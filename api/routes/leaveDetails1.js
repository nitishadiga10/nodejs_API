const express = require('express');
const router = express.Router();
const mongodb = require('mongodb').MongoClient;

const uri = 'mongodb+srv://admin:' + process.env.MONGO_ATLAS_PW + '@stats-ieo8c.mongodb.net/test?retryWrites=true&w=majority';

const options = { useNewUrlParser: true, useUnifiedTopology: true, useUnifiedTopology: true };
const client = new mongodb(uri, options);
try {
    client.connect();
    console.log('connected to Mongo ');
}
catch (error) {
    console.log('Not connected to Mongo: ')
}
finally {
    client.close()
}

router.post('/', (req, res, next) => {
    console.log(req.body);
    res.status(200).json({
        message: "data recieved and posted on to DB"
    })
});


module.exports = router;
