import React from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';

// Ensure Font Awesome is loaded in your project
// (e.g., via CDN in public/index.html or using @fortawesome/react-fontawesome)

function StudentLayout({ pageTitle }) {
    const location = useLocation(); // To determine the active link

    const navItems = [
        { path: '/student/dashboard', icon: 'fas fa-tachometer-alt', label: 'Dashboard' },
        { path: '/student/my-profile', icon: 'fas fa-user-circle', label: 'My Profile' },
        { path: '/student/resume-manager', icon: 'fas fa-file-alt', label: 'Resume Manager' },
        { path: '/student/job-listings', icon: 'fas fa-briefcase', label: 'Job Listings' },
        { path: '/student/applications', icon: 'fas fa-inbox', label: 'Applications', badge: 3 }, // Example badge
        { path: '/student/notifications', icon: 'fas fa-bell', label: 'Notifications', badge: 5 }, // Example badge
        // { path: '/student/saved-jobs', icon: 'fas fa-bookmark', label: 'Saved Jobs' },
        // { path: '/student/settings', icon: 'fas fa-cog', label: 'Settings' },
    ];

    return (
        <div className="student-layout-container">
            {/* Sidebar */}
            <div className="student-sidebar">
                <div className="student-sidebar-header">
                    <h1 className="student-sidebar-title">CareerConnect</h1>
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
                            {item.badge && <span className="student-nav-badge">{item.badge}</span>}
                        </Link>
                    ))}
                </nav>
            </div>

            {/* Main Content */}
            <div className="student-main-content">
                <header className="student-main-header">
                    <div className="student-header-content">
                        {/* The pageTitle prop will be passed by individual page components */}
                        <h1 className="student-header-title">{pageTitle || "Student Portal"}</h1>
                        <div className="student-header-actions">
                            <button className="student-notification-button" title="Notifications">
                                <i className="fas fa-bell"></i>
                                {/* Optional: Add a badge directly on the bell if needed */}
                                {/* <span className="student-header-badge">5</span> */}
                            </button>
                            <div className="student-user-profile">
                                <span className="student-user-name">Jane S.</span> {/* Placeholder Name */}
                                <div className="student-user-avatar">JS</div> {/* Placeholder Initials */}
                            </div>
                            {/* Optional Logout Button - can be added here */}
                            {/* <button className="student-logout-button" title="Logout">
                <i className="fas fa-sign-out-alt"></i>
              </button> */}
                        </div>
                    </div>
                </header>

                <main className="student-content-area">
                    <Outlet /> {/* Child routes will render here */}
                </main>
            </div>
        </div>
    );
}

export default StudentLayout;
