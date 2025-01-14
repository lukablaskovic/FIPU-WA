import express from 'express';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cors());

const PORT = 3000;

app.get('/', (req, res) => {
  res.send('Spremni za autentifikaciju!');
});

app.listen(PORT, () => {
  console.log(`Poslužitelj dela na portu ${PORT}`);
});
