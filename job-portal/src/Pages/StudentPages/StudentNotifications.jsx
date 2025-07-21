import React, { useState, useMemo, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const StudentNotificationsSkeleton = () => (
    <>
        <style>{`
            .skeleton-box { background-color: #e0e0e0; border-radius: 8px; animation: skeleton-pulse 1.5s infinite ease-in-out; }
            .skeleton-line { width: 100%; height: 20px; margin-bottom: 10px; border-radius: 4px; }
            .skeleton-line.short { width: 60%; }
            @keyframes skeleton-pulse { 0% { background-color: #e0e0e0; } 50% { background-color: #f0f0f0; } 100% { background-color: #e0e0e0; } }
        `}</style>
        <div className="notifications-container">
            <div className="notifications-header-bar skeleton-box" style={{ height: '60px' }}></div>
            <div className="notification-list" style={{ padding: '1rem' }}>
                <div className="notification-item skeleton-box" style={{ height: '80px', marginBottom: '1rem' }}></div>
                <div className="notification-item skeleton-box" style={{ height: '80px', marginBottom: '1rem' }}></div>
                <div className="notification-item skeleton-box" style={{ height: '80px', marginBottom: '1rem' }}></div>
            </div>
        </div>
    </>
);

const navItems = [
    { path: '/student-dashboard', icon: 'fas fa-tachometer-alt', label: 'Dashboard' },
    { path: '/student-profile', icon: 'fas fa-user-circle', label: 'My Profile' },
    { path: '/student-resume', icon: 'fas fa-file-alt', label: 'Resume Manager' },
    { path: '/student-applications', icon: 'fas fa-inbox', label: 'Applications' },
    { path: '/student-notifications', icon: 'fas fa-bell', label: 'Notifications' },
];

function NotificationsStandalonePage() {
    const location = useLocation();
    const navigate = useNavigate();

    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');     const [studentData, setStudentData] = useState(null); 
        useEffect(() => {
        const fetchNotificationsAndProfile = async () => {
            const token = localStorage.getItem('authToken');
            if (!token) {
                toast.error("Please log in to view your notifications.");
                navigate('/login');
                return;
            }

            try {
                                const notificationsRes = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/student/notifications`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                                const profileRes = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/profile/student`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (!notificationsRes.ok) {
                    throw new Error('Failed to fetch notifications.');
                }
                const notificationsData = await notificationsRes.json();
                setNotifications(notificationsData);

                if (profileRes.ok) {
                    const profileData = await profileRes.json();
                    setStudentData(profileData);
                } else if (profileRes.status === 404) {
                    console.warn("Student profile not found, using default for header.");
                } else {
                    throw new Error('Failed to fetch student profile for header.');
                }

            } catch (error) {
                toast.error(error.message || "Could not fetch data.");
            } finally {
                setLoading(false);
            }
        };

        fetchNotificationsAndProfile();
    }, [navigate]);

    const filteredNotifications = useMemo(() => {
        if (filter === 'unread') {
            return notifications.filter(n => !n.read);
        }
        return notifications;
    }, [notifications, filter]);

    const toggleReadStatus = async (id) => {
        const token = localStorage.getItem('authToken');
        const notificationToUpdate = notifications.find(n => n._id === id);
        if (!notificationToUpdate) return;

        const newReadStatus = !notificationToUpdate.read;
        const loadingToast = toast.loading(newReadStatus ? 'Marking as read...' : 'Marking as unread...');

        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/student/notifications/${id}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ read: newReadStatus })
            });

            const result = await response.json();
            toast.dismiss(loadingToast);

            if (!response.ok) {
                throw new Error(result.message || 'Failed to update notification status.');
            }

            toast.success('Notification status updated!');
            setNotifications(
                notifications.map(n =>
                    n._id === id ? { ...n, read: newReadStatus } : n
                )
            );
        } catch (error) {
            toast.dismiss(loadingToast);
            toast.error(error.message || "Error updating notification status.");
        }
    };

    const markAllAsRead = async () => {
        const unreadNotifications = notifications.filter(n => !n.read);
        if (unreadNotifications.length === 0) return;

        const token = localStorage.getItem('authToken');
        const loadingToast = toast.loading('Marking all as read...');

        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/student/notifications/mark-all-read`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            });

            const result = await response.json();
            toast.dismiss(loadingToast);

            if (!response.ok) {
                throw new Error(result.message || 'Failed to mark all as read.');
            }

            toast.success('All notifications marked as read!');
            setNotifications(notifications.map(n => ({ ...n, read: true })));
        } catch (error) {
            toast.dismiss(loadingToast);
            toast.error(error.message || "Error marking all notifications as read.");
        }
    };

    const deleteAllNotifications = async () => {
        if (!window.confirm("Are you sure you want to delete all notifications? This action cannot be undone.")) {
            return;
        }

        const token = localStorage.getItem('authToken');
        const loadingToast = toast.loading('Deleting all notifications...');

        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/student/notifications`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` },
            });

            const result = await response.json();
            toast.dismiss(loadingToast);

            if (!response.ok) {
                throw new Error(result.message || 'Failed to delete all notifications.');
            }

            toast.success('All notifications deleted!');
            setNotifications([]);
        } catch (error) {
            toast.dismiss(loadingToast);
            toast.error(error.message || "Error deleting all notifications.");
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        toast.success("Logged out successfully!");
        navigate('/login');
    };

    return (
        <div className="student-page-layout-container">
            
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
                            
                        </Link>
                    ))}
                </nav>
            </div>

            
            <div className="student-page-main-content">
                <header className="student-page-main-header">
                    <div className="student-page-header-content">
                        <h1 className="student-page-header-title">Notifications</h1>
                        <div className="student-page-header-actions">
                            <button className="student-page-notification-button" title="Notifications">
                                <i className="fas fa-bell"></i>
                                
                            </button>
                            <div className="student-page-user-profile">
                                <span className="student-page-user-name">{studentData?.fullName?.split(' ')[0] || 'Student'}</span>
                                <div className="student-user-avatar">
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
                    {loading ? <StudentNotificationsSkeleton /> : (
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
                                            key={notification._id}                                             className={`notification-item ${notification.read ? 'read' : 'unread'}`}
                                        >
                                            <div className="notification-icon-area">
                                                <i className={`${notification.icon || 'fas fa-info-circle'} notification-type-icon type-${notification.type}`}></i>
                                            </div>
                                            <div className="notification-content-area">
                                                <div className="notification-title-bar">
                                                    <h4 className="notification-title">{notification.title}</h4>
                                                    <span className="notification-date">{new Date(notification.createdAt).toLocaleString()}</span> 
                                                </div>
                                                <p className="notification-message">{notification.message}</p>
                                                {notification.link && notification.link !== '#' && (
                                                    <Link to={notification.link} className="notification-link" onClick={() => !notification.read && toggleReadStatus(notification._id)}>
                                                        View Details <i className="fas fa-arrow-right"></i>
                                                    </Link>
                                                )}
                                            </div>
                                            <div className="notification-item-actions">
                                                <button
                                                    onClick={() => toggleReadStatus(notification._id)}
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
                    )}
                </main>
            </div>
        </div>
    );
}

export default NotificationsStandalonePage;
