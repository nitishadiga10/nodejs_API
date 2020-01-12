const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const TaskDetails = require('..//.//models/tasksDetails');

router.get('/', (req, res, next) => {
    TaskDetails.find()
        .exec()
        .then(docs => {
            console.log(docs);
            res.status(201).json({
                message: 'found the tasks',
                tasks: docs
            })
        }
        )
});
router.get('/:id', (req, res, next) => {
    const id = req.params.id;
    TaskDetails.findById(id)
        .exec()
        .then(doc => {
            console.log(doc);
            res.status(201).json({
                message: 'found the task you were looking for',
                Task: doc
            })
        }
        )
})
router.post('/', (req, res, next) => {
    console.log(req.body);
    const tasksDetails = new TaskDetails({
        _id: new mongoose.Types.ObjectId(),
        refNumber: req.body.refNumber,
        reqSummary: req.body.reqSummary,
        reqstate: req.body.reqstate,
        assignedTo: req.body.assignedTo,
        application: req.body.application,
        ticketType: req.body.ticketType,
        createDate: req.body.createDate,
        closeDate: req.body.closeDate,
        reqBy: req.body.reqBy,
        priority: req.body.priority,
        purpose: req.body.purpose,
        comments: req.body.comments,
        efforts: req.body.efforts
    })
    tasksDetails.save()
        .then(
            result => {
                console.log(result);
                res.status(201).json({
                    message: 'Task Details saved Successfully',
                    CreatedTask: result,
                    request: {
                        tyoe: 'GET',
                        URl: 'http://localhost:8000/taskDetails/' + result.id
                    }
                });
            }
        )
        .catch(
            err => {
                console.log(err);
                res.status(500).json({
                    error: err
                });
            }
        )
});
router.patch('/:id', (req, res, next) => {
    const id = req.params.id;
    const updateOps = {};
    // for (const ops of req.body) {
    //     updateOps[ops.propName] = ops.value;
    // }
    // TaskDetails.updateOne({ _id: id }, { $set: updateOps })
    TaskDetails.updateOne({ _id: id }, {
        $set: {
            refNumber: req.body.refNumber,
            reqSummary: req.body.reqSummary,
            reqstate: req.body.reqstate,
            assignedTo: req.body.assignedTo,
            application: req.body.application,
            ticketType: req.body.ticketType,
            createDate: req.body.createDate,
            closeDate: req.body.closeDate,
            reqBy: req.body.reqBy,
            priority: req.body.priority,
            purpose: req.body.purpose,
            comments: req.body.comments,
            efforts: req.body.efforts
        }
    })

        .exec()
        .then(result => {
            res.status(200).json({
                message: 'updated Task Details successfully',
                result: result,
                request: {
                    type: 'GET',
                    Description: "Get the updated Task Details",
                    url: 'http://localhost:8000/taskDetails/' + id
                }
            })
        })
        .catch(err => {
            res.status(500).json({
                message: 'Task Details not updated successfully',
                error: err
            })
        })


});

module.exports = router;
