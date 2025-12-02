# Web aplikacije (WA)

**Nositelj**: doc. dr. sc. Nikola Tanković  
**Asistent**: Luka Blašković, mag. inf.

**Ustanova**: Sveučilište Jurja Dobrile u Puli, Fakultet informatike u Puli

<img src="https://raw.githubusercontent.com/lukablaskovic/FIPU-PJS/main/0.%20Template/FIPU_UNIPU.png" style="width:40%; box-shadow: none !important; "></img>

# (3) Razmjena podataka između klijenta i poslužitelja

<img src="https://github.com/lukablaskovic/FIPU-WA/blob/main/wa-icons/WA_3.png?raw=true" style="width:9%; border-radius: 8px; float:right;"></img>

<div style="float: clear; margin-right:5px;">
Do sada smo obradili izradu Express poslužitelja koji može isporučivati statične datoteke i JSON podatke klijentskoj strani, pri čemu nam je Postman služio kao osnovno klijentsko okruženje. Naučili smo kako validirati i obraditi podatke koji pristižu na poslužitelj putem različitih HTTP metoda (GET, POST, PUT, PATCH, DELETE).

U ovoj skripti prelazimo na razvoj klijentskog dijela web aplikacije, koji ćemo izraditi koristeći Vue.js razvojni okvir. Budući da se Vue.js detaljno obrađuje u sklopu kolegija <a href="https://github.com/azuzic/FIPU-PI/tree/main/Skripte" target="_blank">Programsko inženjerstvo</a>, ovdje se nećemo zadržavati na njegovim specifičnostima. Umjesto toga, usredotočit ćemo se na praktičnu realizaciju komunikacije između klijentske i poslužiteljske strane.

Preporučuje se da prije početka izrade <i>frontend</i> dijela web aplikacije pripremite stabilan Express.js poslužitelj na temelju zadnje dvije skripte te ga temeljito testirate u Postmanu. U ovoj skripti ćemo implementirati jednostavnu Vue.js aplikaciju za naručivanje Pizze koja će komunicirati Express poslužiteljem, a nakon toga preporuka je paralelno razvijati i testirati klijentski i poslužiteljski sloj aplikacije.

</div>

<br>

**🆙 Posljednje ažurirano: 1.12.2025.**

- skripta nije gotova
- bit će vrlo uskoro 🙃

## Sadržaj

- [Web aplikacije (WA)](#web-aplikacije-wa)
- [(3) Razmjena podataka između klijenta i poslužitelja](#3-razmjena-podataka-između-klijenta-i-poslužitelja)
    - [Sadržaj](#sadržaj)
- [1. Postavljanje `Express` poslužitelja](#1-postavljanje-express-poslužitelja)
    - [1.1 Definiranje osnovnih endpointova i dummy podataka](#11-definiranje-osnovnih-endpointova-i-dummy-podataka)
        - [1.1.1 Implementacija `/pizze Router`](#111-implementacija-pizze-router)
        - [1.1.2 Implementacija `/narudzbe Router`](#112-implementacija-narudzbe-router)
- [2. Implementacija Vue.js klijentske strane](#2-implementacija-vuejs-klijentske-strane)
    - [2.1 Konfiguracija Vue.js projekta s TailwindCSS-om i Vite-om](#21-konfiguracija-vuejs-projekta-s-tailwindcss-om-i-vite-om)
    - [2.2 Dodavanje osnovnih komponenti korisničkog sučelja](#22-dodavanje-osnovnih-komponenti-korisničkog-sučelja)
        - [PizzaList.vue komponenta](#pizzalistvue-komponenta)
        - [Header.vue komponenta](#headervue-komponenta)
    - [Implementacija odabira pizze](#implementacija-odabira-pizze)
- [3. Axios i komunikacija s Express poslužiteljem](#3-axios-i-komunikacija-s-express-poslužiteljem)
    - [3.1 CORS politika](#31-cors-politika)
    - [3.2 Dinamičko iscrtavanje podataka o pizzama](#32-dinamičko-iscrtavanje-podataka-o-pizzama)
    - [3.2.1 `v-for` direktiva](#321-v-for-direktiva)
    - [3.2.2 Prikaz ikona sastojaka](#322-prikaz-ikona-sastojaka)
    - [3.2.3 Dodavanje javnih slika na poslužitelj](#323-dodavanje-javnih-slika-na-poslužitelj)

<div style="page-break-after: always; break-after: page;"></div>

# 1. Postavljanje `Express` poslužitelja

Krenimo s definiranjem osnovnog `Express` poslužitelja koji će služiti kao backend za našu aplikaciju za naručivanje pizze. Možete ponovno iskoristiti kod iz prethodnih skript ili započeti od nule (u tom slučaju preskočite na poglavlje 2).

Definirat ćemo dva direktorija naše web aplikacije (`pizza-express` za poslužitelj i `pizza-vue` za klijenta):

```bash
app
├── pizza-express
└── pizza-vue
```

Prebacite se u direktorij `pizza-express` i inicijalizirajte osnovni `Express.js` projekt:

```bash
→ cd app/pizza-express
→ npm init -y
→ npm install express
```

```javascript
// app/pizza-express/index.js

import express from 'express';

const app = express();
const PORT = 3000;
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Dobrodošli u Pizza Express poslužitelj!');
});

app.listen(PORT, () => {
    console.log(`Pizza poslužitelj sluša na portu ${PORT}`);
});
```

```bash
→ nodemon index.js

Pizza poslužitelj sluša na portu 3000
```

Dodajte u `package.json` datoteku `"type": "module"` kako biste omogućili korištenje ES modula, te isključite verzioniranje `node_modules` direktorija dodavanjem `.gitignore` datoteke:

```bash
→ echo "node_modules/" > .gitignore
```

```plaintext
// .gitignore
node_modules/
```

## 1.1 Definiranje osnovnih endpointova i dummy podataka

Dodajmo osnovne _endpointove_ za upravljanje narudžbama pizza. Implementirat ćemo sljedeće rute:

- `GET /pizze` - Dohvaćanje dostupnih pizza
- `GET /pizze/:naziv` - Dohvaćanje detalja o određenoj pizzi
- `POST /narudzbe` - Izrada nove narudžbe pizza

Stvorite `Router` objekte za pizze i narudžbe:

```javascript
→ mkdir routes
→ touch routes/pizze.js routes/narudzbe.js
```

Dodat ćemo i nešto _in-memory dummy_ podataka za pizze i narudžbe unutar `data/data.js` datoteke:

```javascript
→ mkdir data
→ touch data/data.js
```

_Primjer podataka iz `data/data.js` datoteke:_

```javascript
// app/pizza-express/data/data.js

export const pizze = [
    { id: 1, naziv: 'Margherita', sastojci: ['rajčica', 'sir', 'bosiljak'], cijene: { mala: 7.3, srednja: 9.2, jumbo: 16.2 } },
    { id: 2, naziv: 'Capricciosa', sastojci: ['rajčica', 'sir', 'šunka', 'gljive'], cijene: { mala: 7.9, srednja: 9.9, jumbo: 18.0 } },
    { id: 3, naziv: 'Al Tonno', sastojci: ['rajčica', 'sir', 'tunjevina', 'crveni luk'], cijene: { mala: 8.7, srednja: 11.7, jumbo: 21.9 } },
    { id: 4, naziv: 'Fantasia', sastojci: ['rajčica', 'sir', 'gljive', 'šunka', 'paprika', 'panceta', 'vrhnje'], cijene: { mala: 9.4, srednja: 12.7, jumbo: 22.2 } },
    { id: 5, naziv: 'Slavonska', sastojci: ['rajčica', 'sir', 'kulen', 'panceta', 'feferoni ljuti', 'paprika', 'crveni luk'], cijene: { mala: 9.9, srednja: 13.2, jumbo: 22.9 } }
];

export const narudzbe = [
    {
        id: 1,
        narucene_pizze: [
            // svaka narudžba sastoji se od jedne ili više naručenih pizza
            {
                // za svaku naručenu pizzu bilježimo naziv, naručenu veličinu i količinu
                naziv: 'Margherita',
                velicina: 'srednja',
                kolicina: 2
            },
            {
                naziv: 'Fantasia',
                velicina: 'jumbo',
                kolicina: 1
            }
        ],
        ukupna_cijena: 40.6, // ukupnu cijenu narudžbe računamo na poslužitelju
        podaci_dostava: {
            prezime: 'Perić',
            adresa: 'Zagrebačka 15, Pula',
            telefon: '091234567'
        }
    }
];
```

Struktura Express.js projekta sada nam izgleda ovako:

```plaintext
app
└── pizza-express
    ├── node_modules
    ├── index.js
    ├── package.json
    ├── package-lock.json
    ├── data
    │   └── data.js
    ├── routes
    │   ├── pizze.js
    │   └── narudzbe.js
    └── .gitignore
└── pizza-vue
```

### 1.1.1 Implementacija `/pizze Router`

U ovaj `Router` dodajemo rute za dohvaćanje svih pizza i pojedinačne pizze prema nazivu.

```javascript
// app/pizza-express/routes/pizze.js

import express from 'express';
import { pizze } from '../data/data.js'; // učitavanje dummy podataka
const router = express.Router();

// GET /pizze - Dohvaćanje svih pizza (npr. GET /pizze)
router.get('/', (req, res) => {
    if (pizze.length === 0 || !pizze) {
        return res.status(404).json({ message: 'Nema dostupnih pizza.' });
    }

    res.status(200).json(pizze);
});

// GET /pizze/:naziv - Dohvaćanje pizze prema nazivu (npr. GET /pizze/Margherita)

router.get('/:naziv', (req, res) => {
    const naziv = req.params.naziv;
    const pizza = pizze.find(p => p.naziv.toLowerCase() === naziv.toLowerCase());

    if (!pizza) {
        return res.status(404).json({ message: `Pizza s nazivom '${naziv}' nije pronađena.` });
    }

    res.status(200).json(pizza);
});

export default router;
```

Uključite `pizze` router u glavnu `index.js` datoteku:

```javascript
// app/pizza-express/index.js

import pizzeRouter from './routes/pizze.js';
app.use('/pizze', pizzeRouter); // dodavanje prefiksa "/pizze" za svaki endpoint iz pizze.js Routera
```

Otvorite Postman, dodajte odgovarajuće testove i provjerite ispravnost implementacije.

<img src="https://github.com/lukablaskovic/FIPU-WA/blob/main/WA3%20-%20Razmjena%20podataka%20izme%C4%91u%20klijenta%20i%20poslu%C5%BEitelja/screenshots/postman_sve_pizze.png?raw=true" style="width:60%; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); margin-top:10px;"></img>

> Slika 1: Testiranje GET /pizze _endpointa_ u Postmanu (odabrani prikaz `Preview` HTTP odgovora)

### 1.1.2 Implementacija `/narudzbe Router`

U ovaj `Router` dodajemo rutu za izradu nove narudžbe pizza.

Očekujemo sljedeći JSON format podataka u tijelu POST zahtjeva:

```json
{
    "narucene_pizze": [
        {
            "naziv": "Margherita",
            "velicina": "srednja",
            "kolicina": 2
        },
        {
            "naziv": "Fantasia",
            "velicina": "jumbo",
            "kolicina": 1
        }
    ],
    "podaci_dostava": {
        "prezime": "Perić",
        "adresa": "Zagrebačka 15, Pula",
        "telefon": "091234567"
    }
}
```

Ukupnu cijenu narudžbe ćemo izračunati na poslužitelju na temelju naručenih pizza.

```javascript
// app/pizza-express/routes/narudzbe.js

import express from 'express';
import { narudzbe, pizze } from '../data/data.js'; // učitavanje dummy podataka
const router = express.Router();

// POST /narudzbe - Izrada nove narudžbe pizza
router.post('/', (req, res) => {
    const { narucene_pizze, podaci_dostava } = req.body;
    if (!narucene_pizze || narucene_pizze.length === 0) {
        return res.status(400).json({ message: 'Nisu specificirane naručene pizze.' });
    }
    // Izračun ukupne cijene narudžbe
    let ukupna_cijena = 0;
    for (const narucena of narucene_pizze) {
        const pizza = pizze.find(p => p.naziv.toLowerCase() === narucena.naziv.toLowerCase());
        if (!pizza) {
            return res.status(400).json({ message: `Pizza s nazivom '${narucena.naziv}' nije dostupna.` });
        }
        const cijena = pizza.cijene[narucena.velicina.toLowerCase()];
        if (!cijena) {
            return res.status(400).json({ message: `Veličina '${narucena.velicina}' nije dostupna za pizzu '${narucena.naziv}'.` });
        }
        ukupna_cijena += cijena * narucena.kolicina;
    }
    ukupna_cijena = Number(ukupna_cijena.toFixed(2)); // zaokruživanje ukupne cijene na 2 decimale
});
```

Nakon što smo validirali podatke iz HTTP zahtjeva i izračunali ukupnu cijenu narudžbe, stvorit ćemo novi zapis narudžbe i dodati ga u našu _in-memory_ listu narudžbi.

```javascript

ukupna_cijena = Number(ukupna_cijena.toFixed(2));

const nova_narudzba = {
    id: narudzbe.length + 1,
    narucene_pizze,
    ukupna_cijena,
    podaci_dostava
  };
  narudzbe.push(nova_narudzba);
  res.status(201).json({ message: 'Narudžba je uspješno kreirana.', narudzba: nova_narudzba });
});

export default router;
```

Uključite `narudzbe` router u glavnu `index.js` datoteku:

```javascript
// app/pizza-express/index.js

import narudzbeRouter from './routes/narudzbe.js';
app.use('/narudzbe', narudzbeRouter); // dodavanje prefiksa "/narudzbe" za svaki endpoint iz narudzbe.js Routera
```

Otvorite Postman, dodajte odgovarajući test i provjerite ispravnost implementacije.

<img src="https://github.com/lukablaskovic/FIPU-WA/blob/main/WA3%20-%20Razmjena%20podataka%20izme%C4%91u%20klijenta%20i%20poslu%C5%BEitelja/screenshots/postman_dodavanje_pizze.png?raw=true" style="width:60%; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); margin-top:10px;"></img>

> Slika 2: Testiranje POST /pizze _endpointa_ u Postmanu (odabrani prikaz `Preview` HTTP odgovora i JSON tijela zahtjeva)

To je to za sada! Prebacujemo se na izradu klijentske strane naše web aplikacije koristeći Vue.js.

# 2. Implementacija Vue.js klijentske strane

Izradit ćemo jednostavno [Vue.js](https://vuejs.org/) korisničko sučelje koristeći [Tailwind CSS 4.1](https://tailwindcss.com/) CSS _framework_ i [Vite Build Tool](https://vite.dev/).

**TailwindCSS** je vrlo popularan _utility-first CSS framework_ (znači: koristi gotove CSS klase za stilizaciju elemenata umjesto pisanja prilagođenog CSS-a) koji omogućuje izradu korisničkih sučelja brzim sastavljanjem unaprijed definiranih CSS klasa niske razine (npr. `flex`, `pt-4`, `text-center`, `bg-blue-500`, itd.). Umjesto pisanja vlastitih CSS pravila, izgled i stil elementa definiramo kombiniranjem gotovih klasa direktno u HTML/Vue datotekama.

U osnovi, TailwindCSS djeluje kao alat koja nam pruža **gradivne blokove** kojima slažemo dizajn našeg korisničkog sučelja.

**Vite** je moderno razvojno okruženje i alat za izgradnju web aplikacija, optimiziran za rad s JavaScript okvirima kao što su Vue.js, React.js i Svelte. Temelji se na izuzetno brzom dev server mehanizmu koji omogućuje trenutačno osvježavanje tijekom razvoja, učinkovitu optimizaciju te brzu izgradnju aplikacija. Uz to, nudi izvrsnu podršku za TypeScript i JSX/TSX.

Iako je **Webpack** dugo bio standard u industriji, Vite je danas sve češći izbor zahvaljujući znatno boljim performansama i minimalnoj konfiguraciji potrebnoj za pokretanje projekta.

## 2.1 Konfiguracija Vue.js projekta s TailwindCSS-om i Vite-om

Pustite otvoren Express.js poslužitelj te u novom terminalu inicijalizirajte Vue.js projekt.

<img src="https://github.com/lukablaskovic/FIPU-WA/blob/main/WA3%20-%20Razmjena%20podataka%20izme%C4%91u%20klijenta%20i%20poslu%C5%BEitelja/screenshots/vs-code-split-terminal.png?raw=true" style="width:80%; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); margin-top:10px;"></img>

Prebacit ćemo se u `pizza-vue` direktorij i inicijalizirati Vue.js projekt koristeći Vite.

Otvorit će se interaktivni vodič za konfiguraciju projekta.

Možete odabrati što god želite, no preporuka je za početak uključiti samo `Router` i `Prettier`, te započeti s praznim projektom.

> [Prettier](https://marketplace.visualstudio.com/items?itemName=Prettier.prettier-vscode) je korisna VS Code ekstenzija za automatsko formatiranje koda prema definiranim pravilima, što pomaže u održavanju konzistentnog stila kodiranja. Preporuka je koristiti Prettier u svim projektima kako bi se izbjegle nesuglasice u stilu kodiranja među različitim članovima tima.

```bash
→ cd /app/pizza-vue
→ npm create vue@latest
```

```
Need to install the following packages:
create-vue@3.18.3
Ok to proceed? (y) y


> npx
> "create-vue"

┌  Vue.js - The Progressive JavaScript Framework
│
◇  Project name (target directory):
│  vue-project
│
◆  Select features to include in your project: (↑/↓ to navigate, space to select, a to toggle all, enter to confirm)
│  ◻ TypeScript
│  ◻ JSX Support
│  ◼ Router (SPA development)
│  ◻ Pinia (state management)
│  ◻ Vitest (unit testing)
│  ◻ End-to-End Testing
│  ◻ ESLint (error prevention)
│  ◼ Prettier (code formatting)

◇  Select experimental features to include in your project: (↑/↓ to navigate, space to select, a to toggle all, enter to confirm)
│  none
│
◇  Skip all example code and start with a blank Vue project?
│  Yes
```

Nakon što je projekt inicijaliziran, primijetit ćete da ste dobili direktorij unutar `pizza-vue` direktorija s imenom koje ste odabrali (u našem slučaju `vue-project`).

Ovo možemo riješiti bash naredbom `mv` za premještanje svih datoteka iz poddirektorija u glavni `pizza-vue` direktorij:

```bash
→ pwd (#provjerite da ste u /app/pizza-vue)
→ mv vue-project/* vue-project/.* . (# premještanje svih neskrivenih (*) i skrivenih datoteka (.*) iz vue-project u trenutni direktorij .)
```

Prije nastavka provjerite jesu lise sve datoteke prebacile. Ako jesu, `vue-project` direktorij sada možete obrisati.

Otvorite `package.json` datoteku i provjerite jesu li sve ovisnosti ispravno instalirane:

_Primjer: `package.json` datoteke Vue.js projekta:_

```json
{
    "name": "vue-project",
    "version": "0.0.0",
    "private": true,
    "type": "module",
    "engines": {
        "node": "^20.19.0 || >=22.12.0"
    },
    "scripts": {
        "dev": "vite",
        "build": "vite build",
        "preview": "vite preview",
        "format": "prettier --write --experimental-cli src/"
    },
    "dependencies": {
        "vue": "^3.5.25",
        "vue-router": "^4.6.3"
    },
    "devDependencies": {
        "@vitejs/plugin-vue": "^6.0.2",
        "prettier": "3.6.2",
        "vite": "^7.2.4",
        "vite-plugin-vue-devtools": "^8.0.5"
    }
}
```

Možete uočiti `scripts` ključ u kojem su definirane različite CLI naredbe za razvoj i izgradnju Vue.js aplikacije.

Prije nego možemo pokrenuti razvojni server, potrebno je instalirati sve ovisnosti navedene u `package.json` datoteci:

```bash
→ npm install
```

Primjer uspješne instalacije ovisnosti:

```
added 125 packages, and audited 126 packages in 24s

32 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities
```

`npm` naredbe pokrećemo iz terminala unutar `pizza-vue` direktorija, prefiksom `npm run <script-name>`:

_Primjer:_

```bash
→ npm run dev (# pokretanje CLI naredbe vite)
→ npm run build (# pokretanje CLI naredbe vite build)
→ npm run format (# pokretanje CLI naredbe prettier --write --experimental-cli src/)
```

Sada možemo pokrenuti razvojni poslužitelj koristeći naredbu `npm run dev`:

```bash
→ npm run dev

# ili samo
→ vite
```

Otvorite web preglednik i posjetite `http://localhost:5173/` kako biste vidjeli početnu stranicu Vue.js aplikacije.

<img src="https://github.com/lukablaskovic/FIPU-WA/blob/main/WA3%20-%20Razmjena%20podataka%20izme%C4%91u%20klijenta%20i%20poslu%C5%BEitelja/screenshots/vue-dev-server-start.png?raw=true" style="width:60%; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); margin-top:10px;"></img>

> Slika 3: Početna stranica Vue.js aplikacije pokrenute s Vite razvojnim poslužiteljem na zadanom portu `5173`. Vue.js developer tools možete otvoriti putem preglednika za lakše debugiranje Vue komponenti kraticom `SHIFT + ALT/OPT + D`.

> Hint: Isto možete provjeriti i u Postmanu. Možete zamisliti Vite kao specijalizirani poslužitelj koji isporučuje HTML stranicu s ugrađenim JavaScript modulima koji onda iscrtavaju web stranicu u pregledniku

---

Sada ćemo **konfigurirati TailwindCSS** unutar našeg Vue.js projekta.

Zaustavite Vite poslužitelj slanjem `kill` signala (`CTRL + C`) u aktivnom terminalu.

Pokrenite sljedeće naredbe za instalaciju TailwindCSS-a i njegovih ovisnosti:

> Napomena: Za vrijeme pisanja ove skripte, najnovija verzija TailwindCSS-a je 4.1, a za Vite postoji i službeni plugin `@tailwindcss/vite` koji olakšava integraciju. Uvijek je dobro pratiti službene dokumentacije kako biste bili sigurni da se koraci instalacije nisu promijenili.

```bash
→ pwd (#provjerite da ste u /app/pizza-vue)
→ npm install tailwindcss @tailwindcss/vite
```

Otvorite `vite.config.js` datoteku i dodajte `@tailwindcss/vite` plugin kako bi TailwindCSS mogao biti pravilno integriran s Vite-om:

```javascript
// vite.config.js
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
    plugins: [
        tailwindcss() // dodajte ovaj redak
    ]
});
```

Nakon toga, dodat ćemo osnovnu konfiguracijsku datoteku `assets/tailwind.css` za TailwindCSS unutar našeg `src` direktorija:

```bash
→ cd src
→ mkdir assets
→ touch assets/tailwind.css
```

Unutar datoteke `assets/tailwind.css`, dodajte samo jedan redak za uvoz osnovnih TailwindCSS stilova:

```css
@import 'tailwindcss';
```

Sada ćemo osigurati da se `tailwind.css` datoteka učitava unutar glavne `main.js` datoteke Vue.js aplikacije:

```javascript
// app/pizza-vue/src/main.js

import './assets/tailwind.css';
```

To je to! Sada možete ponovno pokrenuti Vite razvojni poslužitelj i provjeriti je li TailwindCSS ispravno integriran na način da dodate neke osnovne TailwindCSS klase u `App.vue` datoteku:

```html
<!-- app/pizza-vue/src/App.vue -->
<template>
    <h1 class="text-red-500">You did it!</h1>
    <h1 class="text-3xl font-bold underline">Hello world!</h1>
</template>
```

> Podsjetnik za TailwindCSS: [Programsko inženjerstvo - Vue Osnove skripta](https://github.com/azuzic/FIPU-PI/blob/main/Skripte/Skripta%201.%20-%20Vue%20Osnove/1.%20Vue%20Osnove.md), autor: Alesandro Žužić, mag. inf.

Pokrenite Vite razvojni poslužitelj, trebali biste vidjeti crveni tekst <span style="color:red">You did it!</span> i veliki podcrtani naslov <u>**Hello world!**</u>.

<img src="https://github.com/lukablaskovic/FIPU-WA/blob/main/WA3%20-%20Razmjena%20podataka%20izme%C4%91u%20klijenta%20i%20poslu%C5%BEitelja/screenshots/tailwind_ready_wohoo.png?raw=true" style="width:60%; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); margin-top:10px;"></img>

> Slika 4: Ispravno integriran TailwindCSS u Vue.js aplikaciju (prikaz u pregledniku)

Općenito, klase za Tailwind CSS ne želite mijenjati direktno u CSS kodu, već koristiti i kombinirati predefinirane klase koje dolaze s Tailwindom. Na primjer, klasa `text-red-500` postavlja boju teksta na crvenu, dok `text-3xl`, `font-bold` i `underline` definiraju veličinu fonta, debljinu i podcrtavanje teksta.

Preporuka je naučiti služiti se [TailwindCSS dokumentacijom](https://tailwindcss.com/docs/styling-with-utility-classes).

Uspješno smo konfigurirali Vue.js projekt s TailwindCSS-om i Vite-om! 🚀 Naša web aplikacija sada se sastoji od dva dijela:

1. **Express.js poslužitelj** koji upravlja podacima o pizzama i narudžbama
2. **Vue.js klijentska aplikacija** koja će komunicirati s Express poslužiteljem i pružiti korisničko sučelje za naručivanje pizza

Provjerite imate li ispravnu datotečnu strukturu web aplikacije:

```plaintext
app
├── pizza-express
│   ├── node_modules
│   ├── index.js
│   ├── package.json
│   ├── package-lock.json
│   ├── data
│   │   └── data.js
│   ├── routes
│   │   ├── pizze.js
│   │   └── narudzbe.js
│   └── .gitignore
└── pizza-vue
    ├── node_modules
    ├── public
    ├── .vscode (opcionalno)
    ├── src
    │   ├── assets
    │   │   └── tailwind.css
    │   ├── router
    │   │   └── index.js
    │   ├── App.vue
    │   └── main.js
    ├── vite.config.js
    ├── package.json
    ├── package-lock.json
    ├── .prettierrc.json (opcionalno)
    ├── index.html
    ├── jsconfig.json
    ├── README.md
    ├── .gitattributes (opcionalno)
    └── .gitignore
```

> Hint: Kada radite na većim projektima u VS Code-u, može postati nezgodno pratiti i raditi na većem broju datoteka i direktorija. Preporuka je instalirati neku ekstenziju koja grafički uređuje datotečnu strukturu (`Explorer tab`). Preporuka: [Material Icon Theme](https://marketplace.visualstudio.com/items?itemName=PKief.material-icon-theme).

> Hint 2: Dvije korisne kratice u VS Code-u kada radite na većim projektima su:

> - `CTRL/CMD + P` - Otvara brzi **pretraživač datoteka** unutar projekta (krenite unositi naziv datoteke bez obzira gdje se nalazi)
> - `CTRL/CMD + Shift + F` - Otvara **globalni pretraživač teksta** unutar svih datoteka projekta (krenite unositi tekst koji tražite bez obzira gdje se nalazi)

Prije nego nastavite, preporučuje se da spremite _commitate_ sve promjene u vaš Git repozitorij kako biste imali sigurnosnu kopiju trenutnog stanja projekta.

> Napomena: Kod izrade projekta iz kolegija, _frontend_ i _backend_ dijelove aplikacije morat ćete **verzionirati u zasebnim repozitorijima**. Da ne kompliciramo, za potrebe ove vježbe, ostavit ćemo sve u jednom repozitoriju.

## 2.2 Dodavanje osnovnih komponenti korisničkog sučelja

Želimo izraditi grafičko korisničko sučelje gdje korisnik može pregledavati dostupne pizze i naručiti ih.

Na Express poslužitelju već imamo implementirane potrebne _endpointove_ za dohvaćanje podataka o pizzama i slanje narudžbi.

Želimo korisniku prikazati grafičko sučelje gdje može vidjeti sve dostupne pizze i njihove detalje (naziv, sastojke, cijene) te omogućiti odabir veličine i količine za svaku pizzu koju želi naručiti.

U kontekstu poslužitelja, zamislite da moramo prvo implementirati GET `/pizze` endpoint koji vraća popis svih pizza u JSON formatu te lijepo prikazati te podatke u Vue.js aplikaciji.

### PizzaList.vue komponenta

Izradit ćemo Vue komponentu `PizzaList.vue` koja će dohvaćati i prikazivati popis dostupnih pizza s Express poslužitelja.

Kako frontend dizajn korisničkog sučelja nije predmet ovog predmeta, upotrijebit ćemo gotovi _tailwind-HTML_ predložak te raditi na funkcionalnostima Vue komponente. Ako hoćete, možete uređivati stilove prema vlastitim željama i/ili izraditi vlastiti dizajn.

Predložak možete pronaći u datoteci `WA3 - Razmjena podataka između klijenta i poslužitelja/vue-templates/pizza-list.html`.

Stvorite `components` direktorij unutar `src` direktorija Vue.js projekta i dodajte `PizzaList.vue` datoteku:

```bash
→ cd src
→ mkdir components
→ touch components/PizzaList.vue
```

Struktura `components` direktorija:

```plaintext
app
└── pizza-vue
    ├── src
    │   ├── assets
    │   │   └── tailwind.css
    │   ├── components
    │   │   └── PizzaList.vue
```

Vue3 komponenta sastoji se od barem dva dijela:

1. **Template (HTML) dio** - definira HTML strukturu komponente (unutar `<template>` taga) - gotovo uvijek koristimo
2. **Script (JS) dio** - definira logiku komponente (unutar `<script setup>` taga) - gotovo uvijek koristimo
3. **Style (CSS) dio** - definira stilove komponente (unutar `<style>` taga) - opcionalno koristimo (npr. ako koristimo TailwindCSS, rijetko želimo pisati prilagođene stilove)

**Sintaksa Vue3 komponente:**

```js
<template>
    <!-- HTML struktura komponente -->
</template>

<script setup>
    // Logika komponente (JS/TS)
</script>

<style>
    /* Stilovi komponente (CSS) */
</style>
```

Samo ćemo kopirati HTML predložak iz `pizza-list.html` datoteke u **template** dio `PizzaList.vue` komponente i ukloniti `body` tag budući da HTML kod Vue komponente mora biti unutar `<template>` taga.

Vidjet ćete mnogo `class` atributa u kojima su pohranjene TailwindCSS klase za stilizaciju elemenata.

Komponenta sadrži stil za prikaz jedne **kartice pizze**, a ponavlja se 3 puta.

Isječak kartice za pizzu iz `pizza-list.html`:

```html
<div class="bg-inherit rounded-xl overflow-hidden">
    <div class="w-full h-48 flex items-center justify-center bg-white">
        <!-- Slika s interneta -->
        <img src="https://www.freeiconspng.com/uploads/pizza-png-1.png" alt="Pizza Image 1" class="w-full h-full object-contain" />
    </div>

    <div class="p-6">
        <div class="flex items-center space-x-3 mb-4">
            <!-- Naziv -->
            <h2 class="text-lg font-bold text-orange-500 tracking-wide">Pizza 1</h2>
            <!-- Sastojci -->
            <div class="flex space-x-2">
                <div class="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-slate-50 font-semibold text-xs">Icon</div>
                <div class="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-slate-50 font-semibold text-xs">Icon</div>
                <div class="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-slate-50 font-semibold text-xs">Icon</div>
            </div>
        </div>
        <!-- Cijene za svaku veličinu -->
        <div class="space-y-2">
            <div class="flex justify-between text-gray-700">
                <span class="font-medium">Mala</span>
                <span>€00.00</span>
            </div>

            <div class="flex justify-between text-gray-700">
                <span class="font-medium">Srednja</span>
                <span>€00.00</span>
            </div>

            <div class="flex justify-between text-gray-700">
                <span class="font-medium">Jumbo</span>
                <span>€00.00</span>
            </div>
        </div>
    </div>
</div>
```

> Pokušajte uočiti dijelove HTML koda gdje su prikazani naziv pizze, slika, sastojci i cijene za različite veličine. Važno je razumjeti strukturu HTML-a čak i ako ne razumijete sve detalje dizajna (u ovom slučaju TailwindCSS klasa), budući da ćemo kasnije trebati dinamički mijenjati te dijelove koda koristeći Vue.js na temelju podataka dohvaćenih s poslužitelja.

`PizzaList.vue` komponenta sada izgleda ovako:

```html
// app/pizza-vue/src/components/PizzaList.vue

<template> kopirani HTML predložak iz pizza-list.html datoteke </template>

<script setup></script>

<style></style>
```

Otvorite `App.vue` datoteku i uvezite `PizzaList.vue` komponentu unutar `script setup` dijela, a nakon toga je unesite unutar `template` dijela.

Na ovaj način žemo iscrtati `PizzaList` komponentu unutar glavne aplikacije.

```html
// app/pizza-vue/src/App.vue

<template>
    <PizzaList />
</template>
```

<img src="https://github.com/lukablaskovic/FIPU-WA/blob/main/WA3%20-%20Razmjena%20podataka%20izme%C4%91u%20klijenta%20i%20poslu%C5%BEitelja/screenshots/vue_pizzalist_first_render.png?raw=true" style="width:80%; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); margin-top:10px;"></img>

> Slika 5: Prikaz Vue.js aplikacije s dodanim HTML predloškom u `PizzaList.vue` komponenti (prikaz u pregledniku)

> Hint: Možete otvoriti Vue.js developer tools u pregledniku kako biste lakše pratili strukturu Vue komponenti ili samo HTML elemente u DOM stablu. Pokušajte izmijeniti neke TailwindCSS klase unutar `PizzaList.vue` komponente i proučite kako se mijenja izgled stranice u web pregledniku.

Dodat ćemo još pozadinsku sliku i zaglavlje (_header_) naše aplikacije.

Pozadinsku sliku `background.png` možete pronaći u `WA3 - Razmjena podataka između klijenta i poslužitelja/vue-templates/` direktoriju.

Slike koje želimo koristiti u Vue.js aplikaciji (čitaj: koje želimo da Vue.js poslužitelj servira) moraju biti smještene unutar `public` direktorija Vue.js projekta.

Struktura `public` direktorija:

```
app
└── pizza-vue
    ├── public
    │   └── background.png
```

Pozadinsku sliku možemo postaviti na više načina, a ako želimo ostati vjerni TailwindCSS pristupu, možemo dodati samo nekoliko klasa na prvi `div` unutar `PizzaList.vue` komponente:

Pronađite prvi `div`:

```html
<div class="mx-auto bg-linear-to-br min-h-screen p-8"></div>
```

Dodajemo sljedeće TailwindCSS klase na kraj:

```html
<div class="mx-auto bg-linear-to-br min-h-screen p-8 bg-[url('/background.png')] bg-cover bg-center bg-no-repeat"></div>
```

Vue.js može pročitati slike iz `public` direktorija koristeći relativnu putanju počevši od korijena web aplikacije (što je u ovom slučaju `/`). Iz tog razloga ne moramo navoditi cijelu putanju do slike, već samo `/background.png`.

### Header.vue komponenta

Na jednak način ćemo izraditi `Header.vue` komponentu koja će prikazivati zaglavlje naše aplikacije.

Stvorite `Header.vue` datoteku unutar `components` direktorija:

```bash
→ cd src/components
→ touch Header.vue
```

Struktura `components` direktorija sada izgleda ovako:

```plaintext
app
└── pizza-vue
    ├── src
    │   ├── assets
    │   │   └── tailwind.css
    │   ├── components
    │   │   ├── Header.vue
    │   │   └── PizzaList.vue
```

Kopirajte HTML predložak iz `header.html` datoteke (nalazi se u `WA3 - Razmjena podataka između klijenta i poslužitelja/vue-templates/` direktoriju) unutar **template** dijela `Header.vue` komponente.

Uvezite komponentu unutar `App.vue` datoteke i koristite je iznad `PizzaList` komponente kako bi se zaglavlje prikazalo na vrhu stranice.

```html
// app/pizza-vue/src/App.vue

<template>
    <header />
    <PizzaList />
</template>
<script setup>
    import Header from './components/Header.vue';
    import PizzaList from './components/PizzaList.vue';
</script>
```

To je to! Vaša web aplikacija sada bi trebala imati pozadinsku sliku iza sadržaja i zaglavlje na vrhu stranice.

<img src="https://github.com/lukablaskovic/FIPU-WA/blob/main/WA3%20-%20Razmjena%20podataka%20izme%C4%91u%20klijenta%20i%20poslu%C5%BEitelja/screenshots/vue-pizzalist-w-bg-header.png?raw=true" style="width:80%; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); margin-top:10px;"></img>

## Implementacija odabira pizze

**Reaktivnost** (_eng. reactivity_) predstavlja jedan od temeljnih koncepata u Vue.js ekosustavu. Ona omogućuje da se korisničko sučelje automatski osvježi svaki put kada dođe do promjene podataka u pozadini, čineći time reaktivnost ključnim mehanizmom na kojem počiva cijeli Vue.js okvir.

Ukratko, koristimo dvije ključne riječi za definiranje reaktivnih podataka u Vue3 komponentama: `ref` i `reactive`.

Ove funkcije svojevrsni su omotači (_wrapperi_) koji omogućuju Vue.js da prati promjene vrijednosti varijabli i objekata te automatski ažurira DOM kada se ti podaci promijene.

**Sintaksa:**

```javascript
const dinamicka_varijabla = ref(pocetna_vrijednost); // najčešće za primitivne tipove podataka

const dinamicki_objekt = reactive({
    // svojstvo1: vrijednost1,
    // svojstvo2: vrijednost2
}); // za složene tipove podataka (objekte)
```

_Primjer `ref`:_

- trenutnoj vrijednosti `ref` objekta pristupamo preko `.value` svojstva

```javascript
import { ref, reactive } from 'vue';

let count = ref(0); // primitivni tipovi podataka (brojevi, stringovi, booleani)

console.log(count); // Ispisuje ref objekt
console.log(count.value); // Ispisuje trenutnu vrijednost (0)

//count++ // NE ! neispravno povećanje vrijednosti za 1
console.log(count.value); // undefined

count.value++; // DA: ispravno povećanje vrijednosti za 1
console.log(count.value); // 1
```

_Primjer `reactive`:_

- u usporedbi s `ref`, `reactive` će učiniti cijeli objekt dubinski reaktivnim, što znači da možemo mijenjati njegova svojstva izravno bez potrebe za `.value` pristupom.

```javascript
const user = reactive({
    // složeni tipovi podataka (objekti)
    name: 'Marko',
    prezime: 'Marković',
    dob: 30
});

// uočite da ne koristimo .value
console.log(user.name); // Ispisuje 'Marko'
user.dob++; // Ispravno mijenja dob na 31
console.log(user.dob); // Ispisuje 31
```

> Više o reaktivnosti u Vue.js možete pročitati u službenoj dokumentaciji: [Reactivity Fundamentals](https://vuejs.org/guide/essentials/reactivity-fundamentals.html).

---

Otvorite `PizzaList.vue` komponentu i unutar `<script setup>` dijela uvezite `ref` funkciju iz `vue` paketa:

- Definirat ćemo reaktivnu varijablu `odabrana_pizza` i postavit joj vrijednost na `null`.

- Definirat ćemo i jednostavnu funkciju `odaberiPizzu(pizza_naziv)` koja će promijeniti vrijdnosti `odabrana_pizza` varijable na proslijeđeni `pizza_naziv` string.

_Primjer:_

```javascript
// app/pizza-vue/src/components/PizzaList.vue
import { ref } from 'vue';
const odabrana_pizza = ref(null); // reaktivna varijabla za pohranu naziva odabrane pizze

function odaberiPizzu(pizza_naziv) {
    odabrana_pizza.value = pizza_naziv; // postavljanje naziva odabrane pizze
    console.log('Odabrana pizza:', odabrana_pizza.value); // ispis u konzolu
}
```

Unutar `template` dijela `PizzaList` komponente, pronađite pizze i izmijenite im nazive na proizvoljne vrijednosti.

Funkcije možemo pozivati iz HTML dijela komponente koristeći `@click` direktivu na gumbu za svaku pizzu. Ovismo gdje stavimo direktivu, ona će "obuhvatiti" taj HTML element i pozvati funkciju prilikom klika na taj element.

**Sintaksa** `@click` direktive:

```html
<!-- pozivanje funkcije bez argumenata -->
<button @click="naziv_funkcije()">Klikni me</button>
<!-- pozivanje funkcije s argumentima -->
<button @click="naziv_funkcije(arg1, arg2)">Klikni me</button>

<!-- primjer sa string argumentom -->
<button @click="odaberiPizzu('Margherita')">Odaberi Margherita pizzu</button>
```

Ako koristite stringove kao argumente, pripazite da koristite jednostruke navodnike (`''`) za string argumente unutar dvostrukih navodnika (`""`) `@click` direktive, kako biste izbjegli greške u parsiranju HTML-a.

_Primjer: Izmijenjeni naziv pizze i dodani `@click` event:_

```html
<div @click="odaberiPizzu('Margherita')">
    <div class="bg-inherit rounded-xl overflow-hidden">
        <div class="w-full h-48 flex items-center justify-center bg-inherit">
            <img src="https://www.freeiconspng.com/uploads/pizza-png-1.png" alt="Pizza Image" class="w-full h-full object-contain" />
        </div>
    </div>
    ... ostatak HTML-a pizze
</div>
```

<img src="https://github.com/lukablaskovic/FIPU-WA/blob/main/WA3%20-%20Razmjena%20podataka%20izme%C4%91u%20klijenta%20i%20poslu%C5%BEitelja/screenshots/vue-pizza-click.png?raw=true" style="width:80%; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); margin-top:10px;"></img>

> Slika 6: Dodan `@click` event na HTML element pizze u `PizzaList.vue` komponenti (prikaz u pregledniku)

Kako bismo naznačili korisniku da je kliknuo na određenu pizzu, možemo promijeniti stil kartice odabrane pizze koristeći uvjetno dodavanje TailwindCSS klasa.

Uvjetnu izmjenu klase u Vue.js komponenti možemo napraviti koristeći `:class` direktivu.

**Sintaksa:**

```html
<div :class="{'niz-klasa-ako-je-uvjet-true': uvjet, 'drugi-niz-klasa-ako-je-drugi_uvjet-true': drugi_uvjet}">
    <!-- sadržaj -->
</div>

<!--ili-->

<div :class="['zadani-niz-klasa', uvjet ? 'dodatni-niz-klasa-ako-je-uvjet-true' : 'alternativni-niz-ako-je-uvjet-false']">
    <!-- sadržaj -->
</div>
```

_Primjeri:_

```html
<!-- Prva sintaksa -->
<div
    :class="{ 'bg-blue-500': isActive,
              'bg-gray-500': !isActive }"
></div>

<!-- Druga sintaksa -->
<div
    :class="[
          'p-4 rounded',
          isActive ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black',
        ]"
></div>
```

Uvjetni izraz u našem slučaju može biti samo: `odabrana_pizza == 'neki_naziv_pizze'`

- ako je `null` ili `""`, nijedna pizza nije odabrana i nema dodatnih TailwindCSS klasa
- ako je jednaka nekom nazivu pizze, dobivamo `dodatni-niz-klasa-ako-je-uvjet-true`

```html
ring-4 ring-orange-300 shadow-lg shadow-orange-300/50 scale-[1.02]
```

Promijenit ćemo i zadanu klasu kako bismo dobili **tranzicijski efekt prilikom odabira pizze**:

```html
<div
    :class="[
          'bg-inherit rounded-xl overflow-hidden cursor-pointer transition-all duration-300',
          odabrana_pizza === 'Slavonska'
            ? 'ring-4 ring-orange-300 shadow-lg shadow-orange-300/50 scale-[1.02]'
            : 'hover:scale-[1.01]',
        ]"
    ...
></div>
```

- Zadana klasa je prva `bg-inherit rounded-xl overflow-hidden cursor-pointer transition-all duration-300`
- Ako je pizza odabrana, dodaju se prve četiri klase iza ternarnog operatora (`?`)
- Ako pizza nije odabrana, dodaje se samo `hover:scale-[1.01]`

Možemo prebaciti `@click` event na cijeli ovaj `div` budući da želimo da se pizza odabere kada korisnik klikne bilo gdje unutar kartice pizze.

<img src="https://github.com/lukablaskovic/FIPU-WA/blob/main/WA3%20-%20Razmjena%20podataka%20izme%C4%91u%20klijenta%20i%20poslu%C5%BEitelja/screenshots/vue-pizza-click-highlight.png?raw=true" style="width:80%; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); margin-top:10px;"></img>

Za sada toliko od dizajna. Idemo napokon implementirati komunikaciju s Express poslužiteljem kako bismo dohvatili stvarne podatke o pizzama i prikazali ih dinamički unutar `PizzaList.vue` komponente.

# 3. Axios i komunikacija s Express poslužiteljem

Za komunikaciju s Express poslužiteljem imamo na raspolaganju više opcija. Moguće je koristiti i `fetch` API koji smo upoznali na _Skriptnim jezicima_ i _Programskom inženjerstvu_, međutim kroz neke vanjske biblioteke možemo definirati konciznu i čitljivu sintaksu za slanje HTTP zahtjeva te rukovanje odgovorima.

Jedna od takvih biblioteka je i [Axios](https://axios-http.com/docs/intro) koji ćemo koristiti na ovom kolegiju.

Axios je HTTP klijent za Node i web preglednik koji se bazira na sintaksi `Promise` objekata.

Instalirajte Axios unutar Vue.js projekta:

```bash
→ cd /app/pizza-vue
→ npm install axios
```

Prijetimo se ukratko sintakse `Promise` objekata kako bismo lakše razumjeli kako Axios funkcionira.

```js
// Izrada novog Promise objekta
const myPromise = new Promise((resolve, reject) => {
    // asinhroni kod koji će na kraju pozvati resolve() ili reject() ovisno o ishodu
    let success = true; // primjer uvjeta
    if (success) {
        resolve('Uspjeh!'); // poziva se ako je operacija uspješna
    } else {
        reject('Greška!'); // poziva se ako je došlo do greške
    }
});
```

Promise objekt predstavlja buduću vrijednost koja može biti ispunjena (`resolved`), odbijena (`rejected`) ili još uvijek na čekanju (`pending`).

> Drugim riječima, Promise nam omogućuje da radimo s asinkronim operacijama na način koji je sličniji sinkronom kodu, čineći ga lakšim za čitanje i održavanje. `pending` stanje znači da mrežna operacija (HTTP zahtjev) prema našem Express poslužitelju još nije izvršena, odnosno da poslužitelj još uvijek nije obradio zahtjev i vratio HTTP odgovor. `resolved` predstavlja uspješno izvršenu mrežnu operaciju (neovisno kakav je odgovor poslužitelj vratio), dok `rejected` označava da je došlo do greške tijekom mrežne operacije (npr. poslužitelj nije dostupan, došlo je do timeouta, itd.).

Promise objekte obrađujemo metodama `.then()` i `.catch()`:

```js
myPromise
    .then(result => {
        console.log(result); // ispisuje 'Uspjeh!' ako je resolve()
    })
    .catch(error => {
        console.error(error); // ispisuje 'Greška!' ako je reject()
    });
```

Također, možemo koristiti i `async/await` sintaksu za rad s Promise objektima:

- tada moramo koristiti `try/catch/finally` blok za "hvatanje" grešaka

```js
async function runAsyncTask() {
    try {
        const result = await myPromise; // čeka da se Promise riješi
        console.log(result); // ispisuje 'Uspjeh!' ako je resolve()
    } catch (error) {
        console.error(error); // ispisuje 'Greška!' ako je reject()
    }
}

runAsyncTask(); // pozivanje asinkrone funkcije runAsyncTask
```

`axios` objekt je Promise koji ima metode za slanje različitih HTTP zahtjeva: `axios.get()`, `axios.post()`, `axios.put()`, `axios.delete()`, itd.

Tijelo `axios` Promise objekta postaje asinkroni HTTP zahtjev koji šaljemo na određeni URL (odgovarajući endpoint na `express-server` poslužitelju), a odgovor na taj zahtjev obrađujemo u `.then()` metodi ili koristeći `await` unutar asinkrone funkcije.

Dakle, kako bismo poslali HTTP GET zahtjev na `http://localhost:3000/pizze` endpoint i dohvatili popis svih pizza, možemo koristiti sljedeći kod:

```js
// app/pizza-vue/src/components/PizzaList.vue

import axios from 'axios';

axios
    .get('http://localhost:3000/pizze') // slanje GET zahtjeva na /pizze endpoint
    // obrada uspješnog odgovora
    .then(response => {
        console.log(response.data); // ispisuje podatke o pizzama iz odgovora
    })
    // obrada greške
    .catch(error => {
        console.error('Greška pri dohvaćanju podataka o pizzama:', error);
    });
```

Ubacite ovaj kod u `PizzaList.vue` komponentu i pokušajte osvježite stranicu u pregledniku - na taj način ćete poslati GET zahtjev na Express poslužitelj za dohvaćanje podataka o svim pizzama.

## 3.1 CORS politika

Nažalost, ako pokušate pokrenuti ovaj kod odmah, vjerojatno ćete dobiti grešku vezanu uz CORS (_Cross-Origin Resource Sharing_) politiku u pregledniku.

<img src="https://github.com/lukablaskovic/FIPU-WA/blob/main/WA3%20-%20Razmjena%20podataka%20izme%C4%91u%20klijenta%20i%20poslu%C5%BEitelja/screenshots/cors_error_console.png?raw=true" style="width:80%; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); margin-top:10px;"></img>

> Slika 7: CORS greška u konzoli preglednika prilikom pokušaja slanja HTTP zahtjeva s Vue.js aplikacije na Express poslužitelj

Možemo se dodatno uvjeriti da je došlo do greške tako da otvorimo _Network_ tab u developer tools preglednika i pogledamo detalje neuspjelog zahtjeva.

**Network tab** pokazuje sve mrežne zahtjeve koje je web stranica napravila, uključujući HTTP zahtjeve **prema našem Express poslužitelju**, ali i **Vite razvojnom poslužitelju**.

Osvježite ponovo stranicu i pronađite neuspjeli zahtjev obojen u crveno.

<img src="https://github.com/lukablaskovic/FIPU-WA/blob/main/WA3%20-%20Razmjena%20podataka%20izme%C4%91u%20klijenta%20i%20poslu%C5%BEitelja/screenshots/cors_error_network.png?raw=true" style="width:80%; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); margin-top:10px;"></img>

Ako otvorite detalje mrežnog zahtjeva, vidjet ćete detalje o HTTP zahtjevu i poslana zaglavlja (_request headers_). Međutim, nećete vidjeti podatke o HTTP odgovoru jer je preglednik blokirao pristup tim podacima zbog CORS politike. Ipak, statusni kod odgovora je `200 OK`, što znači da je poslužitelj ispravno obradio zahtjev.

[CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS) je sigurnosna značajka web preglednika koja kontrolira kako web stranice/aplikacije mogu komunicirati/zatražiti određene resurse preko poslužitelja koji se nalazi na drugoj domeni (ili samo portu u našem slučaju).

<img src="https://github.com/lukablaskovic/FIPU-WA/blob/main/WA3%20-%20Razmjena%20podataka%20izme%C4%91u%20klijenta%20i%20poslu%C5%BEitelja/screenshots/cors-illustration.png?raw=true" style="width:40%; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); margin-top:10px;"></img>

Drugim riječima, CORS politika definira smije li razvojni poslužitelj na domeni `http://localhost:5173` (Vite poslužitelj) komunicirati s Express poslužiteljem na domeni `http://localhost:3000`.

Ako smije, tada će web preglednik dopustiti da se HTTP zahtjev izvrši i da se podaci iz odgovora proslijede Vue.js aplikaciji koju izvršava razvojni poslužitelj. U suprotnom, preglednik će blokirati pristup podacima iz odgovora i prikazati CORS grešku u konzoli.

Ovo je sigurnosni mehanizam kojim možemo spriječiti zlonamjerne web aplikacije da pristupaju resursima na drugim poslužiteljima bez dopuštenja.

Konkretno, mi **moramo CORS politiku definirati na Express poslužitelju** kako bismo dopustili zahtjeve samo s naše Vue.js aplikacije.

Vratimo se na `pizza-express` projekt i instalirajmo `cors` paket:

```bash
→ cd app/pizza-express
→ npm install cors
```

`cors` npm paket nam omogućuje jednostavnu konfiguraciju CORS politike na Express poslužitelju. Uključit ćemo ga u glavnoj `index.js` datoteci poslužitelja.

```javascript
// app/pizza-express/index.js

import express from 'express';
import cors from 'cors'; // uvoz cors paketa
const app = express();
```

Dodajemo još jedan globalni _middleware_ poziv, ovaj put za `cors`:

```javascript
app.use(cors());
```

Na ovaj način smo dozvolili **svim domenama** da šalju zahtjeve našem Express poslužitelju. **Ovo nije dobro produkcijsko rješenje**, ali je u redu za razvojne svrhe.

Vratite se na Vue.js aplikaciju i osvježite stranicu u pregledniku. Sada bi HTTP zahtjev trebao uspješno proći bez CORS greške, a podaci o pizzama trebali bi se ispisati u **konzoli preglednika**.

<img src="https://github.com/lukablaskovic/FIPU-WA/blob/main/WA3%20-%20Razmjena%20podataka%20izme%C4%91u%20klijenta%20i%20poslu%C5%BEitelja/screenshots/vue-get-pizze-after-cors.png?raw=true" style="width:80%; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); margin-top:10px;"></img>

> Slika 8: Uspješan HTTP GET zahtjev s Vue.js aplikacije na Express poslužitelj nakon konfiguracije CORS politike (prikaz u konzoli preglednika)

Možete otvoriti i **Network tab** u developer tools preglednika i pogledati detalje uspješnog zahtjeva.

<img src="https://github.com/lukablaskovic/FIPU-WA/blob/main/WA3%20-%20Razmjena%20podataka%20izme%C4%91u%20klijenta%20i%20poslu%C5%BEitelja/screenshots/vue-network-tab-get-pizze-after-cors.png?raw=true" style="width:80%; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); margin-top:10px;"></img>

> Slika 9: Detalji uspješnog HTTP GET zahtjeva s Vue.js aplikacije na Express poslužitelj nakon konfiguracije CORS politike (prikaz u Network tabu developer tools preglednika)

Ipak, na Express poslužitelju **poželjno je dodatno ograničiti CORS politiku** samo na domenu naše Vue.js aplikacije.

Možemo definirati CORS opcije prilikom poziva `cors()` funkcije:

```javascript
const corsOptions = {
    origin: 'http://localhost:5173'
};
```

Možemo dodati i više domena ako postoji potreba:

```javascript
const corsOptions = {
    origin: ['http://localhost:5173', 'http://example.com', 'http://mydomain.com']
};
```

- ovo može biti praktično ako imamo više frontend aplikacija koje trebaju pristupiti našem Express poslužitelju (npr. mobilna aplikacija i web aplikacija)
- u produkcijskom okruženju, **svakako navedite samo domene koje su vam potrebne**

Zamijenite `app.use(cors());` s:

```javascript
app.use(cors(corsOptions));
```

## 3.2 Dinamičko iscrtavanje podataka o pizzama

Sada kada smo uspostavili HTTP komunikaciju između Vue.js aplikacije i Express poslužitelja, možemo dinamički iscrtavati podatke o pizzama unutar `PizzaList.vue` komponente.

Ovo možemo postići tako da pohranimo dohvaćene podatke o pizzama u **reaktivnu varijablu** i zatim koristimo Vue-ovu `v-for` direktivu za iteraciju kroz taj popis i iscrtavanje svake pizze.

Kako se HTTP zahtjev izvršava asinkrono, trebamo ga smjestiti unutar `onMounted` _lifecycle hooka_ kako bismo bili sigurni da se zahtjev šalje tek nakon što je komponenta "montirana" u DOM.

**Sintaksa:**

```javascript
// app/pizza-vue/src/components/PizzaList.vue

import { onMounted } from 'vue';

onMounted(() => {
    // kod koji se izvršava nakon što je Vue komponenta montirana
});
```

_Primjer:_

```javascript
import { ref, onMounted } from 'vue';

const pizze = ref([]); // reaktivna varijabla za pohranu podataka o pizzama

onMounted(() => {
    axios
        .get('http://localhost:3000/pizze')
        .then(response => {
            pizze.value = response.data; // pohrana podataka o pizzama u reaktivnu varijablu
        })
        .catch(error => {
            console.error('Greška pri dohvaćanju podataka o pizzama:', error);
        });
});
console.log(pizze.value); // ispisuje podatke o pizzama (?)
```

Kod iznad neće raditi budući da je sinkroni: `console.log(pizze.value);` će se izvršiti **prije nego što se HTTP zahtjev završi** i podaci budu pohranjeni u `pizze` varijablu. Iz tog razloga će se ispisati prazan niz `[]`.

Ako ga prebacimo ispod `pizze.value = response.data;` unutar `.then()` metode, tada će se ispisati stvarni podaci o pizzama nakon što su dohvaćeni s poslužitelja.

```javascript
.then(response => {
    pizze.value = response.data; // pohrana podataka o pizzama u reaktivnu varijablu
    console.log(pizze.value); // ispisuje podatke o pizzama nakon dohvaćanja HTTP odgovora
})
```

Ipak, kako bismo mogli ovaj kod "spakirati u funkciju", možemo koristiti `async/await` sintaksu unutar `onMounted` hooka:

```javascript
onMounted(async () => {
    try {
        const response = await axios.get('http://localhost:3000/pizze');
        pizze.value = response.data; // pohrana podataka o pizzama u reaktivnu varijablu
        console.log(pizze.value); // ispisuje podatke o pizzama nakon dohvaćanja HTTP odgovora
    } catch (error) {
        console.error('Greška pri dohvaćanju podataka o pizzama:', error);
    }
});
```

Te spakirati logiku dohvaćanja podataka o pizzama u zasebnu asinkronu funkciju:

```javascript
async function fetchPizze() {
    try {
        const response = await axios.get('http://localhost:3000/pizze'); // dodajemo await kako bi sačekali odgovor asiknrone funkcije
        pizze.value = response.data; // pohrana podataka o pizzama u reaktivnu varijablu
        console.log(pizze.value); // ispisuje podatke o pizzama nakon dohvaćanja HTTP odgovora
    } catch (error) {
        console.error('Greška pri dohvaćanju podataka o pizzama:', error);
    }
}
// u ovom slučaju onMounted ne treba biti async zato što ne koristimo await direktno unutar njega
onMounted(() => {
    fetchPizze(); // pozivanje funkcije za dohvaćanje podataka o pizzama
});
```

Osvježite web aplikaciju i provjerite u konzoli preglednika da li se podaci o pizzama ispravno dohvaćaju s poslužitelja i pohranjuju u reaktivnu varijablu.

## 3.2.1 `v-for` direktiva

Direktiva `v-for` nam omogućuje da iteriramo kroz nizove ili objekte i iscrtavamo HTML elemente za svaki element u nizu ili svojstvo u objektu.

Prvi korak je identificirati HTML element koji želimo ponoviti za svaki element u nizu - odnosno želimo identificirati HTML elemente koji se **ponavljaju za svaku pizzu**.

U našem slučaju, to je `div` kojem smo dodali `@click` event:

```html
<div
    @click="odaberiPizzu('Margherita')"
    :class="[
          'bg-inherit rounded-xl overflow-hidden cursor-pointer transition-all duration-300',
          odabrana_pizza === 'Capricciosa'
            ? 'ring-4 ring-orange-300 shadow-lg shadow-orange-300/50 scale-[1.02]'
            : 'hover:scale-[1.01]',
        ]"
>
    ...
</div>
```

Uočite dinamičke elemente unutar ovog `div`-a koje želimo zamijeniti s podacima iz reaktivne varijable `pizze`:

- **parametar** unutar `odaberiPizzu('pizza')` funkcije u `@click` eventu
- **uvjet** unutar `:class` direktive za isticanje odabrane pizze
- **naziv pizze**: `<h2 class="...">Pizza 1</h2>`
- **ponavljajuće ikone sastojaka** unutar `<div class="p-6">...</div>`
- **cijene za svaku veličinu pizze** unutar `<div class="space-y-2">...</div>`

Prvi korak je definirati `v-for` direktivu na glavnom `div`-u koji se ponavlja za svaku pizzu:

- implementacija je konceptualno ekvivalentna petlji `for ... of`, ali ovdje pišemo `for ... in` zbog sintakse Vue.js direktive

**Sintaksa:**

```html
<div v-for="item in items" :key="item.id">
    <!-- sadržaj koji se ponavlja za svaki item -->
</div>
```

U našem slučaju, `item` predstavlja pojedinačnu pizzu iz niza `pizze`, pa možemo koristiti naziv `pizza` umjesto `item` radi bolje čitljivosti.

```html
<!-- app/pizza-vue/src/components/PizzaList.vue -->

<div
    v-for="pizza in pizze"
    :key="pizza.id"
    @click="odaberiPizzu(pizza.naziv)"
    :class="[
          'bg-inherit rounded-xl overflow-hidden cursor-pointer transition-all duration-300',
          odabrana_pizza === pizza.naziv
            ? 'ring-4 ring-orange-300 shadow-lg shadow-orange-300/50 scale-[1.02]'
            : 'hover:scale-[1.01]',
        ]"
    ...
></div>
```

Sada **obrišite preostale pizze** iz HTML predloška budući da će se one sada generirati dinamički pomoću `v-for` direktive na temelju podataka iz reaktivne varijable `pizze` napunjene podacima s poslužitelja.

Ako ste dobro implementirali `v-for` direktivu, sada biste trebali vidjeti ukupno pet pizza iscrtano u pregledniku, ali s pogrešnim podacima.

<img src="https://github.com/lukablaskovic/FIPU-WA/blob/main/WA3%20-%20Razmjena%20podataka%20izme%C4%91u%20klijenta%20i%20poslu%C5%BEitelja/screenshots/v-for-pizze.png?raw=true" style="width:80%; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); margin-top:10px;"></img>

> Slika 10: Dodana `v-for` direktiva za dinamičko iscrtavanje pizza unutar `PizzaList.vue` komponente (prikaz u pregledniku)

Kako bismo izmijenili outer-HTML elemente iterabilnim podacima iz `pizza` objekta, koristit ćemo **interpolaciju** (`{{ }}`).

Na primjer, za prikaz naziva pizze, zamijenit ćemo statički tekst `Margherita` s `{{ pizza.naziv }}`:

```html
<h2 class="text-lg font-bold text-orange-500 tracking-wide">{{pizza.naziv}}</h2>
```

Isto možemo napraviti za cijene budući da je svojstvo `pizza.cijene` objekt s ključevima: `mala`, `srednja`, i `jumbo`. Prema tome:

```html
<div class="space-y-2">
    <div class="flex justify-between text-gray-700">
        <span class="font-medium">Mala</span>
        <span>€{{ pizza.cijene.mala }}</span>
    </div>

    <div class="flex justify-between text-gray-700">
        <span class="font-medium">Srednja</span>
        <span>€{{pizza.cijene.srednja}}</span>
    </div>

    <div class="flex justify-between text-gray-700">
        <span class="font-medium">Jumbo</span>
        <span>€{{pizza.cijene.jumbo}}</span>
    </div>
</div>
```

Želimo prikazati različite ikone ovisno o sastojcima svake pizze. Budući da kod sastojaka nema poretka (pohranjeni su u listi), idemo za početak samo izlistati naziv sastojaka unutar `<div class="p-6">...</div>`:

Kako je svojstvo `pizza.sastojci` niz (`Array`) stringova, moramo koristiti još jednu `v-for` direktivu za iteraciju kroz svaki sastojak.

Ovaj put ju dodajemo na ponavljajući `<div> class="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-slate-50 font-semibold text-xs`:

```html
<div class="flex space-x-2">
    <div v-for="for sastojak in pizze.sastojci" :key="sastojak" class="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-slate-50 font-semibold text-xs">Icon</div>
</div>
```

<img src="https://github.com/lukablaskovic/FIPU-WA/blob/main/WA3%20-%20Razmjena%20podataka%20izme%C4%91u%20klijenta%20i%20poslu%C5%BEitelja/screenshots/vue-v-for-total.png?raw=true" style="width:80%; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); margin-top:10px;"></img>

> Slika 11: Završena implementacija `v-for` direktive za dinamičko iscrtavanje podataka o pizzama unutar `PizzaList.vue` komponente (prikaz u pregledniku)

Svi podaci se uspješno iscrtavaju dinamički unutar `PizzaList.vue` komponente na temelju podataka dohvaćenih s Express poslužitelja 🚀.

Ipak, ne sviđa nam se kako se prikazuju sastojci - želimo vidjeti odgovarajuće ikone umjesto riječi "Icon".

## 3.2.2 Prikaz ikona sastojaka

Da bismo prikazali odgovarajuće ikone sastojaka, možemo definirati mapu (objekt) koja povezuje naziv sastojka s URL-om ikone ili lokalnom putanjom do slike.

Za ikone postoji mnoštvo besplatnih izvora na internetu, a mi ćemo koristiti [Oh, Vue, Icons!](https://oh-vue-icons.js.org/)

Ovaj projekt nudi veliki izbor SVG ikona koje možemo koristiti besplatno unutar Vue.js aplikacija.

Instalirajte `oh-vue-icons` paket unutar Vue.js projekta:

```bash
→ cd /app/pizza-vue
→ npm install oh-vue-icons
```

Kako ova biblioteka nudi veliki broj ikona, dobra je praksa uvesti samo one koje ćemo koristiti kako bismo smanjili veličinu konačnog JavaScript paketa i poboljšali performanse web aplikacije.

Otvorite stranicu [Oh, Vue, Icons!](https://oh-vue-icons.js.org/) i potražite ikone koje odgovaraju sastojcima koje koristimo na pizzama.

Svakoj ikoni pridružen je jedinstveni identifikator koji ćemo koristiti za uvoz ikona, npr. za rajčicu može biti ikona `GiTomato`.

<img src="https://github.com/lukablaskovic/FIPU-WA/blob/main/WA3%20-%20Razmjena%20podataka%20izme%C4%91u%20klijenta%20i%20poslu%C5%BEitelja/screenshots/oh-vue-icons-web.png?raw=true" style="width:60%; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); margin-top:10px;"></img>

> Slika 12: Oh, Vue, Icons! web stranica za pregled i odabir ikona

Unutar `PizzaList.vue` komponente, uvezite potrebne ikone iz `oh-vue-icons` paketa:

```javascript
import { GiTomato, GiCheeseWedge, GiSlicedMushroom, IoLeafSharp, CoHotjar, GiMilkCarton, GiBellPepper, LaPepperHotSolid, GiCannedFish, GiGarlic, FaBacon, GiHamShank } from 'oh-vue-icons/icons';
```

Zatim definiramo jednostavnu mapu (objekt) koja povezuje naziv sastojka s odgovarajućom ikonom:

```javascript
const ikoneSastojaka = {
    rajčica: GiTomato,
    sir: GiCheeseWedge,
    gljive: GiSlicedMushroom,
    bosiljak: IoLeafSharp,
    paprika: GiBellPepper,
    šunka: GiHamShank,
    'feferoni ljuti': LaPepperHotSolid,
    tunjevina: GiCannedFish,
    'crveni luk': GiGarlic, // nema ikone za luk :(
    panceta: FaBacon,
    kulen: CoHotjar,
    vrhnje: GiMilkCarton // nema ni ikone za vrhnje pa ćemo staviti mlijeko
};
```

Ikone iz biblioteke `oh-vue-icons` su Vue komponente, a iscrtavamo ih koristeći `v-icon name="ikona"` sintaksu.

```html
<v-icon :name="kebab-case-ikona" class="w-5 h-5" />
```

Problem je što imena ikona u `oh-vue-icons` biblioteci koriste `PascalCase` format (npr. `GiTomato`), dok `v-icon` komponenta očekuje `kebab-case` format (npr. `gi-tomato`).

Da bismo riješili ovaj problem, možemo definirati pomoćnu funkciju koja će pretvoriti `PascalCase` u `kebab-case` format **ili izmijeniti mapu** `ikoneSastojaka` da koristi `kebab-case` stringove umjesto uvoženih komponenti.

> Napomena: `kebab-case` format koristi crtice za razdvajanje riječi, dok `PascalCase` format koristi velika slova za početak svake riječi bez razmaka ili crtica.
> Ovo nam je jednostavno ograničenje `oh-vue-icons` biblioteke.

```javascript
const ikoneSastojaka = {
    rajčica: 'gi-tomato',
    sir: 'gi-cheese-wedge',
    gljive: 'gi-sliced-mushroom',
    bosiljak: 'io-leaf-sharp',
    paprika: 'gi-bell-pepper',
    šunka: 'gi-ham-shank',
    'feferoni ljuti': 'la-pepper-hot-solid',
    tunjevina: 'gi-canned-fish',
    'crveni luk': 'gi-garlic',
    panceta: 'fa-bacon',
    kulen: 'co-hotjar',
    vrhnje: 'gi-milk-carton'
};
```

Još malo moramo izmijeniti **sintaksu učitavanja ikona**, koristit ćemo funkciju `addIcons` iz `oh-vue-icons` paketa kako bismo registrirali ikone koje ćemo koristiti:

```javascript
// app/pizza-vue/src/components/PizzaList.vue

import { addIcons } from 'oh-vue-icons';

import { GiTomato, GiCheeseWedge, GiSlicedMushroom, IoLeafSharp, CoHotjar, GiMilkCarton, GiBellPepper, LaPepperHotSolid, GiCannedFish, GiGarlic, FaBacon, GiHamShank } from 'oh-vue-icons/icons';

addIcons(GiTomato, GiCheeseWedge, GiSlicedMushroom, IoLeafSharp, GiBellPepper, GiHamShank, LaPepperHotSolid, GiCannedFish, GiGarlic, FaBacon, CoHotjar, GiMilkCarton);
```

> Napomena: Moramo registrirati samo one ikone koje ćemo koristiti. Više o tome u dokumentaciji [Oh, Vue, Icons!](https://oh-vue-icons.js.org/docs). Ovo je vrlo važno za optimizaciju web stranice - **ne želimo učitavati na tisuće ikona** ako ćemo koristiti samo nekoliko njih.

Za kraj, moramo registrirati `OhVueIcons` plugin unutar glavne `main.js` datoteke Vue.js projekta:

```javascript
// app/pizza-vue/src/main.js

import OhVueIcons from 'oh-vue-icons';

app.component('v-icon', OhVueIcon); // mapiraj OhVueIcon komponentu na "v-icon"
```

Sada možemo iscrtati ikone sastojaka unutar `v-for` direktive u `PizzaList.vue` komponenti:

```html
<!-- app/pizza-vue/src/components/PizzaList.vue -->

  <div
    v-for="sastojak in pizza.sastojci"
    :key="sastojak"
    class="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-slate-50 font-semibold text-xs"
  >
    <v-icon :name="ikoneSastojaka[sastojak]" />
  </div>
</div>
```

To je to! Ispravno smo prikazali sve podatke s poslužitelja, uključujući i ikone sastojaka za svaku pizzu.

<img src="https://github.com/lukablaskovic/FIPU-WA/blob/main/WA3%20-%20Razmjena%20podataka%20izme%C4%91u%20klijenta%20i%20poslu%C5%BEitelja/screenshots/vue-pizzalist-w-icons.png?raw=true" style="width:80%; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); margin-top:10px;"></img>

## 3.2.3 Dodavanje javnih slika na poslužitelj

Kako nam ne bi svaka slika imala istu ikonu, možemo dodati prave slike pizza u podatke na Express poslužitelju te ih potom prikazati unutar Vue.js aplikacije.

Za sada nećemo učitavati slike, već koristiti javno dostupne slike s interneta.

Izvor koji će se koristiti u ovoj skripti su javne slike [Pulske pizzerije TiVoli](https://www.pizzeria-tivoli.com.hr/pizzeria/pizze/18).

Unutar `pizza-express/data/data.js` datoteke, dodajte ključ `slika_url` za svaku sliku te postavite odgovarajući URL slike s interneta.

_Primjer:_

```javascript
// app/pizza-express/data/data.js

  {id: 1, naziv: "Margherita", sastojci: ["rajčica", "sir", "bosiljak"], cijene: {"mala": 7.30, "srednja": 9.20, "jumbo": 16.20},
  slika_url:"https://pizzeria-tivoli.com.hr/uploads/pizza-margherita-u6kflo.jpg"},
```

Provjerite na Postmanu da li se novi podaci ispravno vraćaju s poslužitelja.

Vratite se na Vue.js aplikaciju i unutar `PizzaList.vue` komponente, iscrtajte sliku unutar glavnog `div`-a za svaku pizzu:

```html
<!-- app/pizza-vue/src/components/PizzaList.vue -->

<img :src="pizza.slika_url" :alt="pizza.naziv" class="w-full h-full object-contain" />
```

Malo ćemo izmijeniti stilove kako bi slika zauzela cijeli kontejner i kako bi malo zaokružili rubove, obzirom da više nemamo slike s transparentnom pozadinom.

```html
<div class="w-full h-48 flex items-center justify-center bg-inherit overflow-hidden rounded-xl">
    <img :src="pizza.slika_url" :alt="pizza.naziv" class="w-full h-full object-cover" />
</div>
```

<img src="https://github.com/lukablaskovic/FIPU-WA/blob/main/WA3%20-%20Razmjena%20podataka%20izme%C4%91u%20klijenta%20i%20poslu%C5%BEitelja/screenshots/vue-pizzalist-w-images.png?raw=true" style="width:80%; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); margin-top:10px;"></img>

> To be continued ...
