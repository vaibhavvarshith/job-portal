const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); // Check this path
const Application = require('../models/Application'); // Check this path

/**
 * @route   GET /api/applications/recruiter
 * @desc    Get all applications for jobs posted by the logged-in recruiter
 * @access  Private (Recruiter)
 */
router.get('/recruiter', auth, async (req, res) => {
    if (req.user.role !== 'recruiter') {
        return res.status(403).json({ message: 'Access denied.' });
    }
    try {
        const applications = await Application.find({ recruiterId: req.user.id })
            .populate('studentId', 'name email')
            .populate('jobId', 'jobTitle jobType');
        res.status(200).json(applications);
    } catch (error) {
        console.error('Error fetching applications:', error);
        res.status(500).json({ message: 'Server error.' });
    }
});

/**
 * @route   PATCH /api/applications/:id/status
 * @desc    Update the status of an application
 * @access  Private (Recruiter)
 */
router.patch('/:id/status', auth, async (req, res) => {
    if (req.user.role !== 'recruiter') {
        return res.status(403).json({ message: 'Access denied.' });
    }
    try {
        const { status } = req.body;
        const { id } = req.params;
        const application = await Application.findOne({ _id: id, recruiterId: req.user.id });
        if (!application) {
            return res.status(404).json({ message: 'Application not found or you do not have permission to update it.' });
        }
        application.status = status;
        await application.save();
        res.status(200).json({ message: 'Application status updated successfully.', application });
    } catch (error) {
        console.error('Error updating application status:', error);
        res.status(500).json({ message: 'Server error.' });
    }
});

module.exports = router;
