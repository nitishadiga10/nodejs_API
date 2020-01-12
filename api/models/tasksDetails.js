const mongoose = require('mongoose');

const taskSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    refNumber: { type: String, required: true },
    reqSummary: { type: String, required: true },
    reqstate: { type: String, required: true },
    assignedTo: { type: String, required: true },
    application: { type: String, required: true },
    ticketType: { type: String, required: true },
    createDate: { type: Date, required: true },
    closeDate: { type: Date, required: true },
    reqBy: { type: String, required: true },
    priority: { type: String, required: true },
    purpose: { type: String, required: true },
    comments: { type: String, required: true },
    efforts: { type: Number, required: true }

});

module.exports = mongoose.model('TaskDetails', taskSchema);