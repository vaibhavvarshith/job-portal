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

const initialInternshipData = {
    internshipTitle: '',
    internshipDescription: '',
    internshipType: 'Full-time Internship',
    location: '',
    stipendMin: '',
    stipendMax: '',
    stipendType: 'range',
    stipendCurrency: 'USD',
    duration: '',
    industry: '',
    requiredSkills: [],
    applicationDeadline: '',
    startDate: '',
    contactEmail: '',
    companyName: 'Recruiter Co.',
    companyWebsite: '',
};

function PostInternshipStandalonePage() {
    const location = useLocation();
    const navigate = useNavigate();
    const [internshipData, setInternshipData] = useState(initialInternshipData);
    const [currentSkill, setCurrentSkill] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [companyData, setCompanyData] = useState(null); // State for header data

    // Fetch company profile for the header
    useEffect(() => {
        const fetchProfileForHeader = async () => {
            const token = localStorage.getItem('authToken');
            if (!token) return; // Don't fetch if not logged in
            try {
                const response = await fetch('http://localhost:5000/api/profile/recruiter', {
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
        setInternshipData(prev => ({ ...prev, [name]: value }));
    };

    const handleSkillAdd = () => {
        if (currentSkill.trim() && !internshipData.requiredSkills.includes(currentSkill.trim())) {
            setInternshipData(prev => ({
                ...prev,
                requiredSkills: [...prev.requiredSkills, currentSkill.trim()]
            }));
            setCurrentSkill('');
        }
    };

    const handleSkillRemove = (skillToRemove) => {
        setInternshipData(prev => ({
            ...prev,
            requiredSkills: prev.requiredSkills.filter(skill => skill !== skillToRemove)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!internshipData.internshipTitle || !internshipData.internshipDescription || !internshipData.location || !internshipData.duration || !internshipData.contactEmail) {
            toast.error("Please fill in all required fields.");
            return;
        }

        const token = localStorage.getItem('authToken');
        if (!token) {
            toast.error('Please log in to post an internship.');
            navigate('/login');
            return;
        }
        
        setIsSubmitting(true);
        const loadingToast = toast.loading('Posting internship...');

        try {
            const response = await fetch('http://localhost:5000/api/internships/post', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(internshipData),
            });

            const result = await response.json();
            toast.dismiss(loadingToast);

            if (!response.ok) {
                throw new Error(result.message || 'Failed to post internship.');
            }
            
            toast.success(result.message);
            setInternshipData(initialInternshipData);
            navigate('/recruiter-dashboard');

        } catch (error) {
            toast.dismiss(loadingToast);
            toast.error(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        toast.success("Logged out successfully!");
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
                        <h1 className="recruiter-page-header-title">Post a New Internship</h1>
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
                    <div className="post-internship-form-container">
                        <form onSubmit={handleSubmit} className="post-internship-form">
                            <fieldset disabled={isSubmitting}>
                                <div className="form-section">
                                    <h2 className="form-section-title">Internship Details</h2>
                                    <div className="form-grid two-columns">
                                        <div className="form-group">
                                            <label htmlFor="internshipTitle">Internship Title <span className="required-asterisk">*</span></label>
                                            <input type="text" id="internshipTitle" name="internshipTitle" value={internshipData.internshipTitle} onChange={handleInputChange} required />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="internshipType">Internship Type</label>
                                            <select id="internshipType" name="internshipType" value={internshipData.internshipType} onChange={handleInputChange}>
                                                <option value="Full-time Internship">Full-time Internship</option>
                                                <option value="Part-time Internship">Part-time Internship</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="internshipDescription">Internship Description <span className="required-asterisk">*</span></label>
                                        <textarea id="internshipDescription" name="internshipDescription" value={internshipData.internshipDescription} onChange={handleInputChange} rows="6" required></textarea>
                                    </div>
                                    <div className="form-grid two-columns">
                                        <div className="form-group">
                                            <label htmlFor="location">Location <span className="required-asterisk">*</span></label>
                                            <input type="text" id="location" name="location" value={internshipData.location} onChange={handleInputChange} required />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="duration">Duration <span className="required-asterisk">*</span></label>
                                            <input type="text" id="duration" name="duration" value={internshipData.duration} onChange={handleInputChange} placeholder="e.g., 3 months" required />
                                        </div>
                                    </div>
                                </div>

                                <div className="form-section">
                                    <h2 className="form-section-title">Requirements & Application</h2>
                                    <div className="form-grid two-columns">
                                        <div className="form-group">
                                            <label htmlFor="applicationDeadline">Application Deadline</label>
                                            <input type="date" id="applicationDeadline" name="applicationDeadline" value={internshipData.applicationDeadline} onChange={handleInputChange} />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="contactEmail">Contact Email <span className="required-asterisk">*</span></label>
                                            <input type="email" id="contactEmail" name="contactEmail" value={internshipData.contactEmail} onChange={handleInputChange} required />
                                        </div>
                                    </div>
                                </div>

                                <div className="form-actions">
                                    <button type="button" className="cancel-post-btn" onClick={() => navigate('/recruiter-dashboard')} disabled={isSubmitting}>Cancel</button>
                                    <button type="submit" className="submit-post-btn" disabled={isSubmitting}>
                                        {isSubmitting ? (
                                            <><i className="fas fa-spinner fa-spin"></i> Posting...</>
                                        ) : (
                                            <><i className="fas fa-paper-plane"></i> Post Internship</>
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

export default PostInternshipStandalonePage;
