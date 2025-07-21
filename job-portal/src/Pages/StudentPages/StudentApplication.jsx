import React, { useState, useMemo, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const StudentApplicationsSkeleton = () => (
  <>
    <style>{`
            .skeleton-box { background-color: #e0e0e0; border-radius: 8px; animation: skeleton-pulse 1.5s infinite ease-in-out; }
            .skeleton-line { width: 100%; height: 20px; margin-bottom: 10px; border-radius: 4px; }
            .skeleton-line.short { width: 60%; }
            @keyframes skeleton-pulse { 0% { background-color: #e0e0e0; } 50% { background-color: #f0f0f0; } 100% { background-color: #e0e0e0; } }
        `}</style>
    <div className="applications-container">
      <div className="applications-toolbar">
        <div
          className="skeleton-box"
          style={{ height: "40px", flexGrow: 1, marginRight: "1rem" }}
        ></div>
        <div
          className="skeleton-box"
          style={{ height: "40px", width: "150px" }}
        ></div>
      </div>
      <div
        className="applications-table-container skeleton-box"
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
    path: "/student-dashboard",
    icon: "fas fa-tachometer-alt",
    label: "Dashboard",
  },
  { path: "/student-profile", icon: "fas fa-user-circle", label: "My Profile" },
  { path: "/student-resume", icon: "fas fa-file-alt", label: "Resume Manager" },
  {
    path: "/student-applications",
    icon: "fas fa-inbox",
    label: "Applications",
  },
  {
    path: "/student-notifications",
    icon: "fas fa-bell",
    label: "Notifications",
  },
];

const ITEMS_PER_PAGE = 5;

function ApplicationsStandalonePage() {
  const location = useLocation();
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [studentData, setStudentData] = useState(null);
  useEffect(() => {
    const fetchApplicationsAndProfile = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        toast.error("Please log in to view your applications.");
        navigate("/login");
        return;
      }

      try {
        const applicationsRes = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/student/applications`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const profileRes = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/profile/student`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (!applicationsRes.ok) {
          throw new Error("Failed to fetch applications.");
        }
        const applicationsData = await applicationsRes.json();
        setApplications(applicationsData);

        if (profileRes.ok) {
          const profileData = await profileRes.json();
          setStudentData(profileData);
        } else if (profileRes.status === 404) {
          console.warn("Student profile not found, using default.");
          setStudentData({
            fullName: "Student User",
            profilePicture:
              "https://placehold.co/120x120/15803D/FFFFFF?text=SU",
          });
        } else {
          throw new Error("Failed to fetch student profile.");
        }
      } catch (error) {
        toast.error(error.message || "Could not fetch data.");
      } finally {
        setLoading(false);
      }
    };

    fetchApplicationsAndProfile();
  }, [navigate]);

  const uniqueStatuses = useMemo(() => {
    const statuses = new Set(applications.map((app) => app.status));
    return ["All", ...Array.from(statuses)];
  }, [applications]);

  const filteredApplications = useMemo(() => {
    return applications.filter((app) => {
      const searchLower = searchTerm.toLowerCase();
      const jobTitle = app.jobId?.jobTitle || "";
      const companyName = app.recruiterId?.companyName || "";
      const titleMatch = jobTitle.toLowerCase().includes(searchLower);
      const companyMatch = companyName.toLowerCase().includes(searchLower);
      const statusMatch = filterStatus === "All" || app.status === filterStatus;

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
    if (!status) return "";
    return status.toLowerCase().replace(/\s+/g, "-");
  };

  const handleWithdrawApplication = async (appId) => {
    if (
      !window.confirm(
        "Are you sure you want to withdraw this application? This action cannot be undone."
      )
    ) {
      return;
    }

    const token = localStorage.getItem("authToken");
    const loadingToast = toast.loading("Withdrawing application...");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/applications/${appId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: "Withdrawn" }),
        }
      );

      const result = await response.json();
      toast.dismiss(loadingToast);

      if (!response.ok) {
        throw new Error(result.message || "Failed to withdraw application.");
      }

      toast.success("Application withdrawn successfully!");
      setApplications((prevApps) =>
        prevApps.map((app) =>
          app._id === appId ? { ...app, status: "Withdrawn" } : app
        )
      );
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error(
        error.message || "An error occurred while withdrawing application."
      );
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    toast.success("Logged out successfully!");
    navigate("/login");
  };

  return (
    <div className="student-page-layout-container">
      <div className="student-page-sidebar">
        <div className="student-page-sidebar-header">
          <h1 className="student-page-sidebar-title">
            Pro <span className="trck">Track</span>
          </h1>
        </div>
        <nav className="student-page-sidebar-nav">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`student-page-nav-link ${
                location.pathname === item.path ? "active" : ""
              }`}
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
            <h1 className="student-page-header-title">My Applications</h1>
            <div className="student-page-header-actions">
              <button
                className="student-page-notification-button"
                title="Notifications"
              >
                <i className="fas fa-bell"></i>
              </button>
              <div className="student-page-user-profile">
                <span className="student-page-user-name">
                  {studentData?.fullName?.split(" ")[0] || "Student"}
                </span>
                <div className="student-page-user-avatar">
                  {studentData?.profilePicture &&
                  !studentData.profilePicture.includes("placehold.co") ? (
                    <img
                      src={studentData.profilePicture}
                      alt="Profile"
                      className="header-profile-img"
                    />
                  ) : studentData?.fullName ? (
                    studentData.fullName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()
                  ) : (
                    "SU"
                  )}
                </div>
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

        <main className="student-page-content-area">
          {loading ? (
            <StudentApplicationsSkeleton />
          ) : (
            <div className="applications-container">
              <div className="applications-toolbar">
                <input
                  type="text"
                  placeholder="Search by job title or company..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="applications-search-input"
                />
                <select
                  value={filterStatus}
                  onChange={(e) => {
                    setFilterStatus(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="applications-filter-select"
                >
                  {uniqueStatuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
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
                      {paginatedApplications.map((app) => (
                        <tr key={app._id}>
                          <td>
                            <Link
                              to={`/student/job-details/${app.jobId?._id}`}
                              className="job-title-link"
                            >
                              {app.jobId?.jobTitle || "N/A"}
                            </Link>
                          </td>
                          <td>{app.recruiterId?.companyName || "N/A"}</td>
                          <td>
                            {new Date(app.createdAt).toLocaleDateString()}
                          </td>
                          <td>
                            <span
                              className={`application-status-badge status-${getStatusClass(
                                app.status
                              )}`}
                            >
                              {app.status}
                            </span>

                            {app.status === "Interview Scheduled" &&
                              app.interviewDate && (
                                <span className="interview-details">
                                  <i className="fas fa-calendar-alt"></i>{" "}
                                  {app.interviewDate} at {app.interviewTime}
                                </span>
                              )}
                            {app.status === "Offer Extended" &&
                              app.offerDeadline && (
                                <span className="offer-details">
                                  <i className="fas fa-hourglass-half"></i>{" "}
                                  Deadline: {app.offerDeadline}
                                </span>
                              )}
                          </td>
                          <td>
                            {new Date(app.updatedAt).toLocaleDateString()}
                          </td>
                          <td className="application-actions-cell">
                            <button
                              className="action-btn-app view-details-btn"
                              title="View Details"
                            >
                              <i className="fas fa-eye"></i>
                            </button>
                            {app.status !== "Rejected" &&
                              app.status !== "Withdrawn" &&
                              app.status !== "Offer Accepted" && (
                                <button
                                  onClick={() =>
                                    handleWithdrawApplication(app._id)
                                  }
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
                  <p>
                    You haven't applied to any jobs yet, or no applications
                    match your filters.
                  </p>
                  <Link to="/student/job-listings" className="find-jobs-link">
                    Find Jobs
                  </Link>
                </div>
              )}

              {totalPages > 1 && (
                <div className="pagination-controls-apps">
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

export default ApplicationsStandalonePage;
