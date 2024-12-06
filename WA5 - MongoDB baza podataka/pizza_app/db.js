import { MongoClient } from 'mongodb';

import { config } from 'dotenv';

config();

const mongoURI = process.env.MONGO_URI;
const db_name = process.env.DB_NAME;

async function connectToDatabase() {
  try {
    const client = new MongoClient(mongoURI); // stvaramo novi klijent
    await client.connect(); // spajamo se na klijent
    console.log('Uspješno spajanje na bazu podataka');
    let db = client.db(db_name); // odabiremo bazu podataka
    return db;
  } catch (error) {
    console.error('Greška prilikom spajanja na bazu podataka', error);
    throw error;
  }
}

export { connectToDatabase };
