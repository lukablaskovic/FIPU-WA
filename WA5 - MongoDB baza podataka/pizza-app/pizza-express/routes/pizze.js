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