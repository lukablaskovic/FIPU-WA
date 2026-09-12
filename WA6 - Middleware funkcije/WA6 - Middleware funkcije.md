# Web aplikacije (WA)

**Nositelj**: doc. dr. sc. Nikola Tanković  
**Asistent**: Luka Blašković, mag. inf.

**Ustanova**: Sveučilište Jurja Dobrile u Puli, Fakultet informatike u Puli

<img src="https://raw.githubusercontent.com/lukablaskovic/FIPU-PJS/main/0.%20Template/FIPU_UNIPU.png" style="width:40%; box-shadow: none !important; "></img>

# (6) Middleware funkcije

<img src="https://github.com/lukablaskovic/FIPU-WA/blob/main/WA6%20-%20Middleware%20funkcije/WA_6.png?raw=true" style="width:9%; border-radius: 8px; float:right;"></img>

<div style="float: clear; margin-right:5px;">
<i>Middleware</i> funkcije predstavljaju funkcijske komponente koje djeluju kao posrednici između dolaznog HTTP zahtjeva i odgovora poslužitelja. Njihova je uloga obrada zahtjeva prije nego što on dosegne krajnju logiku aplikacije. Među najčešćim primjenama <i>middleware</i> funkcija ističu se validacija podataka dolaznih zahtjeva te autorizacija pristupa resursima.

Validacijom podataka osigurava se da informacije koje korisnik šalje ispunjavaju unaprijed definirane kriterije, kao što su ispravnost sadržaja, struktura, duljina i tip podataka. U sklopu ove skripte obradit će se validacija na razini pojedine rute i na aplikacijskoj razini, uz poseban naglasak na biblioteku <code>express-validator</code>, koja pojednostavljuje proces validacije dolaznih zahtjeva korištenjem unaprijed pripremljenih <i>middleware</i> funkcija. Osim za validaciju, <i>middleware</i> ćemo također iskoristiti za strukturiranje koda u više datoteka, čime se postiže bolja organizacija i čitljivost aplikacije te za autentifikaciju i autorizaciju HTTP zahtjeva koju ćemo obraditi u sljedećoj skripti.</div>

<br>

**🆙 Posljednje ažurirano: 13.1.2026.**

## Sadržaj

- [Web aplikacije (WA)](#web-aplikacije-wa)
- [(6) Middleware funkcije](#6-middleware-funkcije)
  - [Sadržaj](#sadržaj)
- [1. Što su _middleware_ funkcije?](#1-što-su-middleware-funkcije)
  - [1.1 _Middleware_ na razini definicije rute](#11-middleware-na-razini-definicije-rute)
  - [1.2 Strukturiranje programa u više datoteka](#12-strukturiranje-programa-u-više-datoteka)
  - [1.3 Middleware na aplikacijskoj razini](#13-middleware-na-aplikacijskoj-razini)
- [2. `express-validator` biblioteka](#2-express-validator-biblioteka)
  - [2.1 Učitavanje modula](#21-učitavanje-modula)
  - [2.2 Obrada validacijskih grešaka](#22-obrada-validacijskih-grešaka)
  - [2.3 Kombiniranje vlastitih _middlewarea_ s `express-validator`](#23-kombiniranje-vlastitih-middlewarea-s-express-validator)
  - [2.4 Validacijski lanac](#24-validacijski-lanac)
    - [2.4.1 Validacija emaila](#241-validacija-emaila)
    - [2.4.2 Provjera minimalne/maksimalne duljine lozinke](#242-provjera-minimalnemaksimalne-duljine-lozinke)
    - [2.4.3 Provjera sadržaja](#243-provjera-sadržaja)
    - [2.4.4 Min/Max vrijednosti](#244-minmax-vrijednosti)
    - [2.4.5 Provjera je li vrijednost Boolean](#245-provjera-je-li-vrijednost-boolean)
    - [2.4.6 Provjera specifičnih vrijednosti](#246-provjera-specifičnih-vrijednosti)
    - [2.4.7 Složena provjera lozinke regularnim izrazom](#247-složena-provjera-lozinke-regularnim-izrazom)
    - [2.4.8 Grananje lanca provjere](#248-grananje-lanca-provjere)
    - [2.4.9 Obrada polja u tijelu zahtjeva](#249-obrada-polja-u-tijelu-zahtjeva)
  - [2.5 Često korišteni validatori](#25-često-korišteni-validatori)
  - [2.6 Sanitizacija podataka](#26-sanitizacija-podataka)
  - [2.7 Sprječavanje reflektiranog XSS napada](#27-sprječavanje-reflektiranog-xss-napada)
- [Samostalni zadatak za Vježbu 6](#samostalni-zadatak-za-vježbu-6)

<div style="page-break-after: always; break-after: page;"></div>

# 1. Što su _middleware_ funkcije?

**Middleware funkcije** (_eng. Middleware functions_) su funkcije koje se izvršavaju u različitim fazama obrade HTTP zahtjeva, tj. _request-response_ ciklusa. U Express.js razvojnom okruženju, u pravilu se koriste u trenutku kad HTTP zahtjev stigne na poslužitelj, a prije konkretne obrade zahtjeva (_eng. route handler_) definirane u **implementaciji rute** odnosno endpointa. Međutim, mogu se koristiti i na **aplikacijskoj razini** (_eng. Application level middleware_) ili na **razini rutera** (_eng. Router level middleware_).

**Middleware funkcije se koriste prvenstveno za:**

- izvođenje koda koji se ponavlja u više različitih ruta ponovnom upotrebom `req` i `res` objekata
- izvođenje koda prije ili nakon obrade zahtjeva, npr. u svrhu validacije podataka, autentifikacije, autorizacije, logiranja itd.

<img src="https://github.com/lukablaskovic/FIPU-WA/blob/main/WA6%20-%20Middleware%20funkcije/screenshots/middleware_illustration.png?raw=true" style="width:50%; box-shadow: none !important; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); margin-top:10px;"></img>

> Slika 1. Ilustracija middleware funkcija u _request-response_ ciklusu

## 1.1 _Middleware_ na razini definicije rute

Najčešći oblik korištenja middleware funkcija je na razini definicije rute. U tom slučaju, middleware funkcija se definira kao argument metode `app.METHOD()`:

**Sintaksa:**

```javascript
app.METHOD(path, [middleware], callback);
```

odnosno:

```
app.METHOD(path, [middleware_1, middleware_2, ..., middleware_n], callback);
```

gdje su:

- `app` - instanca Express aplikacije
- `METHOD` - HTTP metoda
- `path` - putanja na koju se odnosi ruta
- `middleware` - **middleware funkcija** ili **niz od `N` middleware funkcija - nema ograničenja**
- `callback` - funkcija koja se izvršava kad se HTTP zahtjev "poklopi" s definiranom rutom/endpointom

_Middleware_ funkcije navodimo u **uglatim zagradama nakon putanje.**

Ako koristimo više _middleware_ funkcija, **svaka od njih se izvršava redom**, a navodimo ih kao niz elemenata, identično kao elemente u polju.

_Primjer definicije rute s middleware funkcijom:_

```javascript
app.get('/korisnici', middleware_fn, (req, res) => {
    // Obrada zahtjeva
});
```

- `middleware_fn` - middleware funkcija koja se izvršava prije obrade zahtjeva

_Middleware_ funkcije imaju minimalno 3 parametra, i to:

- `req` - **objekt** dolaznog HTTP zahtjeva
- `res` - **objekt** HTTP odgovora koji se šalje korisniku
- `next` - **funkcija** koja se poziva kako bi se prešlo na sljedeću _middleware_ funkciju ili na obradu zahtjeva tj. _route handler_

Dakle, _middleware_ funkcije **imaju pristup _request_ (`req`) i _response_ (`res`) objektima**, jednako kao i _route handler_ funkcija tj. _callback_ funkcija rute.

_Osnovna sintaksa middleware arrow funkcije s 3 parametra:_

```javascript
const middleware_fn = (req, res, next) => {
    // Izvođenje koda
    next(); // pozivanjem funkcije next() prelazimo na sljedeću middleware funkciju ili na obradu zahtjeva
};
```

ili koristeći klasičnu funkcijsku deklaraciju:

```javascript
function middleware_fn(req, res, next) {
    // Izvođenje koda
    next(); // pozivanjem funkcije next() prelazimo na sljedeću middleware funkciju ili na obradu zahtjeva
}
```

_Primjer:_ Definirat ćemo jednostavni Express poslužitelj koji obrađuje zahtjeve na putanji `GET /korisnici`. Korisnike ćemo definirati kao niz _in-memory_ objekata s ključevima `id`, `ime` i `prezime`.

```javascript
import express from 'express';

const app = express();
app.use(express.json());

let PORT = 3000;

app.listen(PORT, error => {
    if (error) {
        console.error(`Greška prilikom pokretanja poslužitelja: ${error.message}`);
    } else {
        console.log(`Poslužitelj dela na http://localhost:${PORT}`);
    }
});
```

Dodajemo rute za dohvat svih korisnika (`GET /korisnici`) i pojedinog korisnika (`GET /korisnici/:id`):

```javascript
let korisnici = [
    { id: 983498354, ime: 'Ana', prezime: 'Anić', email: 'aanic@gmail.com' },
    { id: 983498355, ime: 'Ivan', prezime: 'Ivić', email: 'iivic@gmail.com' },
    { id: 983498356, ime: 'Sanja', prezime: 'Sanjić', email: 'ssanjic123@gmail.com' }
];

// dohvat svih korisnika
app.get('/korisnici', async (req, res) => {
    if (korisnici) {
        return res.status(200).json(korisnici);
    }
    return res.status(404).json({ message: 'Nema korisnika' });
});

// dohvat pojedinog korisnika
app.get('/korisnici/:id', async (req, res) => {
    const id_route_param = parseInt(req.params.id);
    const korisnik = korisnici.find(korisnik => korisnik.id === id_route_param);
    if (korisnik) {
        return res.status(200).json(korisnik);
    }
    return res.status(404).json({ message: 'Korisnik nije pronađen' });
});
```

U redu, do sad nismo koristili _middleware_ funkcije niti imamo potrebu za njima u kodu iznad.

Međutim, što ako **želimo dodati još jednu rutu koja će ažurirati email adresu** pojedinog korisnika, primjerice `PATCH /korisnici/:id`?

```javascript
// ažuriranje email adrese pojedinog korisnika
app.patch('/korisnici/:id', async (req, res) => {
    const id_route_param = parseInt(req.params.id);
    const korisnik = korisnici.find(korisnik => korisnik.id === id_route_param);
    if (korisnik) {
        korisnik.email = req.body.email;
        console.log(korisnici);
        return res.status(200).json(korisnik);
    }
    return res.status(404).json({ message: 'Korisnik nije pronađen' });
});
```

_Primjerice_: želimo ažurirati email `Sanje Sanjić` na `"saaaanja123@gmail.com"`. Kako bismo to učinili, koristimo HTTP `PATCH` metodu i šaljemo sljedeći HTTP zahtjev:

```http
PATCH http://localhost:3000/korisnici/983498356
Content-Type: application/json

{
  "email": "saaaanja123@gmail.com"
}
```

Polako možemo uočavati potrebu za korištenjem _middleware_ funkcija **na razini definicije rute**. Potreba se javlja **prilikom validacije tijela dolaznog HTTP zahtjeva**, odnosno želimo provjeriti je li korisnik poslao ispravnu JSON strukturu (objekt) s ključem `email` te je li vrijednost ključa `email` tipa string, a naposljetku i je li email adresa ispravna.

Do sad smo isto provjeravali u samoj _callback_ funkciji rute, recimo na sljedeći način:

```javascript
app.patch('/korisnici/:id', async (req, res) => {
    const id_route_param = parseInt(req.params.id);
    const korisnik = korisnici.find(korisnik => korisnik.id === id_route_param);
    if (korisnik) {
        // postoji li ključ email i je li tipa string
        if (req.body.email && typeof req.body.email === 'string') {
            // trebali bi dodati još provjera za ispravnost strukture email adrese
            korisnik.email = req.body.email;
            console.log(korisnici);
            return res.status(200).json(korisnik);
        }
        return res.status(400).json({ message: 'Neispravna struktura tijela zahtjeva' });
    }
    return res.status(404).json({ message: 'Korisnik nije pronađen' });
});
```

Što ako još želimo provjeriti ispravnost email adrese?

- Praktično bi bilo to implementirati u vanjskoj funkciji, koristiti neku biblioteku ili regularni izraz.
- U svakom slučaju, to je posao koji može obaviti _middleware_ funkcija budući da **kod postaje sve složeniji** s **previše `if` grananja** te ga je **potrebno ponavljati u više ruta**.

---

Idemo vidjeti kako bismo ove provjere implementirali u _middleware_ funkciji. Znamo da one imaju pristup _request_ (`req`) i _response_ (`res`) objektima.

_Middleware_ funkciju možemo nazvati `validacijaEmaila`:

```javascript
// middleware funkcija
const validacijaEmaila = (req, res, next) => {
    //implementacija
    next();
};
```

Jednostavno preslikamo istu provjeru od ranije:

```javascript
// middleware funkcija
const validacijaEmaila = (req, res, next) => {
    if (req.body.email && typeof req.body.email === 'string') {
        // ako postoji ključ email i tipa je string
        next(); // prelazimo na sljedeću middleware funkciju odnosno na obradu zahtjeva (route handler/callback)
    }
    // u suprotnom?
};
```

- U suprotnom, tj. ako uvjet nije zadovoljen, želimo poslati korisniku odgovor s statusom `400` i porukom `"Neispravna struktura tijela zahtjeva"`

```javascript
// middleware funkcija
const validacijaEmaila = (req, res, next) => {
    if (req.body.email && typeof req.body.email === 'string') {
        // ako postoji ključ email i tipa je string
        next(); // prelazimo na sljedeću middleware funkciju odnosno na obradu zahtjeva
    }
    // u suprotnom
    return res.status(400).json({ message: 'Neispravna struktura tijela zahtjeva' });
};
```

Jednom kad smo definirali _middleware_ funkciju, **dodajemo ju kao drugi argument** _endpoint definition_ metode `app.patch()`, a prethodnu provjeru uklanjamo iz _callback_ funkcije rute:

- ako ruta ima samo jedan _middleware_, možemo i **izostaviti uglate zagrade** `[...]`

```javascript
// dodajemo validacijaEmaila kao drugi argument
app.patch('/korisnici/:id', [validacijaEmaila], async (req, res) => {
    const id_route_param = parseInt(req.params.id);
    const korisnik = korisnici.find(korisnik => korisnik.id === id_route_param);
    if (korisnik) {
        korisnik.email = req.body.email;
        console.log(korisnici);
        return res.status(200).json(korisnik);
    }
    return res.status(404).json({ message: 'Korisnik nije pronađen' });
});
```

> **Važno!** _Middleware_ `validacijaEmaila` će se izvršiti prije obrade zahtjeva u _callback_ funkciji rute.
> Ako uvjeti nisu zadovoljeni, _middleware_ će poslati odgovor korisniku sa statusom `400` i porukom `"Neispravna struktura tijela zahtjeva"`, dok se _callback_ funkcija nikada neće izvršiti

**Druga velika prednost** korištenja _middleware_ funkcija je **ponovna upotrebljivost koda** (eng. _reusability_).

- Naime, često je slučaj da više ruta zahtjeva iste provjere, i to istim redoslijedom.
- U tom slučaju, umjesto da kopiramo isti kod u svaku rutu, možemo ga jednostavno izdvojiti u zasebnu _middleware_ funkciju i koristiti ju u svakoj ruti koja zahtjeva tu provjeru.

Sada imamo sljedeće rute:

- `GET /korisnici` - dohvat svih korisnika
- `GET /korisnici/:id` - dohvat pojedinog korisnika
- `PATCH /korisnici/:id` - ažuriranje email adrese pojedinog korisnika

Ako pogledamo implementacije, vidimo da u svakoj ruti koristimo `parseInt(req.params.id)` kako bismo dobili brojčanu vrijednost `id` parametra rute te zatim pretražujemo korisnika po tom `id`-u.

Ovo je odličan primjer gdje možemo koristiti _middleware_ funkciju!

Nazvat ćemo ju `pretragaKorisnika`

Prve dvije linije _middlewarea_ `pretragaKorisnika` su identične kao i u metodama `GET /korisnici/:id` i `PATCH /korisnici/:id`:

```javascript
const pretragaKorisnika = (req, res, next) => {
    const id_route_param = parseInt(req.params.id);
    const korisnik = korisnici.find(korisnik => korisnik.id === id_route_param);
};
```

Ako korisnik postoji, želimo nastaviti s izvođenjem sljedeće _middleware_ funkcije ili s obradom zahtjeva u _callbacku_, u suprotnom želimo poslati korisniku odgovor s statusom `404` i porukom `"Korisnik nije pronađen"`.

```javascript
const pretragaKorisnika = (req, res, next) => {
    const id_route_param = parseInt(req.params.id);
    const korisnik = korisnici.find(korisnik => korisnik.id === id_route_param);
    if (korisnik) {
        next(); // prelazimo na sljedeću middleware funkciju odnosno na obradu zahtjeva
    }
    return res.status(404).json({ message: 'Korisnik nije pronađen' });
};
```

Dodatno, kako su `req` i `res` objekti **globalni na razini/opsegu definicije rute**, možemo jednostavno dodati svojstvo `korisnik` u `req` objekt kako bismo ga mogli koristiti u svim drugim _middlewareima_ ili u _callback_ funkciji rute 🚀

```javascript
const pretragaKorisnika = (req, res, next) => {
    const id_route_param = parseInt(req.params.id);
    const korisnik = korisnici.find(korisnik => korisnik.id === id_route_param);
    if (korisnik) {
        req.korisnik = korisnik; // Ključna linija: dodajemo svojstvo korisnik na req objekt
        next(); // prelazimo na sljedeću middleware funkciju odnosno na obradu zahtjeva
    }
    return res.status(404).json({ message: 'Korisnik nije pronađen' });
};
```

> **Dodatno pojašnjenje**: Zašto je ovo moguće? Objekt `req` je isti objekt koji se prosljeđuje kroz sve _middleware_ funkcije i _callback_ funkciju rute, a budući da se radi o standardnom JavaScript objektu, znamo da možemo dinamički dodavati (ili brisati) svojstva na objektu. Stoga, dodavanjem svojstva `korisnik` na `req` objekt unutar _middleware_ funkcije `pretragaKorisnika`, to svojstvo postaje dostupno u svim sljedećim _middleware_ funkcijama i u _callback_ funkciji rute.

Sada možemo refaktorirati rute `GET /korisnici/:id` i `PATCH /korisnici/:id`. Prvo ćemo rutu `GET /korisnici/:id`

Pogledajmo trenutačnu implementaciju:

```javascript
app.get('/korisnici/:id', async (req, res) => {
    const id_route_param = parseInt(req.params.id);
    const korisnik = korisnici.find(korisnik => korisnik.id === id_route_param);
    if (korisnik) {
        return res.status(200).json(korisnik);
    }
    return res.status(404).json({ message: 'Korisnik nije pronađen' });
});
```

Vidimo da možemo izbaciti gotovo sve! Ostaje nam samo slanje `korisnik` objekta sa statusom `200`.

Dodajemo _middleware_ `pretragaKorisnika`:

```javascript
app.get('/korisnici/:id', [pretragaKorisnika], async (req, res) => {
    // implementacija
});
```

> Čitaj:
>
> - Prije obrade zahtjeva, izvrši _middleware_ `pretragaKorisnika`.
> - Ako _middleware_ prođe (tj. vrati `next()`), nastavi s obradom zahtjeva odnosno izvrši _callback_ funkciju rute.

Dakle, samo vraćamo korisnika koji se sad nalazi u `req.korisnik`:

```javascript
app.get('/korisnici/:id', [pretragaKorisnika], async (req, res) => {
    return res.status(200).json(req.korisnik);
});
```

To je to! Idemo refaktorirati i rutu `PATCH /korisnici/:id`.

Pogledajmo trenutačnu implementaciju:

```javascript
app.patch('/korisnici/:id', [validacijaEmaila], async (req, res) => {
    const id_route_param = parseInt(req.params.id);
    const korisnik = korisnici.find(korisnik => korisnik.id === id_route_param);
    if (korisnik) {
        korisnik.email = req.body.email;
        console.log(korisnici);
        return res.status(200).json(korisnik);
    }
    return res.status(404).json({ message: 'Korisnik nije pronađen' });
});
```

**Ruta već sadrži _middleware_** `validacijaEmaila`. Međutim, mi moramo **prvo provjeriti ispravnost `id`-a, odnosno provjeriti postojanje korisnika**.

- To ćemo jednostavno učiniti dodavanjem _middlewarea_ `pretragaKorisnika` **prije** `validacijaEmaila`:

```javascript
// dodajemo middleware pretragaKorisnika prije validacijaEmaila
app.patch('/korisnici/:id', [pretragaKorisnika, validacijaEmaila], async (req, res) => {
    // implementacija
});
```

Sada možemo izbaciti sve provjere iz _callback_ funkcije rute:

```javascript
app.patch('/korisnici/:id', [pretragaKorisnika, validacijaEmaila], async (req, res) => {
    req.korisnik.email = req.body.email; // ostavljamo samo promjenu emaila
    console.log(korisnici); // možemo pustiti i ispis strukture
    return res.status(200).json(req.korisnik); // vraćamo korisnika
});
```

To je to! 😎 Uočite koliko _middleware_ funkcije čine kod čitljivijim!

Međutim, prije nego nastavimo, uočite sljedeće:

- slanjem zahtjeva na `GET /korisnici/:id` dobivamo korisnika s određenim `id`-em, što je OK ali dobivamo i sljedeću grešku u konzoli:

```plaintext
Error [ERR_HTTP_HEADERS_SENT]: Cannot set headers after they are sent to the client
    at ServerResponse.setHeader (node:_http_outgoing:699:11)
    ...
```

- slanjem zahtjeva na `PATCH /korisnici/:id` odradit ćemo izmjenu email adrese, ali dobivamo dvaput istu grešku u konzoli:

```plaintext
Error [ERR_HTTP_HEADERS_SENT]: Cannot set headers after they are sent to the client
    at ServerResponse.setHeader (node:_http_outgoing:699:11)
    ...
```

Zašto dobivamo ove greške? 🤔

<details>
  <summary>Spoiler alert! Odgovor na pitanje</summary>
  Grešku dobivamo bez obzira što smo slali ispravne podatke u HTTP zahtjevu. Razlog greške je što <i>middleware</i> funkcija <code>validacijaEmaila</code> i <code>pretragaKorisnika</code> pozivanjem funkcije <code>next()</code> prelaze na sljedeću middleware funkciju odnosno obradu zahtjeva.
  <p>Međutim, <b>to ne znači da se izvršavanje trenutne <i>middleware</i> funkcije prekida</b>. Tada se klijentu pokuša poslati odgovor više puta (odgovor greške), što je zabranjeno. Kako bismo to spriječili, moramo prekinuti izvršavanje trenutnog <i>middlewarea</i> funkcije pozivom funkcije <code>return</code> ili <code>else</code> uvjetnim izrazom.</p>
</details>

<hr>

Dodat ćemo ispise na početku svake _middleware_ funkcije kako bismo pratili redoslijed njihova izvršavanja:

```javascript
const validacijaEmaila = (req, res, next) => {
    console.log('Middleware: validacijaEmaila');
    if (req.body.email && typeof req.body.email === 'string') {
        next(); // prelazimo na sljedeću middleware funkciju odnosno na obradu zahtjeva
    }
    return res.status(400).json({ message: 'Neispravna struktura tijela zahtjeva' });
};

const pretragaKorisnika = (req, res, next) => {
    console.log('Middleware: pretragaKorisnika');
    const id_route_param = parseInt(req.params.id);
    const korisnik = korisnici.find(korisnik => korisnik.id === id_route_param);
    if (korisnik) {
        req.korisnik = korisnik;
        next(); // prelazimo na sljedeću middleware funkciju odnosno na obradu zahtjeva
    }
    return res.status(404).json({ message: 'Korisnik nije pronađen' });
};
```

Kako bismo sigurno prekinuli izvršavanje trenutne _middleware_ funkcije, dodajemo `return` ispred `next()`:

```javascript
const validacijaEmaila = (req, res, next) => {
    console.log('Middleware: validacijaEmaila');
    if (req.body.email && typeof req.body.email === 'string') {
        return next(); // prelazimo na sljedeću middleware funkciju odnosno na obradu zahtjeva
    }
    return res.status(400).json({ message: 'Neispravna struktura tijela zahtjeva' });
};

const pretragaKorisnika = (req, res, next) => {
    console.log('Middleware: pretragaKorisnika');
    const id_route_param = parseInt(req.params.id);
    const korisnik = korisnici.find(korisnik => korisnik.id === id_route_param);
    if (korisnik) {
        req.korisnik = korisnik;
        return next(); // prelazimo na sljedeću middleware funkciju odnosno na obradu zahtjeva
    }
    return res.status(404).json({ message: 'Korisnik nije pronađen' });
};
```

Ili, koristimo `else` uvjetni izraz kada šaljemo statusni kod `4xx`:

```javascript
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
```

<div style="page-break-after: always; break-after: page;"></div>

## 1.2 Strukturiranje programa u više datoteka

Rekli smo da je jedna od glavnih prednosti korištenja _middleware_ funkcija **ponovna upotrebljivost koda** (_eng. Code reusability_). Međutim, vidite da već sad `index.js` datoteka postaje nečitljiva zbog miješanja definicija ruta i _middleware_ funkcija. Uobičajena praksa je odvojiti _middleware_ funkcije u zasebne datoteke, jednako kao što smo radili i za definicije rute koristeći `express.Router()`.

Napravit ćemo dva nova direktorija, jedan za rute i jedan za _middleware_ funkcije:

```bash
→ mkdir routes
→ mkdir middleware
```

Obzirom da u pravilu želimo koristiti istu skupinu ruta s istim _middleware_ funkcijama, možemo jednako nazvati datoteke u direktoriju `routes` i `middleware`: nazvat ćemo ih `korisnici.js`.

Naša struktura poslužitelja sada izgleda ovako:

```plaintext
.
├── middleware
│   └── korisnici.js
├── routes
│   └── korisnici.js
├── index.js
├── node_modules
├── package.json
└── package-lock.json
```

**Prvo ćemo jednostavno prebaciti definicije middleware funkcija** iz `index.js` u `middleware/korisnici.js`:

```javascript
// middleware/korisnici.js

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
```

Moramo još prebaciti podatke:

```javascript
// middleware/korisnici.js

let korisnici = [
    { id: 983498354, ime: 'Ana', prezime: 'Anić', email: 'aanic@gmail.com' },
    { id: 983498355, ime: 'Ivan', prezime: 'Ivić', email: 'iivic@gmail.com' },
    { id: 983498356, ime: 'Sanja', prezime: 'Sanjić', email: 'ssanjic123@gmail.com' }
];
```

Prebacujemo definicije ruta iz `index.js` u `routes/korisnici.js`:

```javascript
// routes/korisnici.js

import express from 'express';
// uključujemo middleware funkcije iz middleware/korisnici.js
import { validacijaEmaila, pretragaKorisnika } from '../middleware/korisnici.js';

const router = express.Router();

let korisnici = [
    { id: 983498354, ime: 'Ana', prezime: 'Anić', email: 'aanic@gmail.com' },
    { id: 983498355, ime: 'Ivan', prezime: 'Ivić', email: 'iivic@gmail.com' },
    { id: 983498356, ime: 'Sanja', prezime: 'Sanjić', email: 'ssanjic123@gmail.com' }
];

// endpoint ne koristi middleware
router.get('/', async (req, res) => {
    if (korisnici) {
        return res.status(200).json(korisnici);
    }
    return res.status(404).json({ message: 'Nema korisnika' });
});

// endpoint koristi middleware pretragaKorisnika
router.get('/:id', [pretragaKorisnika], async (req, res) => {
    return res.status(200).json(req.korisnik);
});

// endpoint koristi middleware pretragaKorisnika → validacijaEmaila, tim redom
router.patch('/:id', [pretragaKorisnika, validacijaEmaila], async (req, res) => {
    req.korisnik.email = req.body.email;
    console.log(korisnici);
    return res.status(200).json(req.korisnik);
});

export default router;
```

U `index.js` datoteci uključujemo router i dodajemo odgovarajući prefiks:

```javascript
// index.js

import express from 'express';
import korisniciRouter from './routes/korisnici.js';

const app = express();
app.use(express.json()); // ovaj aplikacijski middleware uvijek dodajemo prije importanja routera jer ga želimo primijeniti na sve rute
app.use('/korisnici', korisniciRouter);

let PORT = 3000;

app.listen(PORT, error => {
    if (error) {
        console.error(`Greška prilikom pokretanja poslužitelja: ${error.message}`);
    } else {
        console.log(`Poslužitelj dela na http://localhost:${PORT}`);
    }
});
```

<div style="page-break-after: always; break-after: page;"></div>

## 1.3 Middleware na aplikacijskoj razini

Pokazali smo kako definirati _middleware_ funkcije na razini definicije rute, unutar metoda `app.METHOD(URL, [middleware_1, middleware_2, ... middleware_N], callback)`.

Međutim, **_middleware_ funkcije možemo definirati i na razini aplikacije**, tj. na razini objekta `app`.

[app](https://expressjs.com/en/4x/api.html#app) objekt konvencionalno se koristi za konfiguraciju ukupne Express.js aplikacije, a instancira se pozivanjem funkcije `express()` → `const app = express();`.

_Primjerice_, ako želimo da se neka _middleware_ funkcija izvrši prije svake rute, neovisno je li to `GET /korisnici`, `GET /korisnici/:id` ili `PATCH /korisnici/:id` ili pak `GET /pizze` itd, možemo ju na razini aplikacijskog objekta (_eng. Application-level middleware_).

_Primjer:_ Možemo definirati _middleware_ `timestamp` koja će ispisati u konzolu **trenutni datum i vrijeme** svaki put kad se zaprimi zahtjev na poslužitelju:

```javascript
// index.js

const timer = (req, res, next) => {
    console.log(`Trenutno vrijeme: ${new Date().toLocaleString()}`);
    next();
};

// koristimo timer middleware na aplikacijskoj razini
app.use(timer);
```

Međutim, uključivanje ovog _middlewarea_ moramo definirati **prije** uključivanja routera, **inače će se odnositi samo na rute koje slijede nakon njega**:

```javascript
// index.js

import express from 'express';
import korisniciRouter from './routes/korisnici.js';

const app = express();
app.use(express.json());

const timer = (req, res, next) => {
    console.log(`Trenutno vrijeme: ${new Date().toLocaleString()}`);
    next();
};

// koristimo timer middleware na aplikacijskoj razini
app.use(timer);

app.use('/korisnici', korisniciRouter);

let PORT = 3000;

app.listen(PORT, error => {
    if (error) {
        console.error(`Greška prilikom pokretanja poslužitelja: ${error.message}`);
    } else {
        console.log(`Poslužitelj dela na http://localhost:${PORT}`);
    }
});
```

Pogledajte malo bolje kod. Uočavate li još negdje _middleware_ koji smo do sad uvijek koristili? 🤔

<details>
  <summary>Spoiler alert! Odgovor na pitanje</summary>
  Pa da! To je naš <i>middleware</i> <code>express.json()</code> koji se skrivećki provlači od prve vježbe i koji parsira dolazno JSON tijelo zahtjeva. On je također definiran na razini aplikacije, tj. na objektu <code>app</code>.
</details>

> Pokušajte poslati zahtjev na bilo koju rutu i uočite ispis trenutnog vremena u konzoli.

<hr>

Dobra praksa, pogotovo u produkcijskom okruženju, jest definirati _middleware_ na razini aplikacije koji ispisuje _logove_ o svakom zahtjevu koji stigne na poslužitelj. Ovo je korisno za praćenje i analizu ponašanja poslužitelja, kao i za _debugging_.

_Primjerice, želimo ispisati trenutni datum, vrijeme, metodu HTTP zahtjeva i URL zahtjeva:_

```javascript
[1/6/2025, 12:30:40 PM] : GET /korisnici
```

Vrijeme znamo izračunati, HTTP metoda se nalazi u `req.method`, a URL zahtjeva u `req.originalUrl`.

_Rješenje:_

```javascript
// index.js

const requestLogger = (req, res, next) => {
    const date = new Date().toLocaleString();
    const method = req.method; // HTTP metoda
    const url = req.originalUrl; // URL zahtjeva
    console.log(`[${date}] : ${method} ${url}`);
    next();
};

app.use(requestLogger);
```

Testirajmo slanjem zahtjeva na `GET http://localhost:3000/korisnici/983498356`

Ispis u konzoli:

```plaintext
Poslužitelj dela na http://localhost:3000
[1/6/2025, 12:33:31 PM] : GET /korisnici/983498356
Middleware: pretragaKorisnika
```

<hr>

ili slanjem zahtjeva na: `PATCH http://localhost:3000/korisnici/983498356` s tijelom zahtjeva:

```json
{
    "email": "sanja.sanjić@gmail.com"
}
```

Ispis u konzoli:

```plaintext
[1/6/2025, 12:34:49 PM] : PATCH /korisnici/983498356
Middleware: pretragaKorisnika
Middleware: validacijaEmaila
```

<hr>

Osim pozivanja _middlewarea_ na **aplikacijskog razini na svim rutama**, možemo ga pozvati i na definiranoj ruti za sve HTTP metode.

- _Primjerice_: ako imamo skupinu ruta URL-a `/admin`. Želimo u konzoli _logirati_ da je pristigao zahtjev na bilo koju `/admin` rutu, **neovisno o metodi HTTP zahtjeva**.

**Rješenje:** Koristimo funkciju `app.all()` odnosno `router.all()`:

```javascript
// index.js

const adminLogger = (req, res, next) => {
    console.log('Oprez! Pristigao zahtjev na /admin rutu');
    // u pravilu ovdje moramo provjeriti autorizacijski token - ovo ćemo raditi na WA7
    next();
};

app.all('/admin', adminLogger); // na svim /admin rutama pozovi adminLogger middleware funkciju
// odnosno
router.all('/admin', adminLogger);
```

_Primjerice_: Ako pošaljemo zahtjev na `GET http://localhost:3000/admin`, u konzoli ćemo dobiti ispis:

```plaintext
Poslužitelj dela na http://localhost:3000
Oprez! Pristigao zahtjev na /admin rutu
[1/6/2025, 12:50:04 PM] : PATCH /admin
```

Kada definiramo middleware na razini aplikacije, ponekad želimo uključiti i 4. neobavezni parametar (`err`) kako bismo mogli uhvatiti greške koje se dogode u <i>middleware</i> funkciji. Ovaj parametar se koristi za hvatanje grešaka koje se dogode u <i>middleware</i> funkciji.

_Primjer:_

```javascript
// index.js

const errorHandler = (err, req, res, next) => {
    console.log(err);
    res.status(500).json({ message: 'Greška na poslužitelju' });
};

app.use(errorHandler);
```

Kada će se izvršiti ovaj _middleware_? 🤔

<details>
  <summary>Spoiler alert! Odgovor na pitanje</summary>
  Ovaj <i>middleware</i> će se izvršiti <b>samo ako se dogodi greška u bilo kojoj od prethodno definiranih</b> <i>middleware</i> funkcija ili <i>callback</i> funkcija rute. Ukoliko se dogodi greška, <i>middleware</i> će uhvatiti grešku i poslati odgovor s statusom <code>500</code> i porukom <code>"Greška na poslužitelju"</code>.
</details>

Možemo uvijek provjeriti simulacijom greške u nekoj ruti:

```javascript
// index.js

app.get('/error', (req, res) => {
    throw new Error('Simulirana greška na poslužitelju');
});
```

<hr>

> Zapamti: _Middleware_ funkcije na razini rutera (_eng. Router level middleware_) definiramo na **identičan način kao i na razini aplikacije/rute**, samo što ih dodajemo kao drugi argument metode `router.METHOD()`, gdje je `router` instanca `express.Router()` konstruktora.

<div style="page-break-after: always; break-after: page;"></div>

# 2. `express-validator` biblioteka

[express-validator](https://express-validator.github.io/docs/) biblioteka nudi **skup gotovih _middleware_ funkcija za validaciju podataka** u zahtjevima. Biblioteka zahtjeva Node.js 14+ verziju i Express.js 4.17.1+ verziju.

`express-validator` biblioteka kroz svoje _middleware_ funkcije nudi dvije vrste provjera:

1. **Validacija** (_eng. Validation_): **provjera ispravnosti podataka** u zahtjevu
2. **Sanitizacija** (_eng. Sanitization_): **čišćenje podataka u zahtjevu** u sigurno stanje

Do sada smo ručno definirali validacije direktno unutar _callback_ funkcija ruta ili unutar zasebnih _middleware_ funkcija. Takva praksa je u redu za jednostavne aplikacije, ali kako aplikacije rastu, počinjemo ponavljati iste validacije na više mjesta, što dovodi do duplikacije koda i otežava održavanje.

Također, veliki broj validacija podataka koji radimo su uobičajene i često korištene validacije u web aplikacijama, poput provjere ispravnosti emaila, jačine lozinke, formata datuma itd. Iz tog razloga, postoji veliki broj gotovoih biblioteka koje nude skupove unaprijed definiranih validacija i sanitizacija. Međutim, potrebno je razumijeti middleware koncept kako bismo znali ispravno koristiti te biblioteke.

> Napomena: Osim `express-validator`, postoje i druge popularne biblioteke za validaciju podataka u Node.js aplikacijama, poput `Joi`, `Yup`, `Validator.js`, `Vine.js`, `Zod` itd. Za projekte iz kolegija možete odabrati bilo koju od navedenih biblioteka, a mi ćemo u nastavku ove skripte proći kroz `express-validator` kao primjer.

<img src="https://github.com/lukablaskovic/FIPU-WA/blob/main/WA6%20-%20Middleware%20funkcije/screenshots/express-validator.png?raw=true" alt="express-validator logo" style="width:50%; box-shadow: none !important; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); margin-top:10px;">

> Slika 2: [Express-validator](https://www.npmjs.com/package/express-validator) je popularna biblioteka za validaciju podataka u Express.js aplikacijama.

Instalirajmo biblioteku:

```bash
→ npm install express-validator
```

## 2.1 Učitavanje modula

Učitajmo uobičajene funkcije iz `express-validator` biblioteke:

```javascript
// index.js

import { body, validationResult, query, param } from 'express-validator';
```

- `body()` - funkcija koja definira **provjere za tijelo zahtjeva**
- `validationResult(req)` - funkcija koja **izračunava rezultate provjera zahtjeva**
- `query()` - funkcija koja definira **provjere za _query_ parametre**
- `param()` - funkcija koja definira **provjere za route parametre**
- `check()` - funkcija koja definira **provjere za bilo koji dio zahtjeva**

_Primjerice_: definirat ćemo super jednostavni endpoint `GET /hello` koji očekuje _query_ parametar `ime`:

```javascript
app.get('/hello', (req, res) => {
    res.send('Hello, ' + req.query.ime);
});
```

Ako pošaljemo zahtjev bez _query_ parametra `name`, dobit ćemo odgovor `"Hello, undefined"`.

**Validator dodajemo na isti način** kao i prethodno manualno definirane _middleware_ funkcije, a to je kao drugi argument metode `app.METHOD()`.

- to je zato što su validatori ustvari predefinirane _middleware_ funkcije

Koristimo `query` funkciju za provjeru _query_ parametra `ime`:

Sintaksa:

```javascript
query('key');
```

U našem slučaju je to:

```javascript
query('ime');
```

➡️ Validator za provjeru da li **vrijednost nije prazna** `notEmpty()`.

Jednostavno vežemo na rezultat funkcije `query()`:

```javascript
query('ime').notEmpty();
```

To je to! Sad ga još samo dodajemo u našu rutu:

```javascript
//index.js

app.get('/hello', [query('ime').notEmpty()], (req, res) => {
    res.send('Hello, ' + req.query.ime);
});
```

Ako pokušate ponovno poslati zahtjev bez, i dalje ćete dobiti odgovor `"Hello, undefined"`.

Razlog tomu je što `express-validator` ne izvještava automatski klijenta o greškama. Dodavanjem dodatnih validatora, moramo ručno definirati strukturu JSON odgovora u slučaju greške.

## 2.2 Obrada validacijskih grešaka

Kako bismo dobili rezultate provjere, koristimo funkciju `validationResult(req)` koja prima `req` objekt i **vraća rezultate provjere u slučaju da dode do greške**.

```javascript
const errors = validationResult(req); // sprema greške svih validacija koje su provele middleware funkcije, ako ih ima!
```

Dodajemo u našu rutu i ispisom provjeravamo sadržaj:

```javascript
//index.js

app.get('/hello', [query('ime').notEmpty()], (req, res) => {
    const errors = validationResult(req); // spremanje grešaka
    console.log(errors);
    res.send('Hello, ' + req.query.ime);
});
```

Ako nema grešaka, npr. ako pošaljemo zahtjev: `GET http://localhost:3000/hello?ime=Ana`, dobivamo sljedeći ispis:

```plaintext
Result { formatter: [Function: formatter], errors: [] }
```

Ako pošaljemo zahtjev bez _query_ parametra, npr. `GET http://localhost:3000/hello`, dobivamo detaljan ispis s detaljima o pogrešci:

```plaintext
Result {
  formatter: [Function: formatter],
  errors: [
    {
      type: 'field',
      value: '',
      msg: 'Invalid value',
      path: 'ime',
      location: 'query'
    }
  ]
}
```

Kako čitamo ispis? "Greška je nastala u _query_ parametru naziva `ime`, jer je njegova vrijednost `value` prazna."

➡️ Funkcijom `isEmpty()` možemo **provjeriti je li vrijednost prazna.**

Ako greške ne postoje (tj. `errors.isEmpty() == true`), šaljemo odgovor `OK` klijentu, u suprotnom šaljemo odgovor s detaljima o grešci koji je dostupan u `errors.array()` uz status `Bad Request`.

```javascript
// index.js

app.get('/hello', [query('ime').notEmpty()], (req, res) => {
    const errors = validationResult(req);
    // ako nema greške
    if (errors.isEmpty()) {
        return res.send('Hello, ' + req.query.ime);
    }
    return res.status(400).json({ errors: errors.array() });
});
```

<div style="page-break-after: always; break-after: page;"></div>

## 2.3 Kombiniranje vlastitih _middlewarea_ s `express-validator`

Moguće je kombinirati vlastite _middleware_ funkcije s `express-validator` validatorima.

- Primjerice, ako želimo provjeriti da li je korisnik s određenim `id`-om pronađen, a zatim provjeriti da li je email ispravan, možemo iskoristiti vlastiti `pretragaKorisnika` _middleware_ koji se nalazi u `middleware/korisnici.js`, a ostatak provjere odraditi kroz `express-validator` biblioteku.

_Primjer:_ Nadogradit ćemo rutu `PATCH /korisnici:id` tako da provjerava ispravnost email adrese.

Prvi korak je izbaciti postojeći vlastiti middleware za provjeru email adrese:

```javascript
// routes/korisnici.js

// uklanjamo validacijaEmaila middleware
router.patch('/:id', [pretragaKorisnika], async (req, res) => {
    req.korisnik.email = req.body.email;
    console.log(korisnici);
    return res.status(200).json(req.korisnik);
});
```

Želimo provjeriti sljedeće:

- da li je ključ `email` proslijeđen u **tijelu zahtjeva**, dakle koristimo `body('email')` a ne `query('email')`
- da li je vrijednost ključa `email` ispravno strukturirana

➡️ Funkcijom `isEmail()` možemo brzo provjeriti je li vrijednost email adrese ispravna.

- dodajemo provjeru kao drugi _middleware_ u nizu, nakon `pretragaKorisnika`

```javascript
// routes/korisnici.js

router.patch('/:id', [pretragaKorisnika, body('email').isEmail()], async (req, res) => {
    req.korisnik.email = req.body.email;
    console.log(korisnici);
    return res.status(200).json(req.korisnik);
});
```

Na kraju još dodajemo obradu grešaka te vraćamo klijentu odgovarajuće JSON odgovore:

```javascript
// routes/korisnici.js

router.patch('/:id', [pretragaKorisnika, body('email').isEmail()], async (req, res) => {
    const errors = validationResult(req);
    // ako nema greške
    if (errors.isEmpty()) {
        req.korisnik.email = req.body.email;
        console.log(korisnici);
        return res.status(200).json(req.korisnik);
    }
    return res.status(400).json({ errors: errors.array() });
});
```

_Primjerice_: ako pokušamo proslijediti neispravnu email adresu, npr. `PATCH http://localhost:3000/korisnici/983498356` s tijelom zahtjeva:

```json
{
    "email": "sssssanja123gmail.com"
}
```

Dobivamo natrag JSON odgovor s detaljima o grešci:

```json
{
    "errors": [
        {
            "type": "field",
            "value": "sssssanja123gmail.com",
            "msg": "Invalid value",
            "path": "email",
            "location": "body"
        }
    ]
}
```

Ako pokušamo definirati pogrešan ključ u tijelu zahtjeva, npr. `PATCH http://localhost:3000/korisnici/983498356` s tijelom zahtjeva:

```json
{
    "email123": "sssssanja123gmail.com"
}
```

Dobivamo odgovarajuću grešku i za to:

```json
{
    "errors": [
        {
            "type": "field",
            "msg": "Invalid value",
            "path": "email",
            "location": "body"
        }
    ]
}
```

Ako pošaljemo prazno tijelo zahtjeva, također ćemo dobiti grešku u tijelu odgovora.

Navedeno je korisno budući da možemo sve greške proslijediti natrag klijentu u jednom odgovoru, umjesto da se greške obrađuju pojedinačno.

<div style="page-break-after: always; break-after: page;"></div>

## 2.4 Validacijski lanac

U `express-validator` biblioteci ima **mnoštvo validatora**, a nudi i mogućnost **kombiniranja više validatora u jedan lanac provjere** (_eng. Validation Chain_), koji se izvršava redom, definiranjem [lanca metoda](https://en.wikipedia.org/wiki/Method_chaining).

- bez obzira što postoji lanac provjera, ovdje se radi o jednoj _middleware_ funkciji

_Primjerice:_ želimo osim ispravnosti emaila provjeriti i sadrži li email nastavak `@unipu.hr`.

➡️ Isto možemo postići kombinacijom validatora `isEmail()` i `contains()`

```javascript
// routes/korisnici.js

router.patch('/:id', [pretragaKorisnika, body('email').isEmail().contains('@unipu.hr')], async (req, res) => {
    const errors = validationResult(req);
    // ako nema grešaka
    if (errors.isEmpty()) {
        req.korisnik.email = req.body.email; // ažuriramo email
        console.log(korisnici);
        return res.status(200).json(req.korisnik);
    }
    return res.status(400).json({ errors: errors.array() });
});
```

Na svaki validator možemo dodati i poruku koja će se prikazati u slučaju greške:

➡️ **Poruku definiramo metodom `withMessage()`**:

```javascript
body('email').isEmail().withMessage('Email adresa nije ispravna').contains('@unipu.hr').withMessage('Email adresa mora biti s @unipu.hr');
```

<hr>

### 2.4.1 Validacija emaila

➡️ **Koristimo `isEmail()` validator**:

```javascript
body('email').isEmail().withMessage('Molimo upišite ispravnu email adresu');
```

### 2.4.2 Provjera minimalne/maksimalne duljine lozinke

➡️ **Koristimo `isLength()` validator**:

Minimalnu duljinu navodimo kao argument metode, slično kao kod MongoDB upita:

```javascript
body('password').isLength({ min: 6 }).withMessage('Lozinka mora imati minimalno 6 znakova');

// ili

body('password').isLength({ min: 6, max: 20 }).withMessage('Lozinka mora imati između 6 i 20 znakova');
```

### 2.4.3 Provjera sadržaja

➡️ **`isAlphanumeric()` validator provjerava sadrži li vrijednost samo slova i brojeve**:

```javascript
body('username').isAlphanumeric().withMessage('Korisničko ime mora sadržavati samo slova i brojeve');
```

➡️ **`isAlpha()` validator provjerava sadrži li vrijednost samo slova**:

```javascript
body('name').isAlpha().withMessage('Ime mora sadržavati samo slova');
```

### 2.4.4 Min/Max vrijednosti

➡️ **Koristimo `isInt()` validator za provjeru je li vrijednost tipa integer**, opcionalno možemo definirati raspon kao i kod `isLength()`:

```javascript
body('age').isInt({ min: 18, max: 99 }).withMessage('Dob mora biti između 18 i 99 godina');
```

➡️ **Koristimo `isFloat()` validator za provjeru je li vrijednost tipa float**:

```javascript
body('price').isFloat({ min: 0 }).withMessage('Cijena mora biti pozitivan broj');
```

### 2.4.5 Provjera je li vrijednost Boolean

➡️ **Koristimo `isBoolean()` validator**:

```javascript
body('active').isBoolean().withMessage('Aktivnost mora biti tipa boolean');
```

### 2.4.6 Provjera specifičnih vrijednosti

➡️ **Koristimo `isIn()` validator za provjeru je li vrijednost sadržana u nekom nizu**:

```javascript
body('role').isIn(['admin', 'user']).withMessage('Uloga mora biti admin ili user');
```

### 2.4.7 Složena provjera lozinke regularnim izrazom

➡️ **Koristimo `matches()` validator**:

- pišemo **regularni izraz** koji definira pravila za lozinku
- npr. lozinka mora sadržavati barem jedno slovo i jedan broj, duljine minimalno 8 znakova

```javascript
body('password')
    .matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/)
    .withMessage('Lozinka mora sadržavati barem jedno slovo i jedan broj');
```

### 2.4.8 Grananje lanca provjere

➡️ Možemo koristiti i `check()` validator koja će pretražiti parametar definiran prema nazivu na svim mogućim lokacijama u HTTP zahtjevu, uključujući:

- u **tijelu zahtjeva** (`req.body`)
- u **_query_** parametrima (`req.query`)
- u **_route_** parametrima (`req.params`)
- u **zaglavljima** (`req.headers`)
- u **kolačićima** (`req.cookies`)

Ako se naziv parametra ponavlja na više mjesta, npr. parametar `password` postoji i u tijelu zahtjeva i u _query_ parametrima (naravno nije dobra praksa), `check()` će svejedno odraditi validaciju za sve te vrijednosti.

_Primjer validacijskog grananja za registraciju korisnika gdje želimo provjeriti sljedeće:_

- korisnik obavezno mora unijeti ime
- korisnik obavezno mora unijeti ispravnu email adresu
- lozinka mora imati minimalno 6 znakova
- potvrda lozinke mora biti jednaka lozinki

```javascript
const { check, validationResult } = require('express-validator');

app.post(
    '/register',

    [
        // ne navodimo lokaciju jer će check() pretražiti sve parametre
        check('name').notEmpty().withMessage('Ime je obavezno'), // zaseban middleware (1)
        check('email').isEmail().withMessage('Email je u krivom formatu'), // zaseban middleware (2)
        check('password').isLength({ min: 6 }).withMessage('Lozinka mora imati barem 6 znakova'), // zaseban middleware (3)
        check('confirmPassword') //zaseban middleware (4)
            .custom((value, { req }) => value === req.body.password)
            .withMessage('Lozinke se ne podudaraju!')
    ],

    (req, res) => {
        // callback funkcija
        const errors = validationResult(req);
        // >>> implementacija registracije ovdje (radit ćemo na WA7) <<<
        // ako nema pogrešaka:
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        res.send('Registracija uspješna!');
    }
);
```

> **Napomena**: U primjeru iznad imamo 4 _middleware_ funkcije (bez obzira što imaju ulančane metode). Ukupno je 4 _middlewarea_ jer polje gdje se definiraju ima ukupno 4 elementa.

### 2.4.9 Obrada polja u tijelu zahtjeva

Što ako klijent proslijedi **polje elemenata** u tijelu zahtjeva?

- Stvari ostaju iste! `express-validator` će provjeriti svaki element polja 🚀

_Na primjer:_ klijent pošalje zahtjev s nekim `ID`-evima:

```json
{
    "ids": [5, 4, 11, 4, 123]
}
```

Validacija provjerava je li svaki element polja `ids` tipa integer:

```javascript
body('ids').isInt().withMessage('Svaki element polja mora biti tipa integer');
```

Međutim, `express-validator` će sve **dolazne podatke tretirati kao stringove**, samim time, ako proslijedimo string `"123"`, validacija će proći.

- Proslijedimo li niz `[5, 4, 11, 4, "abc"]`, validacija **neće proći**.

<div style="page-break-after: always; break-after: page;"></div>

## 2.5 Često korišteni validatori

| **Validator**                   | **Sintaksa**                   | **Primjer**                                                                                   |
| ------------------------------- | ------------------------------ | --------------------------------------------------------------------------------------------- |
| **Obavezno polje**              | `notEmpty()`                   | `check('ime').notEmpty().withMessage('Ime je obavezno')`                                      |
| **Je prazno**                   | `isEmpty()`                    | `check('kljuc').isEmpty().withMessage('kljuc mora biti prazan')`                              |
| **Ključ postoji**               | `exists()`                     | `check('kljuc').exists().withMessage('kljuc mora postojati')`                                 |
| **Validacija emaila**           | `isEmail()`                    | `check('email').isEmail().withMessage('Pogrešan email format')`                               |
| **Min. duljina**                | `isLength({ min: X })`         | `check('password').isLength({ min: 6 }).withMessage('Mora biti minimalno 6 znakova')`         |
| **Max. duljina**                | `isLength({ max: X })`         | `check('username').isLength({ max: 12 }).withMessage('Mora biti maksimalno 12 znakova')`      |
| **Alfanumerički znak**          | `isAlphanumeric()`             | `check('username').isAlphanumeric().withMessage('Samo slova i brojevi!')`                     |
| **Točna duljina**               | `isLength({ min: X, max: X })` | `check('zip').isLength({ min: 5, max: 5 }).withMessage('Mora biti točno 5 znakova')`          |
| **Jednako**                     | `equals('vrijednost')`         | `check('role').equals('admin').withMessage('Mora biti admin')`                                |
| **Min/Max vrijednost**          | `isInt({ min: X, max: Y })`    | `check('age').isInt({ min: 18, max: 65 }).withMessage('Samo vrijednosti između 18 i 65')`     |
| **Integer check**               | `isInt()`                      | `check('age').isInt().withMessage('Mora biti integer')`                                       |
| **Decimal check**               | `isDecimal()`                  | `check('price').isDecimal().withMessage('Mora biti decimalni broj')`                          |
| **Boolean check**               | `isBoolean()`                  | `check('isActive').isBoolean().withMessage('Mora biti Boolean vrijednost')`                   |
| **String check**                | `isString()`                   | `check('name').isString().withMessage('Mora biti string')`                                    |
| **Inclusion**                   | `isIn(['a', 'b'])`             | `check('role').isIn(['admin', 'user']).withMessage('Kriva uloga!')`                           |
| **Sadržavanje podskupa**        | `contains('nešto')`            | `check('username').contains('admin').withMessage('Mora sadržavati admin')`                    |
| **Exclusion**                   | `not().isIn(['a', 'b'])`       | `check('username').not().isIn(['root', 'admin'])`                                             |
| **Custom Regex**                | `matches(/regex/)`             | `check('username').matches(/^[a-zA-Z]+$/).withMessage('Dozvoljena samo velika i mala slova')` |
| **Validacija URL-a**            | `isURL()`                      | `check('website').isURL().withMessage('Pogrešan URL!')`                                       |
| **Validacija kreditne kartice** | `isCreditCard()`               | `check('card').isCreditCard().withMessage('Pogrešan broj kreditne kartice')`                  |
| **Validacija IBAN-a**           | `isIBAN()`                     | `check('iban').isIBAN().withMessage('Pogrešan IBAN')`                                         |
| **ISO Date**                    | `isISO8601()`                  | `check('date').isISO8601().withMessage('Netočan format datuma')`                              |
| **Custom Validator**            | `custom(fn)`                   | `check('field').custom(value => value > 0).withMessage('Vrijednost mora biti pozitivna')`     |
| **Poklapanje lozinke**          | `custom((value, { req }))`     | `check('confirm').custom((lozinka, { req }) => lozinka === req.body.proslijedena_lozinka)`    |
| **Trim**                        | `trim()`                       | `check('username').trim().notEmpty().withMessage('Polje je obavezno!')`                       |
| **Array check**                 | `isArray()`                    | `check('roles').isArray().withMessage('Mora biti polje')`                                     |
| **Object check**                | `isObject()`                   | `check('user').isObject().withMessage('Mora biti objekt')`                                    |

> Sve validatore `express-validator` biblioteke možete pronaći na [službenoj dokumentaciji](https://express-validator.github.io/docs/api/validation-chain/). Naravno, nije ih potrebno sve znati napamet, već ove koji se najčešće koriste kao što su: `notEmpty()`, `isEmail()`, `isLength()`, `isAlphanumeric()`, `isInt()`, `matches()` i `custom()`.

<div style="page-break-after: always; break-after: page;"></div>

## 2.6 Sanitizacija podataka

**Sanitizacija podataka** (_engl. data sanitization_) predstavlja postupak obrade i pročišćavanja ulaznih podataka kojim se oni uklanjanjem neispravnih, nepoželjnih ili potencijalno opasnih elemenata dovode u sigurno i pouzdano stanje za daljnju obradu.

**Proces sanitizacije mora biti izveden prije same validacije podataka.**

Također, sanitizacija može uključivati i **transformaciju podataka u odgovarajući format** koji je prihvatljiv i siguran za aplikaciju.

> **Napomena:** Ovdje se ne radi o sanitizaciji podataka u značenju trajnog i ireverzibilnog uklanjanja podataka s fizičkih medija za pohranu, poput HDD-a, SSD-a ili USB memorije. Iako se termin u praksi koristi i u tom kontekstu, u ovom slučaju odnosi se isključivo na sanitizaciju podataka unutar poslužiteljskog okruženja web aplikacije.

- _Primjerice_: ako korisnik unese email adresu s velikim slovima, možemo ju pretvoriti u mala slova prije nego krenemo s validacijom

`express-validator` biblioteka nudi **niz _middlewarea_** koji se koriste na isti način kao i validatori.

➡️ **Pretvorba email adrese u mala slova** korištenjem `normalizeEmail()` _middlewarea_:

```javascript
body('email').normalizeEmail(all_lowercase: true);

// npr. email: 'Sanja.sanjic@Gmail.com' -> 'sanja.sanjic@gmail.com'
```

➡️ **Uklanjanje praznih znakova** s početka i kraja stringa koristeći `trim()` _middleware_:

```javascript
body('username').trim();

// npr. '  Sanja  ' -> 'Sanja'
```

➡️ **Pretvorba stringa** u broj koristeći `toInt()` _middleware_:

```javascript
body('age').toInt();

// npr. '25' -> 25
```

➡️ **Brisanje znakova koji nisu definirani** u `whitelist` parametru koristeći `whitelist()` _middleware_:

```javascript
body('username').whitelist('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890');

// npr. 'Sanja123!' -> 'Sanja123'
```

➡️ **Brisanje znakova koji su definirani** u `blacklist` parametru koristeći `blacklist()` _middleware_:

```javascript
body('username').blacklist('!@#$%^&*()_+');

// npr. 'Sanja123!$$$' -> 'Sanja123'
```

## 2.7 Sprječavanje reflektiranog XSS napada

**XSS** (_eng. Cross-Site Scripting_) napadi su vrlo česti i opasni. Postoji više kategorija XSS napada, a jedan od najčešćih je **reflektirani XSS napad** (_eng. Reflected XSS attack_).

**Napad izgleda ovako:**

- korisnik šalje HTTP zahtjev na poslužitelj s malicioznim JavaScript kodom, najčešće u URL-u
- maliciozni kod, najčešće obuhvaćen u HTML `<script>` tagu, izvršava se na korisničkoj strani
- u usporedbi sa **pohranjenim XSS napadom** (_eng. Stored XSS attack_), reflektirani XSS napad je **jednokratan** i **ne ostavlja tragove u bazi podataka niti na poslužitelju**

Radi se o čestom hakerskom napadu koji iskorištava ranjivosti u web aplikacijama koje ne provjeravaju i ne sanitiziraju ulazne podatke na poslužiteljskoj strani.

<img src="https://github.com/lukablaskovic/FIPU-WA/blob/main/WA6%20-%20Middleware%20funkcije/screenshots/xss-illustration.png?raw=true" style="width:60%; box-shadow: none !important; "></img>

> Slika 3: Ilustracija reflektiranog XSS napada - korisnik šalje maliciozni kod u URL-u koji se izvršava na klijentskoj strani.

Uzet ćemo za primjer našu rutu `GET /hello` koja očekuje _query_ parametar `ime`.

```javascript
// index.js

app.get('/hello', [query('ime').notEmpty()], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    res.send('Hello, ' + req.query.ime);
});
```

Ako pošaljemo zahtjev: `GET http://localhost:3000/hello?ime=Pero`, dobit ćemo odgovor `"Hello, Pero"`.

- Ako pošaljemo prazan zahtjev, dobit ćemo grešku jer smo to pokrili s `notEmpty()` validatorom.

Možemo nadograditi rutu tako da još sanitiziramo _query_ parametar koristeći `trim()` _middleware_ kako bi uklonili prazne znakove s početka i kraja stringa te možemo provjeriti je li korisnik poslao samo slova koristeći `isAlpha()` validator.

Sljedeći primjer ima samo 1 _middleware_, međutim možemo ih odvojiti i u zasebne _middleware_ funkcije:

```javascript
// 1 middleware
app.get('/hello', [query('ime').notEmpty().trim().isAlpha()], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    res.send('Hello, ' + req.query.ime);
});
```

```javascript
// 3 middlewarea
app.get('/hello', [query('ime').notEmpty(), query('ime').trim(), query('ime').isAlpha()], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    res.send('Hello, ' + req.query.ime);
});
```

Možemo dodati i odgovarajuće poruke za greške:

```javascript
// index.js

app.get('/hello', [query('ime').notEmpty().withMessage('Ime je obavezno'), query('ime').trim(), query('ime').isAlpha().withMessage('Ime mora sadržavati samo slova')], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    res.send('Hello, ' + req.query.ime);
});
```

Međutim, što da nemamo provjeru `isAlpha()` i korisnik pošalje maliciozni kod u _query_ parametru? Prisjetite se, _query parametri_ nisu obavezni dio definicije rute, stoga ih klijenti mogu slati kako žele, koliko žele i u bilo kojem obliku.

- **_Banalni primjer_: Maliciozni korisnik pošalje HTML skriptni tag u _query_ parametru** koji sadrži `alert('Hakirani ste! Molimo da pošaljete novac na adresu...')`:

> Zašto je primjer banalan? Zato što se radi o vrlo jednostavnom XSS napadu koji koristi osnovne HTML i JavaScript elemente kako bi demonstrirao koncept XSS napada. U stvarnim scenarijima, napadi mogu biti mnogo sofisticiraniji gdje korisnik umjesto običnog `alert` prozora može pokušati ukrasti kolačiće ili JWT tokene, preusmjeriti zahtjev korisnika na drugi zlonamjerni poslužitelj ili čak izvršiti zlonamjerni kod na klijentskoj strani.

Primjer takvog HTTP zahtjeva izgledao bi ovako:

```plaintext
GET http://localhost:3000/hello?ime=<script>alert('Hakirani ste! Molimo da pošaljete novac na adresu...')</script>
```

Ako maknete `isAlpha()` validator, dobit ćete odgovor s "malicioznim kodom", odnosno **skripta će se izvršiti na korisničkoj strani**:

```javascript
// index.js

app.get('/hello', [query('ime').notEmpty().withMessage('Ime je obavezno'), query('ime').trim()], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    res.send('Hello, ' + req.query.ime);
});
```

Ako pošaljete GET zahtjev u web pregledniku, dobit ćete `alert` poruku.

<img src="https://github.com/lukablaskovic/FIPU-WA/blob/main/WA6%20-%20Middleware%20funkcije/screenshots/xss-example.png?raw=true" style="width:70%; box-shadow: none !important; "></img>

> Slika 4: Primjer reflektiranog XSS napada - maliciozni kod `<script>alert...</script>` izvršava se na klijentskoj strani.

➡️ Jedan od _middlewarea_ koji se može koristiti za sprječavanje reflektiranog XSS napada je **`escape()` sanitizacijski _middleware_**:

```javascript
query('ime').escape();
```

Ovaj _middleware_ će zamijeniti HTML znakove, npr. `<`, `>`, `&`, `'`, `"` s njihovim kodiranim ekvivalentima `&lt;`, `&gt;`, `&amp;`, `&#39;`, `&quot;`.

```javascript
// index.js

app.get('/hello', [query('ime').notEmpty().withMessage('Ime je obavezno'), query('ime').trim(), query('ime').escape()], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    res.send('Hello, ' + req.query.ime);
});
```

_Primjer odgovora_ (neće se izvršiti skripta i XSS napad je spriječen):

```plaintext
Hello, &lt;script&gt;alert(&#x27;Hakirani ste! Molimo da pošaljete novac na
adresu...&#x27;)&lt;&#x2F;script&gt;
```

<div style="page-break-after: always; break-after: page;"></div>

# Samostalni zadatak za Vježbu 6

Izradite novi poslužitelj `movie-server` na proizvoljnom portu te implementirajte sljedeće rute:

1. `GET /movies` - vraća listu filmova u JSON formatu
2. `GET /movies/:id` - vraća podatke o filmu s određenim `id`-om
3. `POST /movies` - dodaje novi film u listu filmova (_in-memory_)
4. `PATCH /movies/:id` - ažurira podatke o filmu s određenim `id`-om
5. `GET /actors` - vraća listu glumaca u JSON formatu
6. `GET /actors/:id` - vraća podatke o glumcu s određenim `id`-om
7. `POST /actors` - dodaje novog glumca u listu glumaca (_in-memory_)
8. `PATCH /actors/:id` - ažurira podatke o glumcu s određenim `id`-om

Podaci za filmove:

```json
[
    {
        "id": 4222334,
        "title": "The Shawshank Redemption",
        "year": 1994,
        "genre": "Drama",
        "director": "Frank Darabont"
    },
    {
        "id": 5211223,
        "title": "The Godfather",
        "year": 1972,
        "genre": "Crime",
        "director": "Francis Ford Coppola"
    },
    {
        "id": 4123123,
        "title": "The Dark Knight",
        "year": 2008,
        "genre": "Action",
        "director": "Christopher Nolan"
    }
]
```

Podaci za glumce:

```json
[
    {
        "id": 123,
        "name": "Morgan Freeman",
        "birthYear": 1937,
        "movies": [4222334]
    },
    {
        "id": 234,
        "name": "Marlon Brando",
        "birthYear": 1924,
        "movies": [5211223]
    },
    {
        "id": 345,
        "name": "Al Pacino",
        "birthYear": 1940,
        "movies": [5211223]
    }
]
```

Implementirajte _middleware_ koji će se upotrebljavati za pretraživanje filmova i glumaca po `id`-u. Kada korisnik pošalje zahtjev na rutu koja ima route parametar `id` na resursu `/movies`, _middleware_ će provjeriti postoji li taj film u listi filmova. Napravite isto i za glumce, dodatnim _middlewareom_. Odvojite rute u zasebne router instance, a implementacije _middlewareova_ prebacite u zasebne datoteke unutar `middleware` direktorija.

Dodajte novi _middleware_ na **razini cijele Express aplikacije** koji će logirati svaki dolazni zahtjev na konzolu u sljedećm formatu:

```plaintext
[naziv_poslužitelja] [trenutni_datum_i_vrijeme] HTTP_metoda URL_zahtjeva
```

_Primjer:_

```plaintext
[movie-server] [2024-06-01 12:00:00] GET /movies
```

**Za svaki zahtjev morate logirati:**

- naziv aplikacije
- trenutni datum i vrijeme
- HTTP metodu zahtjeva
- URL zahtjeva

Instalirajte `express-validator` biblioteku te implementirajte sljedeće validacije za odgovarajuće rute:

- `POST /movies` - validirajte jesu li poslani `title`, `year`, `genre` i `director`
- `PATCH /movies/:id` - validirajte jesu li poslani `title`, `year`, `genre` ili `director`
- `POST /actors` - validirajte jesu li poslani `name` i `birthYear`
- `PATCH /actors/:id` - validirajte jesu li poslani `name` ili `birthYear`
- `GET /movies/:id` - validirajte je li `id` tipa integer
- `GET /actors/:id` - validirajte je li `id` tipa integer
- `GET /movies` - dodajte 2 _query_ parametra `min_year` i `max_year` te validirajte jesu li oba tipa integer. Ako su poslani, provjerite jesu li `min_year` i `max_year` u ispravnom rasponu (npr. `min_year < max_year`). Ako je poslan samo jedan parametar, provjerite je li tipa integer.
- `GET /actors` - dodajte _route_ parametar `name` te provjerite je li tipa string. Uklonite prazne znakove s početka i kraja stringa koristeći odgovarajući _middleware_.

Obradite greške za svaku rutu slanjem gotovog objekta s detaljima o greškama koju generira `express-validator` biblioteka.

Osigurajte sve rute od reflektiranog XSS napada koristeći odgovarjauće validatore iz `express-validator` biblioteke.

**U prilogu zadaće obavezno uključiti poveznicu na javno Postman okruženje s testovima za definirane rute.**
