import express from 'express';

import { boats } from '../data/boats.js';
import { normalize } from '../utils/index.js';

const router = express.Router();

router.get('/', (req, res) => {
    if (!boats) {
        return res.status(404).json({ greska: 'nema brodova' });
    } else {
        return res.status(200).json(boats);
    }
});

router.get('/:naziv', (req, res) => {
    const naziv_broda = normalize(req.params.name);
    const brod = boats.find(b => normalize(b.naziv) === name);

    if (!brod) {
        return res.status(404).json({ greska: `Nema broda ${naziv_broda}` });
    } else {
        return res.status(200).json(brod);
    }
});

const requiredBoatKeys = ['naziv', 'tip', 'duljina', 'cijenaPoDanu', 'motor_hp'];

router.post('/', (req, res) => {
    const bodyKeys = Object.keys(req.body);

    const sameKeys = bodyKeys.length === requiredBoatKeys.length && requiredBoatKeys.every(k => bodyKeys.includes(k));

    if (!sameKeys) {
        return res.status(400).json({ error: 'Pogrešni ključevi.' });
    }

    const exists = boats.some(b => normalize(b.naziv) === normalize(req.body.naziv));
    if (exists) {
        return res.status(409).json({ error: 'Brod s istim nazivom već postoji.' });
    }

    const newId = boats[boats.length - 1].id + 1;

    const newBoat = {
        id: newId,
        ...req.body
    };

    boats.push(newBoat);

    res.status(201).json(newBoat);
});

export default router;
