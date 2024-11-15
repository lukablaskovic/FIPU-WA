import express from 'express';
import fs from 'fs/promises';

const app = express();
app.use(express.json());

app.get('/students', async (req, res) => {
  let sortiraj_po_godinama = req.query.sortiraj_po_godinama; // dohvatimo query parametar 'sortiraj_po_godinama'
  try {
    const data = await fs.readFile('data/students.json', 'utf8');
    const students = JSON.parse(data);

    if (sortiraj_po_godinama) {
      if (sortiraj_po_godinama === 'uzlazno') {
        students.sort((a, b) => a.godine - b.godine);
      } else if (sortiraj_po_godinama === 'silazno') {
        students.sort((a, b) => b.godine - a.godine);
      }
    }

    res.status(200).send(students);
  } catch (error) {
    console.error('Greška prilikom čitanja datoteke:', error);
    res.status(500).send('Greška prilikom čitanja datoteke.');
  }
});

app.get('/students/:ime/:prezime', async (req, res) => {
  let ime = req.params.ime; //parametar rute ime
  let prezime = req.params.prezime; // parametar rute prezime
  let fakultet_query = req.query.fakultet; // dohvatimo query parametar 'fakultet'
  try {
    const data = await fs.readFile('data/students.json', 'utf8');
    const students = JSON.parse(data);
    const student = students.find(student => student.ime === ime && student.prezime === prezime && student.fakultet === fakultet_query);
    if (student) {
      res.status(200).send(student);
    } else {
      res.status(404).send('Student nije pronađen.');
    }
  } catch (error) {
    console.error('Greška prilikom čitanja datoteke:', error);
    res.status(500).send('Greška prilikom čitanja datoteke.');
  }
});

app.listen(3000, () => {
  console.log('Poslužitelj je pokrenut na http://localhost:3000');
});
