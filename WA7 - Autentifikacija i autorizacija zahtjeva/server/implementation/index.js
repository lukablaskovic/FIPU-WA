import express from 'express';
import cors from 'cors';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

import { hashPassword, checkPassword, generateJWT, verifyJWT, authMiddleware } from './auth.js';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const PORT = 3000;
const JWT_SECRET = process.env.JWT_SECRET;

app.get('/', (req, res) => {
  res.send('Spremni za autentifikaciju!');
});

let users = [
  { id: 1, username: 'peroPeric123', password: '$2b$10$kAPhPJRYnYZNVh.YmC3NwuaUjRPuwO.MQizgCP5kNdO/FrAa7ZXcu' },
  { id: 2, username: 'maraMara', password: '$2b$10$fNvGAkcfgSLVqGUbMGOKOu4lu3UbbcmKyJ0aVULyK1oYOWe5MpWie' },
  { id: 3, username: 'ivanIvanko555', password: '$2b$10$ZKe8aSUUEBNzQlhPigzFKOBne/4v6AzEckXZ.I7.j.TXfFQRYIt8G' },
  { id: 4, username: 'anaAnic', password: '$2b$10$H2HR4nlPbhRFW/5YKtIuC.b5rRsPz2EE7dYz561W44/8rxJ2RrfVW' },
  { id: 5, username: 'justStanko', password: '$2b$10$wXcmTomNSfS9Ivafuy6/iuant3GQgxSXSWf1ZNx9d6iwuSi/d1HMK' }
];

let objave = [
  { id: 1, naslov: 'Prva objava', sadrzaj: 'Ovo je prva objava', autor: 'lukablaskovic' },
  { id: 2, naslov: 'Druga objava', sadrzaj: 'Ovo je druga objava', autor: 'markoMaric' },
  { id: 3, naslov: 'Treća objava', sadrzaj: 'Ovo je treća objava', autor: 'peroPeric' },
  { id: 4, naslov: 'Četvrta objava', sadrzaj: 'Ovo je četvrta objava', autor: 'lukablaskovic' }
];

app.get('/objave', authMiddleware, async (req, res) => {
  let userObjave = objave.filter(objava => objava.autor === req.authorised_user.username); // dohvaćamo podatke iz dekodiranog payloada (req.authorised_user)

  res.json(userObjave);
});

app.post('/register', async (req, res) => {
  const { username, password } = req.body;

  let hashedPassword = await hashPassword(password, 10); // hashiranje lozinke

  // dodajemo korisnika u listu korisnika
  users.push({ username, password: hashedPassword });

  console.log(users);

  res.send('Korisnik je uspješno registriran!');
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  const user = users.find(user => user.username === username);

  if (!user) {
    return res.status(400).send('Greška prilikom prijave!');
  }

  let result = await checkPassword(password, user.password); // usporedba lozinke i hash vrijednosti

  if (!result) {
    return res.status(400).send('Greška prilikom prijave!');
  }

  let token = await generateJWT({ id: user.id, username: user.username }); // generiranje JWT tokena

  res.status(200).json({ jwt_token: token });
});

app.listen(PORT, () => {
  console.log(`Poslužitelj dela na portu ${PORT}`);
});
