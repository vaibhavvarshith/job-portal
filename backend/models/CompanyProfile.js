const mongoose = require('mongoose');

const companyProfileSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    companyName: { type: String, required: true, default: 'My Company' },
    website: { type: String },
    industry: { type: String },
    companySize: { type: String },
    foundedYear: { type: String },
    tagline: { type: String },
    description: { type: String },
    addressLine1: { type: String },
    addressLine2: { type: String },
    city: { type: String },
    state: { type: String },
    zipCode: { type: String },
    country: { type: String },
    contactEmail: { type: String },
    contactPhone: { type: String },
    logoUrl: { type: String },
    bannerUrl: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('CompanyProfile', companyProfileSchema);
