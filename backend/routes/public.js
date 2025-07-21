const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Job = require("../models/Job");
const Internship = require("../models/Internship");

/**
 * @route   GET /api/public/stats
 * @desc    Get public statistics for the landing page
 * @access  Public
 */
router.get("/stats", async (req, res) => {
  try {
    const studentCount = await User.countDocuments({ role: "student" });
    const recruiterCount = await User.countDocuments({ role: "recruiter" });
    const jobCount = await Job.countDocuments();
    const internshipCount = await Internship.countDocuments();

    res.json({
      students: studentCount,
      recruiters: recruiterCount,
      jobs: jobCount + internshipCount,
    });
  } catch (error) {
    console.error("Error fetching public stats:", error);
    res.status(500).json({ message: "Server error." });
  }
});

module.exports = router;
