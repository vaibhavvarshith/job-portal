const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Job = require("../models/Job");
const Internship = require("../models/Internship");
const Application = require("../models/Application");

/**
 * @route   GET /api/recruiter/dashboard-stats
 * @desc    Get key statistics for the recruiter dashboard
 * @access  Private (Recruiter)
 */
router.get("/dashboard-stats", auth, async (req, res) => {
  if (req.user.role !== "recruiter") {
    return res.status(403).json({ message: "Access denied." });
  }
  try {
    const recruiterId = req.user.id;
    const activeJobs = await Job.countDocuments({ postedBy: recruiterId });
    const activeInternships = await Internship.countDocuments({
      postedBy: recruiterId,
    });
    const totalApplications = await Application.countDocuments({
      recruiterId: recruiterId,
    });
    const shortlisted = await Application.countDocuments({
      recruiterId: recruiterId,
      status: "Shortlisted",
    });

    res.json({
      activeListings: activeJobs + activeInternships,
      totalApplications,
      shortlisted,
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    res.status(500).json({ message: "Server error." });
  }
});

/**
 * @route   GET /api/recruiter/recent-applications
 * @desc    Get the 5 most recent applications for the recruiter
 * @access  Private (Recruiter)
 */
router.get("/recent-applications", auth, async (req, res) => {
  if (req.user.role !== "recruiter") {
    return res.status(403).json({ message: "Access denied." });
  }
  try {
    const recentApplications = await Application.find({
      recruiterId: req.user.id,
    })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("studentId", "name")
      .populate("jobId", "jobTitle");
    res.json(recentApplications);
  } catch (error) {
    console.error("Error fetching recent applications:", error);
    res.status(500).json({ message: "Server error." });
  }
});

module.exports = router;
