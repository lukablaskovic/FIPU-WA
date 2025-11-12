import express from 'express';
import path from 'path';

import { checkArray, same_arrays } from './utils/index.js';

import pizze_router from './routes/pizze.js';
import narudzbe_router from './routes/narudzbe.js';

const app = express(); // glavna express aplikacija
const PORT = 3000;

app.use(express.json()); // ukljucujem middleware express.json()
app.use('/pizze', pizze_router);
app.use('/narudzbe', narudzbe_router);

app.get('/', (req, res) => {
    //res.send('Pozdrav s defautlne rute!');
    //res.json({ poruka: 'Pozdrav s defaultne rute' });

    let putanja = path.join('static', 'index.html');
    let aps_putanja = path.resolve(putanja);
    res.sendFile(aps_putanja);
});

app.listen(PORT, error => {
    if (error) {
        console.error('Greška pri pokretanju poslužitelja...');
    }
    console.log(`Poslužitelj sluša na portu ${PORT}`);
});
