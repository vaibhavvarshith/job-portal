import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

// --- Skeleton Loader Component ---
const ProfileSkeleton = () => (
    <>
        <style>{`
            .skeleton-box { background-color: #e0e0e0; border-radius: 8px; animation: skeleton-pulse 1.5s infinite ease-in-out; }
            .skeleton-line { width: 100%; height: 20px; margin-bottom: 10px; border-radius: 4px; }
            .skeleton-line.short { width: 60%; }
            @keyframes skeleton-pulse { 0% { background-color: #e0e0e0; } 50% { background-color: #f0f0f0; } 100% { background-color: #e0e0e0; } }
        `}</style>
        <div className="company-profile-container">
            <div className="profile-banner-section skeleton-box" style={{ height: '200px' }}></div>
            <div className="profile-header-main" style={{ alignItems: 'center' }}>
                <div className="profile-logo-container skeleton-box" style={{ width: '150px', height: '150px', borderRadius: '50%', marginTop: '-75px' }}></div>
                <div className="profile-company-name-tagline" style={{ flexGrow: 1, marginLeft: '20px' }}>
                    <div className="skeleton-box skeleton-line" style={{ height: '36px', width: '300px' }}></div>
                    <div className="skeleton-box skeleton-line short" style={{ height: '24px', width: '200px', marginTop: '10px' }}></div>
                </div>
            </div>
            <div className="form-section-profile skeleton-box" style={{ marginTop: '2rem', padding: '2rem' }}>
                <div className="skeleton-line"></div>
                <div className="skeleton-line short"></div>
                <div className="skeleton-line"></div>
            </div>
        </div>
    </>
);


// Navigation items for the Recruiter sidebar
const navItems = [
    { path: '/recruiter-dashboard', icon: 'fas fa-tachometer-alt', label: 'Dashboard' },
    { path: '/recruiter-post-job', icon: 'fas fa-plus-square', label: 'Post a Job' },
    { path: '/recruiter-post-internship', icon: 'fas fa-graduation-cap', label: 'Post an Internship' },
    { path: '/recruiter-applications-approval', icon: 'fas fa-check-circle', label: 'Applications Approval' },
    { path: '/recruiter-company-profile', icon: 'fas fa-building', label: 'Company Profile' }
];

const initialCompanyData = {
    companyName: '', website: '', industry: '', companySize: '', foundedYear: '',
    tagline: '', description: '', addressLine1: '', addressLine2: '', city: '',
    state: '', zipCode: '', country: '', contactEmail: '', contactPhone: '',
    logoUrl: 'https://placehold.co/150x150/166534/FFFFFF?text=Logo',
    bannerUrl: 'https://placehold.co/800x200/14532d/a7f3d0?text=Banner',
};

function CompanyProfileStandalonePage() {
    const location = useLocation();
    const navigate = useNavigate();
    
    const [companyData, setCompanyData] = useState(initialCompanyData);
    const [originalCompanyData, setOriginalCompanyData] = useState(initialCompanyData);
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem('authToken');
            if (!token) {
                toast.error("Please log in to view your profile.");
                navigate('/login');
                return;
            }

            try {
                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/profile/recruiter`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (response.status === 404) {
                    toast("No company profile found. Please create one.", { icon: 'ℹ️' });
                    setCompanyData(initialCompanyData);
                    setOriginalCompanyData(initialCompanyData);
                } else if (!response.ok) {
                    throw new Error('Failed to fetch profile.');
                } else {
                    const data = await response.json();
                    setCompanyData(data);
                    setOriginalCompanyData(data);
                }
            } catch (error) {
                toast.error(error.message || "Could not fetch profile.");
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [navigate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCompanyData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e, field) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setCompanyData(prev => ({ ...prev, [field]: event.target.result }));
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('authToken');
        const loadingToast = toast.loading('Saving profile...');

        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/profile/recruiter`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(companyData)
            });

            const result = await response.json();
            toast.dismiss(loadingToast);

            if (!response.ok) {
                throw new Error(result.message || 'Failed to save profile.');
            }
            
            toast.success('Profile saved successfully!');
            setCompanyData(result.profile);
            setOriginalCompanyData(result.profile);
            setIsEditing(false);

        } catch (error) {
            toast.dismiss(loadingToast);
            toast.error(error.message);
        }
    };
    
    const handleCancelEdit = () => {
        setCompanyData(originalCompanyData);
        setIsEditing(false);
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
                        <h1 className="recruiter-page-header-title">Company Profile</h1>
                        <div className="recruiter-page-header-actions">
                            <button className="recruiter-page-notification-button" title="Notifications">
                                <i className="fas fa-bell"></i>
                                <span className="recruiter-notification-dot"></span>
                            </button>
                            {/* --- UPDATED HEADER PROFILE --- */}
                            <div className="recruiter-page-user-profile">
                                <span className="recruiter-page-user-name">{companyData.companyName || 'Recruiter'}</span>
                                <div className="recruiter-page-user-avatar">
                                    {companyData.logoUrl && !companyData.logoUrl.includes('placehold.co') ? (
                                        <img src={companyData.logoUrl} alt="Logo" className="header-logo-img" />
                                    ) : (
                                        companyData.companyName ? companyData.companyName.substring(0, 2).toUpperCase() : 'CO'
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
                    {loading ? <ProfileSkeleton /> : (
                        <div className="company-profile-container">
                            <form onSubmit={handleSubmit} className="company-profile-form">
                                <div className="profile-banner-section" style={{ backgroundImage: `url(${companyData.bannerUrl})` }}>
                                    {isEditing && (
                                        <label htmlFor="bannerUpload" className="upload-banner-btn" title="Change Banner Image">
                                            <i className="fas fa-camera"></i> Change Banner
                                            <input type="file" id="bannerUpload" accept="image/*" onChange={(e) => handleFileChange(e, 'bannerUrl')} style={{ display: 'none' }} />
                                        </label>
                                    )}
                                </div>
                                <br/>
                                <div className="profile-header-main">
                                    <div className="profile-logo-container">
                                        <img src={companyData.logoUrl} alt={`${companyData.companyName} Logo`} className="company-logo-profile" />
                                        {isEditing && (
                                            <label htmlFor="logoUpload" className="upload-logo-btn" title="Change Company Logo">
                                                <i className="fas fa-camera"></i>
                                                <input type="file" id="logoUpload" accept="image/*" onChange={(e) => handleFileChange(e, 'logoUrl')} style={{ display: 'none' }} />
                                            </label>
                                        )}
                                    </div>
                                    {/* --- UPDATED EDITABLE NAME AND TAGLINE --- */}
                                    <div className="profile-company-name-tagline">
                                        <br/>
                                        {isEditing ? (
                                            <>
                                                <input
                                                    type="text"
                                                    name="companyName"
                                                    value={companyData.companyName}
                                                    onChange={handleInputChange}
                                                    className="editable-header-input"
                                                    placeholder="Company Name"
                                                />
                                                <input
                                                    type="text"
                                                    name="tagline"
                                                    value={companyData.tagline}
                                                    onChange={handleInputChange}
                                                    className="editable-tagline-input"
                                                    placeholder="Company Tagline"
                                                />
                                            </>
                                        ) : (
                                            <>
                                                <h1>{companyData.companyName || 'Company Name'}</h1>
                                                <p>{companyData.tagline || 'Your company tagline'}</p>
                                            </>
                                        )}
                                    </div>
                                    {!isEditing && (
                                        <button type="button" onClick={() => setIsEditing(true)} className="edit-profile-btn">
                                            <i className="fas fa-pencil-alt"></i> Edit Profile
                                        </button>
                                    )}
                                </div>

                                <div className="form-section-profile">
                                    <h2 className="form-section-title-profile">About Us</h2>
                                    <div className="form-group-profile">
                                        <label htmlFor="description">Company Description</label>
                                        {isEditing ? (
                                            <textarea id="description" name="description" value={companyData.description} onChange={handleInputChange} rows="5"></textarea>
                                        ) : (
                                            <p className="display-text">{companyData.description || 'No description provided.'}</p>
                                        )}
                                    </div>
                                    <div className="form-grid-profile two-columns">
                                        <div className="form-group-profile">
                                            <label htmlFor="industry">Industry</label>
                                            {isEditing ? (
                                                <input type="text" id="industry" name="industry" value={companyData.industry} onChange={handleInputChange} />
                                            ) : (
                                                <p className="display-text">{companyData.industry}</p>
                                            )}
                                        </div>
                                        <div className="form-group-profile">
                                            <label htmlFor="companySize">Company Size</label>
                                            {isEditing ? (
                                                <input type="text" id="companySize" name="companySize" value={companyData.companySize} onChange={handleInputChange} />
                                            ) : (
                                                <p className="display-text">{companyData.companySize}</p>
                                            )}
                                        </div>
                                        <div className="form-group-profile">
                                            <label htmlFor="foundedYear">Founded Year</label>
                                            {isEditing ? (
                                                <input type="text" id="foundedYear" name="foundedYear" value={companyData.foundedYear} onChange={handleInputChange} />
                                            ) : (
                                                <p className="display-text">{companyData.foundedYear}</p>
                                            )}
                                        </div>
                                        <div className="form-group-profile">
                                            <label htmlFor="website">Website</label>
                                            {isEditing ? (
                                                <input type="url" id="website" name="website" value={companyData.website} onChange={handleInputChange} />
                                            ) : (
                                                <p className="display-text"><a href={companyData.website} target="_blank" rel="noopener noreferrer">{companyData.website}</a></p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                
                                {isEditing && (
                                    <div className="form-actions-profile">
                                        <button type="button" onClick={handleCancelEdit} className="cancel-profile-btn">
                                            Cancel
                                        </button>
                                        <button type="submit" className="save-profile-btn">
                                            <i className="fas fa-save"></i> Save Changes
                                        </button>
                                    </div>
                                )}
                            </form>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}

export default CompanyProfileStandalonePage;
