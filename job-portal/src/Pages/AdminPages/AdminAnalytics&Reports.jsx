import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Chart from 'chart.js/auto';
import toast from 'react-hot-toast';

const AnalyticsSkeleton = () => (
    <>
        <style>{`
            .skeleton-box { background-color: #e0e0e0; border-radius: 8px; animation: skeleton-pulse 1.5s infinite ease-in-out; }
            .skeleton-line { width: 100%; height: 20px; margin-bottom: 10px; border-radius: 4px; }
            .skeleton-line.short { width: 60%; }
            @keyframes skeleton-pulse { 0% { background-color: #e0e0e0; } 50% { background-color: #f0f0f0; } 100% { background-color: #e0e0e0; } }
        `}</style>
        <section className="kpi-section">
            <div className="kpi-card skeleton-box" style={{ height: '100px' }}></div>
            <div className="kpi-card skeleton-box" style={{ height: '100px' }}></div>
            <div className="kpi-card skeleton-box" style={{ height: '100px' }}></div>
            <div className="kpi-card skeleton-box" style={{ height: '100px' }}></div>
        </section>
        <section className="charts-section">
            <div className="analytics-chart-card skeleton-box" style={{ height: '300px' }}></div>
            <div className="analytics-chart-card skeleton-box" style={{ height: '300px' }}></div>
            <div className="analytics-chart-card full-width-chart skeleton-box" style={{ height: '300px' }}></div>
        </section>
        <section className="reports-section skeleton-box" style={{ height: '250px', marginTop: '2rem' }}>
            <div className="skeleton-line" style={{ width: '200px', marginBottom: '1rem' }}></div>
            <div className="skeleton-line short" style={{ width: '150px' }}></div>
        </section>
    </>
);


function AnalyticsAndReportsPage() {
    const [reportType, setReportType] = useState('user_list');
    const [dateRange, setDateRange] = useState('last_30_days');
    const [generatedReport, setGeneratedReport] = useState(null);
    const [loading, setLoading] = useState(true);
    const [kpiData, setKpiData] = useState({
        totalUsers: 0,
        activeJobPostings: 0,
        applicationsThisMonth: 0,
        successfulHiresQ2: 0,
    });
    const [chartData, setChartData] = useState({
        userGrowth: { labels: [], datasets: [] },
        jobPostingTrends: { labels: [], datasets: [] },
        applicationSuccessRate: { labels: [], datasets: [] },
    });

    const navigate = useNavigate();

    const userGrowthChartRef = useRef(null);
    const jobPostingChartRef = useRef(null);
    const appSuccessChartRef = useRef(null);
    const chartInstancesRef = useRef({});

    useEffect(() => {
        const fetchAnalyticsData = async () => {
            const token = localStorage.getItem('authToken');
            if (!token) {
                toast.error("Please log in to view analytics.");
                navigate('/login');
                return;
            }

            try {
                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/admin/analytics/dashboard-data`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch analytics data.');
                }
                const data = await response.json();

                setKpiData({
                    totalUsers: data.totalUsers || 0,
                    activeJobPostings: data.activeJobPostings || 0,
                    applicationsThisMonth: data.applicationsThisMonth || 0,
                    successfulHiresQ2: data.successfulHiresQ2 || 0,
                });

                setChartData({
                    userGrowth: data.userGrowth || { labels: [], datasets: [] },
                    jobPostingTrends: data.jobPostingTrends || { labels: [], datasets: [] },
                    applicationSuccessRate: data.applicationSuccessRate || { labels: [], datasets: [] },
                });

            } catch (error) {
                toast.error(error.message || "Could not fetch analytics data.");
            } finally {
                setLoading(false);
            }
        };
        fetchAnalyticsData();
    }, [navigate]);

    useEffect(() => {
        Object.values(chartInstancesRef.current).forEach(chart => chart.destroy());
        chartInstancesRef.current = {};

        if (userGrowthChartRef.current && chartData.userGrowth.labels.length > 0) {
            const ctx = userGrowthChartRef.current.getContext('2d');
            chartInstancesRef.current.userGrowth = new Chart(ctx, {
                type: 'line',
                data: chartData.userGrowth,
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: { beginAtZero: true, grid: { color: 'rgba(200, 200, 200, 0.1)' }, ticks: { color: '#6b7280' } },
                        x: { grid: { display: false }, ticks: { color: '#6b7280' } },
                    },
                    plugins: {
                        legend: { position: 'top', labels: { color: '#374151' } },
                        tooltip: { backgroundColor: 'rgba(0,0,0,0.7)', titleFont: { size: 14 }, bodyFont: { size: 12 }, padding: 10 }
                    },
                },
            });
        }

        if (jobPostingChartRef.current && chartData.jobPostingTrends.labels.length > 0) {
            const ctx = jobPostingChartRef.current.getContext('2d');
            chartInstancesRef.current.jobPosting = new Chart(ctx, {
                type: 'bar',
                data: chartData.jobPostingTrends,
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: { beginAtZero: true, grid: { color: 'rgba(200, 200, 200, 0.1)' }, ticks: { color: '#6b7280' } },
                        x: { grid: { display: false }, ticks: { color: '#6b7280' } },
                    },
                    plugins: {
                        legend: { position: 'top', labels: { color: '#374151' } },
                        tooltip: { backgroundColor: 'rgba(0,0,0,0.7)', titleFont: { size: 14 }, bodyFont: { size: 12 }, padding: 10 }
                    },
                },
            });
        }

        if (appSuccessChartRef.current && chartData.applicationSuccessRate.labels.length > 0) {
            const ctx = appSuccessChartRef.current.getContext('2d');
            chartInstancesRef.current.appSuccess = new Chart(ctx, {
                type: 'doughnut',
                data: chartData.applicationSuccessRate,
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    cutout: '60%',
                    plugins: {
                        legend: { position: 'bottom', labels: { color: '#374151' } },
                        tooltip: { backgroundColor: 'rgba(0,0,0,0.7)', titleFont: { size: 14 }, bodyFont: { size: 12 }, padding: 10 }
                    },
                },
            });
        }

        return () => {
            Object.values(chartInstancesRef.current).forEach(chart => chart.destroy());
        };
    }, [chartData]);

    const handleGenerateReport = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('authToken');
        const loadingToast = toast.loading('Generating report...');

        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/admin/analytics/generate-report`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ reportType, dateRange })
            });

            const result = await response.json();
            toast.dismiss(loadingToast);

            if (!response.ok) {
                throw new Error(result.message || 'Failed to generate report.');
            }
            
            toast.success('Report generated successfully!');
            setGeneratedReport({
                title: result.title,
                data: result.data,
                generatedAt: new Date().toLocaleString(),
            });

        } catch (error) {
            toast.dismiss(loadingToast);
            toast.error(error.message || "Error generating report.");
        }
    };

    const handleDownloadReport = () => {
        if (!generatedReport || !generatedReport.data || generatedReport.data.length === 0) {
            toast.error("No report data to download.");
            return;
        }
        
        const headers = Object.keys(generatedReport.data[0] || {}).join(',');
        const rows = generatedReport.data.map(row => Object.values(row).join(',')).join('\n');
        const csvContent = `${headers}\n${rows}`;
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', `${reportType}_${dateRange}_report.csv`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            toast.success("Report downloaded!");
        } else {
            toast.error("Your browser does not support automatic CSV download.");
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
                    <Link to="/admin-user-management" className="nav-link">
                        <i className="fas fa-users nav-icon"></i> User Management
                    </Link>
                    <Link to="/admin-recruiter-approvals" className="nav-link">
                        <i className="fas fa-check-circle nav-icon"></i> Recruiter Approvals
                    </Link>
                    <Link to="/admin-analytics-reports" className="nav-link active-nav-link">
                        <i className="fas fa-chart-pie nav-icon"></i> Analytics & Reports
                    </Link>
                </nav>
            </div>

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
                    {loading ? <AnalyticsSkeleton /> : (
                        <>
                            <section className="kpi-section">
                                <div className="kpi-card">
                                    <div className="kpi-icon-wrapper bg-blue-100 text-blue-600">
                                        <i className="fas fa-users kpi-icon"></i>
                                    </div>
                                    <div>
                                        <p className="kpi-label">Total Active Users</p>
                                        <p className="kpi-value">{kpiData.totalUsers}</p>
                                    </div>
                                </div>
                                <div className="kpi-card">
                                    <div className="kpi-icon-wrapper bg-green-100 text-green-600">
                                        <i className="fas fa-briefcase kpi-icon"></i>
                                    </div>
                                    <div>
                                        <p className="kpi-label">Active Job Postings</p>
                                        <p className="kpi-value">{kpiData.activeJobPostings}</p>
                                    </div>
                                </div>
                                <div className="kpi-card">
                                    <div className="kpi-icon-wrapper bg-amber-100 text-amber-600">
                                        <i className="fas fa-file-signature kpi-icon"></i>
                                    </div>
                                    <div>
                                        <p className="kpi-label">Applications This Month</p>
                                        <p className="kpi-value">{kpiData.applicationsThisMonth}</p>
                                    </div>
                                </div>
                                <div className="kpi-card">
                                    <div className="kpi-icon-wrapper bg-pink-100 text-pink-600">
                                        <i className="fas fa-user-check kpi-icon"></i>
                                    </div>
                                    <div>
                                        <p className="kpi-label">Successful Hires (Q2)</p>
                                        <p className="kpi-value">{kpiData.successfulHiresQ2}</p>
                                    </div>
                                </div>
                            </section>

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
                                <div className="analytics-chart-card full-width-chart">
                                    <h3 className="analytics-chart-title">Application Success Rate</h3>
                                    <div className="analytics-chart-container doughnut-chart-container">
                                        <canvas ref={appSuccessChartRef}></canvas>
                                    </div>
                                </div>
                            </section>

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
                        </>
                    )}
                </main>
            </div>
        </div>
    );
}

export default AnalyticsAndReportsPage;
