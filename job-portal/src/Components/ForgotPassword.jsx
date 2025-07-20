import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// Placeholder for an icon, e.g., from lucide-react or an SVG
// These SVG components can remain as they are, or you can also style them via CSS if needed.
const MailIcon = ({ className }) => (
  <svg className={className || "icon-default"} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

const LockIcon = ({ className }) => (
  <svg className={className || "icon-default"} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const ArrowLeftIcon = ({ className }) => (
  <svg className={className || "icon-default"} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m12 19-7-7 7-7" />
    <path d="M19 12H5" />
  </svg>
);


function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors

    if (!email) {
      setError('Please enter your email address.');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    // --- TODO: Implement actual password reset logic here ---
    console.log('Password reset requested for:', email);
    // --- End of TODO ---

    setIsSubmitted(true); // Show success message
  };

  return (
    <div className="forgot-password-container">
      {/* Optional: PRO TRACK Logo
      <div className="logo-container">
        PRO <span className="logo-track">TRACK</span>
      </div>
      */}

      <div className="form-card">
        <div className="form-header">
          <LockIcon className="header-icon" />
          <h1 className="form-title">Forgot Password?</h1>
          {!isSubmitted ? (
            <p className="form-subtitle">
              No worries! Enter your email address below and we'll send you a link to reset your password.
            </p>
          ) : (
            <p className="form-subtitle">
              If an account with that email exists, we've sent a password reset link. Please check your inbox (and spam folder).
            </p>
          )}
        </div>

        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="form-body">
            <div className="input-group">
              <label htmlFor="email" className="input-label">
                Email Address
              </label>
              <div className="input-wrapper">
                <MailIcon className="input-icon" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="input-field"
                />
              </div>
              {error && <p className="error-message">{error}</p>}
            </div>

            <div>
              <button
                type="submit"
                className="submit-button"
              >
                Send Reset Link
              </button>
            </div>
          </form>
        ) : (
          <div className="submission-success">
            <p>
              Password reset instructions have been sent to your email.
            </p>
          </div>
        )}

        <div className="form-footer">
          <Link
            to="/login" // Adjust this path to your actual login route
            className="back-link"
          >
            <ArrowLeftIcon className="back-link-icon" />
            Back to Login
          </Link>
        </div>
      </div>
      <p className="copyright-text">
        &copy; {new Date().getFullYear()} PRO TRACK. All rights reserved.
      </p>
    </div>
  );
}

export default ForgotPasswordPage;