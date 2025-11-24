import express from 'express';
import { rentals } from '../data/rentals.js';
import { boats } from '../data/boats.js';
import { dateDiffInDays } from '../utils/index.js';

const router = express.Router();

const requiredRentalKeys = ['boatId', 'customerName', 'rentalStartDate', 'rentalEndDate'];

router.post('/', (req, res) => {
    const bodyKeys = Object.keys(req.body);

    const correctKeys = bodyKeys.length === requiredRentalKeys.length && requiredRentalKeys.every(k => bodyKeys.includes(k));

    if (!correctKeys) {
        return res.status(400).json({ error: 'Pogrešni ključevi najma.' });
    }

    const { boatId, rentalStartDate, rentalEndDate } = req.body;

    if (new Date(rentalEndDate) < new Date(rentalStartDate)) {
        return res.status(400).json({ error: 'Završni datum mora biti nakon početnog.' });
    }

    const boat = boats.find(b => b.id === boatId);
    if (!boat) {
        return res.status(404).json({ error: 'Brod ne postoji.' });
    }

    const days = dateDiffInDays(rentalStartDate, rentalEndDate);
    const totalPrice = days * boat.cijenaPoDanu;

    const newId = rentals.length ? rentals[rentals.length - 1].id + 1 : 1;

    const rental = {
        id: newId,
        ...req.body,
        totalPrice
    };

    rentals.push(rental);

    res.status(201).json(rental);
});

router.put('/:id', (req, res) => {
    const id = parseInt(req.params.id);

    const rental = rentals.find(r => r.id === id);

    if (!rental) {
        return res.status(404).json({ error: 'Najam nije pronađen.' });
    }

    const { rentalStartDate, rentalEndDate } = req.body;

    if (!rentalStartDate || !rentalEndDate) {
        return res.status(400).json({ error: 'Nedostaju datumi.' });
    }

    if (new Date(rentalEndDate) < new Date(rentalStartDate)) {
        return res.status(400).json({ error: 'Završni datum mora biti nakon početnog.' });
    }

    const boat = boats.find(b => b.id === rental.boatId);
    const days = dateDiffInDays(rentalStartDate, rentalEndDate);
    const totalPrice = days * boat.cijenaPoDanu;

    rental.rentalStartDate = rentalStartDate;
    rental.rentalEndDate = rentalEndDate;
    rental.totalPrice = totalPrice;

    res.status(200).json(rental);
});

export default router;
