import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

async function hashPassword(plainPassword, saltRounds) {
  try {
    let hash = await bcrypt.hash(plainPassword, saltRounds);
    return hash;
  } catch (err) {
    console.error(`Došlo je do greške prilikom hashiranja lozinke: ${err}`);
    return null;
  }
}

async function checkPassword(plainPassword, hashedPassword) {
  try {
    let result = await bcrypt.compare(plainPassword, hashedPassword);
    return result;
  } catch (err) {
    console.error(`Došlo je do greške prilikom usporedbe hash vrijednosti: ${err}`);
    return false;
  }
}

async function generateJWT(payload) {
  try {
    let token = jwt.sign(payload, JWT_SECRET); // generiranje JWT tokena s payloadom i enkripcijskim ključem
    return token;
  } catch (err) {
    console.error(`Došlo je do greške prilikom generiranja JWT tokena: ${err}`);
    return null;
  }
}

async function verifyJWT(token) {
  try {
    let decoded = jwt.verify(token, JWT_SECRET); // provjera valjanosti JWT tokena
    return decoded;
  } catch (err) {
    console.error(`Došlo je do greške prilikom verifikacije JWT tokena: ${err}`);
    return null;
  }
}

// auth.js

const authMiddleware = async (req, res, next) => {
  let token = req.headers.authorization.split(' ')[1]; // dohvaćanje JWT tokena iz zaglavlja

  let decoded = await verifyJWT(token); // provjera valjanosti JWT tokena

  if (!decoded) {
    return res.status(401).send('Nevaljan JWT token!');
  }

  req.authorised_user = decoded; // spremamo dekodirani payload u req objekt
  next(); // nastavljamo dalje
};

export { hashPassword, checkPassword, generateJWT, verifyJWT, authMiddleware };
