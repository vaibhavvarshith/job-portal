const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');
const path = require('path');

// Initialize Express app
const app = express();

// Connect to Database
connectDB();

// --- Middlewares ---
const allowedOrigins = [
    process.env.FRONTEND_URL, // Vercel URL
    'http://localhost:5173' // Local development
];
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
};
app.use(cors(corsOptions));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Serve static files from the 'uploads' directory (for resumes)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// --- Define Routes ---
console.log("Registering API routes...");
app.use('/api/auth', require('./routes/auth'));
app.use('/api/jobs', require('./routes/jobs'));
app.use('/api/internships', require('./routes/internships'));
app.use('/api/profile', require('./routes/profiles'));
app.use('/api/applications', require('./routes/applications'));
app.use('/api/recruiter', require('./routes/recruiter'));
app.use('/api/public', require('./routes/public'));
app.use('/api/student', require('./routes/student'));
app.use('/api/user', require('./routes/user'));
app.use('/api/student/resumes', require('./routes/resume'));
app.use('/api/admin', require('./routes/admin')); // NEW: Admin routes
console.log("✅ All API routes registration initiated.");


// Simple test route
app.get('/', (req, res) => res.send('API is running...'));


// --- Global Error Handling Middleware ---
app.use((err, req, res, next) => {
  console.error("An unexpected error occurred:", err.stack);
  res.status(500).json({ 
    message: 'Something went wrong on the server!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined 
  });
});


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server is listening on http://localhost:${PORT}`));
