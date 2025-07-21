const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const CompanyProfile = require('../models/CompanyProfile');
const StudentProfile = require('../models/studentProfile');
const User = require('../models/User');

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
        const profile = await CompanyProfile.findOne({ user: req.user.id }).populate('user', 'email');
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

                await User.findByIdAndUpdate(
            req.user.id,
            { companyProfile: profile._id },
            { new: true }
        );

        const populatedProfile = await CompanyProfile.findById(profile._id).populate('user', 'email');

        res.status(200).json({ message: 'Profile updated successfully!', profile: populatedProfile });
    } catch (error) {
        console.error('Error updating company profile:', error);
        res.status(500).json({ message: 'Server error.' });
    }
});

/**
 * @route   GET /api/profile/student
 * @desc    Get the student profile for the logged-in student
 * @access  Private (Student)
 */
router.get('/student', auth, async (req, res) => {
    if (req.user.role !== 'student') {
        return res.status(403).json({ message: 'Access denied.' });
    }
    try {
        const profile = await StudentProfile.findOne({ user: req.user.id }).populate('user', 'email');
        if (!profile) {
            return res.status(404).json({ message: 'No student profile found for this user.' });
        }
        res.json(profile);
    } catch (error) {
        console.error('Error fetching student profile:', error);
        res.status(500).json({ message: 'Server error.' });
    }
});

/**
 * @route   POST /api/profile/student
 * @desc    Create or update a student profile for the logged-in student
 * @access  Private (Student)
 */
router.post('/student', auth, async (req, res) => {
    if (req.user.role !== 'student') {
        return res.status(403).json({ message: 'Access denied.' });
    }
    try {
        const { email, ...restOfProfileData } = req.body; 

        const profileData = { ...restOfProfileData, user: req.user.id };
        
        const profile = await StudentProfile.findOneAndUpdate(
            { user: req.user.id },
            { $set: profileData },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );

        const populatedProfile = await StudentProfile.findById(profile._id).populate('user', 'email');

        res.status(200).json({ message: 'Profile updated successfully!', profile: populatedProfile });
    } catch (error) {
        console.error('Error updating student profile:', error);
        res.status(500).json({ message: 'Server error.' });
    }
});

module.exports = router;
