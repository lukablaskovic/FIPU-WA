import express from 'express';
import path from 'path';

// ovo nije export default
//import { router } from "./routes/boats.js"

// export default
import boatRouter from './routes/boats.js';
import rentalsRouter from './routes/rentals.js';

const app = express();
app.use(express.json());
app.use('/boats', boatRouter);
app.use('/rentals', rentalsRouter);

const PORT = 3000;

// path.resolve; uzima relativnu i vraća apsolutnu

let relativna = path.join('public', 'index.html');
let apsolutna = path.resolve(relativna);

app.get('/', (req, res) => {
    res.status(200).sendFile(apsolutna);
});

app.listen(PORT, error => {
    if (error) {
        console.error('Greška u pokretanju...');
    }
    console.log(`Poslužitelj sluša na ${PORT}`);
});

// Postman
// https://www.postman.com/lblaskovi-9628038/workspace/rent-a-boat-luka-blaskovic
