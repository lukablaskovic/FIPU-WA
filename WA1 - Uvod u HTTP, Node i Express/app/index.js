const express = require('express');

const app = express();
const PORT = 3000;

// Ruta za početnu stranicu
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// Ruta za stranicu "O nama"
app.get('/about', (req, res) => {
  res.sendFile(__dirname + '/public/about.html');
});

const users = [
  { id: 1, ime: 'Ivan', prezime: 'Horvat' },
  { id: 2, ime: 'Ana', prezime: 'Kovačić' },
  { id: 3, ime: 'Marko', prezime: 'Marić' }
];

// Ruta za korisnike
app.get('/users', (req, res) => {
  res.json(users);
});

// Pokretanje poslužitelja
app.listen(PORT, () => {
  console.log(`Server je pokrenut na http://localhost:${PORT}`);
});
