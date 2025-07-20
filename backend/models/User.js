const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  role: { type: String, required: true, enum: ['student', 'recruiter', 'admin'] },
  // Default name add kiya gaya hai taaki ye kabhi undefined na rahe
  name: { type: String, default: 'New User' },
  
  // --- Fields for Password Reset ---
  passwordResetToken: { type: String },
  passwordResetExpires: { type: Date },

}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
