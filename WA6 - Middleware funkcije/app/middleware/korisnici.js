// middleware/korisnici.js

let korisnici = [
  { id: 983498354, ime: 'Ana', prezime: 'Anić', email: 'aanic@gmail.com' },
  { id: 983498355, ime: 'Ivan', prezime: 'Ivić', email: 'iivic@gmail.com' },
  { id: 983498356, ime: 'Sanja', prezime: 'Sanjić', email: 'ssanjic123@gmail.com' }
];

const pronadiKorisnika = (req, res, next) => {
  const id_route_param = parseInt(req.params.id);
  const korisnik = korisnici.find(korisnik => korisnik.id === id_route_param);

  if (korisnik) {
    console.log('Korisnik pronađen u middlewareu:', korisnik);
    req.korisnik = korisnik;
    next(); // u sljedeci middleware
  } else {
    res.status(404).json({ message: 'Korisnik nije pronađen' });
  }
};

const validirajEmail = (req, res, next) => {
  let novi_email = req.body.email;

  if (!novi_email && typeof novi_email != 'string') {
    res.status(400).json({ message: 'Niste poslali email' });
  } else {
    next(); // u callback
  }
};

// izvoz middleware funkcija
export { pronadiKorisnika, validirajEmail };
