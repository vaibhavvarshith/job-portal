const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Internship = require('../models/Internship');

/**
 * @route   POST /api/internships/post
 * @desc    Create a new internship posting
 * @access  Private (Recruiter)
 */
router.post('/post', auth, async (req, res) => {
    if (req.user.role !== 'recruiter') {
        return res.status(403).json({ message: 'Access denied.' });
    }
    try {
        const newInternship = new Internship({ ...req.body, postedBy: req.user.id });
        await newInternship.save();
        res.status(201).json({ message: 'Internship posted successfully!', internship: newInternship });
    } catch (error) {
        console.error('Internship posting error:', error);
        res.status(500).json({ message: 'Server error while posting internship.' });
    }
});

module.exports = router;
