// routes/korisnici.js

import express from 'express';
// uključujemo middleware funkcije iz middleware/korisnici.js
import { validacijaEmaila, pretragaKorisnika } from '../middleware/korisnici.js';
import { body, validationResult, query, param } from 'express-validator';

const router = express.Router();

let korisnici = [
  { id: 983498354, ime: 'Ana', prezime: 'Anić', email: 'aanic@gmail.com' },
  { id: 983498355, ime: 'Ivan', prezime: 'Ivić', email: 'iivic@gmail.com' },
  { id: 983498356, ime: 'Sanja', prezime: 'Sanjić', email: 'ssanjic123@gmail.com' }
];

router.get('/', async (req, res) => {
  if (korisnici) {
    return res.status(200).json(korisnici);
  }
  return res.status(404).json({ message: 'Nema korisnika' });
});

router.get('/:id', [pretragaKorisnika], async (req, res) => {
  return res.status(200).json(req.korisnik);
});

router.patch('/:id', [pretragaKorisnika, body('email').isEmail().contains('@unipu.hr'), body('ids').isInt().withMessage('Svaki element polja mora biti tipa integer')], async (req, res) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    req.korisnik.email = req.body.email;
    console.log(korisnici);
    return res.status(200).json(req.korisnik);
  }
  return res.status(400).json({ errors: errors.array() });
});

export default router;
