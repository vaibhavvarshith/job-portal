import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom'; // Assuming you use react-router-dom
// import './AdminDashboard.css'; // Re-use common layout styles
// import './UserManagementPage.css'; // Styles specific to this page

// Mock User Data
const initialUsers = [
    { id: 1, name: 'Ayush Verma', email: 'ayush@example.com', role: 'Student', status: 'Active', joinedDate: '2023-01-15' },
    { id: 2, name: 'Suraj Kumar', email: 'suraj@example.com', role: 'Recruiter', status: 'Active', joinedDate: '2023-02-20' },
    { id: 3, name: 'Prem', email: 'Prem@example.com', role: 'Student', status: 'Pending Approval', joinedDate: '2023-03-10' },
    { id: 4, name: 'Ankita Patil', email: 'ankita@example.com', role: 'Admin', status: 'Active', joinedDate: '2022-12-01' },
    { id: 5, name: 'Ravi Jogi', email: 'ravi@example.com', role: 'Recruiter', status: 'Inactive', joinedDate: '2023-04-05' },
    { id: 6, name: 'Vishal Kumar', email: 'vishal@example.com', role: 'Student', status: 'Active', joinedDate: '2023-05-01' },
    { id: 7, name: 'George Jetson', email: 'george@example.com', role: 'Recruiter', status: 'Active', joinedDate: '2023-01-25' },
    { id: 8, name: 'Hannah Montana', email: 'hannah@example.com', role: 'Student', status: 'Inactive', joinedDate: '2023-06-11' },
    { id: 9, name: 'Ivan Drago', email: 'ivan@example.com', role: 'Recruiter', status: 'Pending Approval', joinedDate: '2023-07-01' },
    { id: 10, name: 'Julia Child', email: 'julia@example.com', role: 'Admin', status: 'Active', joinedDate: '2023-02-15' },
];

// Number of items to display per page for pagination
const ITEMS_PER_PAGE = 5;

function UserManagementPage() {
    const [users, setUsers] = useState(initialUsers);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState('All'); // All, Student, Recruiter, Admin
    const [filterStatus, setFilterStatus] = useState('All'); // All, Active, Inactive, Pending Approval
    const [currentPage, setCurrentPage] = useState(1);

    // Memoized filtered users based on search and filters
    const filteredUsers = useMemo(() => {
        return users.filter(user => {
            const nameMatch = user.name.toLowerCase().includes(searchTerm.toLowerCase());
            const emailMatch = user.email.toLowerCase().includes(searchTerm.toLowerCase());
            const roleMatch = filterRole === 'All' || user.role === filterRole;
            const statusMatch = filterStatus === 'All' || user.status === filterStatus;
            return (nameMatch || emailMatch) && roleMatch && statusMatch;
        });
    }, [users, searchTerm, filterRole, filterStatus]);

    // Memoized paginated users
    const paginatedUsers = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredUsers.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [filteredUsers, currentPage]);

    const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
        setCurrentPage(1); // Reset to first page on search
    };

    const handleRoleChange = (event) => {
        setFilterRole(event.target.value);
        setCurrentPage(1); // Reset to first page on filter change
    };

    const handleStatusChange = (event) => {
        setFilterStatus(event.target.value);
        setCurrentPage(1); // Reset to first page on filter change
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // Placeholder action handlers
    const handleEditUser = (userId) => {
        console.log(`Edit user: ${userId}`);
        // Add logic to open an edit modal or navigate to an edit page
    };

    const handleDeleteUser = (userId) => {
        console.log(`Delete user: ${userId}`);
        if (window.confirm('Are you sure you want to delete this user?')) {
            setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
        }
    };

    const handleChangeStatus = (userId, currentStatus) => {
        console.log(`Change status for user: ${userId} from ${currentStatus}`);
        // This would typically involve a modal to select new status and an API call
        // For demo, let's cycle through statuses (very basic)
        const newStatus = currentStatus === 'Active' ? 'Inactive' : currentStatus === 'Inactive' ? 'Pending Approval' : 'Active';
        setUsers(prevUsers =>
            prevUsers.map(user =>
                user.id === userId ? { ...user, status: newStatus } : user
            )
        );
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
                    <Link to="/admin-user-management" className="nav-link active-nav-link"> {/* Active link */}
                        <i className="fas fa-users nav-icon"></i> User Management
                    </Link>
                    <Link to="/admin-recruiter-approvals" className="nav-link">
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
                        <h1 className="header-title">User Management</h1>
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
                    <div className="user-management-content">
                        {/* Toolbar: Search, Filters, Add User Button */}
                        <div className="toolbar">
                            <div className="search-container">
                                <i className="fas fa-search search-icon"></i>
                                <input
                                    type="text"
                                    placeholder="Search by name or email..."
                                    className="search-input"
                                    value={searchTerm}
                                    onChange={handleSearchChange}
                                />
                            </div>
                            <div className="filters-container">
                                <select value={filterRole} onChange={handleRoleChange} className="filter-select">
                                    <option value="All">All Roles</option>
                                    <option value="Student">Student</option>
                                    <option value="Recruiter">Recruiter</option>
                                    <option value="Admin">Admin</option>
                                </select>
                                <select value={filterStatus} onChange={handleStatusChange} className="filter-select">
                                    <option value="All">All Statuses</option>
                                    <option value="Active">Active</option>
                                    <option value="Inactive">Inactive</option>
                                    <option value="Pending Approval">Pending Approval</option>
                                </select>
                            </div>
                            <button className="add-user-button">
                                <i className="fas fa-plus button-icon"></i> Add New User
                            </button>
                        </div>

                        {/* Users Table */}
                        <div className="table-container">
                            <table className="users-table">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Role</th>
                                        <th>Status</th>
                                        <th>Joined Date</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paginatedUsers.length > 0 ? (
                                        paginatedUsers.map(user => (
                                            <tr key={user.id}>
                                                <td>{user.name}</td>
                                                <td>{user.email}</td>
                                                <td>{user.role}</td>
                                                <td>
                                                    <span className={`status-badge status-${user.status.toLowerCase().replace(' ', '-')}`}>
                                                        {user.status}
                                                    </span>
                                                </td>
                                                <td>{user.joinedDate}</td>
                                                <td className="actions-cell">
                                                    <button onClick={() => handleEditUser(user.id)} className="action-button edit-button" title="Edit User">
                                                        <i className="fas fa-edit"></i>
                                                    </button>
                                                    <button onClick={() => handleChangeStatus(user.id, user.status)} className="action-button status-button" title="Change Status">
                                                        <i className="fas fa-sync-alt"></i>
                                                    </button>
                                                    <button onClick={() => handleDeleteUser(user.id)} className="action-button delete-button" title="Delete User">
                                                        <i className="fas fa-trash-alt"></i>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="6" className="no-users-found">No users found matching your criteria.</td>
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

export default UserManagementPage;
