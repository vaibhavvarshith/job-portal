const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Job = require('../models/Job');

/**
 * @route   POST /api/jobs/post
 * @desc    Create a new job posting
 * @access  Private (Recruiter)
 */
router.post('/post', auth, async (req, res) => {
  if (req.user.role !== 'recruiter') {
    return res.status(403).json({ message: 'Access denied. Only recruiters can post jobs.' });
  }
  try {
    const newJob = new Job({ ...req.body, postedBy: req.user.id });
    await newJob.save();
    res.status(201).json({ message: 'Job posted successfully!', job: newJob });
  } catch (error) {
    console.error('Job posting error:', error);
    res.status(500).json({ message: 'Server error while posting job.' });
  }
});

module.exports = router;
