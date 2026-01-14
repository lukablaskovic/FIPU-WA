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

    const nova_narudzba = {
        id: narudzbe.length + 1,
        narucene_pizze,
        ukupna_cijena,
        podaci_dostava
    };
    narudzbe.push(nova_narudzba);
    console.log(`Uspješno kreirana narudžba: ${nova_narudzba}`);
    res.status(201).json({ message: 'Narudžba je uspješno kreirana.', narudzba: nova_narudzba });
});

export default router;
