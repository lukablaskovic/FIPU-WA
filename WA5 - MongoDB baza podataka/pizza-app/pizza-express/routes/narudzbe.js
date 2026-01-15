// app/pizza-express/routes/narudzbe.js

import express from 'express';
import { narudzbe, pizze } from '../data/data.js'; // učitavanje dummy podataka
import { ObjectId } from 'mongodb';
import connectToDatabase from '../db.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        let db = await connectToDatabase();

        let narduzbe = await db.collection('narudzbe').find().toArray();

        if (!narudzbe || narudzbe.length == 0) {
            res.status(404).json({ message: 'Nema narudžbi!' });
        }
        res.status(200).json(narduzbe);
    } catch (error) {
        console.error(`Greška pri dodavanju pizze: ${error}`);

        if (error.code == 'EBADNAME') {
            return res.status(500).json({ message: 'Greška u spajanju na bazu podataka!' });
        }
        return res.status(500).json({ message: `Generalna greška: ${error}` });
    }
});

// POST /narudzbe - Izrada nove narudžbe pizza
router.post('/', async (req, res) => {
    try {
        let db = await connectToDatabase();

        const { narucene_pizze, podaci_dostava } = req.body;
        if (!narucene_pizze || narucene_pizze.length === 0) {
            return res.status(400).json({ message: 'Nisu specificirane naručene pizze.' });
        }
        // Izračun ukupne cijene narudžbe

        let pizze = await db.collection('pizze').find().toArray();

        if (!pizze || pizze.length == 0) {
            return res.status(400).json({ message: 'Nema pizza u bazi podataka.' });
        }

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
            narucene_pizze,
            ukupna_cijena,
            podaci_dostava
        };

        let result = await db.collection('narudzbe').insertOne(nova_narudzba);

        if (result.acknowledged) {
            console.log(`Uspješno kreirana narudžba s ID-em ${result.insertedId}`);
            res.status(201).json({ message: `Narudžba je uspješno kreirana s ID-em: ${result.insertedId}` });
        }
    } catch (error) {
        console.error(`Greška pri dodavanju pizze: ${error}`);

        if (error.code == 'EBADNAME') {
            return res.status(500).json({ message: 'Greška u spajanju na bazu podataka!' });
        }
        return res.status(500).json({ message: `Generalna greška: ${error}` });
    }
});

router.patch('/:id', async (req, res) => {
    try {
        let db = await connectToDatabase();

        let id_string = req.params.id;
        let status_body = req.body.status;

        let narudzbe = db.collection('narudzbe');

        let result = await narudzbe.updateOne({ _id: new ObjectId(id_string) }, { $set: { status: status_body } });

        if (result.modifiedCount === 0) {
            return res.status(404).json({ error: 'Narudžba nije pronađena' });
        }

        res.status(200).json({ modifiedCount: result.modifiedCount });
    } catch (error) {
        console.error(`Greška pri dodavanju pizze: ${error}`);

        if (error.code == 'EBADNAME') {
            return res.status(500).json({ message: 'Greška u spajanju na bazu podataka!' });
        }
        return res.status(500).json({ message: `Generalna greška: ${error}` });
    }
});

export default router;
