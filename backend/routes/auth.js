const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto'); // Node.js module to generate random tokens
const User = require('../models/User'); // Ensure this path is correct and casing matches the filename
const sendEmail = require('../utils/sendEmail'); // Import the email utility
const router = express.Router();

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register', async (req, res) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password || !role) {
      return res.status(400).json({ message: 'Please provide email, password, and role.' });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'User with this email already exists.' });
    }
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);
    const newUser = new User({ email, password: hashedPassword, role });
    await newUser.save();
    res.status(201).json({ message: 'Registration successful! Please log in.' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration.' });
  }
});

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate a user and get a token
 * @access  Public
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password || !role) {
      return res.status(400).json({ message: 'Please provide email, password, and role.' });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }
    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }
    if (user.role !== role) {
      return res.status(401).json({ message: `You are not registered as a(n) ${role}.` });
    }
    const payload = { id: user._id, email: user.email, role: user.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.status(200).json({ message: 'Login successful!', token: token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login.' });
  }
});

/**
 * @route   POST /api/auth/forgot-password
 * @desc    Generate and send a password reset token via email
 * @access  Public
 */
router.post('/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            // For security, we don't reveal if the user was found or not.
            return res.status(200).json({ message: 'If an account with that email exists, a password reset link has been sent.' });
        }

        // 1. Generate a random token
        const resetToken = crypto.randomBytes(20).toString('hex');

        // 2. Hash the token and save it to the database with an expiry time
        user.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        user.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes from now
        
        await user.save();

        // 3. Create the reset URL
        const resetUrl = `https://pro-track-job-portal.vercel.app/reset-password/${resetToken}`;
        
        // 4. Create the email content
        const emailHtml = `
            <h1>Password Reset Request</h1>
            <p>You requested a password reset. Please click the link below to set a new password. This link will expire in 10 minutes.</p>
            <a href="${resetUrl}" target="_blank" style="background-color: #007bff; color: white; padding: 10px 15px; text-decoration: none; border-radius: 5px;">Reset Your Password</a>
        `;

        // 5. Send the email using the utility
        try {
            await sendEmail({
                email: user.email,
                subject: 'ProTrack - Password Reset Link',
                html: emailHtml
            });
            res.status(200).json({ message: 'If an account with that email exists, a password reset link has been sent.' });
        } catch (emailError) {
            console.error('Email sending error:', emailError);
            // Clear the token if email fails, so user can try again
            user.passwordResetToken = undefined;
            user.passwordResetExpires = undefined;
            await user.save();
            return res.status(500).json({ message: 'There was an error sending the email. Please try again later.' });
        }

    } catch (error) {
        console.error('Forgot Password error:', error);
        res.status(500).json({ message: 'Server error.' });
    }
});

module.exports = router;
