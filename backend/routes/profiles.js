const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const CompanyProfile = require('../models/CompanyProfile');

/**
 * @route   GET /api/profile/recruiter
 * @desc    Get the company profile for the logged-in recruiter
 * @access  Private (Recruiter)
 */
router.get('/recruiter', auth, async (req, res) => {
    if (req.user.role !== 'recruiter') {
        return res.status(403).json({ message: 'Access denied.' });
    }
    try {
        const profile = await CompanyProfile.findOne({ user: req.user.id });
        if (!profile) {
            return res.status(404).json({ message: 'No company profile found for this recruiter.' });
        }
        res.json(profile);
    } catch (error) {
        console.error('Error fetching company profile:', error);
        res.status(500).json({ message: 'Server error.' });
    }
});

/**
 * @route   POST /api/profile/recruiter
 * @desc    Create or update a company profile for the logged-in recruiter
 * @access  Private (Recruiter)
 */
router.post('/recruiter', auth, async (req, res) => {
    if (req.user.role !== 'recruiter') {
        return res.status(403).json({ message: 'Access denied.' });
    }
    try {
        const profileData = { ...req.body, user: req.user.id };
        const profile = await CompanyProfile.findOneAndUpdate(
            { user: req.user.id },
            { $set: profileData },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );
        res.status(200).json({ message: 'Profile updated successfully!', profile });
    } catch (error) {
        console.error('Error updating company profile:', error);
        res.status(500).json({ message: 'Server error.' });
    }
});

module.exports = router;
