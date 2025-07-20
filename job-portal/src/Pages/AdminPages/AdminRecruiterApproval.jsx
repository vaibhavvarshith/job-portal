import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom'; // Assuming you use react-router-dom
// import './AdminDashboard.css'; // Re-use common layout styles
// import './RecruiterApprovalsPage.css'; // Styles specific to this page

// Mock Recruiter Data for Approvals
const initialApprovalRequests = [
    { id: 1, name: 'Tech Solutions Inc.', contactPerson: 'John Doe', email: 'john.doe@techsolutions.com', industry: 'Information Technology', appliedDate: '2023-07-10', status: 'Pending' },
    { id: 2, name: 'Innovate Hub Ltd.', contactPerson: 'Jane Smith', email: 'jane.smith@innovatehub.com', industry: 'Marketing & Advertising', appliedDate: '2023-07-12', status: 'Pending' },
    { id: 3, name: 'GreenEnergy Corp.', contactPerson: 'Robert Brown', email: 'robert.brown@greenenergy.com', industry: 'Renewable Energy', appliedDate: '2023-07-11', status: 'Pending' },
    { id: 4, name: 'HealthFirst Clinics', contactPerson: 'Emily White', email: 'emily.white@healthfirst.com', industry: 'Healthcare', appliedDate: '2023-07-14', status: 'Pending' },
    { id: 5, name: 'BuildRight Constructions', contactPerson: 'Michael Green', email: 'michael.green@buildright.com', industry: 'Construction', appliedDate: '2023-07-13', status: 'Pending' },
    { id: 6, name: 'EduGrowth Partners', contactPerson: 'Sarah Davis', email: 'sarah.davis@edugrowth.com', industry: 'Education', appliedDate: '2023-07-15', status: 'Pending' },
];

const ITEMS_PER_PAGE = 5;

function RecruiterApprovalsPage() {
    const [requests, setRequests] = useState(initialApprovalRequests);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterIndustry, setFilterIndustry] = useState('All');
    const [currentPage, setCurrentPage] = useState(1);

    const uniqueIndustries = useMemo(() => {
        const industries = new Set(initialApprovalRequests.map(req => req.industry));
        return ['All', ...Array.from(industries)];
    }, []);


    const filteredRequests = useMemo(() => {
        return requests.filter(req => {
            const companyMatch = req.name.toLowerCase().includes(searchTerm.toLowerCase());
            const contactMatch = req.contactPerson.toLowerCase().includes(searchTerm.toLowerCase());
            const emailMatch = req.email.toLowerCase().includes(searchTerm.toLowerCase());
            const industryMatch = filterIndustry === 'All' || req.industry === filterIndustry;
            return (companyMatch || contactMatch || emailMatch) && industryMatch && req.status === 'Pending'; // Only show pending
        });
    }, [requests, searchTerm, filterIndustry]);

    const paginatedRequests = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredRequests.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [filteredRequests, currentPage]);

    const totalPages = Math.ceil(filteredRequests.length / ITEMS_PER_PAGE);

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
        setCurrentPage(1);
    };

    const handleIndustryChange = (event) => {
        setFilterIndustry(event.target.value);
        setCurrentPage(1);
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleApprove = (requestId) => {
        console.log(`Approve recruiter: ${requestId}`);
        // API call to approve recruiter
        // Update local state to reflect approval (e.g., remove from pending or change status)
        setRequests(prevRequests => prevRequests.filter(req => req.id !== requestId));
        // Or update status:
        // setRequests(prevRequests =>
        //   prevRequests.map(req =>
        //     req.id === requestId ? { ...req, status: 'Approved' } : req
        //   )
        // );
    };

    const handleReject = (requestId) => {
        console.log(`Reject recruiter: ${requestId}`);
        if (window.confirm('Are you sure you want to reject this recruiter application?')) {
            // API call to reject recruiter
            setRequests(prevRequests => prevRequests.filter(req => req.id !== requestId));
            // Or update status:
            // setRequests(prevRequests =>
            //   prevRequests.map(req =>
            //     req.id === requestId ? { ...req, status: 'Rejected' } : req
            //   )
            // );
        }
    };
    const handleLogout = () => {
        // Implement your logout logic here
        // e.g., clear tokens, call a logout API, redirect
        console.log('Admin logged out');
        navigate('/login'); // Example: Redirect to login page
    };

    return (
        <div className="admin-dashboard-container">
            {/* Sidebar */}
            <div className="sidebar">
                <div className="sidebar-header">
                    <h1 className="sidebar-title">Pro <span className="trck">Track</span></h1>
                </div>
                <nav className="sidebar-nav">
                    <Link to="/admin-dashboard" className="nav-link">
                        <i className="fas fa-tachometer-alt nav-icon"></i> Dashboard
                    </Link>
                    <Link to="/admin-user-management" className="nav-link">
                        <i className="fas fa-users nav-icon"></i> User Management
                    </Link>
                    <Link to="/admin-recruiter-approvals" className="nav-link active-nav-link"> {/* Active link */}
                        <i className="fas fa-check-circle nav-icon"></i> Recruiter Approvals
                    </Link>
                    <Link to="/admin-analytics-reports" className="nav-link">
                        <i className="fas fa-chart-bar nav-icon"></i> Analytics
                    </Link>
                </nav>
            </div>

            {/* Main Content */}
            <div className="main-content">
                <header className="main-header">
                    <div className="header-content">
                        <h1 className="header-title">Recruiter Approvals</h1>
                        <div className="header-actions">
                            <button className="notification-button">
                                <i className="fas fa-bell"></i>
                            </button>
                            <div className="user-profile">
                                <span className="user-name">Admin</span>
                                <div className="user-avatar">AD</div>
                            </div>
                            <button onClick={handleLogout} className="logout-button" title="Logout">
                                <i className="fas fa-sign-out-alt"></i>
                                <span className="logout-text">Logout</span>
                            </button>
                        </div>
                    </div>
                </header>

                <main className="content-area">
                    <div className="recruiter-approvals-content">
                        {/* Toolbar: Search, Filters */}
                        <div className="toolbar">
                            <div className="search-container">
                                <i className="fas fa-search search-icon"></i>
                                <input
                                    type="text"
                                    placeholder="Search by company, contact, or email..."
                                    className="search-input"
                                    value={searchTerm}
                                    onChange={handleSearchChange}
                                />
                            </div>
                            <div className="filters-container">
                                <select value={filterIndustry} onChange={handleIndustryChange} className="filter-select">
                                    {uniqueIndustries.map(industry => (
                                        <option key={industry} value={industry}>{industry === 'All' ? 'All Industries' : industry}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Approvals Table/List */}
                        <div className="table-container">
                            <table className="approvals-table">
                                <thead>
                                    <tr>
                                        <th>Company Name</th>
                                        <th>Contact Person</th>
                                        <th>Email</th>
                                        <th>Industry</th>
                                        <th>Date Applied</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paginatedRequests.length > 0 ? (
                                        paginatedRequests.map(req => (
                                            <tr key={req.id}>
                                                <td>{req.name}</td>
                                                <td>{req.contactPerson}</td>
                                                <td>{req.email}</td>
                                                <td>{req.industry}</td>
                                                <td>{req.appliedDate}</td>
                                                <td className="actions-cell">
                                                    <button onClick={() => handleApprove(req.id)} className="action-button approve-button" title="Approve">
                                                        <i className="fas fa-check"></i> Approve
                                                    </button>
                                                    <button onClick={() => handleReject(req.id)} className="action-button reject-button" title="Reject">
                                                        <i className="fas fa-times"></i> Reject
                                                    </button>
                                                    {/* Optionally, a view details button */}
                                                    {/* <button className="action-button view-button" title="View Details">
                            <i className="fas fa-eye"></i>
                          </button> */}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="6" className="no-requests-found">No pending recruiter approvals.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="pagination-container">
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="pagination-button"
                                >
                                    <i className="fas fa-chevron-left"></i> Previous
                                </button>
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNumber => (
                                    <button
                                        key={pageNumber}
                                        onClick={() => handlePageChange(pageNumber)}
                                        className={`pagination-button ${currentPage === pageNumber ? 'active' : ''}`}
                                    >
                                        {pageNumber}
                                    </button>
                                ))}
                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className="pagination-button"
                                >
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

export default RecruiterApprovalsPage;
