import express from 'express';

import { connectToDatabase } from './db.js';

const app = express();
app.use(express.json());

const db = await connectToDatabase();

app.get('/', (req, res) => {
  res.send('Pizza app');
});

app.get('/pizze', async (req, res) => {
  let pizze_collection = db.collection('pizze');
  let pizze_rezultati = await pizze_collection.find().toArray();
  console.log(pizze_rezultati);

  res.status(200).json(pizze_rezultati);
});

// pizze/naziv
app.get('/pizze/:naziv', async (req, res) => {
  let pizze_collection = db.collection('pizze');
  let naziv_param = req.params.naziv;
  let pizza = await pizze_collection.find({ naziv: naziv_param }).toArray();
  console.log(pizza);

  res.status(200).json(pizza);
});

// pizze
app.post('/pizze', async (req, res) => {
  let podaci = req.body;

  let pizze_collection = db.collection('pizze');
  let result = await pizze_collection.insertOne(podaci);

  console.log(result);

  res.status(200).json(result);
});

const PORT = 3000;
app.listen(PORT, error => {
  if (error) {
    console.log('Greška prilikom pokretanja servera', error);
  }
  console.log(`Pizza poslužitelj dela na http://localhost:${PORT}`);
});

// npm install express
// npm install mongodb
