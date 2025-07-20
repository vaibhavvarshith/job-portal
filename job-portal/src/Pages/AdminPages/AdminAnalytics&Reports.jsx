import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Assuming you use react-router-dom
import Chart from 'chart.js/auto'; // Import Chart.js

// Mock data for charts - in a real app, this would come from an API
const mockChartData = {
    userGrowth: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
        datasets: [
            {
                label: 'Total Users',
                data: [500, 580, 690, 810, 950, 1100, 1245],
                borderColor: '#3B82F6', // Blue
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                tension: 0.3,
                fill: true,
            },
            {
                label: 'New Students',
                data: [150, 180, 220, 200, 250, 280, 310],
                borderColor: '#10B981', // Green
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                tension: 0.3,
                fill: true,
            },
            {
                label: 'New Recruiters',
                data: [30, 40, 55, 60, 70, 85, 90],
                borderColor: '#F59E0B', // Amber
                backgroundColor: 'rgba(245, 158, 11, 0.1)',
                tension: 0.3,
                fill: true,
            },
        ],
    },
    jobPostingTrends: {
        labels: ['Q1', 'Q2', 'Q3', 'Q4'],
        datasets: [
            {
                label: 'Internships Posted',
                data: [120, 150, 180, 160],
                backgroundColor: '#6366F1', // Indigo
                borderRadius: 4,
            },
            {
                label: 'Full-time Jobs Posted',
                data: [80, 100, 130, 110],
                backgroundColor: '#EC4899', // Pink
                borderRadius: 4,
            },
        ],
    },
    applicationSuccessRate: {
        labels: ['Applied', 'Shortlisted', 'Interviewed', 'Hired'],
        datasets: [
            {
                label: 'Application Funnel',
                data: [1500, 700, 350, 150],
                backgroundColor: [
                    'rgba(59, 130, 246, 0.7)',
                    'rgba(16, 185, 129, 0.7)',
                    'rgba(245, 158, 11, 0.7)',
                    'rgba(236, 72, 153, 0.7)',
                ],
                borderColor: [
                    '#3B82F6',
                    '#10B981',
                    '#F59E0B',
                    '#EC4899',
                ],
                borderWidth: 1,
            },
        ],
    },
};

function AnalyticsAndReportsPage() {
    const [reportType, setReportType] = useState('user_list');
    const [dateRange, setDateRange] = useState('last_30_days');
    const [generatedReport, setGeneratedReport] = useState(null); // Placeholder for report data
    const navigate = useNavigate(); // Hook for navigation

    const userGrowthChartRef = useRef(null);
    const jobPostingChartRef = useRef(null);
    const appSuccessChartRef = useRef(null);
    const chartInstancesRef = useRef({});

    useEffect(() => {
        const chartsToCreate = [
            { ref: userGrowthChartRef, config: { type: 'line', data: mockChartData.userGrowth }, instanceName: 'userGrowth' },
            { ref: jobPostingChartRef, config: { type: 'bar', data: mockChartData.jobPostingTrends }, instanceName: 'jobPosting' },
            { ref: appSuccessChartRef, config: { type: 'doughnut', data: mockChartData.applicationSuccessRate, options: { cutout: '60%' } }, instanceName: 'appSuccess' },
        ];

        chartsToCreate.forEach(chartInfo => {
            if (chartInstancesRef.current[chartInfo.instanceName]) {
                chartInstancesRef.current[chartInfo.instanceName].destroy();
            }
            if (chartInfo.ref.current) {
                const ctx = chartInfo.ref.current.getContext('2d');
                chartInstancesRef.current[chartInfo.instanceName] = new Chart(ctx, {
                    type: chartInfo.config.type,
                    data: chartInfo.config.data,
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: (chartInfo.config.type === 'line' || chartInfo.config.type === 'bar') ? {
                            y: { beginAtZero: true, grid: { color: 'rgba(200, 200, 200, 0.1)' }, ticks: { color: '#6b7280' } },
                            x: { grid: { display: false }, ticks: { color: '#6b7280' } },
                        } : undefined,
                        plugins: {
                            legend: {
                                position: chartInfo.config.type === 'doughnut' ? 'bottom' : 'top',
                                labels: { color: '#374151' }
                            },
                            tooltip: {
                                backgroundColor: 'rgba(0,0,0,0.7)',
                                titleFont: { size: 14 },
                                bodyFont: { size: 12 },
                                padding: 10,
                            }
                        },
                        ...chartInfo.config.options, // Spread any additional specific options
                    },
                });
            }
        });

        return () => {
            Object.values(chartInstancesRef.current).forEach(chart => chart.destroy());
        };
    }, []); // Re-run if mockChartData changes, though it's constant here

    const handleGenerateReport = (e) => {
        e.preventDefault();
        console.log(`Generating report: ${reportType} for ${dateRange}`);
        // Placeholder: Simulate report generation
        setGeneratedReport({
            title: `Report: ${reportType.replace('_', ' ')} (${dateRange.replace('_', ' ')})`,
            data: [
                { id: 1, field1: 'Data A', field2: 123, field3: 'Info X' },
                { id: 2, field1: 'Data B', field2: 456, field3: 'Info Y' },
                { id: 3, field1: 'Data C', field2: 789, field3: 'Info Z' },
            ],
            generatedAt: new Date().toLocaleString(),
        });
        // In a real app, this would fetch data and possibly format it for download
    };

    const handleDownloadReport = () => {
        if (!generatedReport) return;
        console.log('Downloading report:', generatedReport.title);
        // Placeholder: Simulate CSV download
        const headers = Object.keys(generatedReport.data[0] || {}).join(',');
        const rows = generatedReport.data.map(row => Object.values(row).join(',')).join('\n');
        const csvContent = `${headers}\n${rows}`;
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', `${reportType}_${dateRange}.csv`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
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
                    <Link to="/admin-recruiter-approvals" className="nav-link">
                        <i className="fas fa-check-circle nav-icon"></i> Recruiter Approvals
                    </Link>
                    {/* System Settings skipped as per request */}
                    <Link to="/admin-analytics-reports" className="nav-link active-nav-link"> {/* Active link */}
                        <i className="fas fa-chart-pie nav-icon"></i> Analytics & Reports
                    </Link>
                </nav>
            </div>

            {/* Main Content */}
            <div className="main-content">
                <header className="main-header">
                    <div className="header-content">
                        <h1 className="header-title">Analytics & Reports</h1>
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
                    {/* Key Metrics Section */}
                    <section className="kpi-section">
                        <div className="kpi-card">
                            <div className="kpi-icon-wrapper bg-blue-100 text-blue-600">
                                <i className="fas fa-users kpi-icon"></i>
                            </div>
                            <div>
                                <p className="kpi-label">Total Active Users</p>
                                <p className="kpi-value">1,245</p>
                            </div>
                        </div>
                        <div className="kpi-card">
                            <div className="kpi-icon-wrapper bg-green-100 text-green-600">
                                <i className="fas fa-briefcase kpi-icon"></i>
                            </div>
                            <div>
                                <p className="kpi-label">Active Job Postings</p>
                                <p className="kpi-value">312</p>
                            </div>
                        </div>
                        <div className="kpi-card">
                            <div className="kpi-icon-wrapper bg-amber-100 text-amber-600">
                                <i className="fas fa-file-signature kpi-icon"></i>
                            </div>
                            <div>
                                <p className="kpi-label">Applications This Month</p>
                                <p className="kpi-value">420</p>
                            </div>
                        </div>
                        <div className="kpi-card">
                            <div className="kpi-icon-wrapper bg-pink-100 text-pink-600">
                                <i className="fas fa-user-check kpi-icon"></i>
                            </div>
                            <div>
                                <p className="kpi-label">Successful Hires (Q2)</p>
                                <p className="kpi-value">35</p>
                            </div>
                        </div>
                    </section>

                    {/* Charts Section */}
                    <section className="charts-section">
                        <div className="analytics-chart-card">
                            <h3 className="analytics-chart-title">User Growth Over Time</h3>
                            <div className="analytics-chart-container">
                                <canvas ref={userGrowthChartRef}></canvas>
                            </div>
                        </div>
                        <div className="analytics-chart-card">
                            <h3 className="analytics-chart-title">Job Posting Trends</h3>
                            <div className="analytics-chart-container">
                                <canvas ref={jobPostingChartRef}></canvas>
                            </div>
                        </div>
                        <div className="analytics-chart-card full-width-chart"> {/* For Doughnut or Pie */}
                            <h3 className="analytics-chart-title">Application Success Rate</h3>
                            <div className="analytics-chart-container doughnut-chart-container">
                                <canvas ref={appSuccessChartRef}></canvas>
                            </div>
                        </div>
                    </section>

                    {/* Reports Section */}
                    <section className="reports-section">
                        <h2 className="section-title">Generate Reports</h2>
                        <form className="report-form" onSubmit={handleGenerateReport}>
                            <div className="form-group">
                                <label htmlFor="reportType" className="form-label">Report Type:</label>
                                <select
                                    id="reportType"
                                    value={reportType}
                                    onChange={(e) => setReportType(e.target.value)}
                                    className="form-select"
                                >
                                    <option value="user_list">User List</option>
                                    <option value="recruiter_activity">Recruiter Activity</option>
                                    <option value="job_post_summary">Job Postings Summary</option>
                                    <option value="application_stats">Application Statistics</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label htmlFor="dateRange" className="form-label">Date Range:</label>
                                <select
                                    id="dateRange"
                                    value={dateRange}
                                    onChange={(e) => setDateRange(e.target.value)}
                                    className="form-select"
                                >
                                    <option value="last_7_days">Last 7 Days</option>
                                    <option value="last_30_days">Last 30 Days</option>
                                    <option value="last_90_days">Last 90 Days</option>
                                    <option value="year_to_date">Year to Date</option>
                                    <option value="all_time">All Time</option>
                                </select>
                            </div>
                            <button type="submit" className="generate-report-button">
                                <i className="fas fa-cogs button-icon"></i> Generate Report
                            </button>
                        </form>

                        {generatedReport && (
                            <div className="generated-report-details">
                                <h3 className="report-preview-title">{generatedReport.title}</h3>
                                <p className="report-generated-at">Generated on: {generatedReport.generatedAt}</p>
                                {/* Basic preview - in a real app, this could be a table or more complex */}
                                <div className="report-data-preview">
                                    <p>Showing first {generatedReport.data.length} rows (preview):</p>
                                    <pre>{JSON.stringify(generatedReport.data.slice(0, 3), null, 2)}</pre>
                                </div>
                                <button onClick={handleDownloadReport} className="download-report-button">
                                    <i className="fas fa-download button-icon"></i> Download CSV
                                </button>
                            </div>
                        )}
                    </section>
                </main>
            </div>
        </div>
    );
}

export default AnalyticsAndReportsPage;
