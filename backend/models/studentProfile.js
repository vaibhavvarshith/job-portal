const mongoose = require('mongoose');

// Education के लिए सब-स्कीमा
const educationSchema = new mongoose.Schema({
    institution: { type: String, required: true },
    degree: { type: String, required: true },
    field: { type: String },
    gradYear: { type: String },
    gpa: { type: String },
});

// Experience के लिए सब-स्कीमा
const experienceSchema = new mongoose.Schema({
    company: { type: String, required: true },
    title: { type: String, required: true },
    startDate: { type: String },
    endDate: { type: String },
    description: { type: String },
});

// मुख्य Student Profile स्कीमा
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

module.exports = mongoose.model('StudentProfile', studentProfileSchema);
