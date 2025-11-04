import express from 'express';

import pizzeRouter from './routes/pizze.js';

import { pizze } from './data/pizze.js';

import path from 'path';

const app = express();
const PORT = 3000;

let korisnici = [
  { id: 1, ime: 'Marko', prezime: 'Marić' },
  { id: 2, ime: 'Pero', prezime: 'Perić' },
  { id: 3, ime: 'Ana', prezime: 'Anić' }
];

let narudzbe = [
  {
    id: 1,
    id_korisnik: 2,
    sadrzaj: [
      { id_pizza: 1, kolicina: 2, velicina: 'mala' },
      { id_pizza: 3, kolicina: 1, velicina: 'jumbo' }
    ]
  }
];

app.use(express.json());

app.use('/pizze', pizzeRouter);

app.get('/narudzbe', (req, res) => {
  res.json(narudzbe).status(200);
});

app.post('/narudzbe', (req, res) => {
  let korisnik_ime = req.body.korisnik_ime;
  let sadrzaj = req.body.sadrzaj;

  let narudzbe_idevi = narudzbe.map(narudzba => narudzba.id);

  let id_nova_narudzba = narudzbe_idevi.at(-1) + 1;

  console.log(id_nova_narudzba);

  let korisnik = korisnici.find(korisnik => korisnik.ime == korisnik_ime);

  if (!korisnik) {
    return res.status(404).json({ Greška: 'Korisnik nije pronađen...' });
  }

  // za svaku pizzu u sadržaju provjeri:
  // 1. postoji li pizza u bazi,
  // 2. je li kolicina >= 1,
  // 3. je li velicina izmedu "mala", "srednja", "jumbo"
  let sadrzaj_ok = sadrzaj.every(function (stavka) {
    // stavka == { "id_pizza": 1, "kolicina": 2, "velicina": "mala" }

    let kolicina_ok = Boolean(stavka.kolicina >= 1);
    let velicina_ok = Boolean(['mala', 'srednja', 'jumbo'].includes(stavka.velicina));

    let pizza_postoji = pizze.findIndex(pizza => pizza.id == stavka.id_pizza);

    return kolicina_ok && velicina_ok && pizza_postoji != -1;
  });

  if (!sadrzaj_ok) {
    return res.status(400).json({ Greška: 'Sadržaj narudžbe nije ok....' });
  }

  let nova_narudzba_form = {
    id: id_nova_narudzba,
    id_korisnik: korisnik.id,
    sadrzaj: sadrzaj
  };

  narudzbe.push(nova_narudzba_form);

  return res.status(201).json(narudzbe);
});

app.get('/', (req, res) => {
  let rootPathHTML = path.join('./public', 'index.html');
  let absolutePathHTML = path.resolve(rootPathHTML);
  console.log(absolutePathHTML);
  res.sendFile(absolutePathHTML);
});

app.listen(PORT, error => {
  if (error) {
    console.error('Greška kod pokretanja poslužitelja', error);
  }

  console.log(`Poslužitelj sluša na portu ${PORT}`);
});
