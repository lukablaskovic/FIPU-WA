import express from 'express';
import fs from 'fs';
import path from 'path';

const app = express();


function fetch_data(callback) {
  console.log('Dohvaćam podatke s udaljenog poslužitelja...');

  setTimeout(() => {
    const podaci = { racun: 'HR1234567890', stanje: 5000 };
    callback(podaci); // poziv callback funkcije nakon što se dohvate podaci
  }, 2000); // simulacija čekanja 2 sekunde na dohvat podataka
}

function handle_data(podaci) {
  console.log('Podaci su dohvaćeni:', podaci);
}

// pozivamo funkciju 'simuliraj_dohvat_podataka' s callback funkcijom 'prikazi_podatke'

fetch_data(handle_data);

// Ispisuje:

// Dohvaćam podatke s udaljenog poslužitelja...
// nakon 2 sekunde...
// Podaci su dohvaćeni: { racun: "HR1234567890" , stanje: 5000 };


app.listen(3000, () => {
  console.log('Poslužitelj je pokrenut na http://localhost:3000');
});
