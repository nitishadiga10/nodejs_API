const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');

const Order = require('.././models/order');

router.get('/', (req, res, next) => {
    Order.find()
        .select('quantity _id product')
        .populate('product','name price')
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                products: docs.map(
                    doc => {
                        return {
                            quantity: doc.quantity,
                            _id: doc._id,
                            productid: doc.product,
                            request: {
                                type: 'GET',
                                url: 'http://localhost:8000/orders/' + doc._id
                            }
                        }
                    }
                ),
            }
            if (docs.length >= 0) {
                console.log(docs);
                res.status(200).json({
                    message: "Orders found",
                    response: response
                })
            }
            else {
                console.log(docs);
                res.status(400).json({
                    message: "Orders not found",
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
    Order.findById(id)
        .select('_id quantity product')
        .populate('product','name price')
        .exec()
        .then(
            doc => {
                console.log(doc);
                if (doc) {
                    res.status(200).json({
                        message: "found the Order",
                        doc: doc,
                        request: {
                            type: 'GET',
                            Description: "Get all Orders",
                            url: 'http://localhost:8000/orders/'
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
});
router.post('/', (req, res, next) => {
    const order = new Order({
        _id: new mongoose.Types.ObjectId(),
        quantity: req.body.quantity,
        product: req.body.productId
    })
    order.save()
        .then(
            result => {
                console.log(result);
                res.status(201).json({
                    message: 'Order created successfully',
                    createdproduct: {
                        name: result.name,
                        price: result.price,
                        id: result._id,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:8000/orders/' + result._id
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
    Order.updateOne({ _id: id }, { $set: updateOps })
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'updated Orders successfully',
                result: result,
                request: {
                    type: 'GET',
                    Description: "Get all Orders",
                    url: 'http://localhost:8000/orders/' + id
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
        message: 'handling put requests for orders'
    });
});
router.delete('/:id', (req, res, next) => {
    const id = req.params.id;
    Order.deleteOne({ _id: id })
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Products deleted',
                result: result,
                request: {
                    type: 'POST',
                    Description: "Get all Orders",
                    url: 'http://localhost:8000/orders/',
                    body: {
                        "product": "number", "quantity": "number"
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