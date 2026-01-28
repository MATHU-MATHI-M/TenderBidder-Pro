const { MongoClient } = require('mongodb');

// Hardcoded URI to ensure we test exactly what we think we are testing
const uri = "mongodb://tenderbidder:tenderbidder@ac-htg3fup-shard-00-00.nbjcx77.mongodb.net:27017,ac-htg3fup-shard-00-01.nbjcx77.mongodb.net:27017,ac-htg3fup-shard-00-02.nbjcx77.mongodb.net:27017/?replicaSet=atlas-4ispax-shard-0&ssl=true&authSource=admin&appName=tenderbidder";

console.log('Testing connection to:', uri.replace(/:([^:@]+)@/, ':****@'));

const client = new MongoClient(uri, {
    connectTimeoutMS: 5000,
    socketTimeoutMS: 5000,
});

async function run() {
    try {
        console.log('Connecting...');
        await client.connect();
        console.log('Connected successfully!');
        const db = client.db('admin');
        const result = await db.command({ ping: 1 });
        console.log('Ping result:', result);
    } catch (err) {
        console.error('Connection failed:', err);
    } finally {
        await client.close();
    }
}

run();
