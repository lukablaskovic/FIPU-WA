# Web aplikacije (WA)

**Nositelj**: doc. dr. sc. Nikola Tanković  
**Asistent**: Luka Blašković, mag. inf.

**Ustanova**: Sveučilište Jurja Dobrile u Puli, Fakultet informatike u Puli

<img src="https://raw.githubusercontent.com/lukablaskovic/FIPU-PJS/main/0.%20Template/FIPU_UNIPU.png" style="width:40%; box-shadow: none !important;"></img>

# (1) Uvod u Node i Express

<img src="WA_1_logo.png" style="width:9%; border-radius: 15px; float:right;"></img>

<div style="float: clear; margin-right:5px;"> Web aplikacije su sofisticirana programska rješenja koja se pokreću na web poslužitelju, a korisnici im pristupaju putem internetskog preglednika. Njihova najveća prednost je široka dostupnost na gotovo svim platformama i uređajima, bez potrebe za instalacijom na lokalnim računalima ili uređajima. Ovaj kolegij usmjeren je na dizajn i razvoj web aplikacija korištenjem modernih tehnologija i alata. Za razliku od kolegija Programsko inženjerstvo, ovdje ćete naučiti kako implementirati poslužiteljski sloj web aplikacije – ključni dio koji možemo zamisliti kao "mozak" aplikacije, zadužen za logiku i obradu podataka.</div>
<br>

**🆙 Posljednje ažurirano: 20.10.2024.**

## Sadržaj

<!-- TOC start (generated with https://github.com/derlin/bitdowntoc) -->

- [Web aplikacije (WA)](#web-aplikacije-wa)
- [(1) Uvod u Node i Express](#1-uvod-u-node-i-express)
  - [Sadržaj](#sadržaj)
- [1. Uvod](#1-uvod)
  - [1.1 Kratak povijesni pregled](#11-kratak-povijesni-pregled)
- [2. Instalacija potrebnih alata](#2-instalacija-potrebnih-alata)
    - [2.1 Node.js](#21-nodejs)
    - [2.2 VS Code](#22-vs-code)
    - [2.3 Git](#23-git)
- [3. Kako započeti novi projekt?](#3-kako-započeti-novi-projekt)
  - [3.1 Inicijalizacija novog repozitorija](#31-inicijalizacija-novog-repozitorija)
  - [3.2 Izrada Node projekta](#32-izrada-node-projekta)
- [4. Express.js](#4-expressjs)
  - [4.1 Instalacija Express.js](#41-instalacija-expressjs)
  - [4.2 Osnovni Express.js poslužitelj](#42-osnovni-expressjs-poslužitelj)
  - [4.3 Kako definirati rute?](#43-kako-definirati-rute)
  - [4.4 Nodemon](#44-nodemon)
  - [4.5 Git commit](#45-git-commit)

<br>

# 1. Uvod

Web aplikacije su softverski programi koji se koriste putem internetskog preglednika, bez potrebe za instalacijom na korisničkom računalu ili uređaju. One se izvršavaju na web poslužitelju, a korisnici im pristupaju putem internetskog preglednika. Web aplikacije su dostupne na gotovo svim platformama i uređajima, što ih čini vrlo popularnima među korisnicima.

Primjeri web aplikacija:

- Gmail: web aplikacija za slanje i primanje e-pošte
- Google Docs: omogućuje stvaranje i uređivanje dokumenata u stvarnom vremenu
- Facebook: društvena mreža za povezivanje s prijateljima i obitelji
- Online trgovine: web shopovi poput Amazona ili Ebaya za kupnju proizvoda

Svaka web aplikacija sastoji se od minimalno dva dijela:

1. **Klijentski dio** (_eng. client side_): izvršava se na korisničkom uređaju (npr. računalo, pametni telefon) i koristi se za prikaz korisničkog sučelja. Napisan je u jezicima poput HTML-a, CSS-a i JavaScripta, odnosno razvojnih okvira poput Reacta, Angulara ili Vue.js-a.
2. **Poslužiteljski dio** (_eng. server side_): izvršava se na web poslužitelju i koristi se za obradu zahtjeva korisnika, pristup bazi podataka i poslovnu logiku aplikacije. Napisan je u jezicima poput JavaScripta (Node.js), Pythona (Django, Flask), Rubyja (Ruby on Rails) ili Jave (Spring).

## 1.1 Kratak povijesni pregled

Premda nije predmet ovog kolegija, **PHP** je također popularan jezik za izradu poslužiteljskog dijela web aplikacija. Glavna prednost PHP-a je generiranje dinamičkih HTML stranica na poslužiteljskoj strani, što ga čini idealnim za izradu web stranica i aplikacija. Iako je pristuan već dugi niz godina, PHP i dalje ima veliku bazu korisnika i popularan je izbor za izradu web aplikacija (posebice moderni PHP okviri poput Laravela i Symfonya).

**JavaScript** je nešto mlađi programski jezik od PHP-a (svega nekoliko mjeseci), a prvi put je implementiran u Netscape Navigatoru (najpopularniji web preglednik u to vrijeme) 1995. godine. JavaScript je postao popularan zbog svoje sposobnosti stvaranja interaktivnih korisničkih sučelja na klijentskoj strani web aplikacija, što je dovelo do razvoja modernih web aplikacija poput Gmaila, Google Mapsa. Te aplikacije su imale interaktivno korisničko sučelje napisano u JavaScriptu, dok se se za poslužiteljski sloj koristili PHP i C++ jezici.

Danas gotovo 99% web stranica koristi JavaScript na klijentskoj strani za implementaciju interaktivnog ponašanja, a svaki moderni web preglednik ima ugrađen svoj JavaScript engine koji izvršava JavaScript kod.

Međutim, 2009. godine na tržište izlazi novi revolucionarni alat koji je promijenio način na koji se danas razvijaju moderne web aplikacije - **Node.js**. Node.js je JavaScript okruženje (_eng. runtime environment_) koje dozvoljava izvođenje JavaScript koda na poslužiteljskoj strani. Drugim riječima, Node.js omogućava izvršavanej JavaScript koda izvan web preglednika.

Mi ćemo se na ovom kolegiju fokusirati upravo na taj poslužiteljski sloj web aplikacija, koristeći Node.js, odnosno biblioteku **Express.js** za izradu poslužiteljskog dijela web aplikacija.
<a href="https://nodejs.org/en" target="_blank">
<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Node.js_logo.svg/800px-Node.js_logo.svg.png" style="width:20%;"></img>
</a>

A za one koji žele više, proučite [**Deno**](https://deno.com/) - novi JavaScript _runtime environment_ koji brzo dobiva na popularnosti, a razvija ga isti programer koji je razvio Node.js!

# 2. Instalacija potrebnih alata

### 2.1 Node.js

Node.js možete preuzeti sa [službene stranice](https://nodejs.org/en/). Preuzmite LTS verziju (Long Term Support) koja je stabilna i sigurna za produkciju. Nakon preuzimanja, pokrenite instalacijski program i slijedite upute za instalaciju.

Preporuka je preuzeti verziju LTS 20+.

Nakon što ste uspješno instalirali Node.js, možete provjeriti je li instalacija uspješna tako da otvorite terminal i upišete sljedeću naredbu:

```bash
node -v
```

Ako je instalacija uspješna, trebali biste vidjeti verziju Node.js-a koju ste instalirali. Na primjer:

```bash
v22.9.0
```

Instalacijom Node-a dobivate i `npm` (Node Package Manager) koji koristimo za instalaciju paketa i modula potrebnih za razvoj web aplikacija.

```bash
npm -v
```

### 2.2 VS Code

Visual Studio Code je besplatni uređivač koda koji je dostupan za Windows, macOS i Linux. Možete preuzeti Visual Studio Code sa [službene stranice](https://code.visualstudio.com/download). Nakon preuzimanja, pokrenite instalacijski program i slijedite upute za instalaciju.

Nakon što ste uspješno instalirali Visual Studio Code, možete provjeriti je li instalacija uspješna tako da otvorite terminal i upišete sljedeću naredbu:

```bash
code --version
```

Možete pokrenuti Visual Studio Code tako da upišete sljedeću naredbu:

```bash
code
```

ili jednostavno pokrenite kroz grafičko sučelje.

### 2.3 Git

Git je besplatni sustav za upravljanje izvornim kodom koji je dostupan za Windows, macOS i Linux. Možete preuzeti Git sa [službene stranice](https://git-scm.com/downloads). Nakon preuzimanja, pokrenite instalacijski program i slijedite upute za instalaciju.

Iako nije nužan za sam razvoj web aplikacija, Git je koristan alat koji ćemo često koristiti za verzioniranje izvornog koda.

Nakon što ste uspješno instalirali Git, možete provjeriti je li instalacija uspješna tako da otvorite terminal i upišete sljedeću naredbu:

```bash
git --version
```

Ako je instalacija uspješna, trebali biste vidjeti verziju Git-a koju ste instalirali. Na primjer:

```bash
git version 2.47.0
```

Ako još uvijek nemate, svakako morate izraditi i [Github](https://github.com/) račun. Github je vrlo popularna platofrma gdje developeri mogu pohranjivati, dijeliti te surađivati na kodu i projektima, a koristi Git kao sustav za verzioniranje koda.

# 3. Kako započeti novi projekt?

## 3.1 Inicijalizacija novog repozitorija

Nakon što ste uspješno instalirali Node.js, Visual Studio Code i Git, možete započeti raditi na novom projektu.

Prvi korak je definiranje strukture projekta, budući da smo odlučili verzionirati izvorni kod, koristit ćemo Git za inicijaliziarnje novog repozitorija. Međutim krenut ćemo od Githuba: idemo na [Github izraditi novi repozitorij](https://github.com/new), a zatim ćemo ga klonirati na lokalno računalo. Klonirati (eng. _clone_) znači preuzeti udaljeni repozitorij na naše računalo (lokalno).

Nazovite repozitorij **"wa_vjezbe_01"** i dodajte opis po želji. Možete ga postaviti kao privatni ili javni, a svakako odaberite opciju "Add a README file" kako ne bi inicijalno bio prazan.

<img src="screenshots/new_repo.png " style="width:50%;"></img>

Nakon što ste izradili repozitorij, kopirajte URL repozitorija, npr. https://github.com/lukablaskovic/FIPU-WA1-Express.git

**1. Način**

Otvorite terminal i navigirajte do direktorija u kojem želite spremiti projekt. Zatim upišite sljedeću naredbu:

```bash
cd putanja/do/direktorija

git clone <URL>
```

Na primjer, ako se direktorij nalazi na radnoj površini, naredba bi mogla izgledati ovako:

Windows:

```bash
cd C:\Users\<VAŠ USERNAME>\Desktop
```

macOS/linux:

```bash
cd Desktop
```

Zamijenite `<URL>` s URL-om repozitorija koji ste prethodno kopirali. Na primjer:

```bash
git clone https://github.com/lukablaskovic/FIPU-WA1-Express.git
```

Kako biste se uvjerili da ste u pravom direktoriju, upišite naredbu:

Windows:

```bash
ls
```

ili

```bash
dir
```

macOS/linux:

```bash
ls
```

Ove naredbe će vam ispisati popis datoteka i direktorija u trenutnom direktoriju.

**2. Način**

Drugi način je kloniranje repozitorija direktno iz Visual Studio Codea. Otvorite Visual Studio Code i pritisnite `Ctrl + Shift + P` (Windows) ili `Cmd + Shift + P` (macOS) kako biste otvorili Command Palette. Upišite "Git: Clone" i pritisnite Enter. Zatim upišite URL repozitorija i pritisnite Enter.

Ako vam ne radi, uvjerite se da imate instaliran Git i da je dostupan u PATH-u. Dodatno, u VS Codeu morate biti prijavljeni na Github račun.
Možete se uvjeriti da je Git dostupan u PATH-u tako da otvorite terminal i upišete:

```bash
git --version
```

Ako nije dobit ćete grešku neovisno o okruženju u kojem otvarate terminal. U tom slučaju, potrebno je reinstalirati Git kroz instalacijski program i odabrati opciju koja dodaje Git u PATH.

**3. Način**

Treći način je kloniranje repozitorija direktno iz Github Desktop aplikacije. Otvorite [Github Desktop](https://desktop.github.com/download/) aplikaciju i pritisnite `Ctrl + Shift + O` (Windows) ili `Cmd + Shift + O` (macOS) kako biste otvorili Clone Repository prozor. Upišite URL repozitorija i pritisnite Clone.

Github desktop je odlična aplikacija za početnike jer nudi jednostavan način za upravljanje repozitorijima, ali nije nužna za rad na projektu. Sve što možete napraviti u Github Desktopu možete napraviti i u terminalu ili Visual Studio Codeu, ali Desktop nudi vizualni prikaz promjena i jednostavno upravljanje repozitorijima, što može biti vrlo korisno.

## 3.2 Izrada Node projekta

Jednom kad ste uspješno klonirali repozitorij, možete započeti s izradom Node projekta.

Otvorite terminal i navigirajte do direktorija projekta. Zatim upišite sljedeću naredbu:

```bash
code .
```

ili otvorite Visual Studio Code i navigirajte do direktorija projekta.

Možete i kroz Github Desktop i to tako da otvorite repozitorij u aplikaciji i pritisnete `Ctrl + Shift + A` (Windows) ili `Cmd + Shift + A` (macOS) kako biste otvorili repozitorij u Visual Studio Codeu.

Kada ste otvorili projekt u Visual Studio Codeu, otvorite novi terminal: `Terminal` -> `New Terminal`.

Zatim upišite sljedeću naredbu:

```bash
npm init
```

Ova naredba pokreće inicijalizaciju novog Node projekta. Slijedite upute i unesite podatke o projektu. Ako želite preskočiti neko polje, jednostavno pritisnite Enter.
Ako želite preskočiti cijeli upitnik i koristiti zadane postavke, dodajte `-y` opciju:

```bash
npm init -y
```

Wohoo! Uspješno ste inicijalizirali novi Node projekt! 🎉

Primjetit ćete da se u direktoriju projekta pojavila datoteka `package.json`. Ova datoteka sadrži informacije o projektu, poput naziva, verzije, autora, skripti i ovisnosti. Kroz kolegij ćemo detaljno vidjeti što znači svaki dio `package.json` datoteke i kako ju možemo koristiti za upravljanje projektom.

Struktura direktorija projekta trebala bi izgledati ovako (samo 1 datoteka):

```
.
└── package.json

1 directory, 1 file
```

Idemo još malo ponoviti terminal: Konzola mi je nakrcana nakon ove incijalizacije, kako da očistim? `clear` ili `cls` (Windows) | `clear` (macOS/linux) i sve će biti čisto. 🧹

Kako se mogu kretati kroz direktorije? `cd ime_direktorija` za ulazak u direktorij, `cd ..` za izlazak iz direktorija, `cd` za povratak u korijenski direktorij. 🚶‍♂️

Ok sad opet ne znam di sam? `pwd` (macOS/linux) ili `cd` (Windows) će vam reći trenutnu lokaciju. 👌🏻

# 4. Express.js

## 4.1 Instalacija Express.js

Express.js je popularni web okvir za Node.js koji omogućava brzo i jednostavno kreiranje web aplikacija. Express.js je jedan od najpopularnijih web okvira za Node.js, a koristi se za izradu **poslužiteljskog dijela** web aplikacija.

Kako instalirati Express.js? U terminalu upišite sljedeću naredbu:

```bash
npm install express
```

Naredba `npm install` koristi se za instalaciju paketa i modula iz Node paketnog registra. U ovom slučaju, instalirali smo [**Express.js**](https://www.npmjs.com/package/express) paket.

[Node paketni registar](https://www.npmjs.com/) je online baza podataka koja sadrži tisuće paketa i modula koje možemo koristiti u našim Node projektima.

Nakon što je instalacija završena, u direktoriju projekta trebali biste vidjeti nekoliko dodanih stavki:

- direktorij `node_modules` koji sadrži sve instalirane pakete i module odnosno njihov izvorni kod
- datoteku `package-lock.json` koja sadrži informacije o verzijama paketa i modula

`package-lock.json` datoteka je važna jer osigurava da svi članovi tima koriste iste verzije paketa i modula. Ova datoteka se automatski generira prilikom instalacije paketa i modula, i također ju ne smijete mijenjati ručno.

Struktura direktorija projekta trebala bi izgledati ovako:

```
.
├── node_modules
├── package-lock.json
└── package.json

2 directories, 2 files
```

U sljedećem vježbanju ćemo izraditi prvi Express.js poslužitelj.

## 4.2 Osnovni Express.js poslužitelj

Krenimo napokon s prvim Express.js poslužiteljem! 🚀 Dodat ćemo novu `js` datoteku proizvoljnog naziva, uobičajeno je koristiti `app.js`, `index.js` ili `server.js`.
Mi ćemo koristiti `index.js`.

Dodajte datoteku ručno, desni klik na direktorij projekta -> `New File` -> `index.js`. Ili ako želite biti terminal ninja, upišite:

```bash
touch index.js
```

Osnovni Express.js poslužitelj možemo definirati svega u nekoliko linija koda:

Prvo ćemo uključiti Express.js modul u našu datoteku:

```javascript
const express = require("express");
```

Zatim ćemo stvoriti novu Express aplikaciju:

```javascript
const app = express(); // u varijablu app pohranjujemo objekt koji predstavlja Express aplikaciju
```

OK, kako pokrećem Express.js poslužitelj? Koristimo `listen` metodu:

```javascript
const PORT = 3000; // port na kojem će poslužitelj slušati zahtjeve

app.listen(PORT); // Express aplikacija "sluša" na portu 3000
```

Cijeli kod izgleda ovako:

```javascript
const express = require("express");
const app = express();

const PORT = 3000;
app.listen(PORT);
```

Spremite datoteku i pokrenite Express.js poslužitelj tako da u terminalu upišete:

```bash
node index.js
```

Što se dogodilo? 🤔
Čini se kao da nije ništa, međutim možemo u terminalu vidjeti da je proces pokrenut budući da ne možemo više upisivati nove naredbe. To znači da je Express.js poslužitelj uspješno pokrenut i da sluša zahtjeve na portu 3000.

Gdje ovo mogu vidjeti? Aplikacija pokrećemo na vlastitom računalu, tako da se ona izvodi na adresi `localhost`, odnosno `127.0.0.1`. Dodatno, sluša na portu `3000`, tako da je puna adresa `http://localhost:3000`. Otvorite internetski preglednik i upišite ovu adresu, trebali biste vidjeti poruku "Cannot GET /" ili slično. To je u redu, jer nismo definirali nikakve rute ili putanje.

Kako zatvoriti Express.js poslužitelj? U terminalu pritisnite `Ctrl + C` (Windows) ili `Cmd + C` (macOS) kako biste prekinuli izvođenje programa. Ovo će zaustaviti Express.js poslužitelj i vratiti vam kontrolu nad terminalom.

Da bi bili sigurni da se naša aplikacija "vrti" možemo dodati `callback` funkciju našoj `listen` metodi:

```javascript
app.listen(PORT, function () {
  console.log(`Server je pokrenut na http://localhost:${PORT}`);
});
```

Ova funkcija prima i `error` argument, tako da možemo uhvatiti potencijalne greške prilikom pokretanja poslužitelja:
Skraćeno ju možemo zapisati i kao `arrow callback`:

```javascript
app.listen(PORT, (error) => {
  if (error) {
    console.error(`Greška prilikom pokretanja poslužitelja: ${error.message}`);
  } else {
    console.log(`Server je pokrenut na http://localhost:${PORT}`);
  }
});
```

Spremite datoteku i ponovno pokrenite Express.js poslužitelj. Ovaj put ćete vidjeti poruku "Server je pokrenut na http://localhost:3000" u terminalu.

I to je to! Uspješno ste izradili prvi Express.js poslužitelj! 🎉

## 4.3 Kako definirati rute?

Rute su putanje koje korisnici mogu posjetiti u internetskom pregledniku. Na primjer, korisnik može posjetiti putanju `/` kako bi vidio početnu stranicu aplikacije, ili putanju `/about` kako bi vidio stranicu s informacijama o aplikaciji.

Nazivamo ih još i **endpoints** ili **API endpoints**.

**API** (eng. _Application Programming Interface_) je skup pravila i definicija koje omogućuju različitim softverskim aplikacijama da komuniciraju jedna s drugom. Express, iako se najčešće i koristi za izgradnju API servisa, može se koristiti i za izgradnju drugih vrsta softvera.

Mi ćemo u sklopu ovog kolegija koristiti Express.js za izgradnju ukupnog poslužiteljskog sloja naše web aplikacije, uključujući i API servis za komunikaciju s klijentskim dijelom aplikacije (Vue.js). Sigurno ste čuli i za **REST API** (eng. _Representational State Transfer_), međutim o tome ćemo uskoro!

Vratimo se na rute. Rekli smo da su to putanje koje korisnici mogu posjetiti u internetskom pregledniku i koje odgovaraju na određene zahtjeve korisnika.

Sigurno ste dosad imali priliku vidjeti rute u internetskim preglednicima, npr. `https://moodle.srce.hr/2024-2025/` gdje je `2024-2025` ruta koja odgovara akademskoj godini, odnosno pretpostavljamo da će nas odvesti na stranicu s informacijama o akademskoj godini 2024/2025 (u pozadini: korisnik je zatražio informacije o akademskoj godini 2024/2025, a poslužitelj to mora vratiti).

Definirat ćemo osnovnu rutu `/` koja će korisnicima prikazati poruku "Hello, world!". Koristit ćemo `get` metodu koja je obrađuje **HTTP GET** zahtjev.

```javascript
app.get("/"); // definiramo rutu
```

Zatim ćemo dodati `callback` funkciju koja će se izvršiti kada korisnik posjeti ovu rutu.

Ova callback funkcija najčešće prima dva argumenta: `req` (request) i `res` (response). `req` objekt sadrži informacije o zahtjevu korisnika, dok `res` objekt koristimo za slanje odgovora korisniku (možemo ih nazvati bilo kako ali ovo je konvencija i dobro je se držati). Postoji i treći argument `next` koji koristimo za preusmjeravanje zahtjeva na sljedeću funkciju u lancu middleware-a, ali o tome ćemo kasnije.

Osnovna metoda `res` objekta je `send` koja služi za slanje jednostavnog odgovora korisniku.

```javascript
app.get("/", (req, res) => {
  res.send("Hello, world!"); // šaljemo odgovor korisniku
});
```

To je to!

Cijeli kod izgleda ovako:

```javascript
const express = require("express");
const app = express();

const PORT = 3000;

app.get("/", (req, res) => {
  res.send("Hello, world!");
});

app.listen(PORT, (error) => {
  if (error) {
    console.error(`Greška prilikom pokretanja poslužitelja: ${error.message}`);
  } else {
    console.log(`Server je pokrenut na http://localhost:${PORT}`);
  }
});
```

Obavezno spremite datoteku i ponovo pokrenite Express.js poslužitelj. Otvorite internetski preglednik i posjetite adresu `http://localhost:3000`. Trebali biste vidjeti poruku "Hello, world!".

Međutim, što smo ustvari dobili nazad? Otvorimo konzolu u pregledniku (F12) i vidjet ćemo da smo dobili HTML stranicu s porukom "Hello, world!".

```html
<html>
  <head></head>
  <body>
    <text>Hello, world!</text>
  </body>
</html>
```

> Kada budemo učili o zaglavljima HTTP zahtjeva, vidjet ćemo zašto je ovo tako. Za sad, zapamtite da će `send` metoda poslati odgovor korisniku u obliku HTML stranice.

## 4.4 Nodemon

Primjetite da je potrebno svaki put ručno zaustaviti i ponovno pokrenuti Express.js aplikaciju kada napravimo promjene u kodu. Ono što smo prilikom razvoja Vue.js aplikacija uzimali zdravo za gotovo, ovdje si moramo ručno podesiti. Iz tog razloga koristimo `nodemon` - paket koji automatski prati promjene u kodu i ponovno pokreće Express.js aplikaciju.

Kako instalirati `nodemon` kroz `npm`?

```bash
npm install -g nodemon
```

Opcija `-g` označava globalnu instalaciju, što znači da će `nodemon` biti dostupan u cijelom sustavu (našem računalu). Ovo je korisno jer možemo koristiti `nodemon` za pokretanje bilo koje Node.js aplikacije, a ne samo Express.js aplikacija.

Rekli smo da u `package.json` datoteci definiramo aplikacije koje naš paket koristi. Kako naša aplikacija nema direktne koristi od `nodemon` paketa, već samo mi kao developeri, možemo koristiti `--save-dev` opciju prilikom instalacije koja će dodati `nodemon` paket u `devDependencies` dio `package.json` datoteke (odnosno pakete koji su potrebni samo prilikom razvoja aplikacije).

```bash
npm install --save-dev nodemon
```

Vaša `package.json` datoteka sada bi trebala izgledati ovako:

```json
{
  "name": "wa_vjezbe_01",
  "version": "1.0.0",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "description": "",
  "dependencies": {
    "express": "^4.21.1"
  },
  "devDependencies": {
    "nodemon": "^3.1.7"
  }
}
```

Kako koristiti `nodemon`? Umjesto `node` naredbe, koristimo `nodemon` naredbu. Simple as that! 🚀

```bash
nodemon index.js
```

Sada kada napravimo promjene u kodu, `nodemon` će automatski prepoznati promjene i ponovno pokrenuti Express.js aplikaciju. To nam štedi vrijeme i olakšava razvoj aplikacije.

## 4.5 Git commit

Napravili smo dosta promjena u kodu, vrijeme je za prvi `commit`! 🎉

Možemo primjetiti u lijevom izborniku VS Codea da su se pojavile promjene u našem projektu (vjerojatno njih 500+). Zašto se ovo dešava ako smo samo inicijalizirali node projekt i dodali jednu datoteku i napisali nekoliko linija koda? 🤔

Odgovor je jednostavan: `node_modules` direktorij. Ovaj direktorij sadrži sve instalirane pakete i module potrebne za uspješno izvođenje naše aplikacije. Ovaj direktorij je velik i sadrži tisuće datoteka, što znači da će se pojaviti puno promjena u našem projektu. Međutim, `node_modules` direktorij nije potreban za izvođenje naše aplikacije jer možemo ponovno instalirati sve pakete i module koristeći `npm install` naredbu.

`npm install` metoda čita `package.json` datoteku i instalira sve pakete i module navedene u `dependencies` i `devDependencies` dijelovima datoteke. Ovo je vrlo korisno jer omogućava drugim developerima da lako instaliraju sve potrebne pakete i module za izvođenje naše aplikacije.

Kako bismo izbjegli dodavanje `node_modules` direktorija u repozitorij, dodajemo ga u `.gitignore` datoteku. Ova datoteka sadrži popis datoteka i direktorija koje ne želimo dodati u repozitorij. Dodajte `node_modules` direktorij u `.gitignore` datoteku:

Datoteka: `.gitignore`

```
node_modules
```

Struktura našeg projekta sada izgleda ovako:

```
.
├── index.js
├── node_modules
├── package-lock.json
└── package.json

2 directories, 3 files
```

Primjetit ćete da se promjene u `node_modules` direktoriju više ne pojavljuju u lijevom izborniku VS Codea i da se broj smanjio na nekoliko promjena.

Sada smo spremni napraviti naš prvi `commit`!

1. Način (kroz terminal):

Prvo provjerimo stanje indeksa:

```bash
git status
```

Ova naredba će ispisati sve promjene u projektu. Za sada nismo definirali što dodajemo u indeks, pa će nas tražiti da dodajemo datoteke s naredbom `git add`.

Možemo dodati sve datoteke u indeks tako da kao argumenet navedemo `.`:

```bash
git add .
```

Pozvat ćemo opet `git status` kako bismo provjerili jesu li sve datoteke dodane u indeks:

```bash
git status
```

Uvjerite se da nema datoteke `node_modules` u popisu datoteka koje će se dodati u indeks.

```
Changes to be committed:
  (use "git restore --staged <file>..." to unstage)
        new file:   .gitignore
        new file:   index.js
        new file:   package-lock.json
        new file:   package.json
```

Sada možemo pohraniti promjene kroz `commit` naredbu:
Dodajemo obaveznu poruku uz `-m` opciju:

```bash
git commit -m "Inicijalni commit"
```

Ako je sve prošlo u redu, dobit ćete poruku s popisom promjena:

```
[main 465f003] Inicijalni commit
 4 files changed, 1184 insertions(+)
 create mode 100644 1. Uvod u Node i Express/wa_vjezbe_01/.gitignore
 create mode 100644 1. Uvod u Node i Express/wa_vjezbe_01/index.js
 create mode 100644 1. Uvod u Node i Express/wa_vjezbe_01/package-lock.json
 create mode 100644 1. Uvod u Node i Express/wa_vjezbe_01/package.json
```

Ono što još trebamo napraviti je pohraniti promjene na udaljeni repozitorij. Ovo radimo kroz `push` naredbu:

```bash
git push
```

2. Način (kroz VS Code):

Otvorite Source Control tab u lijevom izborniku VS Codea. Prikazat će se sve promjene u projektu. Postoji nekoliko oznaka uz svaku datoteku:

3. Način (kroz Github Desktop):

Otvorite Github Desktop aplikaciju i pronađite vaš repozitorij. Vidjet ćete vizualni prikaz promjena u projektu na tabu Changes.

Možete dodati opis promjena i pritisnuti `Commit to main` kako biste pohranili promjene (ovoje ekvivalentno `git commit` naredbi). Zatim pritisnite `Push origin` kako biste pohranili promjene na udaljeni repozitorij (ovo je ekvivalentno `git push` naredbi).
