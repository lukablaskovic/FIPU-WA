import express from 'express';
import { connectToDatabase } from './db.js';

import { ObjectId } from 'mongodb';

const app = express();

app.use(express.json());

let db = await connectToDatabase();

app.get('/users', async (req, res) => {
  let users_collection = db.collection('users');
  let allUsers = await users_collection.find().toArray();
  res.status(200).json(allUsers);
});

app.get('/pizze', async (req, res) => {
  let pizze_collection = db.collection('pizze');
  let cijena_query = req.query.cijena;
  let naziv_query = req.query.naziv;

  try {
    let pizze = await pizze_collection
      .find()
      .sort({ cijena: Number(cijena_query), naziv: Number(naziv_query) })
      .toArray(); // sortira pizze po cijeni i nazivu
    res.status(200).json(pizze);
  } catch (error) {
    console.log(error.errorResponse);
    res.status(400).json({ error: error.errorResponse });
  }
});

app.get('/pizze/:naziv', async (req, res) => {
  let pizze_collection = db.collection('pizze');
  let naziv_param = req.params.naziv;
  let pizza = await pizze_collection.find({ naziv: naziv_param }).toArray();
  res.status(200).json(pizza);
});

app.post('/pizze', async (req, res) => {
  let pizze_collection = db.collection('pizze');
  let novaPizza = req.body;
  try {
    let result = await pizze_collection.insertOne(novaPizza);
    res.status(201).json({ insertedId: result.insertedId }); // Kad šaljemo JSON, moramo podatak spremiti u neki ključ
  } catch (error) {
    console.log(error.errorResponse);
    res.status(400).json({ error: error.errorResponse }); // 400 jer je korisnik poslao neispravne podatke
  }
});

app.patch('/pizze/:naziv', async (req, res) => {
  let pizze_collection = db.collection('pizze');
  let naziv_param = req.params.naziv;
  let novaCijena = req.body.cijena;

  try {
    let result = await pizze_collection.updateOne({ naziv: naziv_param }, { $set: { cijena: novaCijena } });
    res.status(200).json({ modifiedCount: result.modifiedCount });
  } catch (error) {
    console.log(error.errorResponse);
    res.status(400).json({ error: error.errorResponse });
  }
});

app.put('/pizze', async (req, res) => {
  let pizze_collection = db.collection('pizze');
  let noviMeni = req.body;

  try {
    await pizze_collection.deleteMany({}); // brišemo sve pizze iz kolekcije
    let result = await pizze_collection.insertMany(noviMeni);
    res.status(200).json({ insertedCount: result.insertedCount });
  } catch (error) {
    console.log(error.errorResponse);
    res.status(400).json({ error: error.errorResponse });
  }
});

app.get('/narudzbe', async (req, res) => {
  let narudzbe_collection = db.collection('narudzbe');
  let narudzbe = await narudzbe_collection.find().toArray();
  res.status(200).json(narudzbe);
});

app.get('/narudzbe/:id', async (req, res) => {
  let narudzbe_collection = db.collection('narudzbe');
  let id_param = req.params.id;
  let narudzba = await narudzbe_collection.findOne({ _id: new ObjectId(id_param) });
  narudzbe_collection.

  if (!narudzba) {
    return res.status(404).json({ error: 'Narudžba nije pronađena' });
  }

  res.status(200).json(narudzba);
});

app.delete('/pizze/:naziv', async (req, res) => {
  let pizze_collection = db.collection('pizze');
  let naziv_param = req.params.naziv;

  try {
    let result = await pizze_collection.deleteOne({ naziv: naziv_param });
    res.status(200).json({ deletedCount: result.deletedCount });
  } catch (error) {
    console.log(error.errorResponse);
    res.status(400).json({ error: error.errorResponse });
  }
});

app.post('/narudzbe', async (req, res) => {
  let narudzbe_collection = db.collection('narudzbe');
  let novaNarudzba = req.body;

  let obavezniKljucevi = ['kupac', 'adresa', 'broj_telefona', 'narucene_pizze'];
  let obavezniKljuceviStavke = ['naziv', 'količina', 'veličina'];

  let pizze_collection = db.collection('pizze');
  let dostupne_pizze = await pizze_collection.find().toArray();

  if (!obavezniKljucevi.every(kljuc => kljuc in novaNarudzba)) {
    return res.status(400).json({ error: 'Nedostaju obavezni ključevi' });
  }

  if (!novaNarudzba.narucene_pizze.every(stavka => dostupne_pizze.some(pizza => pizza.naziv === stavka.naziv))) {
    return res.status(400).json({ error: 'Odabrali ste pizzu koju nemamo u ponudi' });
  }

  if (!novaNarudzba.narucene_pizze.every(stavka => obavezniKljuceviStavke.every(kljuc => kljuc in stavka))) {
    return res.status(400).json({ error: 'Nedostaju obavezni ključevi u stavci narudžbe' });
  }

  if (
    !novaNarudzba.narucene_pizze.every(stavka => {
      return Number.isInteger(stavka.količina) && stavka.količina > 0 && ['mala', 'srednja', 'velika'].includes(stavka.veličina);
    })
  ) {
    return res.status(400).json({ error: 'Neispravni podaci u stavci narudžbe' });
  }

  try {
    let result = await narudzbe_collection.insertOne(novaNarudzba);
    res.status(201).json({ insertedId: result.insertedId });
  } catch (error) {
    console.log(error.errorResponse);
    res.status(400).json({ error: error.errorResponse });
  }
});

const PORT = 3000;
app.listen(PORT, error => {
  if (error) {
    console.log('Greška prilikom pokretanja servera', error);
  }
  console.log(`Pizza poslužitelj dela na http://localhost:${PORT}`);
});
