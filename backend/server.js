const express = require('express');
const cors = require('cors'); // Use the cors package
require('dotenv').config();
const connectDB = require('./config/db');
const path = require('path');

// Initialize Express app
const app = express();

// Connect to Database
connectDB();

// --- Middlewares ---

// CORS Configuration
const corsOptions = {
  origin: '*', // Allow all origins (for debugging)
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Allow all common HTTP methods
  credentials: true, // Allow cookies to be sent (if you use them)
  optionsSuccessStatus: 204 // Some legacy browsers (IE11, various SmartTVs) choke on 200
};

app.use(cors(corsOptions)); // Use the cors middleware


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
app.use('/api/admin', require('./routes/admin'));
console.log("✅ All API routes registration initiated.");


// A simple test route
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
