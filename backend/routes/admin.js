const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const Job = require('../models/Job');
const Internship = require('../models/Internship');
const Application = require('../models/Application');
const CompanyProfile = require('../models/CompanyProfile');

// Middleware to ensure only admins can access these routes
const adminAuth = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
    }
    next();
};

/**
 * @route   GET /api/admin/dashboard-data
 * @desc    Get key statistics and chart data for Admin Dashboard
 * @access  Private (Admin)
 */
router.get('/dashboard-data', auth, adminAuth, async (req, res) => {
    try {
        // --- KPIs ---
        const totalUsers = await User.countDocuments();
        const students = await User.countDocuments({ role: 'student' });
        const recruiters = await User.countDocuments({ role: 'recruiter' });
        const pendingApprovals = await User.countDocuments({ role: 'recruiter', status: 'Pending Approval' });

        // --- Chart Data (Mock data for now, replace with aggregation) ---
        const userRegistrationChartData = {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [
                { label: 'Students', data: [65, 78, 90, 115, 130, 142], borderColor: '#2563EB', backgroundColor: 'rgba(37, 99, 235, 0.1)', tension: 0.3 },
                { label: 'Recruiters', data: [25, 32, 45, 55, 60, 70], borderColor: '#10B981', backgroundColor: 'rgba(16, 185, 129, 0.1)', tension: 0.3 },
            ],
        };
        const activityMetricsChartData = {
            labels: ['Job Posts', 'Applications', 'Interviews', 'Hires'],
            datasets: [
                { label: 'Last Month', data: [120, 350, 75, 30], backgroundColor: '#10B981', borderRadius: 4 },
                { label: 'This Month', data: [150, 420, 90, 35], backgroundColor: '#3B82F6', borderRadius: 4 },
            ],
        };

        res.status(200).json({
            totalUsers,
            students,
            recruiters,
            pendingApprovals,
            userRegistrationChartData,
            activityMetricsChartData,
        });

    } catch (error) {
        console.error('Error fetching admin dashboard data:', error);
        res.status(500).json({ message: 'Server error fetching admin dashboard data.' });
    }
});

/**
 * @route   GET /api/admin/recruiter-approvals
 * @desc    Get pending recruiter approval requests with pagination and filters
 * @access  Private (Admin)
 */
router.get('/recruiter-approvals', auth, adminAuth, async (req, res) => {
    try {
        const { page = 1, limit = 5, searchTerm = '', industry = '' } = req.query;
        const skip = (parseInt(page) - 1) * parseInt(limit);

        let query = { role: 'recruiter', status: 'Pending Approval' };

        if (searchTerm) {
            query.$or = [
                { 'name': { $regex: searchTerm, $options: 'i' } },
                { 'email': { $regex: searchTerm, $options: 'i' } },
            ];
        }

        let users = await User.find(query)
                            .select('name email createdAt status')
                            .skip(skip)
                            .limit(parseInt(limit));
        
        let requestsWithCompanyInfo = [];
        for (let user of users) {
            let companyProfile = await CompanyProfile.findOne({ user: user._id });
            
            if (industry && companyProfile && companyProfile.industry !== industry) {
                continue;
            }

            requestsWithCompanyInfo.push({
                _id: user._id,
                user: user,
                companyName: companyProfile?.companyName || 'N/A',
                contactPerson: user.name || 'N/A',
                email: user.email,
                industry: companyProfile?.industry || 'N/A',
                appliedDate: user.createdAt,
                status: user.status,
            });
        }

        if (searchTerm) {
            const searchLower = searchTerm.toLowerCase();
            requestsWithCompanyInfo = requestsWithCompanyInfo.filter(req => 
                req.companyName.toLowerCase().includes(searchLower) ||
                req.contactPerson.toLowerCase().includes(searchLower) ||
                req.email.toLowerCase().includes(searchLower)
            );
        }

        const totalCount = await User.countDocuments(query);

        res.status(200).json({ requests: requestsWithCompanyInfo, totalCount });

    } catch (error) {
        console.error('Error fetching recruiter approvals:', error);
        res.status(500).json({ message: 'Server error fetching recruiter approvals.' });
    }
});

/**
 * @route   GET /api/admin/industries
 * @desc    Get unique industries from CompanyProfiles for filters
 * @access  Private (Admin)
 */
router.get('/industries', auth, adminAuth, async (req, res) => {
    try {
        const industries = await CompanyProfile.distinct('industry');
        res.status(200).json({ industries: industries.filter(i => i && i.trim() !== '') });
    } catch (error) {
        console.error('Error fetching unique industries:', error);
        res.status(500).json({ message: 'Server error fetching industries.' });
    }
});


/**
 * @route   PATCH /api/admin/recruiter-approvals/:id/approve
 * @desc    Approve a pending recruiter
 * @access  Private (Admin)
 */
router.patch('/recruiter-approvals/:id/approve', auth, adminAuth, async (req, res) => {
    try {
        const { id } = req.params;
        
        const user = await User.findById(id);
        if (!user || user.role !== 'recruiter' || user.status !== 'Pending Approval') {
            return res.status(404).json({ message: 'Recruiter approval request not found or not pending.' });
        }

        user.status = 'Active';
        await user.save();

        res.status(200).json({ message: 'Recruiter approved successfully!', user });
    } catch (error) {
        console.error('Error approving recruiter:', error);
        res.status(500).json({ message: 'Server error approving recruiter.' });
    }
});

/**
 * @route   PATCH /api/admin/recruiter-approvals/:id/reject
 * @desc    Reject a pending recruiter
 * @access  Private (Admin)
 */
router.patch('/recruiter-approvals/:id/reject', auth, adminAuth, async (req, res) => {
    try {
        const { id } = req.params;
        
        const user = await User.findById(id);
        if (!user || user.role !== 'recruiter' || user.status !== 'Pending Approval') {
            return res.status(404).json({ message: 'Recruiter approval request not found or not pending.' });
        }

        user.status = 'Rejected';
        await user.save();

        res.status(200).json({ message: 'Recruiter rejected successfully!', user });
    } catch (error) {
        console.error('Error rejecting recruiter:', error);
        res.status(500).json({ message: 'Server error rejecting recruiter.' });
    }
});

/**
 * @route   GET /api/admin/users
 * @desc    Get all users with pagination, search, and filters
 * @access  Private (Admin)
 */
router.get('/users', auth, adminAuth, async (req, res) => {
    try {
        const { page = 1, limit = 5, searchTerm = '', role = '', status = '' } = req.query;
        const skip = (parseInt(page) - 1) * parseInt(limit);

        let query = {};
        if (role && role !== 'All') {
            query.role = role;
        }
        if (status && status !== 'All') {
            query.status = status;
        }

        if (searchTerm) {
            query.$or = [
                { 'name': { $regex: searchTerm, $options: 'i' } },
                { 'email': { $regex: searchTerm, $options: 'i' } },
            ];
        }

        const users = await User.find(query)
                                .select('name email role status createdAt')
                                .skip(skip)
                                .limit(parseInt(limit))
                                .sort({ createdAt: -1 }); // Sort by newest first

        const totalCount = await User.countDocuments(query);

        res.status(200).json({ users, totalCount });

    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Server error fetching users.' });
    }
});

/**
 * @route   PATCH /api/admin/users/:id/status
 * @desc    Update a user's status
 * @access  Private (Admin)
 */
router.patch('/users/:id/status', auth, adminAuth, async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        user.status = status;
        await user.save();

        res.status(200).json({ message: 'User status updated successfully!', user });
    } catch (error) {
        console.error('Error updating user status:', error);
        res.status(500).json({ message: 'Server error updating user status.' });
    }
});

/**
 * @route   DELETE /api/admin/users/:id
 * @desc    Delete a user
 * @access  Private (Admin)
 */
router.delete('/users/:id', auth, adminAuth, async (req, res) => {
    try {
        const { id } = req.params;
        
        const user = await User.findByIdAndDelete(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Optionally, delete associated profiles (studentProfile, CompanyProfile)
        if (user.role === 'student') {
            await StudentProfile.findOneAndDelete({ user: user._id });
        } else if (user.role === 'recruiter') {
            await CompanyProfile.findOneAndDelete({ user: user._id });
            // Also consider deleting jobs/internships posted by this recruiter
            // await Job.deleteMany({ postedBy: user._id });
            // await Internship.deleteMany({ postedBy: user._id });
        }

        res.status(200).json({ message: 'User deleted successfully!' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Server error deleting user.' });
    }
});


/**
 * @route   GET /api/admin/analytics/dashboard-data
 * @desc    Get all KPI and Chart data for Admin Analytics Dashboard
 * @access  Private (Admin)
 */
router.get('/analytics/dashboard-data', auth, adminAuth, async (req, res) => {
    try {
        // --- KPIs ---
        const totalUsers = await User.countDocuments();
        const activeJobPostings = await Job.countDocuments();
        const activeInternshipPostings = await Internship.countDocuments();
        const totalActiveListings = activeJobPostings + activeInternshipPostings;

        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        const applicationsThisMonth = await Application.countDocuments({ createdAt: { $gte: thirtyDaysAgo } });

        const threeMonthsAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
        const successfulHiresQ2 = await Application.countDocuments({ 
            createdAt: { $gte: threeMonthsAgo },
            status: { $in: ['Hired', 'Offer Accepted'] }
        });

        // --- Chart Data (Mock data for now, replace with aggregation) ---
        const userGrowthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul']; 
        const userGrowthStudents = [500, 580, 690, 810, 950, 1100, 1245]; 
        const userGrowthRecruiters = [30, 40, 55, 60, 70, 85, 90]; 
        const userGrowthTotal = userGrowthStudents.map((s, i) => s + userGrowthRecruiters[i]);

        const userGrowth = {
            labels: userGrowthLabels,
            datasets: [
                { label: 'Total Users', data: userGrowthTotal, borderColor: '#3B82F6', backgroundColor: 'rgba(59, 130, 246, 0.1)', tension: 0.3, fill: true },
                { label: 'New Students', data: userGrowthStudents, borderColor: '#10B981', backgroundColor: 'rgba(16, 185, 129, 0.1)', tension: 0.3, fill: true },
                { label: 'New Recruiters', data: userGrowthRecruiters, borderColor: '#F59E0B', backgroundColor: 'rgba(245, 158, 11, 0.1)', tension: 0.3, fill: true },
            ],
        };

        const jobPostingTrendsLabels = ['Q1', 'Q2', 'Q3', 'Q4'];
        const internshipsPosted = [120, 150, 180, 160];
        const fullTimeJobsPosted = [80, 100, 130, 110];

        const jobPostingTrends = {
            labels: jobPostingTrendsLabels,
            datasets: [
                { label: 'Internships Posted', data: internshipsPosted, backgroundColor: '#6366F1', borderRadius: 4 },
                { label: 'Full-time Jobs Posted', data: fullTimeJobsPosted, backgroundColor: '#EC4899', borderRadius: 4 },
            ],
        };

        const totalApplicationsOverall = await Application.countDocuments();
        const shortlistedApps = await Application.countDocuments({ status: 'Shortlisted' });
        const interviewedApps = await Application.countDocuments({ status: 'Interview Scheduled' });
        const hiredApps = await Application.countDocuments({ status: { $in: ['Hired', 'Offer Accepted'] } });

        const applicationSuccessRate = {
            labels: ['Applied', 'Shortlisted', 'Interviewed', 'Hired'],
            datasets: [
                {
                    label: 'Application Funnel',
                    data: [totalApplicationsOverall, shortlistedApps, interviewedApps, hiredApps],
                    backgroundColor: [
                        'rgba(59, 130, 246, 0.7)', '#10B981', 'rgba(245, 158, 11, 0.7)', 'rgba(236, 72, 153, 0.7)',
                    ],
                    borderColor: [
                        '#3B82F6', '#10B981', '#F59E0B', '#EC4899',
                    ],
                    borderWidth: 1,
                },
            ],
        };


        res.status(200).json({
            totalUsers,
            activeJobPostings: totalActiveListings,
            applicationsThisMonth,
            successfulHiresQ2,
            userGrowth,
            jobPostingTrends,
            applicationSuccessRate,
        });

    } catch (error) {
        console.error('Error fetching admin analytics dashboard data:', error);
        res.status(500).json({ message: 'Server error fetching analytics data.' });
    }
});

/**
 * @route   POST /api/admin/analytics/generate-report
 * @desc    Generate a specific report based on type and date range
 * @access  Private (Admin)
 */
router.post('/analytics/generate-report', auth, adminAuth, async (req, res) => {
    const { reportType, dateRange } = req.body;

    let startDate;
    const endDate = new Date(); // Current date
    switch (dateRange) {
        case 'last_7_days': startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000); break;
        case 'last_30_days': startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); break;
        case 'last_90_days': startDate = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000); break;
        case 'year_to_date': startDate = new Date(new Date().getFullYear(), 0, 1); break; // Start of current year
        case 'all_time': startDate = new Date(0); break; // Epoch start
        default: startDate = new Date(0);
    }

    let reportData = [];
    let reportTitle = `Report: ${reportType.replace(/_/g, ' ')} for ${dateRange.replace(/_/g, ' ')}`;

    try {
        switch (reportType) {
            case 'user_list':
                reportData = await User.find({ createdAt: { $gte: startDate, $lte: endDate } }).select('email role createdAt');
                break;
            case 'recruiter_activity':
                const activeRecruiters = await User.find({ role: 'recruiter' });
                const recruiterActivity = [];
                for (const recruiter of activeRecruiters) {
                    const jobsPosted = await Job.countDocuments({ postedBy: recruiter._id, createdAt: { $gte: startDate, $lte: endDate } });
                    const internshipsPosted = await Internship.countDocuments({ postedBy: recruiter._id, createdAt: { $gte: startDate, $lte: endDate } });
                    const applicationsReceived = await Application.countDocuments({ recruiterId: recruiter._id, createdAt: { $gte: startDate, $lte: endDate } });
                    recruiterActivity.push({
                        email: recruiter.email,
                        jobsPosted,
                        internshipsPosted,
                        applicationsReceived
                    });
                }
                reportData = recruiterActivity;
                break;
            case 'job_post_summary':
                reportData = await Job.find({ createdAt: { $gte: startDate, $lte: endDate } })
                                    .select('jobTitle jobType location createdAt')
                                    .populate('postedBy', 'name');
                break;
            case 'application_stats':
                reportData = await Application.find({ createdAt: { $gte: startDate, $lte: endDate } })
                                            .select('status createdAt')
                                            .populate('studentId', 'name')
                                            .populate('jobId', 'jobTitle');
                break;
            default:
                reportData = [{ message: 'Invalid report type selected.' }];
        }

        res.status(200).json({
            title: reportTitle,
            data: reportData,
            message: 'Report generated successfully.'
        });

    } catch (error) {
        console.error('Error generating report:', error);
        res.status(500).json({ message: 'Server error generating report.' });
    }
});

module.exports = router;
