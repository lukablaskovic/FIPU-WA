import express from 'express';

const router = express.Router();

const pizze = [
  { id: 1, naziv: 'Margherita', cijena: 6.5 },
  { id: 2, naziv: 'Capricciosa', cijena: 8.0 },
  { id: 3, naziv: 'Quattro formaggi', cijena: 10.0 },
  { id: 4, naziv: 'Šunka sir', cijena: 7.0 },
  { id: 5, naziv: 'Vegetariana', cijena: 9.0 }
];

router.get('/', (req, res) => {
  res.status(200).json(pizze);
});

router.get('/:id', (req, res) => {
  const id_pizza = req.params.id;

  if (isNaN(id_pizza)) {
    res.status(400).json({ message: 'Proslijedili ste parametar id koji nije broj!' });
    return;
  }
  const pizza = pizze.find(pizza => pizza.id == id_pizza);

  if (pizza) {
    res.status(200).json(pizza);
  } else {
    res.status(404).json({ message: 'Pizza s traženim ID-em ne postoji.' });
  }
});

// PUT metoda - mijenja cijeli resurs
// Tijelo zahtjeva: { id: 5, naziv: 'Vegetariana', cijena: 9.0 }
// Moramo zamijeniti stvarne podatke

router.put('/:id', (req, res) => {
  let id_pizza_req = req.params.id;
  let tijelo_zahtjeva = req.body;

  if (isNaN(id_pizza_req)) {
    return res.json({ message: 'Proslijedili ste parametar id koji nije broj!' });
  }

  //implementacija

  let index = pizze.findIndex(pizza => pizza.id == id_pizza_req);

  pizze[index] = tijelo_zahtjeva;

  console.log('pizze array', pizze);

  return res.json({ message: 'Ažurirano!', azurirani_podatak: tijelo_zahtjeva });
});

// azurira samo dijelove objekta/resursa
router.patch('/:id', (req, res) => {
  let id_pizza_req = req.params.id;
  let tijelo_zahtjeva = req.body;

  if (isNaN(id_pizza_req)) {
    return res.json({ message: 'Proslijedili ste parametar id koji nije broj!' });
  }

  let index = pizze.findIndex(pizza => pizza.id == id_pizza_req);

  //implementacija
  let kljucevi_objekta = Object.keys(tijelo_zahtjeva);

  console.log(kljucevi_objekta);

  for (let kljuc of kljucevi_objekta) {
    if (pizze[index][kljuc] != tijelo_zahtjeva[kljuc]) {
      pizze[index][kljuc] = tijelo_zahtjeva[kljuc];
    } else {
      pizze[index][kljuc] = pizze[index][kljuc];
    }
  }

  console.log(pizze);

  return res.json({ message: 'Ažurirano!', azurirani_podatak: tijelo_zahtjeva });
});

export default router;
