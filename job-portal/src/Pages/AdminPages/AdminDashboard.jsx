import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom'; // Assuming you use react-router-dom
import Chart from 'chart.js/auto'; // Import Chart.js

// Font Awesome icons are used directly as <i> tags as in the original HTML.
// Ensure Font Awesome is loaded in your project (e.g., via CDN in public/index.html or using a React library).

function AdminDashboard() {
  const registrationChartRef = useRef(null);
  const activityChartRef = useRef(null);
  const chartInstancesRef = useRef({}); // To store chart instances for cleanup

  useEffect(() => {
    // Cleanup previous chart instances if any
    if (chartInstancesRef.current.registrationChart) {
      chartInstancesRef.current.registrationChart.destroy();
    }
    if (chartInstancesRef.current.activityChart) {
      chartInstancesRef.current.activityChart.destroy();
    }

    // Registration Chart
    if (registrationChartRef.current) {
      const registrationCtx = registrationChartRef.current.getContext('2d');
      chartInstancesRef.current.registrationChart = new Chart(registrationCtx, {
        type: 'line',
        data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          datasets: [
            {
              label: 'Students',
              data: [65, 78, 90, 115, 130, 142],
              borderColor: '#2563EB', // Blue color
              backgroundColor: 'rgba(37, 99, 235, 0.1)',
              tension: 0.3,
            },
            {
              label: 'Recruiters',
              data: [25, 32, 45, 55, 60, 70],
              borderColor: '#10B981', // Green color
              backgroundColor: 'rgba(16, 185, 129, 0.1)',
              tension: 0.3,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              grid: {
                color: 'rgba(200, 200, 200, 0.2)', // Lighter grid lines
              },
              ticks: {
                color: '#6b7280', // Text color for ticks
              },
            },
            x: {
              grid: {
                display: false, // Hide x-axis grid lines
              },
              ticks: {
                color: '#6b7280', // Text color for ticks
              },
            },
          },
          plugins: {
            legend: {
              labels: {
                color: '#374151', // Text color for legend
              },
            },
          },
        },
      });
    }

    // Activity Chart
    if (activityChartRef.current) {
      const activityCtx = activityChartRef.current.getContext('2d');
      chartInstancesRef.current.activityChart = new Chart(activityCtx, {
        type: 'bar',
        data: {
          labels: ['Job Posts', 'Applications', 'Interviews', 'Hires'],
          datasets: [
            {
              label: 'Last Month',
              data: [120, 350, 75, 30],
              backgroundColor: '#10B981', // Green color
              borderRadius: 4,
            },
            {
              label: 'This Month',
              data: [150, 420, 90, 35],
              backgroundColor: '#3B82F6', // Blue color
              borderRadius: 4,
            },
          ],
        },
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
      if (chartInstancesRef.current.registrationChart) {
        chartInstancesRef.current.registrationChart.destroy();
      }
      if (chartInstancesRef.current.activityChart) {
        chartInstancesRef.current.activityChart.destroy();
      }
    };
  }, []); // Empty dependency array ensures this runs once on mount and cleanup on unmount

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
            <i className="fas fa-chart-bar nav-icon"></i> Analytics
          </Link>
        </nav>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <header className="main-header">
          <div className="header-content">
            <h1 className="header-title">Admin Dashboard</h1>
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
          {/* Stats Row */}
          <div className="stats-grid">
            <div className="stat-card">
              <h3 className="stat-title">Total Users</h3>
              <p className="stat-value">1,245</p>
            </div>
            <div className="stat-card">
              <h3 className="stat-title">Students</h3>
              <p className="stat-value">892</p>
            </div>
            <div className="stat-card">
              <h3 className="stat-title">Recruiters</h3>
              <p className="stat-value">248</p>
            </div>
          </div>

          {/* Pending Approvals Card */}
          <div className="pending-approvals-card stat-card"> {/* Re-using stat-card for similar styling */}
            <h3 className="stat-title">Pending Approvals</h3>
            <p className="stat-value-amber">12</p>
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
        </main>
      </div>
    </div>
  );
}

export default AdminDashboard;
