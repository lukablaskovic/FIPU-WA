const express = require('express');

const app = express();

const PORT = 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello, world!');
});

const pizze = [
  { id: 1, naziv: 'Margerita', cijena: 7.0 },
  { id: 2, naziv: 'Capricciosa', cijena: 9.0 },
  { id: 3, naziv: 'Šunka sir', cijena: 8.0 },
  { id: 4, naziv: 'Vegetariana', cijena: 12.0 },
  { id: 5, naziv: 'Quattro formaggi', cijena: 15.0 }
];

app.get('/pizze', (req, res) => {
  return res.json(pizze);
});

app.get('/pizze/:id', (req, res) => {
  const id_pizza = req.params.id; // dohvaćamo id parametar iz URL-a

  if (isNaN(id_pizza)) {
    res.json({ message: 'GREŠKA! ID nije broj!' });
  }

  for (pizza of pizze) {
    if (pizza.id == id_pizza) {
      // ako smo pronašli podudaranje u id-u
      return res.json(pizza); // vrati objekt pizze kao rezultat
    }
  }
  res.json({ message: 'Nema pizze' });
});

app.post('/naruci', (req, res) => {
  let tijelo_zahtjeva = req.body;
  console.log(tijelo_zahtjeva);

  return res.send('Super. Naručeno.');
});

app.listen(PORT, error => {
  if (error) {
    console.error(`Greška prilikom pokretanja poslužitelja: ${error.message}`);
  } else {
    console.log(`Server je pokrenut na http://localhost:${PORT}`);
  }
});
