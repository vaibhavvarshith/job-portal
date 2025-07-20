import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

// --- Skeleton Loader Component ---
const DashboardSkeleton = () => (
    <>
        <style>{`
            .skeleton-box { background-color: #e0e0e0; border-radius: 8px; animation: skeleton-pulse 1.5s infinite ease-in-out; }
            .skeleton-line { width: 100%; height: 20px; margin-bottom: 10px; border-radius: 4px; }
            .skeleton-line.short { width: 60%; }
            @keyframes skeleton-pulse { 0% { background-color: #e0e0e0; } 50% { background-color: #f0f0f0; } 100% { background-color: #e0e0e0; } }
        `}</style>
        <div className="recruiter-dashboard-stats-grid">
            <div className="recruiter-stat-card skeleton-box" style={{ height: '100px' }}></div>
            <div className="recruiter-stat-card skeleton-box" style={{ height: '100px' }}></div>
            <div className="recruiter-stat-card skeleton-box" style={{ height: '100px' }}></div>
        </div>
        <div className="recruiter-recent-applications-section">
            <div className="recruiter-section-header">
                <h2 className="recruiter-section-title skeleton-box skeleton-line short" style={{ height: '30px', width: '200px' }}></h2>
                <div className="recruiter-post-new-job-btn skeleton-box" style={{ height: '40px', width: '150px' }}></div>
            </div>
            <div className="recruiter-table-container skeleton-box" style={{ padding: '20px' }}>
                <div className="skeleton-line"></div>
                <div className="skeleton-line short"></div>
                <div className="skeleton-line"></div>
            </div>
        </div>
    </>
);


// Navigation items for the Recruiter sidebar
const navItems = [
    { path: '/recruiter-dashboard', icon: 'fas fa-tachometer-alt', label: 'Dashboard' },
    { path: '/recruiter-post-job', icon: 'fas fa-plus-square', label: 'Post a Job' },
    { path: '/recruiter-post-internship', icon: 'fas fa-graduation-cap', label: 'Post an Internship' },
    { path: '/recruiter-applications-approval', icon: 'fas fa-check-circle', label: 'Applications Approval' },
    { path: '/recruiter-company-profile', icon: 'fas fa-building', label: 'Company Profile' }
];

function RecruiterDashboardStandalonePage() {
    const location = useLocation();
    const navigate = useNavigate();

    const [stats, setStats] = useState({ activeListings: 0, totalApplications: 0, shortlisted: 0 });
    const [recentApplications, setRecentApplications] = useState([]);
    const [companyData, setCompanyData] = useState(null); // State for header data
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('authToken');
            if (!token) {
                toast.error("Please log in.");
                navigate('/login');
                return;
            }

            try {
                // Fetch all data in parallel
                const [statsRes, appsRes, profileRes] = await Promise.all([
                    fetch('https://pro-track-job-portal-backend.onrender.com/api/recruiter/dashboard-stats', { headers: { 'Authorization': `Bearer ${token}` } }),
                    fetch('https://pro-track-job-portal-backend.onrender.com/api/recruiter/recent-applications', { headers: { 'Authorization': `Bearer ${token}` } }),
                    fetch('https://pro-track-job-portal-backend.onrender.com/api/profile/recruiter', { headers: { 'Authorization': `Bearer ${token}` } })
                ]);

                if (!statsRes.ok || !appsRes.ok) {
                    throw new Error('Failed to fetch dashboard data.');
                }

                const statsData = await statsRes.json();
                const appsData = await appsRes.json();
                if (profileRes.ok) {
                    const profileData = await profileRes.json();
                    setCompanyData(profileData);
                }

                setStats(statsData);
                setRecentApplications(appsData);

            } catch (error) {
                toast.error(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [navigate]);
    
    const getStatusClass = (status) => {
        if (!status) return '';
        return status.toLowerCase().replace(/\s+/g, '-');
    };
    
    const handleLogout = () => {
        localStorage.removeItem('authToken');
        toast.success("Logged out successfully!");
        navigate('/login');
    };

    return (
        <div className="recruiter-page-layout-container">
            {/* Sidebar */}
            <div className="recruiter-page-sidebar">
                <div className="recruiter-page-sidebar-header">
                    <h1 className="recruiter-page-sidebar-title">Pro<span className="trck">Track</span></h1>
                </div>
                <nav className="recruiter-page-sidebar-nav">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`recruiter-page-nav-link ${location.pathname === item.path ? 'active' : ''}`}
                        >
                            <i className={`${item.icon} recruiter-page-nav-icon`}></i>
                            {item.label}
                        </Link>
                    ))}
                </nav>
            </div>

            {/* Main Content */}
            <div className="recruiter-page-main-content">
                <header className="recruiter-page-main-header">
                    <div className="recruiter-page-header-content">
                        <h1 className="recruiter-page-header-title">Recruiter Dashboard</h1>
                        <div className="recruiter-page-header-actions">
                            <button className="recruiter-page-notification-button" title="Notifications">
                                <i className="fas fa-bell"></i>
                                <span className="recruiter-notification-dot"></span>
                            </button>
                            {/* --- DYNAMIC HEADER PROFILE --- */}
                            <div className="recruiter-page-user-profile">
                                <span className="recruiter-page-user-name">{companyData?.companyName || 'Recruiter'}</span>
                                <div className="recruiter-page-user-avatar">
                                    {companyData?.logoUrl && !companyData.logoUrl.includes('placehold.co') ? (
                                        <img src={companyData.logoUrl} alt="Logo" className="header-logo-img" />
                                    ) : (
                                        companyData?.companyName ? companyData.companyName.substring(0, 2).toUpperCase() : 'CO'
                                    )}
                                </div>
                            </div>
                            <button onClick={handleLogout} className="recruiter-logout-button" title="Logout">
                                <i className="fas fa-sign-out-alt"></i>
                                <span className="recruiter-logout-text">Logout</span>
                            </button>
                        </div>
                    </div>
                </header>

                <main className="recruiter-page-content-area">
                    {loading ? <DashboardSkeleton /> : (
                        <>
                            <div className="recruiter-dashboard-stats-grid">
                                <div className="recruiter-stat-card stat-card-blue">
                                    <div className="recruiter-stat-icon-wrapper"><i className="fas fa-briefcase recruiter-stat-icon"></i></div>
                                    <div className="recruiter-stat-info"><p className="recruiter-stat-value">{stats.activeListings}</p><p className="recruiter-stat-label">Active Listings</p></div>
                                </div>
                                <div className="recruiter-stat-card stat-card-green">
                                    <div className="recruiter-stat-icon-wrapper"><i className="fas fa-file-alt recruiter-stat-icon"></i></div>
                                    <div className="recruiter-stat-info"><p className="recruiter-stat-value">{stats.totalApplications}</p><p className="recruiter-stat-label">Total Applications</p></div>
                                </div>
                                <div className="recruiter-stat-card stat-card-yellow">
                                    <div className="recruiter-stat-icon-wrapper"><i className="fas fa-users recruiter-stat-icon"></i></div>
                                    <div className="recruiter-stat-info"><p className="recruiter-stat-value">{stats.shortlisted}</p><p className="recruiter-stat-label">Shortlisted</p></div>
                                </div>
                            </div>

                            <div className="recruiter-recent-applications-section">
                                <div className="recruiter-section-header">
                                    <h2 className="recruiter-section-title">Recent Applications</h2>
                                    <Link to="/recruiter-post-job" className="recruiter-post-new-job-btn">
                                        <i className="fas fa-plus"></i> Post New Job
                                    </Link>
                                </div>
                                <div className="recruiter-table-container">
                                    <table className="recruiter-applications-table">
                                        <thead>
                                            <tr>
                                                <th>Candidate</th>
                                                <th>Position</th>
                                                <th>Applied On</th>
                                                <th>Status</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {recentApplications.map(app => (
                                                <tr key={app._id}>
                                                    <td>
                                                        <div className="recruiter-candidate-cell">
                                                            <span>{app.studentId?.name || 'N/A'}</span>
                                                        </div>
                                                    </td>
                                                    <td>{app.jobId?.jobTitle || 'N/A'}</td>
                                                    <td>{new Date(app.createdAt).toLocaleDateString()}</td>
                                                    <td>
                                                        <span className={`recruiter-status-badge status-${getStatusClass(app.status)}`}>
                                                            {app.status}
                                                        </span>
                                                    </td>
                                                    <td className="recruiter-actions-cell">
                                                        <button className="recruiter-action-btn view-btn">View</button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </>
                    )}
                </main>
            </div>
        </div>
    );
}

export default RecruiterDashboardStandalonePage;
