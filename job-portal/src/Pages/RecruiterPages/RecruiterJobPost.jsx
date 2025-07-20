import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

// Navigation items for the Recruiter sidebar
const navItems = [
    { path: '/recruiter-dashboard', icon: 'fas fa-tachometer-alt', label: 'Dashboard' },
    { path: '/recruiter-post-job', icon: 'fas fa-plus-square', label: 'Post a Job' },
    { path: '/recruiter-post-internship', icon: 'fas fa-graduation-cap', label: 'Post an Internship' },
    { path: '/recruiter-applications-approval', icon: 'fas fa-check-circle', label: 'Applications Approval' },
    { path: '/recruiter-company-profile', icon: 'fas fa-building', label: 'Company Profile' }
];

const initialJobData = {
    jobTitle: '',
    jobDescription: '',
    jobType: 'Full-time',
    location: '',
    salaryMin: '',
    salaryMax: '',
    salaryType: 'range',
    salaryCurrency: 'USD',
    industry: '',
    requiredSkills: [],
    applicationDeadline: '',
    contactEmail: '',
    companyName: 'Recruiter Co.',
    companyWebsite: '',
};

function PostJobStandalonePage() {
    const location = useLocation();
    const navigate = useNavigate();
    const [jobData, setJobData] = useState(initialJobData);
    const [currentSkill, setCurrentSkill] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [companyData, setCompanyData] = useState(null); // State for header data

    // Fetch company profile for the header
    useEffect(() => {
        const fetchProfileForHeader = async () => {
            const token = localStorage.getItem('authToken');
            if (!token) return; // Don't fetch if not logged in
            try {
                const response = await fetch('https://pro-track-job-portal-backend.onrender.com/api/profile/recruiter', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (response.ok) {
                    const data = await response.json();
                    setCompanyData(data);
                }
            } catch (error) {
                console.error("Failed to fetch company profile for header");
            }
        };
        fetchProfileForHeader();
    }, []);


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setJobData(prev => ({ ...prev, [name]: value }));
    };

    const handleSkillAdd = () => {
        if (currentSkill.trim() && !jobData.requiredSkills.includes(currentSkill.trim())) {
            setJobData(prev => ({
                ...prev,
                requiredSkills: [...prev.requiredSkills, currentSkill.trim()]
            }));
            setCurrentSkill('');
        }
    };

    const handleSkillRemove = (skillToRemove) => {
        setJobData(prev => ({
            ...prev,
            requiredSkills: prev.requiredSkills.filter(skill => skill !== skillToRemove)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!jobData.jobTitle || !jobData.jobDescription || !jobData.location || !jobData.contactEmail) {
            toast.error("Please fill in all required fields.");
            return;
        }

        const token = localStorage.getItem('authToken');
        if (!token) {
            toast.error('You are not logged in. Please log in to post a job.');
            navigate('/login');
            return;
        }
        
        setIsSubmitting(true);
        const loadingToast = toast.loading('Posting job...');

        try {
            const response = await fetch('https://pro-track-job-portal-backend.onrender.com/api/jobs/post', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(jobData),
            });

            const result = await response.json();
            toast.dismiss(loadingToast);

            if (!response.ok) {
                throw new Error(result.message || 'Failed to post job.');
            }
            
            toast.success(result.message);
            setJobData(initialJobData);
            navigate('/recruiter-dashboard');
        } catch (error) {
            toast.dismiss(loadingToast);
            console.error('Failed to post job:', error);
            toast.error('An error occurred while trying to post the job.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        toast.success('Logged out successfully!');
        navigate('/login');
    };

    return (
        <div className="recruiter-page-layout-container">
            {/* Sidebar */}
            <div className="recruiter-page-sidebar">
                <div className="recruiter-page-sidebar-header">
                    <h1 className="recruiter-page-sidebar-title">Pro<span className="trck">Track</span></h1>
                </div>
                <nav className="recruiter-page-sidebar-nav">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`recruiter-page-nav-link ${location.pathname === item.path ? 'active' : ''}`}
                        >
                            <i className={`${item.icon} recruiter-page-nav-icon`}></i>
                            {item.label}
                        </Link>
                    ))}
                </nav>
            </div>

            {/* Main Content */}
            <div className="recruiter-page-main-content">
                <header className="recruiter-page-main-header">
                    <div className="recruiter-page-header-content">
                        <h1 className="recruiter-page-header-title">Post a New Job</h1>
                        <div className="recruiter-page-header-actions">
                            <button className="recruiter-page-notification-button" title="Notifications">
                                <i className="fas fa-bell"></i>
                                <span className="recruiter-notification-dot"></span>
                            </button>
                            {/* --- DYNAMIC HEADER PROFILE --- */}
                            <div className="recruiter-page-user-profile">
                                <span className="recruiter-page-user-name">{companyData?.companyName || 'Recruiter'}</span>
                                <div className="recruiter-page-user-avatar">
                                    {companyData?.logoUrl && !companyData.logoUrl.includes('placehold.co') ? (
                                        <img src={companyData.logoUrl} alt="Logo" className="header-logo-img" />
                                    ) : (
                                        companyData?.companyName ? companyData.companyName.substring(0, 2).toUpperCase() : 'CO'
                                    )}
                                </div>
                            </div>
                            <button onClick={handleLogout} className="recruiter-logout-button" title="Logout">
                                <i className="fas fa-sign-out-alt"></i>
                                <span className="recruiter-logout-text">Logout</span>
                            </button>
                        </div>
                    </div>
                </header>

                <main className="recruiter-page-content-area">
                    <div className="post-job-form-container">
                        <form onSubmit={handleSubmit} className="post-job-form">
                            <fieldset disabled={isSubmitting}>
                                <div className="form-section">
                                    <h2 className="form-section-title">Job Details</h2>
                                    <div className="form-grid two-columns">
                                        <div className="form-group">
                                            <label htmlFor="jobTitle">Job Title <span className="required-asterisk">*</span></label>
                                            <input type="text" id="jobTitle" name="jobTitle" value={jobData.jobTitle} onChange={handleInputChange} required />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="jobType">Job Type</label>
                                            <select id="jobType" name="jobType" value={jobData.jobType} onChange={handleInputChange}>
                                                <option value="Full-time">Full-time</option>
                                                <option value="Part-time">Part-time</option>
                                                <option value="Contract">Contract</option>
                                                <option value="Temporary">Temporary</option>
                                                <option value="Internship">Internship</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="jobDescription">Job Description <span className="required-asterisk">*</span></label>
                                        <textarea id="jobDescription" name="jobDescription" value={jobData.jobDescription} onChange={handleInputChange} rows="6" required></textarea>
                                    </div>
                                    <div className="form-grid two-columns">
                                        <div className="form-group">
                                            <label htmlFor="location">Location (e.g., City, State or "Remote") <span className="required-asterisk">*</span></label>
                                            <input type="text" id="location" name="location" value={jobData.location} onChange={handleInputChange} required />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="industry">Industry</label>
                                            <input type="text" id="industry" name="industry" value={jobData.industry} onChange={handleInputChange} placeholder="e.g., Technology, Healthcare" />
                                        </div>
                                    </div>
                                </div>

                                <div className="form-section">
                                    <h2 className="form-section-title">Requirements & Application</h2>
                                    <div className="form-group">
                                        <label>Required Skills</label>
                                        <div className="skills-input-area">
                                            <input type="text" value={currentSkill} onChange={(e) => setCurrentSkill(e.target.value)} placeholder="e.g., React, Python" onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); handleSkillAdd(); } }} />
                                            <button type="button" onClick={handleSkillAdd} className="add-skill-btn">Add Skill</button>
                                        </div>
                                        <div className="skills-tags-container">
                                            {jobData.requiredSkills.map((skill, index) => (
                                                <span key={index} className="skill-tag-item">
                                                    {skill}
                                                    <button type="button" onClick={() => handleSkillRemove(skill)} className="remove-skill-tag-btn">&times;</button>
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="form-grid two-columns">
                                        <div className="form-group">
                                            <label htmlFor="applicationDeadline">Application Deadline</label>
                                            <input type="date" id="applicationDeadline" name="applicationDeadline" value={jobData.applicationDeadline} onChange={handleInputChange} />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="contactEmail">Application Contact Email <span className="required-asterisk">*</span></label>
                                            <input type="email" id="contactEmail" name="contactEmail" value={jobData.contactEmail} onChange={handleInputChange} required />
                                        </div>
                                    </div>
                                </div>

                                <div className="form-actions">
                                    <button type="button" className="cancel-post-btn" onClick={() => navigate('/recruiter-dashboard')} disabled={isSubmitting}>Cancel</button>
                                    <button type="submit" className="submit-post-btn" disabled={isSubmitting}>
                                        {isSubmitting ? (
                                            <><i className="fas fa-spinner fa-spin"></i> Posting...</>
                                        ) : (
                                            <><i className="fas fa-paper-plane"></i> Post Job</>
                                        )}
                                    </button>
                                </div>
                            </fieldset>
                        </form>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default PostJobStandalonePage;
