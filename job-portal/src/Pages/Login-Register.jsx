import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast'; // Import toast

// Main component for the Authentication Module
const AuthModule = () => {
    const [activeView, setActiveView] = useState('login');
    const [activeRole, setActiveRole] = useState('student');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [errors, setErrors] = useState({});

    const navigate = useNavigate();

    const handleInputChange = (setter) => (e) => {
        setter(e.target.value);
        if (errors[e.target.name]) {
            setErrors(prevErrors => ({ ...prevErrors, [e.target.name]: null }));
        }
    };

    // Basic email validation
    const validateEmail = (emailToValidate) => {
        if (!emailToValidate) return "Email is required.";
        if (!/\S+@\S+\.\S+/.test(emailToValidate)) return "Email is invalid.";
        return null;
    };

    // Basic password validation
    const validatePassword = (passwordToValidate) => {
        if (!passwordToValidate) return "Password is required.";
        if (passwordToValidate.length < 6) return "Password must be at least 6 characters.";
        return null;
    };

    // Form submission handler with backend integration and toast notifications
    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        let currentErrors = {};

        // --- Validation Logic (unchanged) ---
        const emailError = validateEmail(email);
        if (emailError) currentErrors.email = emailError;

        const passwordError = validatePassword(password);
        if (passwordError) currentErrors.password = passwordError;

        if (activeView === 'register') {
            if (!confirmPassword) {
                currentErrors.confirmPassword = "Confirm password is required.";
            } else if (password && password !== confirmPassword) {
                currentErrors.confirmPassword = "Passwords do not match.";
            }
        }

        if (Object.keys(currentErrors).length > 0) {
            setErrors(currentErrors);
            return;
        }

        // --- Backend API Call with Toasts ---
        const endpoint = activeView === 'login' ? '/api/auth/login' : '/api/auth/register';
        const body = { email, password, role: activeRole };
        
        // Show a loading toast while the request is in progress
        const loadingToast = toast.loading(`Attempting to ${activeView}...`);

        try {
            const response = await fetch(`http://localhost:5000${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            const data = await response.json();
            
            // Dismiss the loading toast once we get a response
            toast.dismiss(loadingToast);

            if (!response.ok) {
                // Use toast.error for server-side errors
                toast.error(data.message || 'An error occurred. Please try again.');
            } else {
                // Use toast.success for successful operations
                toast.success(data.message);

                if (activeView === 'login' && data.token) {
                    localStorage.setItem('authToken', data.token);
                    switch (activeRole) {
                        case 'admin': navigate('/admin-dashboard'); break;
                        case 'recruiter': navigate('/recruiter-dashboard'); break;
                        case 'student': navigate('/student-dashboard'); break;
                        default: navigate('/');
                    }
                } else if (activeView === 'register') {
                    setActiveView('login');
                }
            }
        } catch (error) {
            // Dismiss the loading toast on network error as well
            toast.dismiss(loadingToast);
            console.error('API call failed:', error);
            // Use toast.error for network errors
            toast.error('Could not connect to the server. Please check your connection.');
        }
    };

    const roles = [
        { key: 'student', label: 'Student' },
        { key: 'recruiter', label: 'Recruiter' },
        { key: 'admin', label: 'Admin' },
    ];

    return (
        <div className='loginContainer' >
            <div className="auth-module-container">
                <h1 className="auth-module-main-title">Authentication Module</h1>
                <div className="auth-card">
                    <div className="auth-card-left-panel">
                        <h2 className="auth-card-branding-title">Pro <span className="trck">Track</span> - Job & Internship Portal</h2>
                    </div>
                    <div className="auth-card-right-panel">
                        <div className="auth-tabs">
                            <button
                                onClick={() => { setActiveView('login'); setErrors({}); }}
                                className={`auth-tab-button ${activeView === 'login' ? 'active' : ''}`}
                            >
                                Login
                            </button>
                            <button
                                onClick={() => { setActiveView('register'); setErrors({}); }}
                                className={`auth-tab-button ${activeView === 'register' ? 'active' : ''}`}
                            >
                                Register
                            </button>
                        </div>

                        <div className="auth-role-selector-container">
                            <div className="auth-role-selector">
                                {roles.map(role => (
                                    <button
                                        key={role.key}
                                        onClick={() => setActiveRole(role.key)}
                                        className={`auth-role-button ${activeRole === role.key ? 'active' : ''}`}
                                    >
                                        {role.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} noValidate>
                            <div className="auth-form-group">
                                <label htmlFor="email" className="auth-label">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={email}
                                    onChange={handleInputChange(setEmail)}
                                    placeholder="Enter your email"
                                    className={`auth-input ${errors.email ? 'error' : ''}`}
                                    required
                                />
                                {errors.email && <p className="auth-error-message">{errors.email}</p>}
                            </div>

                            <div className="auth-form-group">
                                <label htmlFor="password" className="auth-label">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    value={password}
                                    onChange={handleInputChange(setPassword)}
                                    placeholder="Enter your password"
                                    className={`auth-input ${errors.password ? 'error' : ''}`}
                                    required
                                />
                                {errors.password && <p className="auth-error-message">{errors.password}</p>}
                            </div>

                            {activeView === 'register' && (
                                <div className="auth-form-group">
                                    <label htmlFor="confirmPassword" className="auth-label">
                                        Confirm Password
                                    </label>
                                    <input
                                        type="password"
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        value={confirmPassword}
                                        onChange={handleInputChange(setConfirmPassword)}
                                        placeholder="Confirm your password"
                                        className={`auth-input ${errors.confirmPassword ? 'error' : ''}`}
                                        required
                                    />
                                    {errors.confirmPassword && <p className="auth-error-message">{errors.confirmPassword}</p>}
                                </div>
                            )}

                            {activeView === 'login' && (
                                <div className="auth-options-group">
                                    <div className="auth-remember-me">
                                        <input
                                            id="remember-me"
                                            name="remember-me"
                                            type="checkbox"
                                            checked={rememberMe}
                                            onChange={(e) => setRememberMe(e.target.checked)}
                                            className="auth-checkbox"
                                        />
                                        <label htmlFor="remember-me" className="auth-checkbox-label">
                                            Remember me
                                        </label>
                                    </div>
                                    <Link to="/forgot" className="auth-forgot-password-link">
                                        Forgot Password?
                                    </Link>
                                </div>
                            )}

                            <button
                                type="submit"
                                className="auth-submit-button"
                            >
                                {activeView === 'login' ? 'Login' : 'Register'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthModule;
