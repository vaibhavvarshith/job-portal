import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const handleLogout = () => {
  // Implement your logout logic here
  // e.g., clear tokens, call a logout API, redirect
  console.log('Admin logged out');
  navigate('/login'); // Example: Redirect to login page
};
// Mock data - replace with API calls in a real application
const profileCompletion = 75;
const applicationStatus = {
  applied: 12,
  interviews: 3,
  offers: 1,
  rejected: 5,
};
const recentActivity = [
  { id: 1, text: 'Resume viewed by TechCorp', time: '2 hours ago', icon: 'fas fa-eye' },
  { id: 2, text: 'Application status changed for Software Engineer at Innovate Ltd', time: 'Yesterday', icon: 'fas fa-check-circle' },
  { id: 3, text: 'New job match found: UI/UX Designer', time: '2 days ago', icon: 'fas fa-bullseye' },
];
const recommendedJobs = [
  { id: 1, title: 'Software Engineering Intern', company: 'TechCorp Inc.', location: 'Remote', salary: '$25/hr', posted: '2 days ago', skills: ['JavaScript', 'React', 'Node.js'], logo: 'https://placehold.co/40x40/166534/FFFFFF?text=T' },
  { id: 2, title: 'Data Science Intern', company: 'DataSolutions LLC', location: 'New York, NY', salary: '$30/hr', posted: '5 days ago', skills: ['Python', 'Machine Learning', 'SQL'], logo: 'https://placehold.co/40x40/16A34A/FFFFFF?text=D' },
  { id: 3, title: 'Marketing Intern', company: 'CreativeMinds Co.', location: 'San Francisco, CA', salary: '$22/hr', posted: '1 day ago', skills: ['Social Media', 'SEO', 'Content Creation'], logo: 'https://placehold.co/40x40/059669/FFFFFF?text=C' },
];

// Navigation items for the sidebar
const navItems = [
  { path: '/student-dashboard', icon: 'fas fa-tachometer-alt', label: 'Dashboard' },
  { path: '/student-profile', icon: 'fas fa-user-circle', label: 'My Profile' },
  { path: '/student-resume', icon: 'fas fa-file-alt', label: 'Resume Manager' },
  { path: '/student-applications', icon: 'fas fa-inbox', label: 'Applications', badge: 3 },
  { path: '/student-notifications', icon: 'fas fa-bell', label: 'Notifications', badge: 5 },
];

function StudentDashboardPage() {
  const location = useLocation(); // To determine the active link

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
            <h1 className="student-page-header-title">Dashboard</h1> {/* Page Specific Title */}
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
          {/* Dashboard Specific Content */}
          <div className="dashboard-grid">
            {/* Profile Completion Card */}
            <div className="dashboard-card profile-completion-card">
              <h3 className="card-title">Profile Completion</h3>
              <div className="progress-bar-container">
                <div
                  className="progress-bar"
                  style={{ width: `${profileCompletion}%` }}
                >
                  {profileCompletion}%
                </div>
              </div>
              <p className="completion-text">{profileCompletion}% Complete</p>
              <Link to="/student-profile" className="complete-profile-link">
                Complete Profile <i className="fas fa-arrow-right"></i>
              </Link>
            </div>

            {/* Application Status Card */}
            <div className="dashboard-card application-status-card">
              <h3 className="card-title">Application Status</h3>
              <ul className="status-list">
                <li><span>Applied</span> <span className="status-count">{applicationStatus.applied}</span></li>
                <li><span>Interviews</span> <span className="status-count">{applicationStatus.interviews}</span></li>
                <li><span>Offers</span> <span className="status-count offer-count">{applicationStatus.offers}</span></li>
                <li><span>Rejected</span> <span className="status-count rejected-count">{applicationStatus.rejected}</span></li>
              </ul>
            </div>

            {/* Recent Activity Card */}
            <div className="dashboard-card recent-activity-card">
              <h3 className="card-title">Recent Activity</h3>
              <ul className="activity-list">
                {recentActivity.map(activity => (
                  <li key={activity.id} className="activity-item">
                    <i className={`${activity.icon} activity-icon`}></i>
                    <div className="activity-details">
                      <p className="activity-text">{activity.text}</p>
                      <p className="activity-time">{activity.time}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Recommended Jobs Section */}
          <div className="dashboard-card recommended-jobs-section">
            <h3 className="card-title">Recommended Jobs</h3>
            <div className="recommended-jobs-grid">
              {recommendedJobs.map(job => (
                <div key={job.id} className="job-card-recommended">
                  <div className="job-card-header">
                    <img src={job.logo} alt={`${job.company} logo`} className="job-company-logo-sm" />
                    <div>
                      <h4 className="job-title-recommended">{job.title}</h4>
                      <p className="job-company-recommended">{job.company}</p>
                    </div>
                  </div>
                  <div className="job-details-recommended">
                    <p><i className="fas fa-map-marker-alt"></i> {job.location}</p>
                    <p><i className="fas fa-dollar-sign"></i> {job.salary}</p>
                    <p><i className="fas fa-clock"></i> Posted {job.posted}</p>
                  </div>
                  <div className="job-skills-recommended">
                    {job.skills.map(skill => <span key={skill} className="skill-tag">{skill}</span>)}
                  </div>
                  <div className="job-actions-recommended">
                    <button className="apply-now-button">Apply Now</button>
                    <button className="save-job-button"><i className="fas fa-bookmark"></i> Save</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default StudentDashboardPage;
// CSS styles (to be included in a separate CSS file)