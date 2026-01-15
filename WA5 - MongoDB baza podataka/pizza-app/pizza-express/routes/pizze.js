// app/pizza-express/routes/pizze.js

import express from 'express';
//import { pizze } from '../data/data.js'; // učitavanje dummy podataka
const router = express.Router();

import connectToDatabase from '../db.js';

// GET /pizze - Dohvaćanje svih pizza (npr. GET /pizze)
router.get('/', async (req, res) => {
    let db = await connectToDatabase(); // asinkrono

    let pizze = await db.collection('pizze').find().toArray();

    console.log('pizze', pizze);

    if (pizze.length === 0 || !pizze) {
        return res.status(404).json({ message: 'Nema dostupnih pizza.' });
    }

    res.status(200).json(pizze);
});

// GET /pizze/:naziv - Dohvaćanje pizze prema nazivu (npr. GET /pizze/Margherita)

router.get('/:naziv', async (req, res) => {
    const naziv_req = req.params.naziv;
    let db = await connectToDatabase();
    let pizza = await db.collection('pizze').findOne({ naziv: naziv_req });

    console.log(pizza);

    if (!pizza) {
        return res.status(404).json({ message: `Pizza s nazivom '${naziv}' nije pronađena.` });
    }

    res.status(200).json(pizza);
});

router.post('/', async (req, res) => {
    const nova_pizza = req.body;

    try {
        let db = await connectToDatabase();

        let result = await db.collection('pizze').insertOne(nova_pizza);

        if (result.acknowledged) {
            return res.status(201).json({ message: `Pizza s nazivom ${nova_pizza.naziv} je uspješno dodana u bazu!` });
        }
    } catch (error) {
        console.error(`Greška pri dodavanju pizze: ${error}`);

        if (error.code == 'EBADNAME') {
            return res.status(500).json({ message: 'Greška u spajanju na bazu podataka!' });
        }

        return res.status(400).json(error);
    }
});

let dozvoljene_velicine = ['mala', 'srednja', 'jumbo'];

router.patch('/:naziv', async (req, res) => {
    const nova_cijena = req.body.cijena; // nova cijena pizze
    const velicina = req.body.velicina;

    if (dozvoljene_velicine.indexOf(velicina) == -1) {
        return res.status(400).json({ message: 'Poslali ste veličinu koja ne postoji.' });
    }

    const naziv_req = req.params.naziv;
    try {
        let db = await connectToDatabase();
        let updateKey = `cijene.${velicina}`;
        let pizza_for_update = await db.collection('pizze').updateOne({ naziv: naziv_req }, { $set: { [updateKey]: nova_cijena } });

        if (pizza_for_update.acknowledged) {
            return res.status(200).json({ message: `Uspješno ažurirana ${velicina} cijena pizze naziva ${naziv_req} na novu vrijednost: ${nova_cijena}.` });
        }
    } catch (error) {
        if (error.code == 'EBADNAME') {
            return res.status(500).json({ message: 'Greška u spajanju na bazu podataka!' });
        }
    }
});

export default router;
