import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

// --- Skeleton Loader Component ---
const ResumeManagerSkeleton = () => (
    <>
        <style>{`
            .skeleton-box { background-color: #e0e0e0; border-radius: 8px; animation: skeleton-pulse 1.5s infinite ease-in-out; }
            .skeleton-line { width: 100%; height: 20px; margin-bottom: 10px; border-radius: 4px; }
            .skeleton-line.short { width: 60%; }
            @keyframes skeleton-pulse { 0% { background-color: #e0e0e0; } 50% { background-color: #f0f0f0; } 100% { background-color: #e0e0e0; } }
        `}</style>
        <div className="resume-manager-container">
            <div className="resume-manager-header skeleton-box" style={{ height: '60px' }}></div>
            <div className="no-resumes-message skeleton-box" style={{ height: '150px', marginTop: '1rem' }}>
                <div className="skeleton-line" style={{ width: '80%', margin: 'auto' }}></div>
                <div className="skeleton-line short" style={{ width: '50%', margin: 'auto' }}></div>
            </div>
            <div className="resume-list" style={{ padding: '1rem' }}>
                <div className="resume-item skeleton-box" style={{ height: '80px', marginBottom: '1rem' }}></div>
                <div className="resume-item skeleton-box" style={{ height: '80px', marginBottom: '1rem' }}></div>
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
// Initial states for dynamic form sections in AI builder
const initialAiEducationEntry = { institution: '', degree: '', field: '', gradYear: '', gpa: '' };
const initialAiExperienceEntry = { company: '', title: '', startDate: '', endDate: '', description: '' };
const initialAiProjectEntry = { name: '', description: '', link: '', technologies: '' };


function ResumeManagerStandalonePage() {
    const location = useLocation();
    const navigate = useNavigate();

    const [resumes, setResumes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [studentData, setStudentData] = useState(null); // For header (name, avatar)

    // State for Upload Resume Modal
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [fileToUpload, setFileToUpload] = useState(null);
    const [resumeName, setResumeName] = useState('');
    const fileInputRef = useRef(null);
    const [isUploading, setIsUploading] = useState(false);

    // State for "Build Resume with AI" Modal
    const [showBuildAiModal, setShowBuildAiModal] = useState(false);
    const [aiResumeData, setAiResumeData] = useState({
        personalDetails: { fullName: '', email: '', phone: '', linkedin: '', github: '', portfolio: '' },
        summary: '',
        education: [initialAiEducationEntry],
        experience: [initialAiExperienceEntry],
        skills: [''],
        projects: [initialAiProjectEntry],
    });
    const [isGeneratingAiResume, setIsGeneratingAiResume] = useState(false);


    // State for "Check Resume Score" Modal
    const [showScoreModal, setShowScoreModal] = useState(false);
    const [scoreResumeFile, setScoreResumeFile] = useState(null);
    const [resumeScoreResult, setResumeScoreResult] = useState(null); // e.g., { score: 85, feedback: "Great skills section..." }
    const scoreFileInputRef = useRef(null);
    const [isCheckingScore, setIsCheckingScore] = useState(false);


    // Fetch resumes and student profile data on component mount
    useEffect(() => {
        const fetchResumesAndProfile = async () => {
            const token = localStorage.getItem('authToken');
            if (!token) {
                toast.error("Please log in to manage your resumes.");
                navigate('/login');
                return;
            }

            try {
                // Fetch resumes
                const resumesRes = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/student/resumes`, { // Assuming a resumes route
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                // Fetch student profile for header
                const profileRes = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/profile/student`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (!resumesRes.ok) {
                    throw new Error('Failed to fetch resumes.');
                }
                const resumesData = await resumesRes.json();
                setResumes(resumesData);

                if (profileRes.ok) {
                    const profileData = await profileRes.json();
                    setStudentData(profileData);
                    // Pre-fill AI builder personal details if profile exists
                    setAiResumeData(prev => ({
                        ...prev,
                        personalDetails: {
                            fullName: profileData.fullName || '',
                            email: profileData.user?.email || '', // Email from populated user
                            phone: profileData.phone || '',
                            linkedin: profileData.linkedin || '',
                            github: profileData.github || '',
                            portfolio: profileData.portfolio || '',
                        },
                        // Optionally pre-fill other sections if desired
                        education: profileData.education?.length > 0 ? profileData.education : [initialAiEducationEntry],
                        experience: profileData.experience?.length > 0 ? profileData.experience : [initialAiExperienceEntry],
                        skills: profileData.skills?.length > 0 ? profileData.skills : [''],
                        bio: profileData.bio || '', // Use bio as summary
                    }));

                } else if (profileRes.status === 404) {
                    console.warn("Student profile not found, using default for header.");
                } else {
                    throw new Error('Failed to fetch student profile for header.');
                }

            } catch (error) {
                toast.error(error.message || "Could not fetch data.");
            } finally {
                setLoading(false);
            }
        };

        fetchResumesAndProfile();
    }, [navigate]);

    // Handle file selection for upload modal
    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                toast.error("File size exceeds 5MB limit.");
                setFileToUpload(null);
                return;
            }
            setFileToUpload(file);
            setResumeName(file.name.split('.').slice(0, -1).join('.') || 'My Resume');
        }
    };

    // Trigger hidden file input for upload modal
    const triggerFileInput = () => {
        fileInputRef.current.click();
    };

    // Handle actual resume upload to backend
    const handleUploadResume = async (event) => {
        event.preventDefault();
        if (!fileToUpload) {
            toast.error('Please select a file to upload.');
            return;
        }

        setIsUploading(true);
        const loadingToast = toast.loading('Uploading resume...');

        const formData = new FormData();
        formData.append('resumeFile', fileToUpload);
        formData.append('resumeName', resumeName);
        formData.append('isDefault', resumes.length === 0); // First resume becomes default

        const token = localStorage.getItem('authToken');

        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/student/resumes/upload`, { // New upload route
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    // 'Content-Type': 'multipart/form-data' is NOT set here, browser handles it for FormData
                },
                body: formData,
            });

            const result = await response.json();
            toast.dismiss(loadingToast);

            if (!response.ok) {
                throw new Error(result.message || 'Failed to upload resume.');
            }
            
            toast.success(result.message);
            // Add the new resume to the state, ensuring it has an _id from backend
            setResumes(prevResumes => {
                const updatedResumes = prevResumes.map(r => ({ ...r, isDefault: false })); // Unset previous defaults
                return [...updatedResumes, result.resume]; // Add new resume from backend response
            });
            setShowUploadModal(false);
            setFileToUpload(null);
            setResumeName('');

        } catch (error) {
            toast.dismiss(loadingToast);
            toast.error(error.message || 'An error occurred during upload.');
        } finally {
            setIsUploading(false);
        }
    };

    // Handle deleting a resume
    const handleDeleteResume = async (resumeId) => {
        if (!window.confirm('Are you sure you want to delete this resume?')) {
            return;
        }

        const token = localStorage.getItem('authToken');
        const loadingToast = toast.loading('Deleting resume...');

        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/student/resumes/${resumeId}`, { // Delete route
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` },
            });

            const result = await response.json();
            toast.dismiss(loadingToast);

            if (!response.ok) {
                throw new Error(result.message || 'Failed to delete resume.');
            }
            
            toast.success(result.message);
            setResumes(prevResumes => prevResumes.filter(resume => resume._id !== resumeId));

        } catch (error) {
            toast.dismiss(loadingToast);
            toast.error(error.message || 'An error occurred during deletion.');
        }
    };

    // Handle setting a resume as default
    const handleSetDefault = async (resumeId) => {
        const token = localStorage.getItem('authToken');
        const loadingToast = toast.loading('Setting default resume...');

        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/student/resumes/${resumeId}/set-default`, { // Set default route
                method: 'PATCH',
                headers: { 'Authorization': `Bearer ${token}` },
            });

            const result = await response.json();
            toast.dismiss(loadingToast);

            if (!response.ok) {
                throw new Error(result.message || 'Failed to set default resume.');
            }
            
            toast.success(result.message);
            setResumes(
                resumes.map(resume => ({
                    ...resume,
                    isDefault: resume._id === resumeId, // Use _id from MongoDB
                }))
            );
        } catch (error) {
            toast.dismiss(loadingToast);
            toast.error(error.message || 'An error occurred while setting default.');
        }
    };

    // --- AI Resume Builder Functions ---
    const handleAiInputChange = (section, index, event) => {
        const { name, value } = event.target;
        setAiResumeData(prev => {
            const updatedSection = Array.isArray(prev[section])
                ? prev[section].map((item, i) => (i === index ? { ...item, [name]: value } : item))
                : { ...prev[section], [name]: value };
            return { ...prev, [section]: updatedSection };
        });
    };
    const handleAiSimpleInputChange = (section, event) => { // For non-array fields like personalDetails, summary
        const { name, value } = event.target;
        setAiResumeData(prev => ({
            ...prev,
            [section]: typeof prev[section] === 'object' ? { ...prev[section], [name]: value } : value,
        }));
    };


    const addAiEntry = (section, initialEntry) => {
        setAiResumeData(prev => ({
            ...prev,
            [section]: [...prev[section], { ...initialEntry, _id: Date.now().toString() }], // Add temporary client-side id
        }));
    };

    const removeAiEntry = (section, idToRemove) => {
        setAiResumeData(prev => ({
            ...prev,
            [section]: prev[section].filter(item => item._id !== idToRemove),
        }));
    };

    const handleAiSkillChange = (index, event) => {
        const newSkills = [...aiResumeData.skills];
        newSkills[index] = event.target.value;
        setAiResumeData(prev => ({ ...prev, skills: newSkills }));
    };

    const addAiSkillField = () => {
        setAiResumeData(prev => ({ ...prev, skills: [...prev.skills, ''] }));
    };

    const removeAiSkillField = (index) => {
        setAiResumeData(prev => ({ ...prev, skills: aiResumeData.skills.filter((_, i) => i !== index) }));
    };


    const handleGenerateAiResume = async (event) => {
        event.preventDefault();
        setIsGeneratingAiResume(true);
        const loadingToast = toast.loading('Generating resume with AI...');
        const token = localStorage.getItem('authToken');

        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/student/resumes/ai-build`, { // New AI build route
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(aiResumeData),
            });

            const result = await response.json();
            toast.dismiss(loadingToast);

            if (!response.ok) {
                throw new Error(result.message || 'AI resume generation failed.');
            }
            
            toast.success(result.message);
            // Assuming the backend returns the generated resume details (e.g., URL or content)
            // You might want to display the generated resume or add it to the list of resumes
            // For now, let's just show success and close modal.
            setShowBuildAiModal(false);
            // Optionally, re-fetch resumes to show the new AI-generated one
            // fetchResumesAndProfile(); // You might need to make fetchResumesAndProfile callable or re-trigger useEffect
            // For simplicity, we can just add a mock entry or prompt user to upload/download.
            // A real implementation would involve downloading the generated file or displaying its content.

        } catch (error) {
            toast.dismiss(loadingToast);
            toast.error(error.message || 'An error occurred during AI resume generation.');
        } finally {
            setIsGeneratingAiResume(false);
        }
    };

    // --- Resume Score Checker Functions ---
    const handleScoreResumeUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                toast.error("File size exceeds 5MB limit.");
                setScoreResumeFile(null);
                return;
            }
            setScoreResumeFile(file);
            setResumeScoreResult(null); // Clear previous results
        }
    };
    const triggerScoreFileInput = () => {
        scoreFileInputRef.current.click();
    }

    const handleCheckResumeScore = async (event) => {
        event.preventDefault();
        if (!scoreResumeFile) {
            toast.error('Please upload a resume to check its score.');
            return;
        }

        setIsCheckingScore(true);
        const loadingToast = toast.loading('Analyzing your resume...');
        const token = localStorage.getItem('authToken');

        const formData = new FormData();
        formData.append('resumeFile', scoreResumeFile);

        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/student/resumes/check-score`, { // New AI score route
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formData,
            });

            const result = await response.json();
            toast.dismiss(loadingToast);

            if (!response.ok) {
                throw new Error(result.message || 'Resume scoring failed.');
            }
            
            toast.success(result.message);
            setResumeScoreResult({
                score: result.score,
                feedback: result.feedback,
                fileName: scoreResumeFile.name,
            });

        } catch (error) {
            toast.dismiss(loadingToast);
            toast.error(error.message || 'An error occurred during resume scoring.');
        } finally {
            setIsCheckingScore(false);
        }
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
                        <h1 className="student-page-header-title">Resume Manager</h1>
                        <div className="student-page-header-actions">
                            <button className="student-page-notification-button" title="Notifications">
                                <i className="fas fa-bell"></i>
                            </button>
                            <div className="student-page-user-profile">
                                <span className="student-page-user-name">{studentData?.fullName?.split(' ')[0] || 'Student'}</span>
                                <div className="student-page-user-avatar">
                                    {studentData?.profilePicture && !studentData.profilePicture.includes('placehold.co') ? (
                                        <img src={studentData.profilePicture} alt="Profile" className="header-profile-img" />
                                    ) : (
                                        studentData?.fullName ? studentData.fullName.split(' ').map(n => n[0]).join('').toUpperCase() : 'SU'
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
                    {loading ? <ResumeManagerSkeleton /> : (
                        <div className="resume-manager-container">
                            <div className="resume-manager-header">
                                <h2>Manage Your Resumes</h2>
                                <div className="resume-actions-top">
                                    <button onClick={() => setShowBuildAiModal(true)} className="ai-feature-btn build-ai-btn">
                                        <i className="fas fa-magic"></i> Build with AI
                                    </button>
                                    <button onClick={() => setShowScoreModal(true)} className="ai-feature-btn score-check-btn">
                                        <i className="fas fa-clipboard-check"></i> Check Resume Score
                                    </button>
                                    <button onClick={() => setShowUploadModal(true)} className="upload-new-resume-btn main-upload-btn">
                                        <i className="fas fa-plus"></i> Upload New Resume
                                    </button>
                                </div>
                            </div>

                            {resumes.length === 0 && !showBuildAiModal && !showScoreModal && (
                                <div className="no-resumes-message">
                                    <i className="fas fa-folder-open empty-icon"></i>
                                    <p>You haven't uploaded any resumes yet.</p>
                                    <p>Use the buttons above to build one with AI, check a resume's score, or upload your own.</p>
                                </div>
                            )}
                            {resumes.length > 0 && (
                                <ul className="resume-list">
                                    {resumes.map(resume => (
                                        <li key={resume._id} className="resume-item">
                                            <div className="resume-icon">
                                                <i className={resume.fileName.endsWith('.pdf') ? 'fas fa-file-pdf' : 'fas fa-file-word'}></i>
                                            </div>
                                            <div className="resume-details">
                                                <span className="resume-name">{resume.name || resume.fileName}</span>
                                                <span className="resume-meta">
                                                    Uploaded: {new Date(resume.uploadDate).toLocaleDateString()} | Size: {resume.size}
                                                </span>
                                            </div>
                                            <div className="resume-status">
                                                {resume.isDefault && <span className="default-badge">Default</span>}
                                            </div>
                                            <div className="resume-actions">
                                                {/* Assuming resume.url is provided by backend for download/view */}
                                                <a href={resume.url} target="_blank" rel="noopener noreferrer" className="action-btn view-btn" title="View/Download">
                                                    <i className="fas fa-eye"></i>
                                                </a>
                                                {!resume.isDefault && (
                                                    <button onClick={() => handleSetDefault(resume._id)} className="action-btn default-btn" title="Set as Default">
                                                        <i className="fas fa-star"></i>
                                                    </button>
                                                )}
                                                <button onClick={() => handleDeleteResume(resume._id)} className="action-btn delete-btn" title="Delete">
                                                    <i className="fas fa-trash-alt"></i>
                                                </button>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    )}

                    {/* Upload Resume Modal */}
                    {showUploadModal && (
                        <div className="modal-overlay">
                            <div className="modal-content">
                                <h3>Upload New Resume</h3>
                                <form onSubmit={handleUploadResume}>
                                    <div className="form-group-modal">
                                        <label htmlFor="resumeName">Resume Name (Optional)</label>
                                        <input
                                            type="text" id="resumeName" value={resumeName}
                                            onChange={(e) => setResumeName(e.target.value)}
                                            placeholder="e.g., My Technical Resume"
                                        />
                                    </div>
                                    <div className="form-group-modal file-upload-area" onClick={triggerFileInput}>
                                        <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept=".pdf,.doc,.docx" style={{ display: 'none' }} />
                                        {fileToUpload ? (
                                            <div className="file-selected-info">
                                                <i className="fas fa-file-alt"></i>
                                                <span>{fileToUpload.name}</span>
                                                <span>({(fileToUpload.size / 1024).toFixed(1)}KB)</span>
                                            </div>
                                        ) : (
                                            <div className="file-placeholder">
                                                <i className="fas fa-cloud-upload-alt"></i>
                                                <p>Click or Drag & Drop to Upload</p>
                                                <p className="file-types">Supports: PDF, DOC, DOCX (Max 5MB)</p>
                                            </div>
                                        )}
                                    </div>
                                    <div className="modal-actions">
                                        <button type="button" onClick={() => setShowUploadModal(false)} className="cancel-btn" disabled={isUploading}>Cancel</button>
                                        <button type="submit" className="upload-btn-modal" disabled={!fileToUpload || isUploading}>
                                            {isUploading ? 'Uploading...' : 'Upload'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                    {/* Build Resume with AI Modal */}
                    {showBuildAiModal && (
                        <div className="modal-overlay ai-builder-modal-overlay">
                            <div className="modal-content ai-builder-modal-content">
                                <h3>Build Your Resume with AI</h3>
                                <form onSubmit={handleGenerateAiResume} className="ai-builder-form">
                                    {/* Personal Details */}
                                    <fieldset className="ai-form-fieldset">
                                        <legend>Personal Details</legend>
                                        <div className="ai-form-grid">
                                            <input type="text" name="fullName" placeholder="Full Name" value={aiResumeData.personalDetails.fullName} onChange={(e) => handleAiSimpleInputChange('personalDetails', e)} required />
                                            <input type="email" name="email" placeholder="Email" value={aiResumeData.personalDetails.email} onChange={(e) => handleAiSimpleInputChange('personalDetails', e)} required />
                                            <input type="tel" name="phone" placeholder="Phone" value={aiResumeData.personalDetails.phone} onChange={(e) => handleAiSimpleInputChange('personalDetails', e)} />
                                            <input type="text" name="linkedin" placeholder="LinkedIn URL" value={aiResumeData.personalDetails.linkedin} onChange={(e) => handleAiSimpleInputChange('personalDetails', e)} />
                                            <input type="text" name="github" placeholder="GitHub URL" value={aiResumeData.personalDetails.github} onChange={(e) => handleAiSimpleInputChange('personalDetails', e)} />
                                            <input type="text" name="portfolio" placeholder="Portfolio URL" value={aiResumeData.personalDetails.portfolio} onChange={(e) => handleAiSimpleInputChange('personalDetails', e)} />
                                        </div>
                                    </fieldset>

                                    {/* Summary */}
                                    <fieldset className="ai-form-fieldset">
                                        <legend>Summary / Objective</legend>
                                        <textarea name="summary" placeholder="Write a brief summary or career objective..." value={aiResumeData.summary} onChange={(e) => handleAiSimpleInputChange('summary', e)} rows="3"></textarea>
                                    </fieldset>

                                    {/* Education */}
                                    <fieldset className="ai-form-fieldset">
                                        <legend>Education</legend>
                                        {aiResumeData.education.map((edu, index) => (
                                            <div key={edu._id || index} className="ai-form-dynamic-entry">
                                                <input type="text" name="institution" placeholder="Institution" value={edu.institution} onChange={(e) => handleAiInputChange('education', index, e)} />
                                                <input type="text" name="degree" placeholder="Degree (e.g., B.S. in Computer Science)" value={edu.degree} onChange={(e) => handleAiInputChange('education', index, e)} />
                                                <input type="text" name="field" placeholder="Field of Study" value={edu.field} onChange={(e) => handleAiInputChange('education', index, e)} />
                                                <div className="ai-form-grid-half">
                                                    <input type="text" name="gradYear" placeholder="Graduation Year (YYYY)" value={edu.gradYear} onChange={(e) => handleAiInputChange('education', index, e)} />
                                                    <input type="text" name="gpa" placeholder="GPA (Optional)" value={edu.gpa} onChange={(e) => handleAiInputChange('education', index, e)} />
                                                </div>
                                                {aiResumeData.education.length > 1 && <button type="button" onClick={() => removeAiEntry('education', edu._id || index)} className="remove-entry-btn-ai"><i className="fas fa-minus-circle"></i> Remove</button>}
                                            </div>
                                        ))}
                                        <button type="button" onClick={() => addAiEntry('education', initialAiEducationEntry)} className="add-entry-btn-ai"><i className="fas fa-plus-circle"></i> Add Education</button>
                                    </fieldset>

                                    {/* Experience */}
                                    <fieldset className="ai-form-fieldset">
                                        <legend>Experience</legend>
                                        {aiResumeData.experience.map((exp, index) => (
                                            <div key={exp._id || index} className="ai-form-dynamic-entry">
                                                <input type="text" name="company" placeholder="Company Name" value={exp.company} onChange={(e) => handleAiInputChange('experience', index, e)} />
                                                <input type="text" name="title" placeholder="Job Title" value={exp.title} onChange={(e) => handleAiInputChange('experience', index, e)} />
                                                <div className="ai-form-grid-half">
                                                    <input type="text" name="startDate" placeholder="Start Date (e.g., May 2022)" value={exp.startDate} onChange={(e) => handleAiInputChange('experience', index, e)} />
                                                    <input type="text" name="endDate" placeholder="End Date (e.g., Aug 2022 or Present)" value={exp.endDate} onChange={(e) => handleAiInputChange('experience', index, e)} />
                                                </div>
                                                <textarea name="description" placeholder="Key responsibilities and achievements..." value={exp.description} onChange={(e) => handleAiInputChange('experience', index, e)} rows="3"></textarea>
                                                {aiResumeData.experience.length > 1 && <button type="button" onClick={() => removeAiEntry('experience', exp._id || index)} className="remove-entry-btn-ai"><i className="fas fa-minus-circle"></i> Remove</button>}
                                            </div>
                                        ))}
                                        <button type="button" onClick={() => addAiEntry('experience', initialAiExperienceEntry)} className="add-entry-btn-ai"><i className="fas fa-plus-circle"></i> Add Experience</button>
                                    </fieldset>

                                    {/* Skills */}
                                    <fieldset className="ai-form-fieldset">
                                        <legend>Skills</legend>
                                        {aiResumeData.skills.map((skill, index) => (
                                            <div key={index} className="ai-skill-entry">
                                                <input type="text" placeholder={`Skill ${index + 1}`} value={skill} onChange={(e) => handleAiSkillChange(index, e)} />
                                                {aiResumeData.skills.length > 1 && <button type="button" onClick={() => removeAiSkillField(index)} className="remove-skill-btn-ai"><i className="fas fa-times"></i></button>}
                                            </div>
                                        ))}
                                        <button type="button" onClick={addAiSkillField} className="add-entry-btn-ai"><i className="fas fa-plus-circle"></i> Add Skill</button>
                                    </fieldset>

                                    {/* Projects */}
                                    <fieldset className="ai-form-fieldset">
                                        <legend>Projects</legend>
                                        {aiResumeData.projects.map((proj, index) => (
                                            <div key={proj._id || index} className="ai-form-dynamic-entry">
                                                <input type="text" name="name" placeholder="Project Name" value={proj.name} onChange={(e) => handleAiInputChange('projects', index, e)} />
                                                <input type="text" name="technologies" placeholder="Technologies Used (e.g., React, Firebase)" value={proj.technologies} onChange={(e) => handleAiInputChange('projects', index, e)} />
                                                <textarea name="description" placeholder="Project description and your role..." value={proj.description} onChange={(e) => handleAiInputChange('projects', index, e)} rows="2"></textarea>
                                                <input type="text" name="link" placeholder="Project Link (Optional)" value={proj.link} onChange={(e) => handleAiInputChange('projects', index, e)} />
                                                {aiResumeData.projects.length > 1 && <button type="button" onClick={() => removeAiEntry('projects', proj._id || index)} className="remove-entry-btn-ai"><i className="fas fa-minus-circle"></i> Remove</button>}
                                            </div>
                                        ))}
                                        <button type="button" onClick={() => addAiEntry('projects', initialAiProjectEntry)} className="add-entry-btn-ai"><i className="fas fa-plus-circle"></i> Add Project</button>
                                    </fieldset>


                                    <div className="modal-actions">
                                        <button type="button" onClick={() => setShowBuildAiModal(false)} className="cancel-btn" disabled={isGeneratingAiResume}>Cancel</button>
                                        <button type="submit" className="generate-ai-btn" disabled={isGeneratingAiResume}>
                                            {isGeneratingAiResume ? <><i className="fas fa-spinner fa-spin"></i> Generating...</> : 'Generate with AI'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                    {/* Check Resume Score Modal */}
                    {showScoreModal && (
                        <div className="modal-overlay">
                            <div className="modal-content">
                                <h3>Check Your Resume Score</h3>
                                {!resumeScoreResult || isCheckingScore ? (
                                    <form onSubmit={handleCheckResumeScore}>
                                        <div className="form-group-modal file-upload-area score-upload-area" onClick={triggerScoreFileInput}>
                                            <input type="file" ref={scoreFileInputRef} onChange={handleScoreResumeUpload} accept=".pdf,.doc,.docx" style={{ display: 'none' }} />
                                            {scoreResumeFile ? (
                                                <div className="file-selected-info">
                                                    <i className="fas fa-file-alt"></i>
                                                    <span>{scoreResumeFile.name}</span>
                                                    <span>({(scoreResumeFile.size / 1024).toFixed(1)}KB)</span>
                                                </div>
                                            ) : (
                                                <div className="file-placeholder">
                                                    <i className="fas fa-cloud-upload-alt"></i>
                                                    <p>Upload Your Resume to Get Score</p>
                                                    <p className="file-types">Supports: PDF, DOC, DOCX</p>
                                                </div>
                                            )}
                                        </div>
                                        {isCheckingScore && <p className="processing-message">Analyzing your resume...</p>}
                                        <div className="modal-actions">
                                            <button type="button" onClick={() => setShowScoreModal(false)} className="cancel-btn" disabled={isCheckingScore}>Cancel</button>
                                            <button type="submit" className="upload-btn-modal" disabled={!scoreResumeFile || isCheckingScore}>
                                                {isCheckingScore ? 'Processing...' : 'Check Score'}
                                            </button>
                                        </div>
                                    </form>
                                ) : (
                                    <div className="resume-score-results">
                                        <h4>Analysis for: {resumeScoreResult.fileName}</h4>
                                        <div className="score-display">
                                            Your Score: <span>{resumeScoreResult.score}/100</span>
                                        </div>
                                        <p className="score-feedback-title">AI Feedback:</p>
                                        <p className="score-feedback-text">{resumeScoreResult.feedback}</p>
                                        <div className="modal-actions">
                                            <button type="button" onClick={() => { setScoreResumeFile(null); setResumeScoreResult(null); }} className="cancel-btn">Check Another</button>
                                            <button type="button" onClick={() => setShowScoreModal(false)} className="upload-btn-modal">Close</button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                </main>
            </div>
        </div>
    );
}

export default ResumeManagerStandalonePage;
