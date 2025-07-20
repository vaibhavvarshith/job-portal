import React, { useState, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';

// Navigation items for the sidebar
const navItems = [
    { path: '/student-dashboard', icon: 'fas fa-tachometer-alt', label: 'Dashboard' },
    { path: '/student-profile', icon: 'fas fa-user-circle', label: 'My Profile' },
    { path: '/student-resume', icon: 'fas fa-file-alt', label: 'Resume Manager' },
    { path: '/student-applications', icon: 'fas fa-inbox', label: 'Applications', badge: 3 },
    { path: '/student-notifications', icon: 'fas fa-bell', label: 'Notifications', badge: 5 },
];
// Initial states for dynamic form sections in AI builder
const initialAiEducationEntry = { institution: '', degree: '', field: '', gradYear: '', gpa: '' };
const initialAiExperienceEntry = { company: '', title: '', startDate: '', endDate: '', description: '' };
const initialAiProjectEntry = { name: '', description: '', link: '', technologies: '' };


function ResumeManagerStandalonePage() {
    const location = useLocation();

    const [resumes, setResumes] = useState([
        { id: 1, name: 'Software_Engineer_Resume_v3.pdf', uploadDate: '2023-06-15', size: '245KB', isDefault: true, url: '#' },
        { id: 2, name: 'Data_Analyst_Targeted_Resume.docx', uploadDate: '2023-07-01', size: '180KB', isDefault: false, url: '#' },
    ]);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [fileToUpload, setFileToUpload] = useState(null);
    const [resumeName, setResumeName] = useState('');
    const fileInputRef = useRef(null);

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

    // State for "Check Resume Score" Modal
    const [showScoreModal, setShowScoreModal] = useState(false);
    const [scoreResumeFile, setScoreResumeFile] = useState(null);
    const [resumeScoreResult, setResumeScoreResult] = useState(null); // e.g., { score: 85, feedback: "Great skills section..." }
    const scoreFileInputRef = useRef(null);


    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            setFileToUpload(file);
            setResumeName(file.name.split('.').slice(0, -1).join('.') || 'My Resume');
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current.click();
    };

    const handleUploadResume = (event) => {
        event.preventDefault();
        if (!fileToUpload) {
            alert('Please select a file to upload.');
            return;
        }
        const newResume = {
            id: Date.now(),
            name: resumeName || fileToUpload.name,
            uploadDate: new Date().toISOString().split('T')[0],
            size: `${(fileToUpload.size / 1024).toFixed(1)}KB`,
            isDefault: resumes.length === 0,
            url: URL.createObjectURL(fileToUpload),
        };
        setResumes([...resumes, newResume]);
        console.log('Uploading resume:', newResume);
        setShowUploadModal(false);
        setFileToUpload(null);
        setResumeName('');
    };

    const handleDeleteResume = (resumeId) => {
        if (window.confirm('Are you sure you want to delete this resume?')) {
            setResumes(resumes.filter(resume => resume.id !== resumeId));
            console.log('Deleting resume:', resumeId);
        }
    };

    const handleSetDefault = (resumeId) => {
        setResumes(
            resumes.map(resume => ({
                ...resume,
                isDefault: resume.id === resumeId,
            }))
        );
        console.log('Setting default resume:', resumeId);
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
            [section]: [...prev[section], { ...initialEntry, id: Date.now() }], // Add unique id for key prop
        }));
    };

    const removeAiEntry = (section, index) => {
        setAiResumeData(prev => ({
            ...prev,
            [section]: prev[section].filter((_, i) => i !== index),
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


    const handleGenerateAiResume = (event) => {
        event.preventDefault();
        // In a real app, send aiResumeData to backend AI service
        console.log('Generating AI Resume with data:', aiResumeData);
        alert('Resume data sent for AI generation! (Check console)');
        setShowBuildAiModal(false);
    };

    // --- Resume Score Checker Functions ---
    const handleScoreResumeUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            setScoreResumeFile(file);
            setResumeScoreResult(null); // Clear previous results
        }
    };
    const triggerScoreFileInput = () => {
        scoreFileInputRef.current.click();
    }

    const handleCheckResumeScore = (event) => {
        event.preventDefault();
        if (!scoreResumeFile) {
            alert('Please upload a resume to check its score.');
            return;
        }
        // Simulate AI processing
        console.log('Checking score for resume:', scoreResumeFile.name);
        setResumeScoreResult({ processing: true });
        setTimeout(() => {
            const randomScore = Math.floor(Math.random() * 31) + 70; // Score between 70-100
            setResumeScoreResult({
                score: randomScore,
                feedback: `Your resume shows strong potential. Areas for improvement: quantify achievements more. Keywords found: ${randomScore > 85 ? 'React, Node.js, Agile' : 'JavaScript, Teamwork'}.`,
                fileName: scoreResumeFile.name,
            });
        }, 2000);
    };


    return (
        <div className="student-page-layout-container">
            {/* Sidebar */}
            <div className="student-page-sidebar">
                <div className="student-page-sidebar-header">
                    <h1 className="student-page-sidebar-title">CareerConnect</h1>
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
                        <h1 className="student-page-header-title">Resume Manager</h1>
                        <div className="student-page-header-actions">
                            <button className="student-page-notification-button" title="Notifications">
                                <i className="fas fa-bell"></i>
                            </button>
                            <div className="student-page-user-profile">
                                <span className="student-page-user-name">Jane S.</span>
                                <div className="student-page-user-avatar">JS</div>
                            </div>
                        </div>
                    </div>
                </header>

                <main className="student-page-content-area">
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
                                    <li key={resume.id} className="resume-item">
                                        <div className="resume-icon">
                                            <i className={resume.name.endsWith('.pdf') ? 'fas fa-file-pdf' : 'fas fa-file-word'}></i>
                                        </div>
                                        <div className="resume-details">
                                            <span className="resume-name">{resume.name}</span>
                                            <span className="resume-meta">
                                                Uploaded: {resume.uploadDate} | Size: {resume.size}
                                            </span>
                                        </div>
                                        <div className="resume-status">
                                            {resume.isDefault && <span className="default-badge">Default</span>}
                                        </div>
                                        <div className="resume-actions">
                                            <a href={resume.url} target="_blank" rel="noopener noreferrer" className="action-btn view-btn" title="View/Download">
                                                <i className="fas fa-eye"></i>
                                            </a>
                                            {!resume.isDefault && (
                                                <button onClick={() => handleSetDefault(resume.id)} className="action-btn default-btn" title="Set as Default">
                                                    <i className="fas fa-star"></i>
                                                </button>
                                            )}
                                            <button onClick={() => handleDeleteResume(resume.id)} className="action-btn delete-btn" title="Delete">
                                                <i className="fas fa-trash-alt"></i>
                                            </button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {/* Upload Resume Modal (Existing) */}
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
                                        <button type="button" onClick={() => setShowUploadModal(false)} className="cancel-btn">Cancel</button>
                                        <button type="submit" className="upload-btn-modal" disabled={!fileToUpload}>Upload</button>
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
                                            <div key={edu.id || index} className="ai-form-dynamic-entry">
                                                <input type="text" name="institution" placeholder="Institution" value={edu.institution} onChange={(e) => handleAiInputChange('education', index, e)} />
                                                <input type="text" name="degree" placeholder="Degree (e.g., B.S. in Computer Science)" value={edu.degree} onChange={(e) => handleAiInputChange('education', index, e)} />
                                                <input type="text" name="field" placeholder="Field of Study" value={edu.field} onChange={(e) => handleAiInputChange('education', index, e)} />
                                                <div className="ai-form-grid-half">
                                                    <input type="text" name="gradYear" placeholder="Graduation Year (YYYY)" value={edu.gradYear} onChange={(e) => handleAiInputChange('education', index, e)} />
                                                    <input type="text" name="gpa" placeholder="GPA (Optional)" value={edu.gpa} onChange={(e) => handleAiInputChange('education', index, e)} />
                                                </div>
                                                {aiResumeData.education.length > 1 && <button type="button" onClick={() => removeAiEntry('education', index)} className="remove-entry-btn-ai"><i className="fas fa-minus-circle"></i> Remove</button>}
                                            </div>
                                        ))}
                                        <button type="button" onClick={() => addAiEntry('education', initialAiEducationEntry)} className="add-entry-btn-ai"><i className="fas fa-plus-circle"></i> Add Education</button>
                                    </fieldset>

                                    {/* Experience */}
                                    <fieldset className="ai-form-fieldset">
                                        <legend>Experience</legend>
                                        {aiResumeData.experience.map((exp, index) => (
                                            <div key={exp.id || index} className="ai-form-dynamic-entry">
                                                <input type="text" name="company" placeholder="Company Name" value={exp.company} onChange={(e) => handleAiInputChange('experience', index, e)} />
                                                <input type="text" name="title" placeholder="Job Title" value={exp.title} onChange={(e) => handleAiInputChange('experience', index, e)} />
                                                <div className="ai-form-grid-half">
                                                    <input type="text" name="startDate" placeholder="Start Date (e.g., May 2022)" value={exp.startDate} onChange={(e) => handleAiInputChange('experience', index, e)} />
                                                    <input type="text" name="endDate" placeholder="End Date (e.g., Aug 2022 or Present)" value={exp.endDate} onChange={(e) => handleAiInputChange('experience', index, e)} />
                                                </div>
                                                <textarea name="description" placeholder="Key responsibilities and achievements..." value={exp.description} onChange={(e) => handleAiInputChange('experience', index, e)} rows="3"></textarea>
                                                {aiResumeData.experience.length > 1 && <button type="button" onClick={() => removeAiEntry('experience', index)} className="remove-entry-btn-ai"><i className="fas fa-minus-circle"></i> Remove</button>}
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
                                            <div key={proj.id || index} className="ai-form-dynamic-entry">
                                                <input type="text" name="name" placeholder="Project Name" value={proj.name} onChange={(e) => handleAiInputChange('projects', index, e)} />
                                                <input type="text" name="technologies" placeholder="Technologies Used (e.g., React, Firebase)" value={proj.technologies} onChange={(e) => handleAiInputChange('projects', index, e)} />
                                                <textarea name="description" placeholder="Project description and your role..." value={proj.description} onChange={(e) => handleAiInputChange('projects', index, e)} rows="2"></textarea>
                                                <input type="text" name="link" placeholder="Project Link (Optional)" value={proj.link} onChange={(e) => handleAiInputChange('projects', index, e)} />
                                                {aiResumeData.projects.length > 1 && <button type="button" onClick={() => removeAiEntry('projects', index)} className="remove-entry-btn-ai"><i className="fas fa-minus-circle"></i> Remove</button>}
                                            </div>
                                        ))}
                                        <button type="button" onClick={() => addAiEntry('projects', initialAiProjectEntry)} className="add-entry-btn-ai"><i className="fas fa-plus-circle"></i> Add Project</button>
                                    </fieldset>


                                    <div className="modal-actions">
                                        <button type="button" onClick={() => setShowBuildAiModal(false)} className="cancel-btn">Cancel</button>
                                        <button type="submit" className="generate-ai-btn">Generate with AI</button>
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
                                {!resumeScoreResult || resumeScoreResult.processing ? (
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
                                        {resumeScoreResult?.processing && <p className="processing-message">Analyzing your resume...</p>}
                                        <div className="modal-actions">
                                            <button type="button" onClick={() => setShowScoreModal(false)} className="cancel-btn">Cancel</button>
                                            <button type="submit" className="upload-btn-modal" disabled={!scoreResumeFile || resumeScoreResult?.processing}>
                                                {resumeScoreResult?.processing ? 'Processing...' : 'Check Score'}
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
