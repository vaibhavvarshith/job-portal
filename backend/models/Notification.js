const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Assuming User model is used for students
        required: true
    },
    type: { // e.g., 'application_update', 'new_job_match', 'resume_viewed', 'interview_reminder'
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    read: {
        type: Boolean,
        default: false
    },
    link: { // Optional link to related page (e.g., /student-applications)
        type: String
    },
    icon: { // Optional Font Awesome icon class (e.g., 'fas fa-briefcase')
        type: String
    }
}, { timestamps: true }); // createdAt and updatedAt will be added automatically

module.exports = mongoose.models.Notification || mongoose.model('Notification', notificationSchema);
