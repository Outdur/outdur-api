const mongoose = require('mongoose');

(async function () {
    try {
        await mongoose.connect('mongodb://localhost:27017/outdur', { 
            useNewUrlParser: true, 
            useUnifiedTopology: true, 
            useCreateIndex: true,
            useFindAndModify: false
        });
        console.log('Connected to mongo');
    } catch (error) {
        console.log(error);
    }
})();