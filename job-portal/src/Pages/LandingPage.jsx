import React, { useState, useEffect } from 'react';
import AuthModule from './Login-Register';
import { Link } from 'react-router-dom';


function LandingPage() {

    const [activeTrack, setActiveTrack] = useState(0);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'auto' });
    }, []);

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                }

            });
        }, {
            threshold: 0.1
        });


        const elementsToAnimate = document.querySelectorAll('.animate-on-scroll');
        elementsToAnimate.forEach(el => observer.observe(el));


        return () => {
            elementsToAnimate.forEach(el => observer.unobserve(el));
        };
    }, []);

    const trackContents = [
        {
            title: "1-Month Internship Plan",
            goal: "Goal: Build a specific and complete functional module within a short duration.",
            structure: [
                { week: "Week 1", content: "Induction, project requirements, technical setup" },
                { week: "Week 2", content: "Begin development of assigned module" },
                { week: "Week 3", content: "Complete core functionality, testing" },
                { week: "Week 4", content: "Final testing, documentation, presentation" }
            ],
            outcomes: [
                "Fully functional isolated module",
                "Complete documentation",
                "Smooth handover process"
            ]
        },
        {
            title: "2-Month Internship Plan",
            goal: "Goal: Design and develop interconnected modules or subsystems.",
            structure: [
                { week: "Week 1-2", content: "Requirement study, ER diagram, backend setup" },
                { week: "Week 3-6", content: "Full stack development of assigned modules" },
                { week: "Week 7", content: "UI enhancements, testing with real-time data" },
                { week: "Week 8", content: "Documentation, integration support, final demo" }
            ],
            outcomes: [
                "Two integrated modules with backend and frontend support",
                "Contributions to reusable APIs or UI components",
                "Working prototype with test data"
            ]
        },
        {
            title: "3-Month Internship Plan",
            goal: "Goal: Take complete ownership of a major project segment or multiple modules, possibly including deployment.",
            structure: [
                { week: "Month 1", content: "Requirement planning, DB schema, base module design" },
                { week: "Month 2", content: "Module expansion, feature-rich implementation" },
                { week: "Month 3", content: "Final testing, debugging, deployment, optional enhancements" }
            ],
            outcomes: [
                "Robust, tested, and deployable version of assigned modules",
                "Advanced features such as notifications, analytics, or chat systems",
                "Production-ready code with complete documentation"
            ]
        }
    ];

    const handleNavClick = (event, targetId) => {
        event.preventDefault();
        const section = document.querySelector(targetId);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div>
            
            <nav className="navbar">
                <div className="logo">PRO <span>TRACK</span></div>
                <ul className="nav-links">
                    <li><a href="#features" onClick={(e) => handleNavClick(e, '#features')}>Features</a></li>
                    <li><a href="#tech-stack" onClick={(e) => handleNavClick(e, '#tech-stack')}>Tech Stack</a></li>
                    <li><a href="#modules" onClick={(e) => handleNavClick(e, '#modules')}>Modules</a></li>
                    <li><a href="#tracks" onClick={(e) => handleNavClick(e, '#tracks')}>Internship Tracks</a></li>
                    <li><a href="#contact" onClick={(e) => handleNavClick(e, '#contact')}>Contact</a></li>
                </ul>
                <Link to="/login" className="btn">Login</Link>
            </nav>

            
            <section className="hero" id="hero">
                <div className="hero-content">
                    <h1>INTERNSHIP & JOB MANAGEMENT WEB PORTAL</h1>
                    <p>A comprehensive platform bridging the gap between students and recruiters. Streamline applications, job
                        postings, and communications all in one place.</p>
                    <div className="hero-buttons">
                        <Link to="/login" className="btn">Register as Student</Link>
                        <Link to="/login" className="btn btn-white">Register as Recruiter</Link>
                        <Link to="/login" className="btn btn-gray">Register as Admin</Link>
                    </div>
                </div>
            </section>

            
            <section id="features" className="section features">
                <div className="section-title animate-on-scroll">
                    <h2>Project Objectives</h2>
                    <p>ProTrack is designed to transform how students and recruiters interact, making opportunities more
                        accessible and management more efficient.</p>
                </div>
                <div className="feature-cards">
                    
                    <div className="feature-card animate-on-scroll">
                        <div className="feature-icon">👩‍💻</div>
                        <h3>Student Dashboard</h3>
                        <p>Allow students to apply, track, and manage their applications in one place with real-time status
                            updates.</p>
                    </div>
                    <div className="feature-card animate-on-scroll">
                        <div className="feature-icon">🧑‍💼</div>
                        <h3>Recruiter Dashboard</h3>
                        <p>A recruiter dashboard in a job and internship portal provides a centralized view for managing applications,
                            tracking candidates, and streamlining the hiring process.</p>
                    </div>
                    <div className="feature-card animate-on-scroll">
                        <div className="feature-icon">📊</div>
                        <h3>Admin Control</h3>
                        <p>Provide admin-level control for content moderation, user management, and comprehensive analytics.</p>
                    </div>
                    <div className="feature-card animate-on-scroll">
                        <div className="feature-icon">📝</div>
                        <h3>Job Posting</h3>
                        <p>Enable companies to post internship and job opportunities with detailed descriptions, requirements,
                            and application processes.</p>
                    </div>
                    <div className="feature-card animate-on-scroll">
                        <div className="feature-icon">💬</div>
                        <h3>Communication</h3>
                        <p>Facilitate seamless communication between students and recruiters throughout the application process.</p>
                    </div>
                    <div className="feature-card animate-on-scroll">
                        <div className="feature-icon">🧠</div>
                        <h3>Ai Resume Builder & Manager</h3>
                        <p>AI-powered tools help you build optimized resumes and manage multiple versions for efficient job applications.</p>
                    </div>
                </div>
            </section>

            
            <section id="tech-stack" className="section tech-stack">
                <div className="section-title animate-on-scroll">
                    <h2>Tech Stack & Tools</h2>
                    <p>Built with modern, industry-standard technologies to ensure reliability, performance, and scalability.</p>
                </div>
                <div className="stack-categories">
                    <div className="stack-category animate-on-scroll">
                        <h3>Frontend</h3>
                        <div className="tech-items">
                            <span className="tech-item">HTML</span>
                            <span className="tech-item">CSS</span>
                            <span className="tech-item">JavaScript</span>
                            <span className="tech-item">React.js</span>
                            <span className="tech-item">JSP</span>
                        </div>
                    </div>
                    <div className="stack-category animate-on-scroll">
                        <h3>Backend</h3>
                        <div className="tech-items">
                            <span className="tech-item">Java</span>
                            <span className="tech-item">Spring Boot</span>
                        </div>
                    </div>
                    <div className="stack-category animate-on-scroll">
                        <h3>Database</h3>
                        <div className="tech-items">
                            <span className="tech-item">MySQL</span>
                            <span className="tech-item">MongoDB</span>
                        </div>
                    </div>
                    <div className="stack-category animate-on-scroll">
                        <h3>Tools</h3>
                        <div className="tech-items">
                            <span className="tech-item">Postman</span>
                            <span className="tech-item">Git/GitHub</span>
                            <span className="tech-item">Cloudinary</span>
                        </div>
                    </div>
                </div>
            </section>

            
            <section id="modules" className="section modules">
                <div className="section-title animate-on-scroll">
                    <h2>Key Modules</h2>
                    <p>Comprehensive features designed to create a complete job management ecosystem.</p>
                </div>
                <div className="module-cards">
                    <div className="module-card animate-on-scroll">
                        <h3>Authentication Module</h3>
                        <ul>
                            <li>Student, Recruiter, and Admin logins</li>
                            <li>Registration with email verification</li>
                            <li>Role-based access control</li>
                            <li>Password reset functionality</li>
                        </ul>
                    </div>
                    <div className="module-card animate-on-scroll">
                        <h3>Student Dashboard</h3>
                        <ul>
                            <li>Profile management</li>
                            <li>Resume upload and management</li>
                            <li>View and apply to opportunities</li>
                            <li>Application status tracking</li>
                        </ul>
                    </div>
                    <div className="module-card animate-on-scroll">
                        <h3>Recruiter Dashboard</h3>
                        <ul>
                            <li>Post job/internship listings</li>
                            <li>View and manage applications</li>
                            <li>Shortlist or reject candidates</li>
                            <li>Schedule interviews</li>
                        </ul>
                    </div>
                    <div className="module-card animate-on-scroll">
                        <h3>Admin Panel</h3>
                        <ul>
                            <li>User management (approve/block)</li>
                            <li>Content moderation</li>
                            <li>System analytics and reporting</li>
                            <li>Platform configuration</li>
                        </ul>
                    </div>
                    <div className="module-card animate-on-scroll">
                        <h3>Job/Internship Management</h3>
                        <ul>
                            <li>Comprehensive listings</li>
                            <li>Advanced search and filtering</li>
                            <li>Bookmarking options</li>
                            <li>Notifications and updates</li>
                        </ul>
                    </div>
                    <div className="module-card animate-on-scroll">
                        <h3>Optional Add-ons</h3>
                        <ul>
                            <li>Email Notification System</li>
                            <li>Chat/Messaging System</li>
                            <li>Resume Builder Tool</li>
                            <li>Analytics Dashboard</li>
                        </ul>
                    </div>
                </div>
            </section>

            
            <section id="tracks" className="section internship-tracks">
                <div className="section-title animate-on-scroll">
                    <h2>Internship Duration Tracks</h2>
                    <p>Flexible internship plans tailored to different time commitments and learning objectives.</p>
                </div>

                <div className="track-tabs animate-on-scroll">
                    {['1-Month Track', '2-Month Track', '3-Month Track'].map((track, index) => (
                        <div
                            key={index}
                            className={`track-tab ${activeTrack === index ? 'active' : ''}`}
                            onClick={() => setActiveTrack(index)}
                        >
                            {track}
                        </div>
                    ))}
                </div>

                <div className="track-content animate-on-scroll">
                    <h3>{trackContents[activeTrack].title}</h3>
                    <p className="goal">{trackContents[activeTrack].goal}</p>

                    <div className="track-structure">
                        <h4>Structure:</h4>
                        <ul>
                            {trackContents[activeTrack].structure.map((item, index) => (
                                <li key={index}><strong>{item.week}:</strong> {item.content}</li>
                            ))}
                        </ul>
                    </div>

                    <div className="outcome">
                        <h4>Expected Outcomes:</h4>
                        <ul>
                            {trackContents[activeTrack].outcomes.map((outcome, index) => (
                                <li key={index}>{outcome}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            </section>

            
            <section className="section cta">
                
                <div className="cta-content animate-on-scroll">
                    <h2>Ready to Get Started?</h2>
                    <p>Join ProTrack Connect to boost your career or find the perfect candidate for your organization.</p>
                    <a href="#" className="btn btn-white">Register Now</a>
                </div>
            </section>

            
            <footer id="contact" className="footer">
                <div className="footer-content">
                    <div className="footer-column animate-on-scroll">
                        <h3>ProTrack</h3>
                        <ul className="footer-links">
                            <li><a href="#">About Us</a></li>
                            <li><a href="#">Our Team</a></li>
                            <li><a href="#">Testimonials</a></li>
                            <li><a href="#">Blog</a></li>
                        </ul>
                    </div>
                    <div className="footer-column animate-on-scroll">
                        <h3>For Students</h3>
                        <ul className="footer-links">
                            <li><a href="#">Find Internships</a></li>
                            <li><a href="#">Career Resources</a></li>
                            <li><a href="#">Resume Tips</a></li>
                            <li><a href="#">Interview Prep</a></li>
                        </ul>
                    </div>
                    <div className="footer-column animate-on-scroll">
                        <h3>For Recruiters</h3>
                        <ul className="footer-links">
                            <li><a href="#">Post a Job</a></li>
                            <li><a href="#">Talent Search</a></li>
                            <li><a href="#">Recruitment Solutions</a></li>
                            <li><a href="#">Success Stories</a></li>
                        </ul>
                    </div>
                    <div className="footer-column contact-info animate-on-scroll">
                        <h3>Contact Us</h3>
                        <p>📧 hr@pro-track.in</p>
                        <p>🌐 www.pro-track.in</p>
                        <p>📞 Contact: Suraj Kumar & Ayush Kumar Verma (Project Mentor)</p>
                    </div>
                </div>
                <div className="copyright animate-on-scroll">
                    <p>&copy; 2025 ProTrack. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}

export default LandingPage;
