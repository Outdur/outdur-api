const mongoose = require('mongoose');

(async function () {
    try {
        await mongoose.connect('mongodb://localhost:27017/outdur', { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });
        //delete mongoose.connection.models['Organisation'];
        console.log('Connected to mongo');
    } catch (error) {
        console.log(error);
    }
})();

mongoose.connection.on('error', (err: any) => {
    console.log(err);
});