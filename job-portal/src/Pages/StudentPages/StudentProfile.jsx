import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

// --- Skeleton Loader Component for Student Profile ---
const StudentProfileSkeleton = () => (
    <>
        <style>{`
            .skeleton-box { background-color: #e0e0e0; border-radius: 8px; animation: skeleton-pulse 1.5s infinite ease-in-out; }
            .skeleton-line { width: 100%; height: 20px; margin-bottom: 10px; border-radius: 4px; }
            .skeleton-line.short { width: 60%; }
            @keyframes skeleton-pulse { 0% { background-color: #e0e0e0; } 50% { background-color: #f0f0f0; } 100% { background-color: #e0e0e0; } }
        `}</style>
        <div className="my-profile-form">
            <div className="profile-header-section" style={{ alignItems: 'center' }}>
                <div className="profile-picture-container skeleton-box" style={{ width: '120px', height: '120px', borderRadius: '50%' }}></div>
                <div className="profile-header-info" style={{ flexGrow: 1, marginLeft: '1.5rem' }}>
                    <div className="skeleton-box skeleton-line" style={{ height: '30px', width: '200px', marginBottom: '0.5rem' }}></div>
                    <div className="skeleton-box skeleton-line short" style={{ height: '20px', width: '150px' }}></div>
                </div>
            </div>

            <div className="profile-section skeleton-box" style={{ padding: '2rem', marginTop: '2rem' }}>
                <div className="skeleton-line"></div>
                <div className="skeleton-line short"></div>
                <div className="skeleton-line"></div>
            </div>
            <div className="profile-section skeleton-box" style={{ padding: '2rem', marginTop: '2rem' }}>
                <div className="skeleton-line"></div>
                <div className="skeleton-line short"></div>
                <div className="skeleton-line"></div>
            </div>
        </div>
    </>
);

// Navigation items for the sidebar
const navItems = [
    { path: '/student-dashboard', icon: 'fas fa-tachometer-alt', label: 'Dashboard' },
    { path: '/student-profile', icon: 'fas fa-user-circle', label: 'My Profile' },
    { path: '/student-resume', icon: 'fas fa-file-alt', label: 'Resume Manager' },
    { path: '/student-applications', icon: 'fas fa-inbox', label: 'Applications' },
    { path: '/student-notifications', icon: 'fas fa-bell', label: 'Notifications' },
];

const initialEducationEntry = {
    institution: '',
    degree: '',
    field: '',
    gradYear: '',
    gpa: '',
};

const initialExperienceEntry = {
    company: '',
    title: '',
    startDate: '',
    endDate: '',
    description: '',
};

function MyProfileStandalonePage() {
    const location = useLocation();
    const navigate = useNavigate();

    const [profileData, setProfileData] = useState({
        fullName: '',
        email: '', // Email will be fetched from User model, not directly from StudentProfile
        phone: '',
        linkedin: '',
        github: '',
        portfolio: '',
        bio: '',
        profilePicture: 'https://placehold.co/120x120/15803D/FFFFFF?text=JD', // Default placeholder
    });
    // Store original profile data (including email) for comparison and reset
    const [originalProfileData, setOriginalProfileData] = useState(profileData); 
    const [educationEntries, setEducationEntries] = useState([]);
    const [experienceEntries, setExperienceEntries] = useState([]);
    const [skills, setSkills] = useState([]);
    const [newSkill, setNewSkill] = useState('');
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false); // New state for edit mode

    // State for Education Modal
    const [showEducationModal, setShowEducationModal] = useState(false);
    const [currentEducation, setCurrentEducation] = useState(initialEducationEntry);
    const [editingEducationId, setEditingEducationId] = useState(null);

    // State for Experience Modal
    const [showExperienceModal, setShowExperienceModal] = useState(false);
    const [currentExperience, setCurrentExperience] = useState(initialExperienceEntry);
    const [editingExperienceId, setEditingExperienceId] = useState(null);

    // Fetch profile data on component mount
    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem('authToken');
            if (!token) {
                toast.error("Please log in to view your profile.");
                navigate('/login');
                return;
            }

            try {
                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/profile/student`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (response.status === 404) {
                    toast("No student profile found. Please create one.", { icon: 'ℹ️' });
                    // If profile not found, set initial empty data. Email will come from user's auth token.
                    // For now, set a placeholder email.
                    setProfileData(prev => ({ ...prev, email: 'your.email@example.com' })); 
                    setOriginalProfileData(prev => ({ ...prev, email: 'your.email@example.com' })); 
                } else if (!response.ok) {
                    throw new Error('Failed to fetch profile.');
                } else {
                    const data = await response.json();
                    const fetchedProfile = {
                        fullName: data.fullName || '',
                        // Email will be fetched from the user object
                        email: data.user?.email || '', 
                        phone: data.phone || '',
                        linkedin: data.linkedin || '',
                        github: data.github || '',
                        portfolio: data.portfolio || '',
                        bio: data.bio || '',
                        profilePicture: data.profilePicture || 'https://placehold.co/120x120/15803D/FFFFFF?text=JD',
                    };
                    setProfileData(fetchedProfile);
                    setOriginalProfileData(fetchedProfile); // Store original fetched data
                    setEducationEntries(data.education || []);
                    setExperienceEntries(data.experience || []);
                    setSkills(data.skills || []);
                }
            } catch (error) {
                toast.error(error.message || "Could not fetch profile.");
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [navigate]);

    // Handle input changes for main profile data
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProfileData(prev => ({ ...prev, [name]: value }));
    };

    // Handle profile picture file change (converts to Data URL for display/storage)
    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = (event) => {
                setProfileData(prev => ({ ...prev, profilePicture: event.target.result }));
            };
            reader.readAsDataURL(file); // Reads file as base64 Data URL
        }
    };

    // Handle adding a new skill
    const handleAddSkill = () => {
        if (newSkill.trim() && !skills.includes(newSkill.trim())) {
            setSkills([...skills, newSkill.trim()]);
            setNewSkill('');
        }
    };

    // Handle removing an existing skill
    const handleRemoveSkill = (skillToRemove) => {
        setSkills(skills.filter(skill => skill !== skillToRemove));
    };

    // --- Education Modal Functions ---
    const openEducationModal = (education = null) => {
        if (education) {
            setCurrentEducation(education);
            setEditingEducationId(education._id); // Use _id for existing entries
        } else {
            setCurrentEducation(initialEducationEntry);
            setEditingEducationId(null);
        }
        setShowEducationModal(true);
    };

    const closeEducationModal = () => {
        setShowEducationModal(false);
        setCurrentEducation(initialEducationEntry);
        setEditingEducationId(null);
    };

    const handleEducationChange = (e) => {
        const { name, value } = e.target;
        setCurrentEducation(prev => ({ ...prev, [name]: value }));
    };

    const handleSaveEducation = (e) => {
        e.preventDefault();
        if (editingEducationId) {
            setEducationEntries(
                educationEntries.map(edu =>
                    edu._id === editingEducationId ? { ...currentEducation, _id: editingEducationId } : edu
                )
            );
        } else {
            // For new entries, DO NOT assign an _id. Let Mongoose generate it.
            setEducationEntries([...educationEntries, { ...currentEducation }]);
        }
        closeEducationModal();
    };

    const handleDeleteEducation = (id) => {
        if (window.confirm("Are you sure you want to delete this education entry?")) {
            setEducationEntries(educationEntries.filter(edu => edu._id !== id));
        }
    };

    // --- Experience Modal Functions ---
    const openExperienceModal = (experience = null) => {
        if (experience) {
            setCurrentExperience(experience);
            setEditingExperienceId(experience._id); // Use _id for existing entries
        } else {
            setCurrentExperience(initialExperienceEntry);
            setEditingExperienceId(null);
        }
        setShowExperienceModal(true);
    };

    const closeExperienceModal = () => {
        setShowExperienceModal(false);
        setCurrentExperience(initialExperienceEntry);
        setEditingExperienceId(null);
    };

    const handleExperienceChange = (e) => {
        const { name, value } = e.target;
        setCurrentExperience(prev => ({ ...prev, [name]: value }));
    };

    const handleSaveExperience = (e) => {
        e.preventDefault();
        if (editingExperienceId) {
            setExperienceEntries(
                experienceEntries.map(exp =>
                    exp._id === editingExperienceId ? { ...currentExperience, _id: editingExperienceId } : exp
                )
            );
        } else {
            // For new entries, DO NOT assign an _id. Let Mongoose generate it.
            setExperienceEntries([...experienceEntries, { ...currentExperience }]);
        }
        closeExperienceModal();
    };

    const handleDeleteExperience = (id) => {
        if (window.confirm("Are you sure you want to delete this experience entry?")) {
            setExperienceEntries(experienceEntries.filter(exp => exp._id !== id));
        }
    };

    // Main form submission to save all profile data to backend
    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('authToken');
        if (!token) {
            toast.error("You are not logged in.");
            navigate('/login');
            return;
        }

        const loadingToast = toast.loading('Saving profile...');
        let profileSaveSuccess = false;
        let emailUpdateSuccess = true; // Assume true if email not changed or no error

        try {
            // Check if email has changed and update separately
            if (profileData.email !== originalProfileData.email) {
                const emailUpdateResponse = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/update-email`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ email: profileData.email })
                });

                const emailUpdateResult = await emailUpdateResponse.json();
                if (!emailUpdateResponse.ok) {
                    emailUpdateSuccess = false;
                    throw new Error(emailUpdateResult.message || 'Failed to update email.');
                } else {
                    toast.success('Email updated successfully!');
                }
            }

            // Remove the email field from profileData as it's part of the User model, not StudentProfile
            const { email, ...dataToSend } = profileData; 

            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/profile/student`, {
                method: 'POST', // Use POST for upsert (create or update)
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    ...dataToSend, // Now without the email
                    education: educationEntries,
                    experience: experienceEntries,
                    skills: skills,
                })
            });

            const result = await response.json();
            toast.dismiss(loadingToast);

            if (!response.ok) {
                throw new Error(result.message || 'Failed to save profile.');
            }
            
            profileSaveSuccess = true;
            toast.success('Profile saved successfully!');
            
            // Update state with canonical data from backend, especially new _ids for subdocuments
            const updatedProfileData = {
                fullName: result.profile.fullName || '',
                email: result.profile.user?.email || profileData.email, // Use updated email if changed, or fetched
                phone: result.profile.phone || '',
                linkedin: result.profile.linkedin || '',
                github: result.profile.github || '',
                portfolio: result.profile.portfolio || '',
                bio: result.profile.bio || '',
                profilePicture: result.profile.profilePicture || 'https://placehold.co/120x120/15803D/FFFFFF?text=JD',
            };
            setProfileData(updatedProfileData);
            setOriginalProfileData(updatedProfileData); // Update original data after successful save
            setEducationEntries(result.profile.education || []);
            setExperienceEntries(result.profile.experience || []);
            setSkills(result.profile.skills || []);
            setIsEditing(false); // Exit edit mode on successful save

        } catch (error) {
            toast.dismiss(loadingToast);
            // If profile save failed, but email update succeeded, still show error for profile.
            // If email update failed, it would have thrown an error already.
            toast.error(error.message || "An error occurred while saving profile.");
            // If profile save failed, but email was updated, revert email in UI to original
            if (!profileSaveSuccess && !emailUpdateSuccess) {
                setProfileData(prev => ({ ...prev, email: originalProfileData.email }));
            }
        }
    };

    // Handle canceling edits
    const handleCancelEdit = () => {
        // Revert to original data stored when entering edit mode or on initial fetch
        setProfileData(originalProfileData); 
        setEducationEntries(originalProfileData.education || []); 
        setExperienceEntries(originalProfileData.experience || []);
        setSkills(originalProfileData.skills || []);
        setIsEditing(false);
    };


    const handleLogout = () => {
        localStorage.removeItem('authToken');
        toast.success("Logged out successfully!");
        navigate('/login');
    };

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
                        </Link>
                    ))}
                </nav>
            </div>

            {/* Main Content */}
            <div className="student-page-main-content">
                <header className="student-page-main-header">
                    <div className="student-page-header-content">
                        <h1 className="student-page-header-title">My Profile</h1>
                        <div className="student-page-header-actions">
                            <button className="student-page-notification-button" title="Notifications">
                                <i className="fas fa-bell"></i>
                            </button>
                            <div className="student-page-user-profile">
                                <span className="student-page-user-name">{profileData.fullName?.split(' ')[0] || 'Student'}</span>
                                <div className="student-page-user-avatar">
                                    {profileData.profilePicture && !profileData.profilePicture.includes('placehold.co') ? (
                                        <img src={profileData.profilePicture} alt="Profile" className="header-profile-img" />
                                    ) : (
                                        profileData.fullName ? profileData.fullName.split(' ').map(n => n[0]).join('').toUpperCase() : 'SU'
                                    )}
                                </div>
                            </div>
                            <button onClick={handleLogout} className="logout-button" title="Logout">
                                <i className="fas fa-sign-out-alt"></i>
                                <span className="logout-text">Logout</span>
                            </button>
                        </div>
                    </div>
                </header>

                <main className="student-page-content-area">
                    {loading ? <StudentProfileSkeleton /> : (
                        <form onSubmit={handleSubmit} className="my-profile-form">
                            <div className="profile-header-section">
                                <div className="profile-picture-container">
                                    <img src={profileData.profilePicture} alt="Profile" className="profile-picture" />
                                    {isEditing && ( // Show upload button only in edit mode
                                        <label htmlFor="profilePictureInput" className="profile-picture-upload-btn">
                                            <i className="fas fa-camera"></i>
                                        </label>
                                    )}
                                    <input
                                        type="file"
                                        id="profilePictureInput"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        style={{ display: 'none' }}
                                    />
                                </div>
                                <div className="profile-header-info">
                                    <h2>{profileData.fullName || "Your Name"}</h2>
                                    <p>{profileData.email || "your.email@example.com"}</p>
                                </div>
                                {!isEditing && ( // Show Edit button only in view mode
                                    <button type="button" onClick={() => setIsEditing(true)} className="edit-profile-btn">
                                        <i className="fas fa-pencil-alt"></i> Edit Profile
                                    </button>
                                )}
                            </div>

                            <div className="profile-section">
                                <h3 className="section-title">Personal Details</h3>
                                <div className="form-grid">
                                    <div className="form-group">
                                        <label htmlFor="fullName">Full Name</label>
                                        {isEditing ? (
                                            <input type="text" id="fullName" name="fullName" value={profileData.fullName} onChange={handleInputChange} required />
                                        ) : (
                                            <p className="display-text">{profileData.fullName || 'N/A'}</p>
                                        )}
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="email">Email Address</label>
                                        {/* Email field is now conditionally editable */}
                                        {isEditing ? (
                                            <input type="email" id="email" name="email" value={profileData.email} onChange={handleInputChange} required />
                                        ) : (
                                            <p className="display-text">{profileData.email || 'N/A'}</p>
                                        )}
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="phone">Phone Number</label>
                                        {isEditing ? (
                                            <input type="tel" id="phone" name="phone" value={profileData.phone} onChange={handleInputChange} />
                                        ) : (
                                            <p className="display-text">{profileData.phone || 'N/A'}</p>
                                        )}
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="bio">Short Bio / Summary</label>
                                    {isEditing ? (
                                        <textarea id="bio" name="bio" value={profileData.bio} onChange={handleInputChange} rows="4"></textarea>
                                    ) : (
                                        <p className="display-text">{profileData.bio || 'No bio provided.'}</p>
                                    )}
                                </div>
                            </div>

                            <div className="profile-section">
                                <h3 className="section-title">Online Presence</h3>
                                <div className="form-grid">
                                    <div className="form-group">
                                        <label htmlFor="linkedin">LinkedIn Profile URL</label>
                                        {isEditing ? (
                                            <input type="text" id="linkedin" name="linkedin" value={profileData.linkedin} onChange={handleInputChange} placeholder="https://linkedin.com/in/yourprofile" />
                                        ) : (
                                            <p className="display-text">
                                                {profileData.linkedin ? <a href={profileData.linkedin} target="_blank" rel="noopener noreferrer">{profileData.linkedin}</a> : 'N/A'}
                                            </p>
                                        )}
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="github">GitHub Profile URL</label>
                                        {isEditing ? (
                                            <input type="text" id="github" name="github" value={profileData.github} onChange={handleInputChange} placeholder="https://github.com/yourusername" />
                                        ) : (
                                            <p className="display-text">
                                                {profileData.github ? <a href={profileData.github} target="_blank" rel="noopener noreferrer">{profileData.github}</a> : 'N/A'}
                                            </p>
                                        )}
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="portfolio">Portfolio Website</label>
                                        {isEditing ? (
                                            <input type="text" id="portfolio" name="portfolio" value={profileData.portfolio} onChange={handleInputChange} placeholder="https://yourportfolio.com" />
                                        ) : (
                                            <p className="display-text">
                                                {profileData.portfolio ? <a href={profileData.portfolio} target="_blank" rel="noopener noreferrer">{profileData.portfolio}</a> : 'N/A'}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="profile-section">
                                <div className="section-header">
                                    <h3 className="section-title">Education</h3>
                                    {isEditing && ( // Show add button only in edit mode
                                        <button type="button" onClick={() => openEducationModal()} className="add-entry-button-inline">
                                            <i className="fas fa-plus"></i> Add Education
                                        </button>
                                    )}
                                </div>
                                {educationEntries.length > 0 ? educationEntries.map((entry) => (
                                    <div key={entry._id} className="entry-card education-entry">
                                        <div className="entry-card-content">
                                            <h4>{entry.degree} in {entry.field}</h4>
                                            <p>{entry.institution} - Graduated {entry.gradYear}</p>
                                            {entry.gpa && <p>GPA: {entry.gpa}</p>}
                                        </div>
                                        {isEditing && ( // Show edit/delete buttons only in edit mode
                                            <div className="entry-card-actions">
                                                <button type="button" onClick={() => openEducationModal(entry)} className="edit-entry-btn" title="Edit">
                                                    <i className="fas fa-pencil-alt"></i>
                                                </button>
                                                <button type="button" onClick={() => handleDeleteEducation(entry._id)} className="delete-entry-btn" title="Delete">
                                                    <i className="fas fa-trash-alt"></i>
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )) : <p className="no-entries-message">No education entries added yet.</p>}
                            </div>

                            <div className="profile-section">
                                <div className="section-header">
                                    <h3 className="section-title">Work Experience</h3>
                                    {isEditing && ( // Show add button only in edit mode
                                        <button type="button" onClick={() => openExperienceModal()} className="add-entry-button-inline">
                                            <i className="fas fa-plus"></i> Add Experience
                                        </button>
                                    )}
                                </div>
                                {experienceEntries.length > 0 ? experienceEntries.map((entry) => (
                                    <div key={entry._id} className="entry-card experience-entry">
                                        <div className="entry-card-content">
                                            <h4>{entry.title} at {entry.company}</h4>
                                            <p>{entry.startDate} - {entry.endDate}</p>
                                            <p className="entry-description">{entry.description}</p>
                                        </div>
                                        {isEditing && ( // Show edit/delete buttons only in edit mode
                                            <div className="entry-card-actions">
                                                <button type="button" onClick={() => openExperienceModal(entry)} className="edit-entry-btn" title="Edit">
                                                    <i className="fas fa-pencil-alt"></i>
                                                </button>
                                                <button type="button" onClick={() => handleDeleteExperience(entry._id)} className="delete-entry-btn" title="Delete">
                                                    <i className="fas fa-trash-alt"></i>
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )) : <p className="no-entries-message">No experience entries added yet.</p>}
                            </div>

                            <div className="profile-section">
                                <h3 className="section-title">Skills</h3>
                                <div className="skills-container">
                                    {skills.map(skill => (
                                        <span key={skill} className="skill-tag-profile">
                                            {skill}
                                            {isEditing && ( // Show remove button only in edit mode
                                                <button type="button" onClick={() => handleRemoveSkill(skill)} className="remove-skill-btn">&times;</button>
                                            )}
                                        </span>
                                    ))}
                                </div>
                                {isEditing && ( // Show add skill input/button only in edit mode
                                    <div className="add-skill-container">
                                        <input
                                            type="text"
                                            value={newSkill}
                                            onChange={(e) => setNewSkill(e.target.value)}
                                            placeholder="Add a new skill"
                                            className="add-skill-input"
                                        />
                                        <button type="button" onClick={handleAddSkill} className="add-skill-button">
                                            Add Skill
                                        </button>
                                    </div>
                                )}
                            </div>

                            {isEditing && ( // Show form actions only in edit mode
                                <div className="form-actions">
                                    <button type="button" onClick={handleCancelEdit} className="cancel-btn-profile">
                                        Cancel
                                    </button>
                                    <button type="submit" className="save-profile-button">
                                        <i className="fas fa-save"></i> Save All Changes
                                    </button>
                                </div>
                            )}
                        </form>
                    )}
                </main>
            </div>

            {/* Education Modal */}
            {showEducationModal && (
                <div className="modal-overlay-profile">
                    <div className="modal-content-profile">
                        <h3>{editingEducationId ? 'Edit Education' : 'Add New Education'}</h3>
                        <form onSubmit={handleSaveEducation}>
                            <div className="form-group-modal">
                                <label htmlFor="eduInstitution">Institution Name</label>
                                <input type="text" id="eduInstitution" name="institution" value={currentEducation.institution} onChange={handleEducationChange} required />
                            </div>
                            <div className="form-group-modal">
                                <label htmlFor="eduDegree">Degree</label>
                                <input type="text" id="eduDegree" name="degree" value={currentEducation.degree} onChange={handleEducationChange} required />
                            </div>
                            <div className="form-group-modal">
                                <label htmlFor="eduField">Field of Study</label>
                                <input type="text" id="eduField" name="field" value={currentEducation.field} onChange={handleEducationChange} required />
                            </div>
                            <div className="form-grid-modal">
                                <div className="form-group-modal">
                                    <label htmlFor="eduGradYear">Graduation Year</label>
                                    <input type="text" id="eduGradYear" name="gradYear" value={currentEducation.gradYear} onChange={handleEducationChange} placeholder="YYYY" required />
                                </div>
                                <div className="form-group-modal">
                                    <label htmlFor="eduGpa">GPA (Optional)</label>
                                    <input type="text" id="eduGpa" name="gpa" value={currentEducation.gpa} onChange={handleEducationChange} />
                                </div>
                            </div>
                            <div className="modal-actions-profile">
                                <button type="button" onClick={closeEducationModal} className="cancel-btn-profile">
                                    Cancel
                                </button>
                                <button type="submit" className="save-btn-profile">
                                    {editingEducationId ? 'Save Changes' : 'Add Education'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Experience Modal */}
            {showExperienceModal && (
                <div className="modal-overlay-profile">
                    <div className="modal-content-profile">
                        <h3>{editingExperienceId ? 'Edit Experience' : 'Add New Experience'}</h3>
                        <form onSubmit={handleSaveExperience}>
                            <div className="form-group-modal">
                                <label htmlFor="expCompany">Company Name</label>
                                <input type="text" id="expCompany" name="company" value={currentExperience.company} onChange={handleExperienceChange} required />
                            </div>
                            <div className="form-group-modal">
                                <label htmlFor="expTitle">Job Title</label>
                                <input type="text" id="expTitle" name="title" value={currentExperience.title} onChange={handleExperienceChange} required />
                            </div>
                            <div className="form-grid-modal">
                                <div className="form-group-modal">
                                    <label htmlFor="expStartDate">Start Date</label>
                                    <input type="text" id="expStartDate" name="startDate" value={currentExperience.startDate} onChange={handleExperienceChange} placeholder="MMM YYYY" required />
                                </div>
                                <div className="form-group-modal">
                                    <label htmlFor="expEndDate">End Date (or "Present")</label>
                                    <input type="text" id="expEndDate" name="endDate" value={currentExperience.endDate} onChange={handleExperienceChange} placeholder="MMM YYYY or Present" required />
                                </div>
                            </div>
                            <div className="form-group-modal">
                                <label htmlFor="expDescription">Description / Responsibilities</label>
                                <textarea id="expDescription" name="description" value={currentExperience.description} onChange={handleExperienceChange} rows="4" required></textarea>
                            </div>
                            <div className="modal-actions-profile">
                                <button type="button" onClick={closeExperienceModal} className="cancel-btn-profile">
                                    Cancel
                                </button>
                                <button type="submit" className="save-btn-profile">
                                    {editingExperienceId ? 'Save Changes' : 'Add Experience'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default MyProfileStandalonePage;
