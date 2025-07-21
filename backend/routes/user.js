const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User'); // User model को import करें

/**
 * @route   PATCH /api/user/update-email
 * @desc    Update the email of the logged-in user
 * @access  Private (User)
 */
router.patch('/update-email', auth, async (req, res) => {
    const { email } = req.body;

    // ईमेल वैलिडेशन (basic)
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
        return res.status(400).json({ message: 'Please provide a valid email address.' });
    }

    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // जाँचें कि क्या नया ईमेल पहले से मौजूद है (यदि यह वर्तमान ईमेल नहीं है)
        if (user.email !== email) {
            const existingUserWithEmail = await User.findOne({ email });
            if (existingUserWithEmail) {
                return res.status(409).json({ message: 'This email is already registered.' });
            }
        }

        user.email = email;
        await user.save();

        res.status(200).json({ message: 'Email updated successfully!', email: user.email });

    } catch (error) {
        console.error('Error updating user email:', error);
        res.status(500).json({ message: 'Server error while updating email.' });
    }
});

module.exports = router;
