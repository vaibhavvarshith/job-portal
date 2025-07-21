const mongoose = require('mongoose');

// Sub-schema for Education
const educationSchema = new mongoose.Schema({
    institution: { type: String, required: true },
    degree: { type: String, required: true },
    field: { type: String },
    gradYear: { type: String },
    gpa: { type: String },
});

// Sub-schema for Experience
const experienceSchema = new mongoose.Schema({
    company: { type: String, required: true },
    title: { type: String, required: true },
    startDate: { type: String },
    endDate: { type: String },
    description: { type: String },
});

// Main Student Profile Schema
const studentProfileSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    fullName: { type: String, required: true },
    phone: { type: String },
    linkedin: { type: String },
    github: { type: String },
    portfolio: { type: String },
    bio: { type: String },
    profilePicture: { type: String, default: 'https://placehold.co/120x120/15803D/FFFFFF?text=JD' },
    education: [educationSchema],
    experience: [experienceSchema],
    skills: [String],
}, { timestamps: true });

// Check if the model already exists before compiling it
// This prevents the OverwriteModelError when the model is required multiple times
module.exports = mongoose.models.StudentProfile || mongoose.model('StudentProfile', studentProfileSchema);
