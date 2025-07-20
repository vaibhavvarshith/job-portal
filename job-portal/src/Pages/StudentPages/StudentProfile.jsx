import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';


const handleLogout = () => {
    // Implement your logout logic here
    // e.g., clear tokens, call a logout API, redirect
    console.log('Admin logged out');
    navigate('/login'); // Example: Redirect to login page
};
// Navigation items for the sidebar
const navItems = [
    { path: '/student-dashboard', icon: 'fas fa-tachometer-alt', label: 'Dashboard' },
    { path: '/student-profile', icon: 'fas fa-user-circle', label: 'My Profile' },
    { path: '/student-resume', icon: 'fas fa-file-alt', label: 'Resume Manager' },
    { path: '/student-applications', icon: 'fas fa-inbox', label: 'Applications', badge: 3 },
    { path: '/student-notifications', icon: 'fas fa-bell', label: 'Notifications', badge: 5 },
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

    const [profileData, setProfileData] = useState({
        fullName: 'Jane S. Doe',
        email: 'jane.doe@example.com',
        phone: '123-456-7890',
        linkedin: 'linkedin.com/in/janedoe',
        github: 'github.com/janedoe',
        portfolio: 'janedoe.dev',
        bio: 'Aspiring software developer with a passion for creating innovative solutions. Eager to learn and contribute to impactful projects.',
        profilePicture: 'https://placehold.co/120x120/15803D/FFFFFF?text=JD',
    });

    const [educationEntries, setEducationEntries] = useState([
        { id: 1, institution: 'State University', degree: 'B.S. in Computer Science', field: 'Computer Science', gradYear: '2023', gpa: '3.8' },
    ]);

    const [experienceEntries, setExperienceEntries] = useState([
        { id: 1, company: 'Tech Intern Co.', title: 'Software Engineer Intern', startDate: 'May 2022', endDate: 'Aug 2022', description: 'Worked on developing new features for the company\'s flagship product using React and Node.js. Collaborated with a team of 5 engineers.' },
    ]);

    const [skills, setSkills] = useState(['JavaScript', 'React', 'Node.js', 'Python', 'SQL', 'HTML', 'CSS']);
    const [newSkill, setNewSkill] = useState('');

    // State for Education Modal
    const [showEducationModal, setShowEducationModal] = useState(false);
    const [currentEducation, setCurrentEducation] = useState(initialEducationEntry);
    const [editingEducationId, setEditingEducationId] = useState(null);

    // State for Experience Modal
    const [showExperienceModal, setShowExperienceModal] = useState(false);
    const [currentExperience, setCurrentExperience] = useState(initialExperienceEntry);
    const [editingExperienceId, setEditingExperienceId] = useState(null);


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProfileData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setProfileData(prev => ({ ...prev, profilePicture: event.target.result }));
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    const handleAddSkill = () => {
        if (newSkill.trim() && !skills.includes(newSkill.trim())) {
            setSkills([...skills, newSkill.trim()]);
            setNewSkill('');
        }
    };

    const handleRemoveSkill = (skillToRemove) => {
        setSkills(skills.filter(skill => skill !== skillToRemove));
    };

    // --- Education Modal Functions ---
    const openEducationModal = (education = null) => {
        if (education) {
            setCurrentEducation(education);
            setEditingEducationId(education.id);
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
                    edu.id === editingEducationId ? { ...currentEducation, id: editingEducationId } : edu
                )
            );
            console.log('Updating education:', currentEducation);
        } else {
            const newId = educationEntries.length > 0 ? Math.max(...educationEntries.map(e => e.id)) + 1 : 1;
            setEducationEntries([...educationEntries, { ...currentEducation, id: newId }]);
            console.log('Adding new education:', { ...currentEducation, id: newId });
        }
        alert(`Education ${editingEducationId ? 'updated' : 'added'}! (Console logged)`);
        closeEducationModal();
    };

    const handleDeleteEducation = (id) => {
        if (window.confirm("Are you sure you want to delete this education entry?")) {
            setEducationEntries(educationEntries.filter(edu => edu.id !== id));
            console.log('Deleting education with id:', id);
            alert('Education entry deleted! (Console logged)');
        }
    };

    // --- Experience Modal Functions ---
    const openExperienceModal = (experience = null) => {
        if (experience) {
            setCurrentExperience(experience);
            setEditingExperienceId(experience.id);
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
                    exp.id === editingExperienceId ? { ...currentExperience, id: editingExperienceId } : exp
                )
            );
            console.log('Updating experience:', currentExperience);
        } else {
            const newId = experienceEntries.length > 0 ? Math.max(...experienceEntries.map(e => e.id)) + 1 : 1;
            setExperienceEntries([...experienceEntries, { ...currentExperience, id: newId }]);
            console.log('Adding new experience:', { ...currentExperience, id: newId });
        }
        alert(`Experience ${editingExperienceId ? 'updated' : 'added'}! (Console logged)`);
        closeExperienceModal();
    };

    const handleDeleteExperience = (id) => {
        if (window.confirm("Are you sure you want to delete this experience entry?")) {
            setExperienceEntries(experienceEntries.filter(exp => exp.id !== id));
            console.log('Deleting experience with id:', id);
            alert('Experience entry deleted! (Console logged)');
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // TODO: API call to save all profile data
        console.log('Profile data submitted:', { profileData, educationEntries, experienceEntries, skills });
        alert('Profile updated successfully! (Console logged)');
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
                            {item.badge && <span className="student-page-nav-badge">{item.badge}</span>}
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
                                <span className="student-page-user-name">{profileData.fullName.split(' ')[0] || 'User'}</span>
                                <div className="student-page-user-avatar">
                                    {profileData.fullName ? profileData.fullName.split(' ').map(n => n[0]).join('').toUpperCase() : 'U'}
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
                    <form onSubmit={handleSubmit} className="my-profile-form">
                        {/* ... (Personal Details and Online Presence sections remain the same) ... */}
                        <div className="profile-header-section">
                            <div className="profile-picture-container">
                                <img src={profileData.profilePicture} alt="Profile" className="profile-picture" />
                                <label htmlFor="profilePictureInput" className="profile-picture-upload-btn">
                                    <i className="fas fa-camera"></i>
                                </label>
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
                        </div>

                        <div className="profile-section">
                            <h3 className="section-title">Personal Details</h3>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label htmlFor="fullName">Full Name</label>
                                    <input type="text" id="fullName" name="fullName" value={profileData.fullName} onChange={handleInputChange} required />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="email">Email Address</label>
                                    <input type="email" id="email" name="email" value={profileData.email} onChange={handleInputChange} required />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="phone">Phone Number</label>
                                    <input type="tel" id="phone" name="phone" value={profileData.phone} onChange={handleInputChange} />
                                </div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="bio">Short Bio / Summary</label>
                                <textarea id="bio" name="bio" value={profileData.bio} onChange={handleInputChange} rows="4"></textarea>
                            </div>
                        </div>

                        <div className="profile-section">
                            <h3 className="section-title">Online Presence</h3>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label htmlFor="linkedin">LinkedIn Profile URL</label>
                                    <input type="text" id="linkedin" name="linkedin" value={profileData.linkedin} onChange={handleInputChange} placeholder="https://linkedin.com/in/yourprofile" />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="github">GitHub Profile URL</label>
                                    <input type="text" id="github" name="github" value={profileData.github} onChange={handleInputChange} placeholder="https://github.com/yourusername" />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="portfolio">Portfolio Website</label>
                                    <input type="text" id="portfolio" name="portfolio" value={profileData.portfolio} onChange={handleInputChange} placeholder="https://yourportfolio.com" />
                                </div>
                            </div>
                        </div>


                        <div className="profile-section">
                            <div className="section-header">
                                <h3 className="section-title">Education</h3>
                                <button type="button" onClick={() => openEducationModal()} className="add-entry-button-inline">
                                    <i className="fas fa-plus"></i> Add Education
                                </button>
                            </div>
                            {educationEntries.length > 0 ? educationEntries.map((entry) => (
                                <div key={entry.id} className="entry-card education-entry">
                                    <div className="entry-card-content">
                                        <h4>{entry.degree} in {entry.field}</h4>
                                        <p>{entry.institution} - Graduated {entry.gradYear}</p>
                                        {entry.gpa && <p>GPA: {entry.gpa}</p>}
                                    </div>
                                    <div className="entry-card-actions">
                                        <button type="button" onClick={() => openEducationModal(entry)} className="edit-entry-btn" title="Edit">
                                            <i className="fas fa-pencil-alt"></i>
                                        </button>
                                        <button type="button" onClick={() => handleDeleteEducation(entry.id)} className="delete-entry-btn" title="Delete">
                                            <i className="fas fa-trash-alt"></i>
                                        </button>
                                    </div>
                                </div>
                            )) : <p className="no-entries-message">No education entries added yet.</p>}
                        </div>

                        <div className="profile-section">
                            <div className="section-header">
                                <h3 className="section-title">Work Experience</h3>
                                <button type="button" onClick={() => openExperienceModal()} className="add-entry-button-inline">
                                    <i className="fas fa-plus"></i> Add Experience
                                </button>
                            </div>
                            {experienceEntries.length > 0 ? experienceEntries.map((entry) => (
                                <div key={entry.id} className="entry-card experience-entry">
                                    <div className="entry-card-content">
                                        <h4>{entry.title} at {entry.company}</h4>
                                        <p>{entry.startDate} - {entry.endDate}</p>
                                        <p className="entry-description">{entry.description}</p>
                                    </div>
                                    <div className="entry-card-actions">
                                        <button type="button" onClick={() => openExperienceModal(entry)} className="edit-entry-btn" title="Edit">
                                            <i className="fas fa-pencil-alt"></i>
                                        </button>
                                        <button type="button" onClick={() => handleDeleteExperience(entry.id)} className="delete-entry-btn" title="Delete">
                                            <i className="fas fa-trash-alt"></i>
                                        </button>
                                    </div>
                                </div>
                            )) : <p className="no-entries-message">No experience entries added yet.</p>}
                        </div>

                        <div className="profile-section">
                            <h3 className="section-title">Skills</h3>
                            <div className="skills-container">
                                {skills.map(skill => (
                                    <span key={skill} className="skill-tag-profile">
                                        {skill}
                                        <button type="button" onClick={() => handleRemoveSkill(skill)} className="remove-skill-btn">&times;</button>
                                    </span>
                                ))}
                            </div>
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
                        </div>

                        <div className="form-actions">
                            <button type="submit" className="save-profile-button">
                                <i className="fas fa-save"></i> Save All Changes
                            </button>
                        </div>
                    </form>
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
