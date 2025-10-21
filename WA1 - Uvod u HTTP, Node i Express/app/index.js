// REST API
const express = require('express');

const app = express();

const PORT = 3000;
const ADDRESS = 'http://localhost';

// Zapamti: imamo kolekcije koje sadrže resurse

app.get('/', function (req, res) {
  // req objekt: JavaScript objekt u kojem se nalaze informacije dolaznog HTTP zahtjeva
  // res objekt: JavaScript objekt u kojem se nalaze informacije odlaznog HTTP odgovora
  console.log(res);
  res.send('<p>Pozdrav iz našeg Express.js poslužitelja</p>');
});

// app.listen gre na kraju

app.listen(PORT, error => {
  if (error) {
    console.error(`Greška prilikom pokretanja poslužitelja: ${error}`);
  } else {
    console.log(`Express.js server je pokrenut na ${ADDRESS}:${PORT}`);
  }
});
