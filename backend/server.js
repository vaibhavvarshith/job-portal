const express = require('express');
const cors = require('cors'); require('dotenv').config();
const connectDB = require('./config/db');
const path = require('path');

const app = express();

connectDB();


const corsOptions = {
  origin: '*',   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',   credentials: true,   optionsSuccessStatus: 204 };

app.use(cors(corsOptions)); 

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


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


app.get('/', (req, res) => res.send('API is running...'));


app.use((err, req, res, next) => {
  console.error("An unexpected error occurred:", err.stack);
  res.status(500).json({ 
    message: 'Something went wrong on the server!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined 
  });
});


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server is listening on http://localhost:${PORT}`));
