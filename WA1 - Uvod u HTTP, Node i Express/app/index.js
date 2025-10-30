const express = require('express');
const app = express();
const PORT = 3005;

// instalirati nodemon:
// npm install -g nodemon

let korisnici = [
  { id: 1, ime: 'Marko', prezime: 'Marić' },
  { id: 2, ime: 'Ana', prezime: 'Anić' },
  { id: 3, ime: 'Pero', prezime: 'Perić' }
];

app.get('/', (req, res) => {
  console.log('pozvan je GET root endpoint!');

  res.sendFile(__dirname + '/public/index.html');
});

app.get('/about', (req, res) => {
  console.log(__dirname);
  res.sendFile(__dirname + '/public/about.html');
});

app.get('/korisnici', (req, res) => {
  console.log('Pozvana je endpoint /korisnici');
  res.json(korisnici);
});

app.listen(PORT, error => {
  if (error) {
    console.error('Ne mogu startati... neda mi se..');
  } else {
    console.log(`Express.js poslužitelj sluša na portu ${PORT}`);
  }
});
