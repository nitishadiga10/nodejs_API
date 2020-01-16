const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const LeaveDetails = require('..//.//models/leaveDetails');

router.get('/', (req, res, next) => {
    LeaveDetails.find()
        .exec()
        .then(docs => {
            // console.log(docs);
            res.status(201).json({
                message: 'found the Leaves',
                Leaves: docs
            })
        }
        )
});
router.get('/:id', (req, res, next) => {
    const id = req.params.id;
    LeaveDetails.findById(id)
        .exec()
        .then(doc => {
            console.log(doc);
            res.status(201).json({
                message: 'found the Leave you were looking for',
                Leave: doc
            })
        }
        )
})
router.post('/', (req, res, next) => {
    console.log(req.body);
    async function handlePost(req) {
        var finalresult = [];
        for (i = 0; i < req.body.length; i++) {
            // try {
            const leaveDetails = new LeaveDetails({
                _id: new mongoose.Types.ObjectId(),
                leaveDate: req.body[i].leaveDate,
                compOff: req.body[i].compOff,
            })
            await leaveDetails.save()
                .then(
                    result => {
                        finalresult.push(result);
                        console.log("result array 1", finalresult);
                    }
                )
            // }
            // catch (error) {
            // console.log("error in for loop", error);
            // }
        }
        console.log("result array 2", finalresult);
        return finalresult;
    }
    handlePost(req)
        .then(finalresult => {
            console.log("result array 3", finalresult);
            res.status(201).json({
                message: 'Leave Details saved Successfully',
                CreatedLeaves: finalresult,
                request: {
                    type: 'GET',
                    URl: 'http://localhost:8000/leaveDetails/'
                }
            })
        })
        .catch(
            err => {
                console.log(err);
                res.status(500).json({
                    error: err
                });
            }
        )
})
router.delete('/:id', (req, res, next) => {
    const id = req.params.id;
    LeaveDetails.deleteOne({ _id: id })
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Leave deleted',
                result: result,
                request: {
                    type: 'POST',
                    Description: "Get all Leaves",
                    url: 'http://localhost:8000/leaveDetails/',
                    body: [{
                        "leaveDate": "Date", "compOff": "string"
                    }]
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
