const mongoose = require('mongoose');
const config = require('./config');

const { db: { host, port, name: dbname } } = config;

(async function () {
    try {
        await mongoose.connect(`mongodb://${host}:${port}/${dbname}`, { 
            useNewUrlParser: true, 
            useUnifiedTopology: true, 
            useCreateIndex: true,
            useFindAndModify: false
        });
        console.log(`Connected to mongo ${process.env.NODE_ENV} server`);
    } catch (error) {
        console.log(error);
    }
})();