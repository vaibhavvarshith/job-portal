const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');

// Initialize Express app
const app = express();

// Connect to Database
connectDB();

// --- Middlewares ---
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// --- Define Routes ---
app.use('/api/auth', require('./routes/auth'));
app.use('/api/jobs', require('./routes/jobs'));
app.use('/api/internships', require('./routes/internships'));
app.use('/api/profile', require('./routes/profiles'));
app.use('/api/applications', require('./routes/applications'));
app.use('/api/recruiter', require('./routes/recruiter')); // Add this new line

// Simple test route
app.get('/', (req, res) => res.send('API is running...'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server is listening on http://localhost:${PORT}`));
