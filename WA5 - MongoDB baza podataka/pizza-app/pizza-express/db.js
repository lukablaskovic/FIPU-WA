import { MongoClient } from 'mongodb';

import { config } from 'dotenv';

config();

const username = process.env.USERNAME;
const password = process.env.PASSWORD;
const cluster = process.env.MONGO_CLUSTER;

const mongoURI = `mongodb+srv://${username}:${password}@${cluster.toLowerCase()}.pmzcqdx.mongodb.net/?appName=${cluster}`;

console.log(mongoURI);

async function connectToDatabase() {
    try {
        const client = new MongoClient(mongoURI);
        await client.connect();
        console.log('Uspješno spajanje na MongoDB bazu!');
        let db = client.db('pizza_db');
        return db;
    } catch (error) {
        console.error(`Došlo je do greške pri spajanju na bazu! Greška: ${error}`);
        throw error;
    }
}

export default connectToDatabase;
