import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Chart from 'chart.js/auto';
import toast from 'react-hot-toast'; // Import toast

// --- Skeleton Loader Component for Admin Dashboard ---
const AdminDashboardSkeleton = () => (
    <>
        <style>{`
            .skeleton-box { background-color: #e0e0e0; border-radius: 8px; animation: skeleton-pulse 1.5s infinite ease-in-out; }
            .skeleton-line { width: 100%; height: 20px; margin-bottom: 10px; border-radius: 4px; }
            .skeleton-line.short { width: 60%; }
            @keyframes skeleton-pulse { 0% { background-color: #e0e0e0; } 50% { background-color: #f0f0f0; } 100% { background-color: #e0e0e0; } }
        `}</style>
        <div className="stats-grid">
            <div className="stat-card skeleton-box" style={{ height: '100px' }}></div>
            <div className="stat-card skeleton-box" style={{ height: '100px' }}></div>
            <div className="stat-card skeleton-box" style={{ height: '100px' }}></div>
        </div>
        <div className="pending-approvals-card stat-card skeleton-box" style={{ height: '100px', marginTop: '1.5rem' }}></div>
        <div className="charts-grid" style={{ marginTop: '1.5rem' }}>
            <div className="chart-card skeleton-box" style={{ height: '300px' }}></div>
            <div className="chart-card skeleton-box" style={{ height: '300px' }}></div>
        </div>
    </>
);


function AdminDashboard() {
  const registrationChartRef = useRef(null);
  const activityChartRef = useRef(null);
  const chartInstancesRef = useRef({}); // To store chart instances for cleanup

  const navigate = useNavigate();
  const [loading, setLoading] = useState(true); // New loading state
  const [dashboardStats, setDashboardStats] = useState({
    totalUsers: 0,
    students: 0,
    recruiters: 0,
    pendingApprovals: 0,
    userRegistrationChartData: { labels: [], datasets: [] },
    activityMetricsChartData: { labels: [], datasets: [] },
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
        const token = localStorage.getItem('authToken');
        if (!token) {
            toast.error("Please log in to view the admin dashboard.");
            navigate('/login');
            return;
        }

        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/admin/dashboard-data`, { // New backend route
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch dashboard data.');
            }
            const data = await response.json();

            setDashboardStats({
                totalUsers: data.totalUsers || 0,
                students: data.students || 0,
                recruiters: data.recruiters || 0,
                pendingApprovals: data.pendingApprovals || 0,
                userRegistrationChartData: data.userRegistrationChartData || { labels: [], datasets: [] },
                activityMetricsChartData: data.activityMetricsChartData || { labels: [], datasets: [] },
            });

        } catch (error) {
            toast.error(error.message || "Could not fetch dashboard data.");
        } finally {
            setLoading(false);
        }
    };
    fetchDashboardData();
  }, [navigate]);


  useEffect(() => {
    // Cleanup previous chart instances if any
    Object.values(chartInstancesRef.current).forEach(chart => chart.destroy());
    chartInstancesRef.current = {}; // Clear the ref

    // Registration Chart
    if (registrationChartRef.current && dashboardStats.userRegistrationChartData.labels.length > 0) {
      const registrationCtx = registrationChartRef.current.getContext('2d');
      chartInstancesRef.current.registrationChart = new Chart(registrationCtx, {
        type: 'line',
        data: dashboardStats.userRegistrationChartData,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              grid: {
                color: 'rgba(200, 200, 200, 0.2)',
              },
              ticks: {
                color: '#6b7280',
              },
            },
            x: {
              grid: {
                display: false,
              },
              ticks: {
                color: '#6b7280',
              },
            },
          },
          plugins: {
            legend: {
              labels: {
                color: '#374151',
              },
            },
          },
        },
      });
    }

    // Activity Chart
    if (activityChartRef.current && dashboardStats.activityMetricsChartData.labels.length > 0) {
      const activityCtx = activityChartRef.current.getContext('2d');
      chartInstancesRef.current.activityChart = new Chart(activityCtx, {
        type: 'bar',
        data: dashboardStats.activityMetricsChartData,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              grid: {
                color: 'rgba(200, 200, 200, 0.2)',
              },
              ticks: {
                color: '#6b7280',
              },
            },
            x: {
              grid: {
                display: false,
              },
              ticks: {
                color: '#6b7280',
              },
            },
          },
          plugins: {
            legend: {
              labels: {
                color: '#374151',
              },
            },
          },
        },
      });
    }

    // Cleanup function to destroy charts when component unmounts
    return () => {
      Object.values(chartInstancesRef.current).forEach(chart => chart.destroy());
    };
  }, [dashboardStats]); // Re-run when dashboardStats changes


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
          <Link to="/admin-dashboard" className="nav-link active-nav-link">
            <i className="fas fa-tachometer-alt nav-icon"></i> Dashboard
          </Link>
          <Link to="/admin-user-management" className="nav-link">
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
            <h1 className="header-title">Admin Dashboard</h1>
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
          {loading ? <AdminDashboardSkeleton /> : (
            <>
              {/* Stats Row */}
              <div className="stats-grid">
                <div className="stat-card">
                  <h3 className="stat-title">Total Users</h3>
                  <p className="stat-value">{dashboardStats.totalUsers}</p>
                </div>
                <div className="stat-card">
                  <h3 className="stat-title">Students</h3>
                  <p className="stat-value">{dashboardStats.students}</p>
                </div>
                <div className="stat-card">
                  <h3 className="stat-title">Recruiters</h3>
                  <p className="stat-value">{dashboardStats.recruiters}</p>
                </div>
              </div>

              {/* Pending Approvals Card */}
              <div className="pending-approvals-card stat-card">
                <h3 className="stat-title">Pending Approvals</h3>
                <p className="stat-value-amber">{dashboardStats.pendingApprovals}</p>
              </div>

              {/* Charts Row */}
              <div className="charts-grid">
                <div className="chart-card">
                  <h3 className="chart-title">User Registration Chart</h3>
                  <div className="chart-container">
                    <canvas ref={registrationChartRef}></canvas>
                  </div>
                </div>
                <div className="chart-card">
                  <h3 className="chart-title">Activity Metrics</h3>
                  <div className="chart-container">
                    <canvas ref={activityChartRef}></canvas>
                  </div>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export default AdminDashboard;
