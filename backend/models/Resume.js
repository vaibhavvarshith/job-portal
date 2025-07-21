const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Assuming 'User' model represents students
        required: true
    },
    name: { // User-given name for the resume
        type: String,
        required: true
    },
    fileName: { // Original file name (e.g., "my_resume.pdf")
        type: String,
        required: true
    },
    url: { // URL to the stored resume file (e.g., Cloudinary URL)
        type: String,
        required: true
    },
    size: { // File size (e.g., "245KB")
        type: String
    },
    mimeType: { // File type (e.g., "application/pdf")
        type: String
    },
    isDefault: { // Whether this is the student's default resume
        type: Boolean,
        default: false
    },
    // For AI-generated resumes, you might store more metadata or a reference to the AI data
    isAIGenerated: {
        type: Boolean,
        default: false
    }
}, { timestamps: true }); // Adds createdAt and updatedAt

module.exports = mongoose.models.Resume || mongoose.model('Resume', resumeSchema);
