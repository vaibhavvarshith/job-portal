const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job' },
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    recruiterId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, required: true, default: 'New' },
}, { timestamps: true });

module.exports = mongoose.model('Application', applicationSchema);
