import express from 'express';
import path from 'path';

const app = express();
const PORT = 3000;

const korisnici = [
    { id: 1, ime: 'Marko', prezime: 'Marić' },
    { id: 2, ime: 'Ana', prezime: 'Anić' },
    { id: 3, ime: 'Stipe', prezime: 'Stipić' }
];

// endpoint:
// req : HTTP request (zahtjev): klijent -> poslužitelj
// res : HTTP response (odgovor): poslužitelj -> klijent

// /Users/lukablaskovic/Github/FIPU-WA/WA1 - Uvod u HTTP, Node i Express/app/public/error.html

app.get('/', (req, res) => {
    console.log('Pozvan sam...');
    let putanja = path.join('public', 'error.html');
    let aps_putanja = path.resolve(putanja);
    res.sendFile(aps_putanja);
});

app.get('/korisnici', (req, res) => {
    res.json(korisnici); //slanje JSON-a
});

/*
app.HTTP_METODA("URL", (HTTP_REQUEST, HTTP_RESPONSE) => { 
    // javascript kod
})
*/

app.listen(PORT, error => {
    if (error) {
        console.error(`Došlo je do greške pri pokretanju poslužitelja...`);
    }
    console.log(`Express Poslužitelj sluša na portu ${PORT}`);
});
