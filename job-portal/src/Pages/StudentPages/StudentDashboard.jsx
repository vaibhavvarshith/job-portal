import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

// --- Skeleton Loader Component for Student Dashboard ---
const StudentDashboardSkeleton = () => (
    <>
        <style>{`
            .skeleton-box { background-color: #e0e0e0; border-radius: 8px; animation: skeleton-pulse 1.5s infinite ease-in-out; }
            .skeleton-line { width: 100%; height: 20px; margin-bottom: 10px; border-radius: 4px; }
            .skeleton-line.short { width: 60%; }
            @keyframes skeleton-pulse { 0% { background-color: #e0e0e0; } 50% { background-color: #f0f0f0; } 100% { background-color: #e0e0e0; } }
        `}</style>
        <div className="dashboard-grid">
            <div className="dashboard-card skeleton-box" style={{ height: '180px' }}></div>
            <div className="dashboard-card skeleton-box" style={{ height: '180px' }}></div>
            <div className="dashboard-card skeleton-box" style={{ height: '180px' }}></div>
        </div>
        <div className="dashboard-card recommended-jobs-section skeleton-box" style={{ height: '300px', marginTop: '1.5rem' }}>
            <div className="skeleton-line" style={{ height: '30px', width: '250px', marginBottom: '1rem' }}></div>
            <div className="skeleton-line"></div>
            <div className="skeleton-line short"></div>
            <div className="skeleton-line"></div>
        </div>
    </>
);

// Navigation items for the sidebar
const navItems = [
    { path: '/student-dashboard', icon: 'fas fa-tachometer-alt', label: 'Dashboard' },
    { path: '/student-profile', icon: 'fas fa-user-circle', label: 'My Profile' },
    { path: '/student-resume', icon: 'fas fa-file-alt', label: 'Resume Manager' },
    { path: '/student-applications', icon: 'fas fa-inbox', label: 'Applications' }, // Badge will be dynamic
    { path: '/student-notifications', icon: 'fas fa-bell', label: 'Notifications' }, // Badge will be dynamic
];

function StudentDashboardPage() {
    const location = useLocation();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [studentData, setStudentData] = useState({
        fullName: 'Student',
        profilePicture: 'https://placehold.co/120x120/15803D/FFFFFF?text=SU'
    }); // For header (name, avatar)
    const [dashboardStats, setDashboardStats] = useState({
        profileCompletion: 0,
        applicationStatus: { applied: 0, interviews: 0, offers: 0, rejected: 0 },
        recentActivity: [],
        recommendedJobs: [],
    });

    useEffect(() => {
        const fetchDashboardData = async () => {
            const token = localStorage.getItem('authToken');
            if (!token) {
                toast.error("Please log in to view your dashboard.");
                navigate('/login');
                return;
            }

            try {
                const dashboardRes = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/student/dashboard`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (!dashboardRes.ok) {
                    throw new Error('Failed to fetch dashboard data.');
                }
                const dashboardData = await dashboardRes.json();

                setDashboardStats({
                    profileCompletion: dashboardData.profileCompletion || 0,
                    applicationStatus: dashboardData.applicationStatus || { applied: 0, interviews: 0, offers: 0, rejected: 0 },
                    recentActivity: dashboardData.recentActivity || [],
                    recommendedJobs: dashboardData.recommendedJobs || [],
                });

                setStudentData({
                    fullName: dashboardData.studentName || 'Student',
                    profilePicture: dashboardData.profilePicture || 'https://placehold.co/120x120/15803D/FFFFFF?text=SU'
                });

            } catch (error) {
                toast.error(error.message || "Could not fetch dashboard data.");
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        toast.success('Logged out successfully!');
        navigate('/login');
    };

    return (
        <div className="student-page-layout-container">
            {/* Sidebar */}
            <div className="student-page-sidebar">
                <div className="student-page-sidebar-header">
                    <h1 className="student-page-sidebar-title">Pro <span className="trck">Track</span></h1>
                </div>
                <nav className="student-page-sidebar-nav">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`student-page-nav-link ${location.pathname === item.path ? 'active' : ''}`}
                        >
                            <i className={`${item.icon} student-page-nav-icon`}></i>
                            {item.label}
                            {/* Dynamically show badge for applications/notifications if data is available */}
                            {item.path === '/student-applications' && dashboardStats.applicationStatus.applied > 0 && 
                                <span className="student-page-nav-badge">{dashboardStats.applicationStatus.applied}</span>}
                            {/* You'd need a separate notification count from backend for this */}
                            {item.path === '/student-notifications' && false && 
                                <span className="student-page-nav-badge">0</span>} 
                        </Link>
                    ))}
                </nav>
            </div>

            {/* Main Content */}
            <div className="student-page-main-content">
                <header className="student-page-main-header">
                    <div className="student-page-header-content">
                        <h1 className="student-page-header-title">Dashboard</h1>
                        <div className="student-page-header-actions">
                            <button className="student-page-notification-button" title="Notifications">
                                <i className="fas fa-bell"></i>
                            </button>
                            <div className="student-page-user-profile">
                                <span className="student-page-user-name">{studentData?.fullName?.split(' ')[0] || 'Student'}</span>
                                <div className="student-page-user-avatar">
                                    {studentData?.profilePicture && !studentData.profilePicture.includes('placehold.co') ? (
                                        <img src={studentData.profilePicture} alt="Profile" className="header-profile-img" />
                                    ) : (
                                        studentData?.fullName ? studentData.fullName.split(' ').map(n => n[0]).join('').toUpperCase() : 'SU'
                                    )}
                                </div>
                            </div>
                            <button onClick={handleLogout} className="logout-button" title="Logout">
                                <i className="fas fa-sign-out-alt"></i>
                                <span className="logout-text">Logout</span>
                            </button>
                        </div>
                    </div>
                </header>

                <main className="student-page-content-area">
                    {loading ? <StudentDashboardSkeleton /> : (
                        <>
                            {/* Dashboard Specific Content */}
                            <div className="dashboard-grid">
                                {/* Profile Completion Card */}
                                <div className="dashboard-card profile-completion-card">
                                    <h3 className="card-title">Profile Completion</h3>
                                    <div className="progress-bar-container">
                                        <div
                                            className="progress-bar"
                                            style={{ width: `${dashboardStats.profileCompletion}%` }}
                                        >
                                            {dashboardStats.profileCompletion}%
                                        </div>
                                    </div>
                                    <p className="completion-text">{dashboardStats.profileCompletion}% Complete</p>
                                    <Link to="/student-profile" className="complete-profile-link">
                                        Complete Profile <i className="fas fa-arrow-right"></i>
                                    </Link>
                                </div>

                                {/* Application Status Card */}
                                <div className="dashboard-card application-status-card">
                                    <h3 className="card-title">Application Status</h3>
                                    <ul className="status-list">
                                        <li><span>Applied</span> <span className="status-count">{dashboardStats.applicationStatus.applied}</span></li>
                                        <li><span>Interviews</span> <span className="status-count">{dashboardStats.applicationStatus.interviews}</span></li>
                                        <li><span>Offers</span> <span className="status-count offer-count">{dashboardStats.applicationStatus.offers}</span></li>
                                        <li><span>Rejected</span> <span className="status-count rejected-count">{dashboardStats.applicationStatus.rejected}</span></li>
                                    </ul>
                                </div>

                                {/* Recent Activity Card */}
                                <div className="dashboard-card recent-activity-card">
                                    <h3 className="card-title">Recent Activity</h3>
                                    <ul className="activity-list">
                                        {dashboardStats.recentActivity.length > 0 ? (
                                            dashboardStats.recentActivity.map(activity => (
                                                <li key={activity.id} className="activity-item">
                                                    <i className={`${activity.icon || 'fas fa-info-circle'} activity-icon`}></i>
                                                    <div className="activity-details">
                                                        <p className="activity-text">{activity.text}</p>
                                                        <p className="activity-time">{activity.time}</p>
                                                    </div>
                                                </li>
                                            ))
                                        ) : (
                                            <li className="no-entries-message" style={{ borderBottom: 'none' }}>No recent activity.</li>
                                        )}
                                    </ul>
                                </div>
                            </div>

                            {/* Recommended Jobs Section */}
                            <div className="dashboard-card recommended-jobs-section">
                                <h3 className="card-title">Recommended Jobs</h3>
                                <div className="recommended-jobs-grid">
                                    {dashboardStats.recommendedJobs.length > 0 ? (
                                        dashboardStats.recommendedJobs.map(job => (
                                            <div key={job._id} className="job-card-recommended">
                                                <div className="job-card-header">
                                                    {job.companyLogo ? (
                                                        <img src={job.companyLogo} alt={`${job.companyName} logo`} className="job-company-logo-sm" />
                                                    ) : (
                                                        <div className="job-company-logo-placeholder">
                                                            {job.companyName ? job.companyName.charAt(0).toUpperCase() : 'C'}
                                                        </div>
                                                    )}
                                                    <div>
                                                        <h4 className="job-title-recommended">{job.jobTitle}</h4>
                                                        <p className="job-company-recommended">{job.companyName || 'N/A'}</p>
                                                    </div>
                                                </div>
                                                <div className="job-details-recommended">
                                                    <p><i className="fas fa-map-marker-alt"></i> {job.location}</p>
                                                    <p><i className="fas fa-dollar-sign"></i> {job.salary || 'Negotiable'}</p> {/* Use actual salary if available */}
                                                    <p><i className="fas fa-clock"></i> Posted {new Date(job.createdAt).toLocaleDateString()}</p>
                                                </div>
                                                <div className="job-skills-recommended">
                                                    {job.skills && job.skills.length > 0 ? (
                                                        job.skills.map(skill => <span key={skill} className="skill-tag">{skill}</span>)
                                                    ) : (
                                                        <span className="skill-tag">No skills specified</span>
                                                    )}
                                                </div>
                                                <div className="job-actions-recommended">
                                                    <button className="apply-now-button">Apply Now</button>
                                                    <button className="save-job-button"><i className="fas fa-bookmark"></i> Save</button>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="no-entries-message" style={{ gridColumn: '1 / -1' }}>No recommended jobs found at the moment.</p>
                                    )}
                                </div>
                            </div>
                        </>
                    )}
                </main>
            </div>
        </div>
    );
}

export default StudentDashboardPage;
