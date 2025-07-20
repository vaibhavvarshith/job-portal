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

// Mock Application Data
const initialApplications = [
    { id: 1, jobId: 101, jobTitle: 'Software Engineer Intern', company: 'Tech Solutions Inc.', dateApplied: '2023-07-01', status: 'Under Review', lastUpdate: '2023-07-05' },
    { id: 2, jobId: 102, jobTitle: 'Frontend Developer (Junior)', company: 'Innovate Hub Ltd.', dateApplied: '2023-06-25', status: 'Interview Scheduled', interviewDate: '2023-07-15', interviewTime: '10:00 AM PST', lastUpdate: '2023-07-02' },
    { id: 3, jobId: 103, jobTitle: 'Data Analyst Intern', company: 'GreenEnergy Corp.', dateApplied: '2023-06-10', status: 'Offer Extended', offerDeadline: '2023-07-20', lastUpdate: '2023-07-08' },
    { id: 4, jobId: 104, jobTitle: 'Product Manager', company: 'HealthFirst Clinics', dateApplied: '2023-05-15', status: 'Rejected', lastUpdate: '2023-06-01' },
    { id: 5, jobId: 105, jobTitle: 'UX/UI Design Intern', company: 'Creative Spark Agency', dateApplied: '2023-07-05', status: 'Applied', lastUpdate: '2023-07-05' },
    { id: 6, jobId: 106, jobTitle: 'Backend Developer', company: 'SecureNet Systems', dateApplied: '2023-06-20', status: 'Interview Scheduled', interviewDate: '2023-07-18', interviewTime: '02:00 PM EST', lastUpdate: '2023-07-10' },
];

const ITEMS_PER_PAGE = 5;

function ApplicationsStandalonePage() {
    const location = useLocation(); // To determine the active link

    const [applications, setApplications] = useState(initialApplications);
    const [filterStatus, setFilterStatus] = useState('All'); // All, Applied, Under Review, Interview Scheduled, Offer Extended, Rejected
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    const uniqueStatuses = useMemo(() => ['All', ...new Set(initialApplications.map(app => app.status))], []);

    const filteredApplications = useMemo(() => {
        return applications.filter(app => {
            const searchLower = searchTerm.toLowerCase();
            const titleMatch = app.jobTitle.toLowerCase().includes(searchLower);
            const companyMatch = app.company.toLowerCase().includes(searchLower);
            const statusMatch = filterStatus === 'All' || app.status === filterStatus;
            return (titleMatch || companyMatch) && statusMatch;
        });
    }, [applications, searchTerm, filterStatus]);

    const paginatedApplications = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredApplications.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [filteredApplications, currentPage]);

    const totalPages = Math.ceil(filteredApplications.length / ITEMS_PER_PAGE);

    const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

    const getStatusClass = (status) => {
        return status.toLowerCase().replace(/\s+/g, '-');
    };

    const handleWithdrawApplication = (appId) => {
        if (window.confirm("Are you sure you want to withdraw this application? This action cannot be undone.")) {
            // TODO: API call to withdraw application
            setApplications(prevApps => prevApps.filter(app => app.id !== appId));
            console.log(`Withdrew application ID: ${appId}`);
            alert(`Application ID ${appId} withdrawn. (Placeholder)`);
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
                        <h1 className="student-page-header-title">My Applications</h1> {/* Page Specific Title */}
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
                    {/* Applications Specific Content */}
                    <div className="applications-container">
                        <div className="applications-toolbar">
                            <input
                                type="text"
                                placeholder="Search by job title or company..."
                                value={searchTerm}
                                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                                className="applications-search-input"
                            />
                            <select value={filterStatus} onChange={(e) => { setFilterStatus(e.target.value); setCurrentPage(1); }} className="applications-filter-select">
                                {uniqueStatuses.map(status => (
                                    <option key={status} value={status}>{status}</option>
                                ))}
                            </select>
                        </div>

                        {paginatedApplications.length > 0 ? (
                            <div className="applications-table-container">
                                <table className="applications-table">
                                    <thead>
                                        <tr>
                                            <th>Job Title</th>
                                            <th>Company</th>
                                            <th>Date Applied</th>
                                            <th>Status</th>
                                            <th>Last Update</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {paginatedApplications.map(app => (
                                            <tr key={app.id}>
                                                <td>
                                                    {/* Assuming a job details page might exist at /student/job-details/:jobId */}
                                                    <Link to={`/student/job-details/${app.jobId}`} className="job-title-link">{app.jobTitle}</Link>
                                                </td>
                                                <td>{app.company}</td>
                                                <td>{app.dateApplied}</td>
                                                <td>
                                                    <span className={`application-status-badge status-${getStatusClass(app.status)}`}>
                                                        {app.status}
                                                    </span>
                                                    {app.status === 'Interview Scheduled' && app.interviewDate && (
                                                        <span className="interview-details">
                                                            <i className="fas fa-calendar-alt"></i> {app.interviewDate} at {app.interviewTime}
                                                        </span>
                                                    )}
                                                    {app.status === 'Offer Extended' && app.offerDeadline && (
                                                        <span className="offer-details">
                                                            <i className="fas fa-hourglass-half"></i> Deadline: {app.offerDeadline}
                                                        </span>
                                                    )}
                                                </td>
                                                <td>{app.lastUpdate}</td>
                                                <td className="application-actions-cell">
                                                    <button className="action-btn-app view-details-btn" title="View Details">
                                                        <i className="fas fa-eye"></i>
                                                    </button>
                                                    {(app.status === 'Applied' || app.status === 'Under Review') && (
                                                        <button
                                                            onClick={() => handleWithdrawApplication(app.id)}
                                                            className="action-btn-app withdraw-btn"
                                                            title="Withdraw Application"
                                                        >
                                                            <i className="fas fa-times-circle"></i>
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="no-applications-found">
                                <i className="fas fa-folder-open empty-icon"></i>
                                <p>You haven't applied to any jobs yet, or no applications match your filters.</p>
                                <Link to="/student/job-listings" className="find-jobs-link">Find Jobs</Link>
                            </div>
                        )}

                        {totalPages > 1 && (
                            <div className="pagination-controls-apps">
                                <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                                    <i className="fas fa-chevron-left"></i> Previous
                                </button>
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map(num => (
                                    <button
                                        key={num}
                                        onClick={() => handlePageChange(num)}
                                        className={currentPage === num ? 'active' : ''}
                                    >
                                        {num}
                                    </button>
                                ))}
                                <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                                    Next <i className="fas fa-chevron-right"></i>
                                </button>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}

export default ApplicationsStandalonePage;
