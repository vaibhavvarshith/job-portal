import React, { useState, useEffect } from 'react';
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

function StudentLayout() {
    const location = useLocation();     const navigate = useNavigate();

    const [studentData, setStudentData] = useState({
        fullName: 'Student',
        profilePicture: 'https://placehold.co/120x120/15803D/FFFFFF?text=SU'
    });
    const [badgeCounts, setBadgeCounts] = useState({
        applications: 0,
        notifications: 0
    });
    const [loading, setLoading] = useState(true);

        useEffect(() => {
        const fetchLayoutData = async () => {
            const token = localStorage.getItem('authToken');
            if (!token) {
                toast.error("Please log in to view the student portal.");
                navigate('/login');
                return;
            }

            try {
                                const profileRes = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/profile/student`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                                const dashboardRes = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/student/dashboard`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });


                let fetchedProfile = null;
                if (profileRes.ok) {
                    fetchedProfile = await profileRes.json();
                } else if (profileRes.status === 404) {
                    console.warn("Student profile not found, using default for header.");
                } else {
                    throw new Error('Failed to fetch student profile.');
                }

                let fetchedDashboardData = null;
                if (dashboardRes.ok) {
                    fetchedDashboardData = await dashboardRes.json();
                } else {
                    throw new Error('Failed to fetch dashboard stats for badges.');
                }

                setStudentData({
                    fullName: fetchedProfile?.fullName || fetchedDashboardData?.studentName || 'Student',
                    profilePicture: fetchedProfile?.profilePicture || 'https://placehold.co/120x120/15803D/FFFFFF?text=SU'
                });

                setBadgeCounts({
                    applications: fetchedDashboardData?.applicationStatus?.applied || 0,
                    notifications: fetchedDashboardData?.notificationCount || 0                 });

            } catch (error) {
                toast.error(error.message || "Could not load portal data.");
            } finally {
                setLoading(false);
            }
        };

        fetchLayoutData();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        toast.success("Logged out successfully!");
        navigate('/login');
    };

    const navItems = [
        { path: '/student-dashboard', icon: 'fas fa-tachometer-alt', label: 'Dashboard' },
        { path: '/student-profile', icon: 'fas fa-user-circle', label: 'My Profile' },
        { path: '/student-resume', icon: 'fas fa-file-alt', label: 'Resume Manager' },
        { path: '/student-applications', icon: 'fas fa-inbox', label: 'Applications', badgeKey: 'applications' }, 
        { path: '/student-notifications', icon: 'fas fa-bell', label: 'Notifications', badgeKey: 'notifications' }, 
        //{ path: '/student/saved-jobs', icon: 'fas fa-bookmark', label: 'Saved Jobs' },
        //{ path: '/student/settings', icon: 'fas fa-cog', label: 'Settings' },
    ];

    return (
        <div className="student-layout-container">
            
            <div className="student-sidebar">
                <div className="student-sidebar-header">
                    <h1 className="student-sidebar-title">Pro<span className="trck">Track</span></h1>
                </div>
                <nav className="student-sidebar-nav">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`student-nav-link ${location.pathname === item.path ? 'active' : ''}`}
                        >
                            <i className={`${item.icon} student-nav-icon`}></i>
                            {item.label}
                            
                            {item.badgeKey && badgeCounts[item.badgeKey] > 0 && 
                                <span className="student-nav-badge">{badgeCounts[item.badgeKey]}</span>}
                        </Link>
                    ))}
                </nav>
            </div>

            
            <div className="student-main-content">
                <header className="student-main-header">
                    <div className="student-header-content">
                        
                        <h1 className="student-header-title">Student Portal</h1> 
                        <div className="student-header-actions">
                            <button className="student-notification-button" title="Notifications">
                                <i className="fas fa-bell"></i>
                                
                                {badgeCounts.notifications > 0 && <span className="student-header-badge">{badgeCounts.notifications}</span>}
                            </button>
                            <div className="student-user-profile">
                                <span className="student-user-name">{studentData?.fullName?.split(' ')[0] || 'Student'}</span> 
                                <div className="student-user-avatar">
                                    {studentData?.profilePicture && !studentData.profilePicture.includes('placehold.co') ? (
                                        <img src={studentData.profilePicture} alt="Profile" className="header-profile-img" />
                                    ) : (
                                        studentData?.fullName ? studentData.fullName.split(' ').map(n => n[0]).join('').toUpperCase() : 'SU'
                                    )}
                                </div>
                            </div>
                            <button onClick={handleLogout} className="student-logout-button" title="Logout">
                                <i className="fas fa-sign-out-alt"></i>
                                <span className="logout-text">Logout</span>
                            </button>
                        </div>
                    </div>
                </header>

                <main className="student-content-area">
                    
                    {loading ? (
                        <div style={{ padding: '2rem', textAlign: 'center' }}>Loading student portal...</div>
                    ) : (
                        <Outlet /> 
                    )}
                </main>
            </div>
        </div>
    );
}

export default StudentLayout;
