const mongoose = require('mongoose');

const leaveSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    leaveDate: { type: Date, required: true },
    compOff: { type: String, required: true }
});

module.exports = mongoose.model('LeaveDetails', leaveSchema);