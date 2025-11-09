//index.js

import express from 'express';
import pizzeRouter from './routes/pizze.js';

// glavna express aplikacija
const app = express();
// middleware
app.use(express.json());

// dodajem routere
app.use('/pizze', pizzeRouter);

const PORT = 3000;

app.listen(PORT, error => {
  if (error) {
    console.error('Greška pri pokretanju...');
  }
  console.log(`Poslužitelj radi na portu ${PORT}`);
});
