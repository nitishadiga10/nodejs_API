// const express = require('express');
// const router = express.Router();
// const mongoose = require('mongoose');
// const multer = require('multer');
// const checkAuth = require('../middleware/check-auth');

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, 'uploads/');
//     },
//     filename: function (req, file, cb) {
//         cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname);
//     }
// });

// const fileFilter = (req, file, cb) => {
//     if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
//         cb(null, true); // stores the file
//     } else {
//         cb(null, false); // rejects the file
//     }
// }
// const upload = multer(
//     { storage: storage, limit: { fileSize: 1024 * 1024 }, fileFilter: fileFilter }
// );


// exports.product_post = checkAuth, upload.single('productImage'), (req, res, next) => {
//     console.log(req.file);
//     const product = new Product({
//         _id: new mongoose.Types.ObjectId(),
//         name: req.body.name,
//         price: req.body.price,
//         productImage: req.file.path
//     })
//     product.save()
//         .then(
//             result => {
//                 console.log(result);
//                 res.status(201).json({
//                     message: 'Product created successfully',
//                     createdproduct: {
//                         name: result.name,
//                         price: result.price,
//                         id: result._id,
//                         request: {
//                             type: 'GET',
//                             url: 'http://localhost:8000/products/' + result._id
//                         }
//                     }
//                 });
//             })
//         .catch(err => {
//             console.log(err);
//             res.status(500).json({
//                 error: err
//             })
//         });
// }