import React, { useState, useMemo, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
const RecruiterApprovalsSkeleton = () => (
  <>
    <style>{`
            .skeleton-box { background-color: #e0e0e0; border-radius: 8px; animation: skeleton-pulse 1.5s infinite ease-in-out; }
            .skeleton-line { width: 100%; height: 20px; margin-bottom: 10px; border-radius: 4px; }
            .skeleton-line.short { width: 60%; }
            @keyframes skeleton-pulse { 0% { background-color: #e0e0e0; } 50% { background-color: #f0f0f0; } 100% { background-color: #e0e0e0; } }
        `}</style>
    <div className="recruiter-approvals-content">
      <div className="toolbar skeleton-box" style={{ height: "60px" }}></div>
      <div
        className="table-container skeleton-box"
        style={{ padding: "20px", marginTop: "1rem" }}
      >
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

function RecruiterApprovalsPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterIndustry, setFilterIndustry] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRequestsCount, setTotalRequestsCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchApprovalRequests = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        toast.error("Please log in to view recruiter approvals.");
        navigate("/login");
        return;
      }

      setLoading(true);
      try {
        const queryParams = new URLSearchParams({
          page: currentPage,
          limit: ITEMS_PER_PAGE,
          searchTerm: searchTerm,
          industry: filterIndustry === "All" ? "" : filterIndustry,
        });

        const response = await fetch(
          `${
            import.meta.env.VITE_BACKEND_URL
          }/api/admin/recruiter-approvals?${queryParams.toString()}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch recruiter approval requests.");
        }
        const data = await response.json();
        setRequests(data.requests);
        setTotalRequestsCount(data.totalCount);
      } catch (error) {
        toast.error(error.message || "Could not fetch recruiter approvals.");
      } finally {
        setLoading(false);
      }
    };
    fetchApprovalRequests();
  }, [currentPage, searchTerm, filterIndustry, navigate]);
  const [uniqueIndustries, setUniqueIndustries] = useState(["All"]);
  useEffect(() => {
    const fetchUniqueIndustries = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) return;
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/admin/industries`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (response.ok) {
          const data = await response.json();
          setUniqueIndustries(["All", ...data.industries]);
        }
      } catch (error) {
        console.error("Failed to fetch unique industries:", error);
      }
    };
    fetchUniqueIndustries();
  }, []);

  const totalPages = Math.ceil(totalRequestsCount / ITEMS_PER_PAGE);

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

  const handleApprove = async (requestId, recruiterUserId) => {
    const token = localStorage.getItem("authToken");
    const loadingToast = toast.loading("Approving recruiter...");

    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/admin/recruiter-approvals/${requestId}/approve`,
        { method: "PATCH", headers: { Authorization: `Bearer ${token}` } }
      );

      const result = await response.json();
      toast.dismiss(loadingToast);

      if (!response.ok) {
        throw new Error(result.message || "Failed to approve recruiter.");
      }

      toast.success(result.message);
      setRequests((prevRequests) =>
        prevRequests.filter((req) => req._id !== requestId)
      );
      setTotalRequestsCount((prevCount) => prevCount - 1);
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error(error.message || "Error approving recruiter.");
    }
  };

  const handleReject = async (requestId) => {
    if (
      !window.confirm(
        "Are you sure you want to reject this recruiter application? This action cannot be undone."
      )
    ) {
      return;
    }

    const token = localStorage.getItem("authToken");
    const loadingToast = toast.loading("Rejecting recruiter...");

    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/admin/recruiter-approvals/${requestId}/reject`,
        { method: "PATCH", headers: { Authorization: `Bearer ${token}` } }
      );

      const result = await response.json();
      toast.dismiss(loadingToast);

      if (!response.ok) {
        throw new Error(result.message || "Failed to reject recruiter.");
      }

      toast.success(result.message);
      setRequests((prevRequests) =>
        prevRequests.filter((req) => req._id !== requestId)
      );
      setTotalRequestsCount((prevCount) => prevCount - 1);
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error(error.message || "Error rejecting recruiter.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    toast.success("Logged out successfully!");
    navigate("/login");
  };

  return (
    <div className="admin-dashboard-container">
      <div className="sidebar">
        <div className="sidebar-header">
          <h1 className="sidebar-title">
            Pro <span className="trck">Track</span>
          </h1>
        </div>
        <nav className="sidebar-nav">
          <Link to="/admin-dashboard" className="nav-link">
            <i className="fas fa-tachometer-alt nav-icon"></i> Dashboard
          </Link>
          <Link to="/admin-user-management" className="nav-link">
            <i className="fas fa-users nav-icon"></i> User Management
          </Link>
          <Link
            to="/admin-recruiter-approvals"
            className="nav-link active-nav-link"
          >
            <i className="fas fa-check-circle nav-icon"></i> Recruiter Approvals
          </Link>
          <Link to="/admin-analytics-reports" className="nav-link">
            <i className="fas fa-chart-bar nav-icon"></i> Analytics & Reports
          </Link>
        </nav>
      </div>

      <div className="main-content">
        <header className="main-header">
          <div className="header-content">
            <h1 className="header-title">Recruiter Approvals</h1>
            <div className="header-actions">
              <button className="notification-button" title="Notifications">
                <i className="fas fa-bell"></i>
              </button>
              <div className="user-profile">
                <span className="user-name">Admin</span>
                <div className="user-avatar">AD</div>
              </div>
              <button
                onClick={handleLogout}
                className="logout-button"
                title="Logout"
              >
                <i className="fas fa-sign-out-alt"></i>
                <span className="logout-text">Logout</span>
              </button>
            </div>
          </div>
        </header>

        <main className="content-area">
          {loading ? (
            <RecruiterApprovalsSkeleton />
          ) : (
            <div className="recruiter-approvals-content">
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
                  <select
                    value={filterIndustry}
                    onChange={handleIndustryChange}
                    className="filter-select"
                  >
                    {uniqueIndustries.map((industry) => (
                      <option key={industry} value={industry}>
                        {industry === "All" ? "All Industries" : industry}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

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
                    {requests.length > 0 ? (
                      requests.map((req) => (
                        <tr key={req._id}>
                          <td>{req.companyName}</td>{" "}
                          <td>
                            {req.contactPerson || req.user?.name || "N/A"}
                          </td>{" "}
                          <td>{req.user?.email || "N/A"}</td>{" "}
                          <td>{req.industry || "N/A"}</td>{" "}
                          <td>
                            {new Date(req.createdAt).toLocaleDateString()}
                          </td>
                          <td className="actions-cell">
                            <button
                              onClick={() =>
                                handleApprove(req._id, req.user._id)
                              }
                              className="action-button approve-button"
                              title="Approve"
                            >
                              <i className="fas fa-check"></i> Approve
                            </button>
                            <button
                              onClick={() => handleReject(req._id)}
                              className="action-button reject-button"
                              title="Reject"
                            >
                              <i className="fas fa-times"></i> Reject
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="no-requests-found">
                          No pending recruiter approvals.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {totalPages > 1 && (
                <div className="pagination-container">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="pagination-button"
                  >
                    <i className="fas fa-chevron-left"></i> Previous
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (pageNumber) => (
                      <button
                        key={pageNumber}
                        onClick={() => handlePageChange(pageNumber)}
                        className={`pagination-button ${
                          currentPage === pageNumber ? "active" : ""
                        }`}
                      >
                        {pageNumber}
                      </button>
                    )
                  )}
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

export default RecruiterApprovalsPage;
