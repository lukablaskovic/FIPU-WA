import express from 'express';
import pizzeRouter from './routes/pizze.js';
import narudzbeRouter from './routes/narudzbe.js';
import cors from 'cors';

const app = express();
const PORT = 3000;

const corsOptions = {
    origin: ['http://localhost:5173']
};

app.use(cors(corsOptions));
app.use(express.json());

app.use('/pizze', pizzeRouter);
app.use('/narudzbe', narudzbeRouter);

app.use;
app.get('/', (req, res) => {
    res.send('Dobrodošli u Pizza Express poslužitelj!');
});

app.listen(PORT, () => {
    console.log(`Pizza poslužitelj sluša na portu ${PORT}`);
});
