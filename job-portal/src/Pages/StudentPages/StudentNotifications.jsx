import React, { useState, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';

const handleLogout = () => {
  // Implement your logout logic here
  // e.g., clear tokens, call a logout API, redirect
  console.log('Admin logged out');
  navigate('/login'); // Example: Redirect to login page
};
// Navigation items for the sidebar
const navItems = [
    { path: '/student-dashboard', icon: 'fas fa-tachometer-alt', label: 'Dashboard' },
    { path: '/student-profile', icon: 'fas fa-user-circle', label: 'My Profile' },
    { path: '/student-resume', icon: 'fas fa-file-alt', label: 'Resume Manager' },
    { path: '/student-applications', icon: 'fas fa-inbox', label: 'Applications', badge: 3 },
    { path: '/student-notifications', icon: 'fas fa-bell', label: 'Notifications', badge: 5 },
];
// Mock Notification Data
const initialNotifications = [
    { id: 1, type: 'application_update', title: 'Application Status Changed', message: 'Your application for Software Engineer Intern at Tech Solutions Inc. has been updated to "Under Review".', date: '2023-07-12 10:30 AM', read: false, icon: 'fas fa-briefcase', link: '/student/applications/1' },
    { id: 2, type: 'new_job_match', title: 'New Job Match!', message: 'A new job matching your profile: Senior Frontend Developer at Web Wizards.', date: '2023-07-12 09:00 AM', read: true, icon: 'fas fa-bullseye', link: '/student/job-listings/201' },
    { id: 3, type: 'resume_viewed', title: 'Your Resume was Viewed', message: 'Innovate Hub Ltd. viewed your default resume.', date: '2023-07-11 03:45 PM', read: false, icon: 'fas fa-eye', link: '#' },
    { id: 4, type: 'interview_reminder', title: 'Interview Reminder', message: 'Your interview with GreenEnergy Corp. is scheduled for tomorrow at 2:00 PM.', date: '2023-07-10 05:00 PM', read: true, icon: 'fas fa-calendar-check', link: '/student/applications/3' },
    { id: 5, type: 'message_recruiter', title: 'New Message from Recruiter', message: 'John Doe from Tech Solutions Inc. sent you a message regarding your application.', date: '2023-07-10 02:15 PM', read: false, icon: 'fas fa-envelope', link: '#' },
    { id: 6, type: 'profile_tip', title: 'Profile Tip', message: 'Consider adding more projects to your portfolio to attract recruiters.', date: '2023-07-09 11:00 AM', read: true, icon: 'fas fa-lightbulb', link: '/student/my-profile' },
];

function NotificationsStandalonePage() {
    const location = useLocation(); // To determine the active link

    const [notifications, setNotifications] = useState(initialNotifications);
    const [filter, setFilter] = useState('all'); // 'all', 'unread'

    const filteredNotifications = useMemo(() => {
        if (filter === 'unread') {
            return notifications.filter(n => !n.read);
        }
        return notifications;
    }, [notifications, filter]);

    const toggleReadStatus = (id) => {
        // TODO: API call to update read status
        setNotifications(
            notifications.map(n =>
                n.id === id ? { ...n, read: !n.read } : n
            )
        );
    };

    const markAllAsRead = () => {
        // TODO: API call to mark all as read
        setNotifications(notifications.map(n => ({ ...n, read: true })));
    };

    const deleteAllNotifications = () => {
        if (window.confirm("Are you sure you want to delete all notifications? This action cannot be undone.")) {
            // TODO: API call to delete all notifications
            setNotifications([]);
            alert("All notifications deleted. (Placeholder)");
        }
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
                            {item.badge && <span className="student-page-nav-badge">{item.badge}</span>}
                        </Link>
                    ))}
                </nav>
            </div>

            {/* Main Content */}
            <div className="student-page-main-content">
                <header className="student-page-main-header">
                    <div className="student-page-header-content">
                        <h1 className="student-page-header-title">Notifications</h1> {/* Page Specific Title */}
                        <div className="student-page-header-actions">
                            <button className="student-page-notification-button" title="Notifications">
                                <i className="fas fa-bell"></i>
                            </button>
                            <div className="student-page-user-profile">
                                <span className="student-page-user-name">Jane S.</span>
                                <div className="student-page-user-avatar">JS</div>
                            </div>
                            <button onClick={handleLogout} className="logout-button" title="Logout">
                                <i className="fas fa-sign-out-alt"></i>
                                <span className="logout-text">Logout</span>
                            </button>
                        </div>
                    </div>
                </header>

                <main className="student-page-content-area">
                    {/* Notifications Specific Content */}
                    <div className="notifications-container">
                        <div className="notifications-header-bar">
                            <div className="notification-filters">
                                <button
                                    onClick={() => setFilter('all')}
                                    className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
                                >
                                    All Notifications
                                </button>
                                <button
                                    onClick={() => setFilter('unread')}
                                    className={`filter-btn ${filter === 'unread' ? 'active' : ''}`}
                                >
                                    Unread ({notifications.filter(n => !n.read).length})
                                </button>
                            </div>
                            <div className="notification-actions-top">
                                <button onClick={markAllAsRead} className="action-btn-notif mark-all-read-btn" disabled={notifications.every(n => n.read)}>
                                    <i className="fas fa-check-double"></i> Mark all as Read
                                </button>
                                <button onClick={deleteAllNotifications} className="action-btn-notif delete-all-btn" disabled={notifications.length === 0}>
                                    <i className="fas fa-trash-alt"></i> Delete All
                                </button>
                            </div>
                        </div>

                        {filteredNotifications.length > 0 ? (
                            <ul className="notification-list">
                                {filteredNotifications.map(notification => (
                                    <li
                                        key={notification.id}
                                        className={`notification-item ${notification.read ? 'read' : 'unread'}`}
                                    >
                                        <div className="notification-icon-area">
                                            <i className={`${notification.icon || 'fas fa-info-circle'} notification-type-icon type-${notification.type}`}></i>
                                        </div>
                                        <div className="notification-content-area">
                                            <div className="notification-title-bar">
                                                <h4 className="notification-title">{notification.title}</h4>
                                                <span className="notification-date">{notification.date}</span>
                                            </div>
                                            <p className="notification-message">{notification.message}</p>
                                            {notification.link && notification.link !== '#' && (
                                                <Link to={notification.link} className="notification-link" onClick={() => !notification.read && toggleReadStatus(notification.id)}>
                                                    View Details <i className="fas fa-arrow-right"></i>
                                                </Link>
                                            )}
                                        </div>
                                        <div className="notification-item-actions">
                                            <button
                                                onClick={() => toggleReadStatus(notification.id)}
                                                className="action-btn-notif toggle-read-btn"
                                                title={notification.read ? 'Mark as Unread' : 'Mark as Read'}
                                            >
                                                <i className={notification.read ? 'fas fa-envelope-open' : 'fas fa-envelope'}></i>
                                            </button>
                                            {/* Optional: Delete single notification
                      <button className="action-btn-notif delete-single-btn" title="Delete Notification">
                        <i className="fas fa-times"></i>
                      </button>
                      */}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="no-notifications-message">
                                <i className="fas fa-bell-slash empty-icon"></i>
                                <p>{filter === 'unread' ? 'No unread notifications.' : 'You have no notifications at the moment.'}</p>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}

export default NotificationsStandalonePage;
