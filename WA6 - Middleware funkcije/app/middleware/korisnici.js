// middleware/korisnici.js

let korisnici = [
  { id: 983498354, ime: 'Ana', prezime: 'Anić', email: 'aanic@gmail.com' },
  { id: 983498355, ime: 'Ivan', prezime: 'Ivić', email: 'iivic@gmail.com' },
  { id: 983498356, ime: 'Sanja', prezime: 'Sanjić', email: 'ssanjic123@gmail.com' }
];

const validacijaEmaila = (req, res, next) => {
  console.log('Middleware: validacijaEmaila');
  if (req.body.email && typeof req.body.email === 'string') {
    return next(); // prelazimo na sljedeću middleware funkciju odnosno na obradu zahtjeva
  } else {
    return res.status(400).json({ message: 'Neispravna struktura tijela zahtjeva' });
  }
};

const pretragaKorisnika = (req, res, next) => {
  console.log('Middleware: pretragaKorisnika');
  const id_route_param = parseInt(req.params.id);
  const korisnik = korisnici.find(korisnik => korisnik.id === id_route_param);
  if (korisnik) {
    req.korisnik = korisnik;
    return next(); // prelazimo na sljedeću middleware funkciju odnosno na obradu zahtjeva
  } else {
    return res.status(404).json({ message: 'Korisnik nije pronađen' });
  }
};
// izvoz middleware funkcija
export { validacijaEmaila, pretragaKorisnika };
