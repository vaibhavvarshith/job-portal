const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Application = require('../models/Application');
const Job = require('../models/Job');
const User = require('../models/User');

// Yeh log batayega ki file server mein load hui ya nahi
console.log("✅ Student routes file loaded and is being registered.");

/**
 * @route   GET /api/student/dashboard
 * @desc    Get all data needed for the student dashboard
 * @access  Private (Student)
 */
router.get('/dashboard', auth, async (req, res) => {
    if (!req.user || req.user.role !== 'student') {
        return res.status(403).json({ message: 'Access denied.' });
    }

    try {
        const studentId = req.user.id;

        const [
            appliedCount,
            interviewsCount,
            rejectedCount,
            recommendedJobs,
            student
        ] = await Promise.all([
            Application.countDocuments({ studentId }),
            Application.countDocuments({ studentId, status: 'Interview Scheduled' }),
            Application.countDocuments({ studentId, status: 'Rejected' }),
            Job.find().sort({ createdAt: -1 }).limit(3),
            User.findById(studentId).select('name')
        ]);

        res.json({
            studentName: student ? student.name : 'Student',
            profileCompletion: 75, // Placeholder
            applicationStatus: {
                applied: appliedCount,
                interviews: interviewsCount,
                rejected: rejectedCount,
                offers: 0, // Placeholder
            },
            recommendedJobs,
            recentActivity: [ // Placeholder
                { id: 1, text: 'Your application for Software Engineer was viewed.', time: '2 hours ago', icon: 'fas fa-eye' },
                { id: 2, text: 'New job match: UI/UX Designer at CreativeMinds.', time: '1 day ago', icon: 'fas fa-bullseye' },
            ]
        });

    } catch (error) {
        console.error('Error in /api/student/dashboard route:', error);
        res.status(500).json({ 
            message: 'Server error while fetching dashboard data.',
            error: error.message
        });
    }
});

module.exports = router;
