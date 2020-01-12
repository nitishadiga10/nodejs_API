const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true); // stores the file
    } else {
        cb(null, false); // rejects the file
    }
}
const upload = multer(
    { storage: storage, limit: { fileSize: 1024 * 1024 }, fileFilter: fileFilter }
);

const Product = require('..//.//models/products');

router.get('/', (req, res, next) => {
    Product.find()
        .select('_id name price productImage')
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                products: docs.map(
                    doc => {
                        return {
                            name: doc.name,
                            price: doc.price,
                            _id: doc._id,
                            productImage: doc.productImage,
                            request: {
                                type: 'GET',
                                url: 'http://localhost:8000/products/' + doc._id,
                                ImageURl: 'http://localhost:8000/' + doc.productImage
                            }
                        }
                    }
                ),
            }
            if (docs.length >= 0) {
                console.log(docs);
                res.status(200).json({
                    message: "products found",
                    response: response
                })
            }
            else {
                console.log(docs);
                res.status(400).json({
                    message: "products not found",
                    products: docs
                })
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        })
});
router.get('/:id', (req, res, next) => {
    const id = req.params.id;
    Product.findById(id)
        .select('_id name price productImage')
        .exec()
        .then(
            doc => {
                console.log(doc);
                if (doc) {
                    res.status(200).json({
                        message: "found the id",
                        doc: doc,
                        request: {
                            type: 'GET',
                            Description: "Get all Products",
                            url: 'http://localhost:8000/products/',
                            ImageURl: 'http://localhost:8000/' + doc.productImage

                        }
                    })
                }
                else {
                    res.status(200).json({
                        message: "product not found",
                        doc: doc
                    })
                }
            })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err })
        }
        );

    // const id = req.params.id;
    // if (id === "hello") {
    //     res.status(200).json({
    //         message: 'got the id:',
    //         id: id
    //     });
    // }
    // else {
    //     res.status(200).json({
    //         message: 'ID wasnt hello:',
    //         id: id
    //     });
    // }
});
router.post('/', checkAuth, upload.single('productImage'), (req, res, next) => {
    console.log(req.file);
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        productImage: req.file.path
    })
    product.save()
        .then(
            result => {
                console.log(result);
                res.status(201).json({
                    message: 'Product created successfully',
                    createdproduct: {
                        name: result.name,
                        price: result.price,
                        id: result._id,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:8000/products/' + result._id
                        }
                    }
                });
            })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        });
});

router.patch('/:id', (req, res, next) => {
    const id = req.params.id;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    // Product.update({ _id: id }, { $set: { name: "Lord of the Rings" } })
    Product.updateOne({ _id: id }, { $set: updateOps })
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'updated products successfully',
                result: result,
                request: {
                    type: 'GET',
                    Description: "Get all Products",
                    url: 'http://localhost:8000/products/' + id
                }
            })
        })
        .catch(err => {
            res.status(500).json({
                message: 'Products not updated successfully',
                error: err
            })
        })


});
router.put('/', (req, res, next) => {
    res.status(200).json({
        message: 'handling put requests for Products'
    });
});
router.delete('/:id', (req, res, next) => {
    const id = req.params.id;
    Product.deleteOne({ _id: id })
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Products deleted',
                result: result,
                request: {
                    type: 'POST',
                    Description: "Get all Products",
                    url: 'http://localhost:8000/products/',
                    body: {
                        "name": "string", "price": "number"
                    }
                }
            })
        })
        .catch(err => {
            res.status(500).json({
                message: 'product not deleted',
                error: err
            })
        });
});

module.exports = router;