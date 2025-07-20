const mongoose = require('mongoose');

const internshipSchema = new mongoose.Schema({
    internshipTitle: { type: String, required: true },
    internshipDescription: { type: String, required: true },
    internshipType: { type: String, required: true },
    location: { type: String, required: true },
    duration: { type: String },
    companyName: { type: String },
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

module.exports = mongoose.model('Internship', internshipSchema);
