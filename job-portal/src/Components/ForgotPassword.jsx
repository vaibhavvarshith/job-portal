import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

// ... (SVG Icons remain the same)
const MailIcon = ({ className }) => ( <svg>...</svg> );
const LockIcon = ({ className }) => ( <svg>...</svg> );
const ArrowLeftIcon = ({ className }) => ( <svg>...</svg> );


function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('Please enter your email address.');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    setIsSubmitting(true);
    const loadingToast = toast.loading('Sending reset link...');

    try {
        const response = await fetch('https://pro-track-job-portal-backend.onrender.com/api/auth/forgot-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email }),
        });

        const result = await response.json();
        toast.dismiss(loadingToast);

        if (!response.ok) {
            throw new Error(result.message || 'Failed to send reset link.');
        }
        
        // Even on success, we show a generic message for security.
        // The actual success/failure is handled by the backend.
        setIsSubmitted(true);

    } catch (err) {
        toast.dismiss(loadingToast);
        toast.error(err.message || 'An error occurred.');
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <div className="forgot-password-container">
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
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Sending...' : 'Send Reset Link'}
              </button>
            </div>
          </form>
        ) : (
          <div className="submission-success">
            <p>
              You can now close this page.
            </p>
          </div>
        )}

        <div className="form-footer">
          <Link to="/login" className="back-link">
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
