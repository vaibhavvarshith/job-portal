// Import required packages
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Import Authentication Middleware
const auth = require('./middleware/auth');

// Initialize the Express app
const app = express();
const PORT = process.env.PORT || 5000;

// --- Middlewares ---

// --- FIX FOR DEPLOYMENT: CORS Configuration ---
// Define the allowed origins (your Vercel frontend URL)
const allowedOrigins = ['https://your-vercel-frontend-url.vercel.app', 'http://localhost:5173'];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  }
};
// Use the configured CORS options
app.use(cors(corsOptions));


app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));


// --- MongoDB Connection ---
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Successfully connected to MongoDB.');
}).catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

// --- Mongoose Schemas and Models ---
// ... (Your schemas remain the same)
const User = require('./models/User');
const Job = require('./models/Job');
const Internship = require('./models/Internship');
const Application = require('./models/Application');
const CompanyProfile = require('./models/CompanyProfile');


// --- API Routes ---
// ... (Your routes remain the same)
app.use('/api/auth', require('./routes/auth'));
app.use('/api/jobs', require('./routes/jobs'));
app.use('/api/internships', require('./routes/internships'));
app.use('/api/profile', require('./routes/profiles'));
app.use('/api/applications', require('./routes/applications'));
app.use('/api/recruiter', require('./routes/recruiter'));


// --- Start the Server ---
app.listen(PORT, () => {
  console.log(`Server is listening on http://localhost:${PORT}`);
});
