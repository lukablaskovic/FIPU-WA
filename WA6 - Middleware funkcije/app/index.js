import express from 'express';
import korisniciRouter from './routes/korisnici.js';
import { body, validationResult, query, param } from 'express-validator';

const app = express();
app.use(express.json());

const requestLogger = (req, res, next) => {
  const date = new Date().toLocaleString();
  const method = req.method;
  const url = req.originalUrl;
  console.log(`[${date}] : ${method} ${url}`);
  next();
};

const adminLogger = (req, res, next) => {
  console.log('Oprez! Pristigao zahtjev na /admin rutu');
  // u pravilu ovdje moramo provjeriti autorizacijski token, što ćemo vidjeti kasnije
  next();
};

app.all('/admin', adminLogger); // na svim /admin rutama pozovi adminLogger middleware

app.use(requestLogger);

app.use('/korisnici', korisniciRouter);

app.get('/admin', (req, res) => {
  res.send('Dobrodošli na admin stranicu');
});

app.get('/hello', [query('ime').notEmpty().withMessage('Ime je obavezno'), query('ime').trim(), query('ime').escape()], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  res.send('Hello, ' + req.query.ime);
});

let PORT = 3000;

app.listen(PORT, error => {
  if (error) {
    console.error(`Greška prilikom pokretanja poslužitelja: ${error.message}`);
  } else {
    console.log(`Poslužitelj dela na http://localhost:${PORT}`);
  }
});
