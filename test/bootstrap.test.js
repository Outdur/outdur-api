const mongoose = require('mongoose');
const fs = require('fs');

const fixtures = {};

before(async() => {
    try {
        await mongoose.connect('mongodb://localhost:27017/outdurTestBd', { 
            useNewUrlParser: true, 
            useUnifiedTopology: true, 
            useCreateIndex: true,
            useFindAndModify: false
        });
        console.log('Connected to Test mongo DB');
    } catch (error) {
        console.log(error);
    }

    fs.readdirSync('test/fixtures').filter(name => require('path').extname(name) === '.json').forEach(name => { 
        fixtures[name.split('.')[0]] = require(`./fixtures/${name}`);
    });

    global.fixtures = fixtures;       
});


after(async () => {
    console.log('Shutting down test...')

    // empty collections and delete database
    const collections = Object.keys(mongoose.connection.collections);
    for (const collectionName of collections) {
        const collection = mongoose.connection.collections[collectionName];
        try {
            await collection.drop();
        } catch (error) {
            if (error.message === "ns not found") return;

            if (error.message.includes("a background operation is currently running"))
            return;

            console.log(error.message);
        }
    }
    // await testDB.connection.db.dropDatabase();
    await testDB.connection.close();
});