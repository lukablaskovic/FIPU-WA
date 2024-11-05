import express from 'express';

import pizzeRouter from './routes/pizze.js';

const app = express();
app.use(express.json());

const pizze = [
  { id: 1, naziv: 'Margherita', cijena: 6.5 },
  { id: 2, naziv: 'Capricciosa', cijena: 8.0 },
  { id: 3, naziv: 'Quattro formaggi', cijena: 10.0 },
  { id: 4, naziv: 'Šunka sir', cijena: 7.0 },
  { id: 5, naziv: 'Vegetariana', cijena: 9.0 }
];

app.use('/pizze', pizzeRouter);

const narudzbe = new Array();
app.post('/narudzbe', (req, res) => {
  const narudzba = req.body.narudzba;
  const klijent = req.body.klijent;

  const dozvoljeni_kljucevi = ['pizza', 'velicina', 'kolicina'];
  const potrebni_podaci = ['prezime', 'adresa', 'broj_telefona'];

  if (!Array.isArray(narudzba) || typeof klijent !== 'object') {
    return res.json({ message: 'Krivi JSON format! Morate poslati listu za narudžbu i objekt za klijenta' });
  }

  for (let podatak of potrebni_podaci) {
    if (!klijent[podatak]) {
      return res.json({ message: `Krivi JSON format! Nedostaje podatak: ${podatak}` });
    }
  }

  function getPizzaPrice(naziv) {
    const pizza = pizze.find(p => p.naziv === naziv);
    return pizza ? pizza.cijena : null;
  }

  // Provjera ispravnosti ključeva i vrijednosti za svaku stavku narudžbe
  let ukupna_cijena = 0;
  for (let stavka of narudzba) {
    let stavka_keys = Object.keys(stavka);

    // Provjera da svi ključevi postoje i da su ispravni
    if (!stavka_keys.every(kljuc => dozvoljeni_kljucevi.includes(kljuc)) || !dozvoljeni_kljucevi.every(kljuc => stavka_keys.includes(kljuc))) {
      return res.json({ message: 'Krivi JSON format! Nedostaju ili su neispravni ključevi u narudžbi' });
    }

    const { pizza, velicina, kolicina } = stavka;

    const pizzaPrice = getPizzaPrice(pizza);
    if (pizzaPrice === null) {
      return res.json({ message: `Pizza ${pizza} nije dostupna u jelovniku` });
    }

    ukupna_cijena += pizzaPrice * kolicina;
  }

  const narudzba_opis = narudzba.map((stavka, index) => `pizza_${index + 1}_naziv ${stavka.pizza} (${stavka.velicina})`).join(' i ');

  narudzbe.push({ klijent, narudzba, ukupna_cijena });

  return res.json({
    message: `Vaša narudžba za ${narudzba_opis} je uspješno zaprimljena!`,
    prezime: klijent.prezime,
    adresa: klijent.adresa,
    ukupna_cijena: ukupna_cijena
  });
});

let PORT = 3000;

app.listen(PORT, error => {
  if (error) {
    console.error(`Greška prilikom pokretanja poslužitelja: ${error.message}`);
  } else {
    console.log(`Server dela na http://localhost:${PORT}`);
  }
});
