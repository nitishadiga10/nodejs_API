const express = require('express');
const router = express.Router();
const mongodb = require('mongodb').MongoClient;

const uri = 'mongodb+srv://admin:' + process.env.MONGO_ATLAS_PW + '@stats-ieo8c.mongodb.net/test?retryWrites=true&w=majority';

const options = { useNewUrlParser: true, useUnifiedTopology: true, useUnifiedTopology: true };

mongodb.connect(uri, options, (err, client) => {
    if (err) {
        return console.log('Not connected to Mongo: ')
    };
    if (client) {
        return console.log('connected to Mongo')
    }
});

router.post('/', (req, res, next) => {
    console.log(req.body);
});


module.exports = router;
