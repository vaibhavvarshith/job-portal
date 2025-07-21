const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Application = require('../models/Application');

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
        console.error('Error fetching applications for recruiter:', error);
        res.status(500).json({ message: 'Server error.' });
    }
});

/**
 * @route   PATCH /api/applications/:id/status
 * @desc    Update the status of an application.
 * Allowed for Recruiter (any status) or Student (to 'Withdrawn' only for their own app).
 * @access  Private (Recruiter or Student)
 */
router.patch('/:id/status', auth, async (req, res) => {
    const { status } = req.body;
    const { id } = req.params;

    try {
        let application = await Application.findById(id);

        if (!application) {
            return res.status(404).json({ message: 'Application not found.' });
        }

                if (req.user.role === 'recruiter') {
                        if (application.recruiterId.toString() !== req.user.id) {
                return res.status(403).json({ message: 'Access denied. You do not have permission to update this application.' });
            }
            application.status = status;
        } 
                else if (req.user.role === 'student') {
                        if (application.studentId.toString() !== req.user.id) {
                return res.status(403).json({ message: 'Access denied. You can only withdraw your own applications.' });
            }
            if (status !== 'Withdrawn') {
                return res.status(403).json({ message: 'Access denied. Students can only change status to "Withdrawn".' });
            }
            application.status = status;
        } 
                else {
            return res.status(403).json({ message: 'Access denied. Unauthorized role.' });
        }

        await application.save();
        res.status(200).json({ message: 'Application status updated successfully.', application });

    } catch (error) {
        console.error('Error updating application status:', error);
        res.status(500).json({ message: 'Server error.' });
    }
});

module.exports = router;
