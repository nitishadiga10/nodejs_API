const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/order');
const userRoutes = require('./api/routes/user');
const taskRoutes = require('./api/routes/taskDetails');
const leaveRoutes = require('./api/routes/leaveDetails');

const uri = 'mongodb+srv://admin:' + process.env.MONGO_ATLAS_PW + '@stats-ieo8c.mongodb.net/test?retryWrites=true&w=majority';

const options = { useNewUrlParser: true, useUnifiedTopology: true, useUnifiedTopology: true };

mongoose.connect(process.env.MONGODB_URI || uri, options);
mongoose.Promise = global.Promise;
app.use(cors());
app.use(morgan('dev'));
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// app.use((req, res, next) => {
//     res.header('Access-Control-Allow-Origin', '*'); // add any url to allow it access instead of *
//     res.header('Access-Control-Allow-Headers', 'Origin,X-Requested-With, Content-Type,Accept,Authorization');
//     if (req.method === 'Options') {
//         res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
//         return res.status(200).json({});
//     }
//     next();
// });

app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/user', userRoutes);
app.use('/taskDetails', taskRoutes);
app.use('/leaveDetails', leaveRoutes);

app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
});
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

module.exports = app;