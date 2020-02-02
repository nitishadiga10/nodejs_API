const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('..//.//models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
router.get('/', (req, res, next) => {
    User.find()
        .select('_id email password')
        .exec()
        .then(users => {
            const response = {
                count: users.length,
                users: users.map(
                    user => {
                        return {
                            email: user.email,
                            password: user.password,
                            _id: user._id,
                            request: {
                                type: 'GET',
                                url: 'http://localhost:8000/user/' + user._id
                            }
                        }
                    }
                ),
            }
            if (users.length >= 0) {
                console.log(users);
                res.status(200).json({
                    message: "Users found",
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
    User.findById(id)
        .select('_id email password')
        .exec()
        .then(
            user => {
                console.log(user);
                if (user) {
                    res.status(200).json({
                        message: "found the User",
                        user: user,
                        request: {
                            type: 'GET',
                            Description: "Get all users",
                            url: 'http://localhost:8000/user/'

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
router.post('/login', (req, res, next) => {
    User.find({ email: req.body.email }) //check if email already exists on the database
        .exec()
        .then(user => {
            if (user.length < 1) {
                return res.status(409).json({
                    message: "auth failed"
                })
            } else {
                bcrypt.compare(req.body.password, user[0].password, (err, result) => {
                    if (err) {
                        return res.status(500).json({
                            error: err
                        })
                    }
                    if (result) {
                        const token = jwt.sign({
                            email: user[0].email,
                            userId: user[0]._id
                        }, process.env.JWT_KEY, {
                                expiresIn: "1h"
                            });
                        return res.status(200).json({
                            message: "login successful",
                            result: result,
                            jwt: token
                        })
                    }
                    res.status(200).json({
                        message: "login failed"
                    })
                });
            }
        })
        .catch()

});
router.post('/signup', (req, res, next) => {
    console.log('user data:' , req.body);
    User.find({ email: req.body.email }) //check if email already exists on the database
        .exec()
        .then(user => {
            if (user.length >= 1) {
                return res.status(409).json({
                    message: "auth failed"
                })
            } else {
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        return res.status(500).json({
                            error: err
                        })
                    }
                    else {
                        const user = new User({
                            _id: new mongoose.Types.ObjectId(),
                            email: req.body.email,
                            firstName: req.body.firstName,
                            lastName: req.body.lastName,
                            password: hash
                        })
                        user.save().then(
                            result => {
                                console.log(result);
                                res.status(201).json({
                                    message: 'User created successfully',
                                    createdUser: {
                                        email: result.email,
                                        password: result.password,
                                        id: result._id,
                                        request: {
                                            type: 'GET',
                                            url: 'http://localhost:8000/user/' + result._id
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
                    }
                });
            }
        })
        .catch()

});
router.delete('/:userId', (req, res, next) => {
    const userId = req.params.userId;
    Product.deleteOne({ _id: id })
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'User deleted',
                result: result,
                request: {
                    type: 'POST',
                    Description: "Get all Products",
                    url: 'http://localhost:8000/products/',
                    body: {
                        "email": "string", "password": "string"
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
