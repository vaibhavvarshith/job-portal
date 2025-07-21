import React, { useState, useMemo, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast'; // Import toast

// --- Skeleton Loader Component ---
const UserManagementSkeleton = () => (
    <>
        <style>{`
            .skeleton-box { background-color: #e0e0e0; border-radius: 8px; animation: skeleton-pulse 1.5s infinite ease-in-out; }
            .skeleton-line { width: 100%; height: 20px; margin-bottom: 10px; border-radius: 4px; }
            .skeleton-line.short { width: 60%; }
            @keyframes skeleton-pulse { 0% { background-color: #e0e0e0; } 50% { background-color: #f0f0f0; } 100% { background-color: #e0e0e0; } }
        `}</style>
        <div className="user-management-content">
            <div className="toolbar skeleton-box" style={{ height: '60px' }}></div>
            <div className="table-container skeleton-box" style={{ padding: '20px', marginTop: '1rem' }}>
                <div className="skeleton-line"></div>
                <div className="skeleton-line short"></div>
                <div className="skeleton-line"></div>
                <div className="skeleton-line short"></div>
                <div className="skeleton-line"></div>
            </div>
        </div>
    </>
);


const ITEMS_PER_PAGE = 5;

function UserManagementPage() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true); // New loading state
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState('All');
    const [filterStatus, setFilterStatus] = useState('All');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalUsersCount, setTotalUsersCount] = useState(0); // For total count for pagination

    const navigate = useNavigate();

    // Fetch users on component mount and when filters/page change
    useEffect(() => {
        const fetchUsers = async () => {
            const token = localStorage.getItem('authToken');
            if (!token) {
                toast.error("Please log in to manage users.");
                navigate('/login');
                return;
            }

            setLoading(true);
            try {
                // Construct query parameters for search, filter, and pagination
                const queryParams = new URLSearchParams({
                    page: currentPage,
                    limit: ITEMS_PER_PAGE,
                    searchTerm: searchTerm,
                    role: filterRole === 'All' ? '' : filterRole,
                    status: filterStatus === 'All' ? '' : filterStatus,
                });

                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/admin/users?${queryParams.toString()}`, { // New backend route
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch users.');
                }
                const data = await response.json();
                setUsers(data.users);
                setTotalUsersCount(data.totalCount); // Get total count for pagination

            } catch (error) {
                toast.error(error.message || "Could not fetch users.");
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, [currentPage, searchTerm, filterRole, filterStatus, navigate]); // Re-fetch when these dependencies change


    const totalPages = Math.ceil(totalUsersCount / ITEMS_PER_PAGE);

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
        toast.info("Edit user functionality is not yet implemented.");
        // Add logic to open an edit modal or navigate to an edit page
    };

    const handleDeleteUser = async (userId) => {
        if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
            return;
        }

        const token = localStorage.getItem('authToken');
        const loadingToast = toast.loading('Deleting user...');

        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/admin/users/${userId}`, { // New delete route
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` },
            });

            const result = await response.json();
            toast.dismiss(loadingToast);

            if (!response.ok) {
                throw new Error(result.message || 'Failed to delete user.');
            }
            
            toast.success(result.message);
            // Remove from local state
            setUsers(prevUsers => prevUsers.filter(user => user._id !== userId));
            setTotalUsersCount(prevCount => prevCount - 1);

        } catch (error) {
            toast.dismiss(loadingToast);
            toast.error(error.message || "Error deleting user.");
        }
    };

    const handleChangeStatus = async (userId, currentStatus) => {
        const newStatus = prompt(`Change status for user ${userId} (Current: ${currentStatus}). Enter new status (e.g., Active, Inactive, Pending Approval):`);
        if (!newStatus || newStatus.trim() === '') {
            toast.info("No new status entered.");
            return;
        }

        const token = localStorage.getItem('authToken');
        const loadingToast = toast.loading('Updating user status...');

        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/admin/users/${userId}/status`, { // New status update route
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status: newStatus.trim() })
            });

            const result = await response.json();
            toast.dismiss(loadingToast);

            if (!response.ok) {
                throw new Error(result.message || 'Failed to update user status.');
            }
            
            toast.success(result.message);
            // Update local state
            setUsers(prevUsers =>
                prevUsers.map(user =>
                    user._id === userId ? { ...user, status: newStatus.trim() } : user
                )
            );

        } catch (error) {
            toast.dismiss(loadingToast);
            toast.error(error.message || "Error updating user status.");
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        toast.success('Logged out successfully!');
        navigate('/login');
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
                        <i className="fas fa-chart-bar nav-icon"></i> Analytics & Reports
                    </Link>
                </nav>
            </div>

            {/* Main Content */}
            <div className="main-content">
                <header className="main-header">
                    <div className="header-content">
                        <h1 className="header-title">User Management</h1>
                        <div className="header-actions">
                            <button className="notification-button" title="Notifications">
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
                    {loading ? <UserManagementSkeleton /> : (
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
                                        <option value="student">Student</option>
                                        <option value="recruiter">Recruiter</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                    <select value={filterStatus} onChange={handleStatusChange} className="filter-select">
                                        <option value="All">All Statuses</option>
                                        <option value="Active">Active</option>
                                        <option value="Inactive">Inactive</option>
                                        <option value="Pending Approval">Pending Approval</option>
                                        <option value="Rejected">Rejected</option>
                                    </select>
                                </div>
                                <button className="add-user-button" onClick={() => toast.info("Add new user functionality is not yet implemented.")}>
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
                                        {users.length > 0 ? (
                                            users.map(user => (
                                                <tr key={user._id}>
                                                    <td>{user.name || 'N/A'}</td>
                                                    <td>{user.email}</td>
                                                    <td>{user.role}</td>
                                                    <td>
                                                        <span className={`status-badge status-${user.status?.toLowerCase().replace(' ', '-') || 'active'}`}>
                                                            {user.status || 'Active'}
                                                        </span>
                                                    </td>
                                                    <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                                                    <td className="actions-cell">
                                                        <button onClick={() => handleEditUser(user._id)} className="action-button edit-button" title="Edit User">
                                                            <i className="fas fa-edit"></i>
                                                        </button>
                                                        <button onClick={() => handleChangeStatus(user._id, user.status)} className="action-button status-button" title="Change Status">
                                                            <i className="fas fa-sync-alt"></i>
                                                        </button>
                                                        <button onClick={() => handleDeleteUser(user._id)} className="action-button delete-button" title="Delete User">
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
                    )}
                </main>
            </div>
        </div>
    );
}

export default UserManagementPage;
