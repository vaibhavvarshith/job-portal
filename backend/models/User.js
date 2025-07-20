const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  role: { type: String, required: true, enum: ['student', 'recruiter', 'admin'] },
  name: { type: String },
  
  // --- Fields for Password Reset ---
  passwordResetToken: { type: String },
  passwordResetExpires: { type: Date },

}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
