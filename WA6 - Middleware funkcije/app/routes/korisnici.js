// routes/korisnici.js

import express from 'express';
import { validirajEmail, pronadiKorisnika } from '../middleware/korisnici.js';
const router = express.Router();

let korisnici = [
  { id: 983498354, ime: 'Ana', prezime: 'Anić', email: 'aanic@gmail.com' },
  { id: 983498355, ime: 'Ivan', prezime: 'Ivić', email: 'iivic@gmail.com' },
  { id: 983498356, ime: 'Sanja', prezime: 'Sanjić', email: 'ssanjic123@gmail.com' }
];

// dohvat svih korisnika
router.get('/', async (req, res) => {
  if (korisnici) {
    return res.status(200).json(korisnici);
  }
  return res.status(404).json({ message: 'Nema korisnika' });
});

// dohvat pojedinog korisnika
router.get('/:id', [pronadiKorisnika], async (req, res) => {
  res.status(200).json(req.korisnik);
});

//ažuriranje emaila
router.patch('/:id', [pronadiKorisnika, validirajEmail], async (req, res) => {
  let korisnik = req.korisnik;
  korisnik.email = novi_email;
  res.status(200).json({ message: 'Uspješna promjena...' });
});

export default router;
