// 1. npm init -y
// 2. npm install express
// 3. u package.json promijeniti type commonjs u type module
import express from 'express';
let PORT = 3000;
let app = express();

// middleware
app.use(express.json());

let pizze = [
  { id: 1, naziv: 'Margerita', cijena: 9 },
  { id: 2, naziv: 'Capriciosa', cijena: 12 },
  { id: 3, naziv: 'Vegetariana', cijena: 18 },
  { id: 4, naziv: 'Quattro stagioni', cijena: 15 },
  { id: 5, naziv: 'Salami', cijena: 13 }
];

app.get('/', (req, res) => {
  // osnovna ruta
  console.log('Pozvana GET / ruta');
  res.send('Pozdrav.');
});

app.get('/pizze', (req, res) => {
  res.json(pizze);
});
// route parametar (parametar rute)
app.get('/pizze/:naziv', (req, res) => {
  let naziv_pizze = req.params.naziv;
  console.log('Tražim pizzu:', naziv_pizze);
  // -X GET http://localhost:3000/pizze/Vegetarina
  let trazena_pizza = pizze.find(pizza => {
    return naziv_pizze == pizza.naziv;
  });

  // find - nadi jednog u polju
  // findIndex - nad index jednog u polju
  // map, filter, reduce - stuči polje
  // splice, slice - vrati podskup
  // some, every - boolean provjere...
  // forEach, for of, for in

  res.json(trazena_pizza);
});

app.post('/pizze', (req, res) => {
  let nova_pizza = req.body;
  console.log('Podaci:', nova_pizza);
  pizze.push(nova_pizza);
  res.json(pizze);
});

app.delete('/pizze/:id', (req, res) => {
  let brisanje_id = req.params.id;

  let index_polje = pizze.findIndex(pizza => {
    return brisanje_id == pizza.id;
  });

  pizze.splice(index_polje, 1);

  console.log(pizze);

  res.json(pizze);
});

// primjer poslužitelja za naručivanje pizze
app.listen(PORT, error => {
  // pokretanje poslužitelja
  if (error) {
    console.error('Došlo je do greške u pokretanju poslužitelja...');
  }

  console.log(`Aplikacija sluša na portu ${PORT}`);
});
