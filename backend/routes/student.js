const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const StudentProfile = require('../models/studentProfile');
const Application = require('../models/Application');
const Job = require('../models/Job');
const Internship = require('../models/Internship'); const User = require('../models/User');
const CompanyProfile = require('../models/CompanyProfile');
const Notification = require('../models/Notification'); 
/**
 * @route   GET /api/student/dashboard
 * @desc    Get student dashboard data (profile completion, application stats, recent activity, recommended jobs)
 * @access  Private (Student)
 */
router.get('/dashboard', auth, async (req, res) => {
    try {
        const studentId = req.user.id;

                const studentProfile = await StudentProfile.findOne({ user: studentId }).populate('user', 'email');

        let profileCompletion = 0;
        let studentName = req.user.name || 'Student';
        let profilePicture = 'https://placehold.co/120x120/15803D/FFFFFF?text=SU';

        if (studentProfile) {
            studentName = studentProfile.fullName || req.user.name || 'Student';
            profilePicture = studentProfile.profilePicture || profilePicture;

            let completedFields = 0;
            const profileFields = [
                studentProfile.fullName,
                studentProfile.phone,
                studentProfile.linkedin,
                studentProfile.github,
                studentProfile.portfolio,
                studentProfile.bio,
            ];
            profileFields.forEach(field => {
                if (field && field.trim() !== '') completedFields++;
            });

            if (studentProfile.education && studentProfile.education.length > 0) completedFields++;
            if (studentProfile.experience && studentProfile.experience.length > 0) completedFields++;
            if (studentProfile.skills && studentProfile.skills.length > 0) completedFields++;
            
            const totalTrackedFields = 9;             profileCompletion = Math.round((completedFields / totalTrackedFields) * 100);
            if (profileCompletion > 100) profileCompletion = 100;
        }

                const applications = await Application.find({ studentId: studentId });
        const applicationStatus = {
            applied: applications.length,
            interviews: applications.filter(app => app.status === 'Interview Scheduled').length,
            offers: applications.filter(app => app.status === 'Offer Extended').length,
            rejected: applications.filter(app => app.status === 'Rejected').length,
        };

                const recentActivity = applications
            .sort((a, b) => b.createdAt - a.createdAt)
            .slice(0, 5)
            .map(app => ({
                id: app._id,
                text: `Application for ${app.jobId?.jobTitle || 'a job'} at ${app.recruiterId?.companyName || 'Unknown Company'} is ${app.status}.`,
                time: new Date(app.createdAt).toLocaleDateString(),
                icon: 'fas fa-file-signature'
            }));

                const recommendedJobs = await Job.find({})
            .sort({ createdAt: -1 })
            .limit(5)
            .populate({
                path: 'postedBy',
                select: 'name email',
                populate: {
                    path: 'companyProfile',                     select: 'companyName logoUrl'
                }
            })
            .lean();

        const mappedRecommendedJobs = recommendedJobs.map(job => {
            const companyName = job.postedBy?.companyProfile?.companyName || 'N/A';
            const companyLogo = job.postedBy?.companyProfile?.logoUrl || '';
            
            const skills = job.requiredSkills && job.requiredSkills.length > 0 ? job.requiredSkills : ['No skills specified']; 
            const salary = job.salaryMin && job.salaryMax ? `$${job.salaryMin} - $${job.salaryMax}` : job.salary || 'Negotiable';

            return {
                _id: job._id,
                jobTitle: job.jobTitle,
                companyName: companyName,
                companyLogo: companyLogo, 
                location: job.location,
                createdAt: job.createdAt,
                salary: salary,
                skills: skills,
                jobType: job.jobType,
            };
        });

                const unreadNotificationCount = await Notification.countDocuments({ studentId: studentId, read: false });


        res.json({
            studentName,
            profilePicture,
            profileCompletion,
            applicationStatus,
            recentActivity,
            recommendedJobs: mappedRecommendedJobs,
            notificationCount: unreadNotificationCount,         });

    } catch (error) {
        console.error('Error fetching student dashboard data:', error);
        res.status(500).json({ 
            message: 'Server error while fetching dashboard data.',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined 
        });
    }
});

/**
 * @route   GET /api/student/applications
 * @desc    Get all applications for the logged-in student
 * @access  Private (Student)
 */
router.get('/applications', auth, async (req, res) => {
    if (req.user.role !== 'student') {
        return res.status(403).json({ message: 'Access denied.' });
    }
    try {
        const applications = await Application.find({ studentId: req.user.id })
            .populate('jobId', 'jobTitle jobType')
            .populate('recruiterId', 'companyName');         
        res.status(200).json(applications);
    } catch (error) {
        console.error('Error fetching student applications:', error);
        res.status(500).json({ message: 'Server error while fetching applications.' });
    }
});


/**
 * @route   GET /api/student/notifications
 * @desc    Get all notifications for the logged-in student
 * @access  Private (Student)
 */
router.get('/notifications', auth, async (req, res) => {
    if (req.user.role !== 'student') {
        return res.status(403).json({ message: 'Access denied.' });
    }
    try {
        const notifications = await Notification.find({ studentId: req.user.id })
                                                .sort({ createdAt: -1 });         res.status(200).json(notifications);
    } catch (error) {
        console.error('Error fetching student notifications:', error);
        res.status(500).json({ message: 'Server error fetching notifications.' });
    }
});

/**
 * @route   PATCH /api/student/notifications/:id/status
 * @desc    Update the read status of a specific notification
 * @access  Private (Student)
 */
router.patch('/notifications/:id/status', auth, async (req, res) => {
    if (req.user.role !== 'student') {
        return res.status(403).json({ message: 'Access denied.' });
    }
    try {
        const { id } = req.params;
        const { read } = req.body;
        const notification = await Notification.findOneAndUpdate(
            { _id: id, studentId: req.user.id },             { read: read },
            { new: true }
        );
        if (!notification) {
            return res.status(404).json({ message: 'Notification not found or unauthorized.' });
        }
        res.status(200).json({ message: 'Notification status updated.', notification });
    } catch (error) {
        console.error('Error updating notification status:', error);
        res.status(500).json({ message: 'Server error updating notification status.' });
    }
});

/**
 * @route   PATCH /api/student/notifications/mark-all-read
 * @desc    Mark all unread notifications for the student as read
 * @access  Private (Student)
 */
router.patch('/notifications/mark-all-read', auth, async (req, res) => {
    if (req.user.role !== 'student') {
        return res.status(403).json({ message: 'Access denied.' });
    }
    try {
        await Notification.updateMany(
            { studentId: req.user.id, read: false },
            { read: true }
        );
        res.status(200).json({ message: 'All notifications marked as read.' });
    } catch (error) {
        console.error('Error marking all notifications as read:', error);
        res.status(500).json({ message: 'Server error marking all notifications as read.' });
    }
});

/**
 * @route   DELETE /api/student/notifications
 * @desc    Delete all notifications for the logged-in student
 * @access  Private (Student)
 */
router.delete('/notifications', auth, async (req, res) => {
    if (req.user.role !== 'student') {
        return res.status(403).json({ message: 'Access denied.' });
    }
    try {
        await Notification.deleteMany({ studentId: req.user.id });
        res.status(200).json({ message: 'All notifications deleted.' });
    } catch (error) {
        console.error('Error deleting all notifications:', error);
        res.status(500).json({ message: 'Server error deleting all notifications.' });
    }
});

module.exports = router;
