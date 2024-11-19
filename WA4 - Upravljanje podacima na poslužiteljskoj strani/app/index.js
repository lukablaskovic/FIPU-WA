import express from 'express';
import fs from 'fs';

const app = express();
app.use(express.json());

app.get('/story', (req, res) => {
  let prica = fs.readFile('./data/story.txt', 'utf8', (err, data) => {
    if (err) {
      console.error('Greška prilikom čitanja datoteke:', err);
      return;
    }
    console.log('Sadržaj datoteke:', data);
  });
  res.send(prica);
});

app.listen(3000, () => {
  console.log('Poslužitelj je pokrenut na http://localhost:3000');
});
