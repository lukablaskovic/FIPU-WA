# Web aplikacije - Vježbe (2024/2025)



##  Rješenje zadatka:  (WA1) Samostalni zadatak za vježbu 1



1. Postavite strukturu projekta i definirajte novi Node projekt

```bash
mkdir wa_zadatak_1
cd wa_zadatak_1

npm init -y
```



2. Instalirajte Express

```bash
npm install express
```



3. Napravite `index.js` i definirajte osnovnu Express poslužitelja

```javascript
const express = require('express');
const app = express();

const PORT = 3000;

app.get('/', (req, res) => {
  res.send('Hello, world!');
});

app.listen(PORT, error => {
  if (error) {
    console.error(`Greška prilikom pokretanja poslužitelja: ${error.message}`);
  } else {
    console.log(`Server je pokrenut na http://localhost:${PORT}`);
  }
});
```



4. Testirajte kroz HTTP klijent ili web preglednik



5. Izradite folder `/public` i dodajte 2 HTML datoteke:

`/public/index.html`

```html
<!DOCTYPE html>
<html lang="hr">
<head>
    <meta charset="UTF-8">
    <title>Pozdravna stranica</title>
</head>
<body>
    <h1>Hello, Express!</h1>
</body>
</html>
```



`/public/about.html`

```html
<!DOCTYPE html>
<html lang="hr">
<head>
    <meta charset="UTF-8">
    <title>O nama</title>
</head>
<body>
    <h1>Ovo je stranica o nama!</h1>
</body>
</html>
```



6. Nadogradite poslužitelj traženim rutama (`/about` i `/`) i servirajte HTML datoteke:

`index.js`

```javascript
const express = require('express');
const app = express();
const PORT = 3000;

// Ruta za početnu stranicu
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

// Ruta za stranicu "O nama"
app.get('/about', (req, res) => {
    res.sendFile(__dirname + '/public/about.html');
});

// Pokretanje poslužitelja
app.listen(PORT, () => {
    console.log(`Server je pokrenut na http://localhost:${PORT}`);
});
```

Testirajte kroz web preglednik



7. Dodavanje `/users` rute

`index.js`

```javascript
const express = require('express');
const app = express();
const PORT = 3000;

// Ruta za početnu stranicu
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

// Ruta za stranicu "O nama"
app.get('/about', (req, res) => {
    res.sendFile(__dirname + '/public/about.html');
});

const users = [
        { id: 1, ime: 'Ivan', prezime: 'Horvat' },
        { id: 2, ime: 'Ana', prezime: 'Kovačić' },
        { id: 3, ime: 'Marko', prezime: 'Marić' }
				];

// Ruta za korisnike
app.get('/users', (req, res) => {    
    res.json(users);
});

// Pokretanje poslužitelja
app.listen(PORT, () => {
    console.log(`Server je pokrenut na http://localhost:${PORT}`);
});
```



8. Testirajte u web pregledniku i s programom `curl`

```bash	
curl http://localhost:3000

curl http://localhost:3000/about

curl http://localhost:3000/users
```



Konačna struktura projekta:

```
.
├── index.js
├── node_modules
├── package-lock.json
├── package.json
└── public
    ├── about.html
    └── index.html
```

