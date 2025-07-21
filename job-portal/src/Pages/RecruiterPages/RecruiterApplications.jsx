import React, { useState, useMemo, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const ApplicationsSkeleton = () => (
  <>
    <style>{`
            .skeleton-box { background-color: #e0e0e0; border-radius: 8px; animation: skeleton-pulse 1.5s infinite ease-in-out; }
            .skeleton-line { width: 100%; height: 20px; margin-bottom: 10px; border-radius: 4px; }
            .skeleton-line.short { width: 60%; }
            @keyframes skeleton-pulse { 0% { background-color: #e0e0e0; } 50% { background-color: #f0f0f0; } 100% { background-color: #e0e0e0; } }
        `}</style>
    <div className="applications-approval-container">
      <div className="applications-approval-toolbar">
        <div
          className="skeleton-box"
          style={{ height: "40px", flexGrow: 1, marginRight: "1rem" }}
        ></div>
        <div
          className="skeleton-box"
          style={{ height: "40px", width: "150px", marginRight: "1rem" }}
        ></div>
        <div
          className="skeleton-box"
          style={{ height: "40px", width: "150px" }}
        ></div>
      </div>
      <div
        className="applications-approval-table-container skeleton-box"
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

const navItems = [
  {
    path: "/recruiter-dashboard",
    icon: "fas fa-tachometer-alt",
    label: "Dashboard",
  },
  {
    path: "/recruiter-post-job",
    icon: "fas fa-plus-square",
    label: "Post a Job",
  },
  {
    path: "/recruiter-post-internship",
    icon: "fas fa-graduation-cap",
    label: "Post an Internship",
  },
  {
    path: "/recruiter-applications-approval",
    icon: "fas fa-check-circle",
    label: "Applications Approval",
  },
  {
    path: "/recruiter-company-profile",
    icon: "fas fa-building",
    label: "Company Profile",
  },
];

const ITEMS_PER_PAGE = 5;

function ApplicationsApprovalStandalonePage() {
  const location = useLocation();
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterJobType, setFilterJobType] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [companyData, setCompanyData] = useState(null);
  useEffect(() => {
    console.log("Backend URL being used:", import.meta.env.VITE_BACKEND_URL);
    const fetchPageData = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        toast.error("Please log in to view applications.");
        navigate("/login");
        return;
      }

      try {
        const [appsRes, profileRes] = await Promise.all([
          fetch(
            `${import.meta.env.VITE_BACKEND_URL}/api/applications/recruiter`,
            { headers: { Authorization: `Bearer ${token}` } }
          ),
          fetch(`${import.meta.env.VITE_BACKEND_URL}/api/profile/recruiter`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (!appsRes.ok) {
          throw new Error("Failed to fetch applications.");
        }

        const appsData = await appsRes.json();
        setApplications(appsData);

        if (profileRes.ok) {
          const profileData = await profileRes.json();
          setCompanyData(profileData);
        }
      } catch (error) {
        toast.error(error.message || "Could not fetch data.");
      } finally {
        setLoading(false);
      }
    };

    fetchPageData();
  }, [navigate]);

  const uniqueJobTypes = useMemo(
    () => [
      "All",
      ...new Set(applications.map((app) => app.jobId?.jobType).filter(Boolean)),
    ],
    [applications]
  );
  const uniqueStatuses = useMemo(
    () => ["All", ...new Set(applications.map((app) => app.status))],
    [applications]
  );

  const filteredApplications = useMemo(() => {
    return applications.filter((app) => {
      const searchLower = searchTerm.toLowerCase();
      const studentName = app.studentId?.name || "";
      const jobTitle = app.jobId?.jobTitle || "";
      const jobType = app.jobId?.jobType || "";

      const nameMatch = studentName.toLowerCase().includes(searchLower);
      const titleMatch = jobTitle.toLowerCase().includes(searchLower);
      const jobTypeMatch = filterJobType === "All" || jobType === filterJobType;
      const statusMatch = filterStatus === "All" || app.status === filterStatus;

      return (nameMatch || titleMatch) && jobTypeMatch && statusMatch;
    });
  }, [applications, searchTerm, filterJobType, filterStatus]);

  const paginatedApplications = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredApplications.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredApplications, currentPage]);

  const totalPages = Math.ceil(filteredApplications.length / ITEMS_PER_PAGE);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  const handleAction = async (appId, action) => {
    const token = localStorage.getItem("authToken");
    const loadingToast = toast.loading("Updating status...");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/applications/${appId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: action }),
        }
      );

      const result = await response.json();
      toast.dismiss(loadingToast);

      if (!response.ok) {
        throw new Error(result.message || "Failed to update status.");
      }

      toast.success("Status updated successfully!");
      setApplications((prevApps) =>
        prevApps.map((app) =>
          app._id === appId ? { ...app, status: action } : app
        )
      );
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error(error.message);
    }
  };

  const getStatusClass = (status) => {
    if (!status) return "";
    return status.toLowerCase().replace(/\s+/g, "-");
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    toast.success("Logged out successfully!");
    navigate("/login");
  };

  return (
    <div className="recruiter-page-layout-container">
      <div className="recruiter-page-sidebar">
        <div className="recruiter-page-sidebar-header">
          <h1 className="recruiter-page-sidebar-title">
            Pro<span className="trck">Track</span>
          </h1>
        </div>
        <nav className="recruiter-page-sidebar-nav">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`recruiter-page-nav-link ${
                location.pathname === item.path ? "active" : ""
              }`}
            >
              <i className={`${item.icon} recruiter-page-nav-icon`}></i>
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="recruiter-page-main-content">
        <header className="recruiter-page-main-header">
          <div className="recruiter-page-header-content">
            <h1 className="recruiter-page-header-title">
              Applications Approval
            </h1>
            <div className="recruiter-page-header-actions">
              <button
                className="recruiter-page-notification-button"
                title="Notifications"
              >
                <i className="fas fa-bell"></i>
                <span className="recruiter-notification-dot"></span>
              </button>
              <div className="recruiter-page-user-profile">
                <span className="recruiter-page-user-name">
                  {companyData?.companyName || "Recruiter"}
                </span>
                <div className="recruiter-page-user-avatar">
                  {companyData?.logoUrl &&
                  !companyData.logoUrl.includes("placehold.co") ? (
                    <img
                      src={companyData.logoUrl}
                      alt="Logo"
                      className="header-logo-img"
                    />
                  ) : companyData?.companyName ? (
                    companyData.companyName.substring(0, 2).toUpperCase()
                  ) : (
                    "CO"
                  )}
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="recruiter-logout-button"
                title="Logout"
              >
                <i className="fas fa-sign-out-alt"></i>
                <span className="recruiter-logout-text">Logout</span>
              </button>
            </div>
          </div>
        </header>

        <main className="recruiter-page-content-area">
          {loading ? (
            <ApplicationsSkeleton />
          ) : (
            <div className="applications-approval-container">
              <div className="applications-approval-toolbar">
                <input
                  type="text"
                  placeholder="Search by student name or job title..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="applications-approval-search-input"
                />
                <select
                  value={filterJobType}
                  onChange={(e) => {
                    setFilterJobType(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="applications-approval-filter-select"
                >
                  {uniqueJobTypes.map((type) => (
                    <option key={type} value={type}>
                      {type === "All" ? "All Types" : type}
                    </option>
                  ))}
                </select>
                <select
                  value={filterStatus}
                  onChange={(e) => {
                    setFilterStatus(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="applications-approval-filter-select"
                >
                  {uniqueStatuses.map((status) => (
                    <option key={status} value={status}>
                      {status === "All" ? "All Statuses" : status}
                    </option>
                  ))}
                </select>
              </div>

              {paginatedApplications.length > 0 ? (
                <div className="applications-approval-table-container">
                  <table className="applications-approval-table">
                    <thead>
                      <tr>
                        <th>Student Name</th>
                        <th>Applied For</th>
                        <th>Type</th>
                        <th>Date Applied</th>
                        <th>Current Status</th>
                        <th>Documents</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedApplications.map((app) => (
                        <tr key={app._id}>
                          <td>
                            <Link
                              to={`/student/profile/${app.studentId?._id}`}
                              className="student-profile-link"
                              title="View Student Profile"
                            >
                              {app.studentId?.name || "N/A"}
                            </Link>
                          </td>
                          <td>{app.jobId?.jobTitle || "N/A"}</td>
                          <td>{app.jobId?.jobType || "N/A"}</td>
                          <td>
                            {new Date(app.createdAt).toLocaleDateString()}
                          </td>
                          <td>
                            <span
                              className={`app-status-badge status-${getStatusClass(
                                app.status
                              )}`}
                            >
                              {app.status}
                            </span>
                          </td>
                          <td className="document-links">
                            <a
                              href={"#"}
                              target="_blank"
                              rel="noopener noreferrer"
                              title="View Resume"
                            >
                              <i className="fas fa-file-pdf"></i> Resume
                            </a>
                          </td>
                          <td className="application-approval-actions-cell">
                            {app.status === "New" && (
                              <button
                                onClick={() => handleAction(app._id, "Viewed")}
                                className="action-btn-app-approval mark-viewed"
                                title="Mark as Viewed"
                              >
                                <i className="fas fa-eye"></i>
                              </button>
                            )}
                            {(app.status === "New" ||
                              app.status === "Viewed") && (
                              <button
                                onClick={() =>
                                  handleAction(app._id, "Shortlisted")
                                }
                                className="action-btn-app-approval shortlist"
                                title="Shortlist"
                              >
                                <i className="fas fa-star"></i>
                              </button>
                            )}
                            {app.status === "Shortlisted" && (
                              <button
                                onClick={() =>
                                  handleAction(app._id, "Interview Scheduled")
                                }
                                className="action-btn-app-approval schedule"
                                title="Schedule Interview"
                              >
                                <i className="fas fa-calendar-plus"></i>
                              </button>
                            )}
                            {app.status !== "Rejected" && (
                              <button
                                onClick={() =>
                                  handleAction(app._id, "Rejected")
                                }
                                className="action-btn-app-approval reject"
                                title="Reject"
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
                <div className="no-applications-to-review">
                  <i className="fas fa-inbox empty-icon-app-approval"></i>
                  <p>
                    No applications found matching your criteria or awaiting
                    review.
                  </p>
                </div>
              )}

              {totalPages > 1 && (
                <div className="pagination-controls-app-approval">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <i className="fas fa-chevron-left"></i> Previous
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (num) => (
                      <button
                        key={num}
                        onClick={() => handlePageChange(num)}
                        className={currentPage === num ? "active" : ""}
                      >
                        {num}
                      </button>
                    )
                  )}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
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

export default ApplicationsApprovalStandalonePage;
