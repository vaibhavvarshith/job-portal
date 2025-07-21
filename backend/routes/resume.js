const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Resume = require('../models/Resume'); // Import the new Resume model
const multer = require('multer'); // For handling file uploads
const path = require('path');
const fs = require('fs'); // For file system operations (e.g., deleting local temp files)

// --- Multer setup for file uploads ---
// You might want to configure storage to a cloud service like Cloudinary in a real app.
// For local temporary storage:
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Ensure the 'uploads' directory exists
        const uploadDir = path.join(__dirname, '../uploads/resumes');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, `${req.user.id}-${Date.now()}${path.extname(file.originalname)}`);
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB file size limit
    fileFilter: (req, file, cb) => {
        const allowedTypes = /pdf|doc|docx/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        if (extname && mimetype) {
            return cb(null, true);
        } else {
            cb(new Error('Only PDF, DOC, and DOCX files are allowed!'));
        }
    }
});

// --- Resume Routes ---

/**
 * @route   GET /api/student/resumes
 * @desc    Get all resumes for the logged-in student
 * @access  Private (Student)
 */
router.get('/', auth, async (req, res) => {
    if (req.user.role !== 'student') {
        return res.status(403).json({ message: 'Access denied.' });
    }
    try {
        const resumes = await Resume.find({ studentId: req.user.id }).sort({ createdAt: -1 });
        res.status(200).json(resumes);
    } catch (error) {
        console.error('Error fetching resumes:', error);
        res.status(500).json({ message: 'Server error fetching resumes.' });
    }
});

/**
 * @route   POST /api/student/resumes/upload
 * @desc    Upload a new resume file
 * @access  Private (Student)
 */
router.post('/upload', auth, upload.single('resumeFile'), async (req, res) => {
    if (req.user.role !== 'student') {
        return res.status(403).json({ message: 'Access denied.' });
    }
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded.' });
    }

    try {
        // In a real application, you would upload this file to Cloudinary or S3
        // and get a secure URL. For now, we'll use a placeholder URL.
        const fileUrl = `${req.protocol}://${req.get('host')}/uploads/resumes/${req.file.filename}`;
        // You might want to save the file to Cloudinary here and get its secure_url
        // const cloudinaryResponse = await cloudinary.uploader.upload(req.file.path);
        // const fileUrl = cloudinaryResponse.secure_url;
        // fs.unlinkSync(req.file.path); // Delete local temp file after upload

        // Unset previous default resume if new one is set as default
        if (req.body.isDefault === 'true') { // FormData sends boolean as string
            await Resume.updateMany({ studentId: req.user.id, isDefault: true }, { isDefault: false });
        }

        const newResume = new Resume({
            studentId: req.user.id,
            name: req.body.resumeName || req.file.originalname,
            fileName: req.file.originalname,
            url: fileUrl, // Use the actual hosted URL
            size: `${(req.file.size / 1024).toFixed(1)}KB`,
            mimeType: req.file.mimetype,
            isDefault: req.body.isDefault === 'true' || false,
        });

        await newResume.save();
        res.status(201).json({ message: 'Resume uploaded successfully!', resume: newResume });
    } catch (error) {
        console.error('Error uploading resume:', error);
        // If there was a file, delete it from local storage if upload to cloud failed
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        res.status(500).json({ message: error.message || 'Server error uploading resume.' });
    }
});

/**
 * @route   PATCH /api/student/resumes/:id/set-default
 * @desc    Set a specific resume as the default
 * @access  Private (Student)
 */
router.patch('/:id/set-default', auth, async (req, res) => {
    if (req.user.role !== 'student') {
        return res.status(403).json({ message: 'Access denied.' });
    }
    try {
        const { id } = req.params;

        // Unset previous default resume for this student
        await Resume.updateMany({ studentId: req.user.id, isDefault: true }, { isDefault: false });

        // Set the specified resume as default
        const resume = await Resume.findOneAndUpdate(
            { _id: id, studentId: req.user.id }, // Ensure student owns this resume
            { isDefault: true },
            { new: true }
        );

        if (!resume) {
            return res.status(404).json({ message: 'Resume not found or unauthorized.' });
        }
        res.status(200).json({ message: 'Resume set as default successfully!', resume });
    } catch (error) {
        console.error('Error setting default resume:', error);
        res.status(500).json({ message: 'Server error setting default resume.' });
    }
});

/**
 * @route   DELETE /api/student/resumes/:id
 * @desc    Delete a specific resume
 * @access  Private (Student)
 */
router.delete('/:id', auth, async (req, res) => {
    if (req.user.role !== 'student') {
        return res.status(403).json({ message: 'Access denied.' });
    }
    try {
        const { id } = req.params;
        const resume = await Resume.findOneAndDelete({ _id: id, studentId: req.user.id }); // Ensure student owns resume

        if (!resume) {
            return res.status(404).json({ message: 'Resume not found or unauthorized.' });
        }

        // In a real app, delete the file from Cloudinary/S3 as well
        // if (resume.url && resume.url.includes('cloudinary.com')) {
        //     await cloudinary.uploader.destroy(public_id_from_url);
        // }

        res.status(200).json({ message: 'Resume deleted successfully!' });
    } catch (error) {
        console.error('Error deleting resume:', error);
        res.status(500).json({ message: 'Server error deleting resume.' });
    }
});

/**
 * @route   POST /api/student/resumes/ai-build
 * @desc    Generate a resume using AI based on provided data
 * @access  Private (Student)
 */
router.post('/ai-build', auth, async (req, res) => {
    if (req.user.role !== 'student') {
        return res.status(403).json({ message: 'Access denied.' });
    }
    const aiResumeData = req.body; // Data from the AI builder form

    try {
        // --- LLM API Call (Gemini API) ---
        // This is a placeholder. You'll integrate with Gemini API here.
        // Example prompt: "Generate a professional resume in markdown format based on the following data: ${JSON.stringify(aiResumeData)}"
        const prompt = `Generate a professional resume in a structured, readable format (e.g., Markdown or plain text) based on the following student profile data. Focus on clarity, impact, and standard resume sections.
        
        Personal Details: ${aiResumeData.personalDetails.fullName}, ${aiResumeData.personalDetails.email}, ${aiResumeData.personalDetails.phone}, LinkedIn: ${aiResumeData.personalDetails.linkedin}, GitHub: ${aiResumeData.personalDetails.github}, Portfolio: ${aiResumeData.personalDetails.portfolio}
        Summary: ${aiResumeData.summary}
        Education: ${JSON.stringify(aiResumeData.education)}
        Experience: ${JSON.stringify(aiResumeData.experience)}
        Skills: ${aiResumeData.skills.join(', ')}
        Projects: ${JSON.stringify(aiResumeData.projects)}
        
        Ensure the output is clean text, suitable for a resume. Do NOT include any conversational filler or code block markers.`;

        let chatHistory = [];
        chatHistory.push({ role: "user", parts: [{ text: prompt }] });
        const payload = { contents: chatHistory };
        const apiKey = ""; // Leave as empty string, Canvas will provide it
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

        const geminiResponse = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const geminiResult = await geminiResponse.json();

        if (geminiResult.candidates && geminiResult.candidates.length > 0 &&
            geminiResult.candidates[0].content && geminiResult.candidates[0].content.parts &&
            geminiResult.candidates[0].content.parts.length > 0) {
            const generatedResumeContent = geminiResult.candidates[0].content.parts[0].text;

            // In a real scenario, you would save this generated content as a file (e.g., PDF, DOCX)
            // and then save the file's URL to your database (similar to upload route).
            // For now, we'll simulate saving and return a mock URL/ID.

            // Example: Save generated content to a temporary file or directly upload to Cloudinary
            // For demonstration, we'll just return a success message and mock data.

            // Mock saving the generated resume
            const mockResume = {
                studentId: req.user.id,
                name: `AI-Generated Resume ${Date.now()}`,
                fileName: `ai_resume_${Date.now()}.txt`, // Or .md, .pdf etc.
                url: 'https://example.com/ai-generated-resume.pdf', // Placeholder URL
                size: '10KB', // Placeholder size
                mimeType: 'text/plain', // Or application/pdf
                isDefault: false,
                isAIGenerated: true
            };
            // await new Resume(mockResume).save(); // Uncomment to save mock resume to DB

            res.status(200).json({
                message: 'AI resume generated successfully!',
                generatedContent: generatedResumeContent, // You might send this back to display
                resume: mockResume // Or the actual saved resume object
            });

        } else {
            console.error("Gemini API response structure unexpected:", geminiResult);
            res.status(500).json({ message: 'AI generation failed: Unexpected API response.' });
        }

    } catch (error) {
        console.error('Error generating AI resume:', error);
        res.status(500).json({ message: error.message || 'Server error during AI resume generation.' });
    }
});


/**
 * @route   POST /api/student/resumes/check-score
 * @desc    Check resume score using AI
 * @access  Private (Student)
 */
router.post('/check-score', auth, upload.single('resumeFile'), async (req, res) => {
    if (req.user.role !== 'student') {
        return res.status(403).json({ message: 'Access denied.' });
    }
    if (!req.file) {
        return res.status(400).json({ message: 'No resume file provided for scoring.' });
    }

    try {
        // In a real app, you'd read the content of req.file.path
        // and send it to an LLM for analysis.
        // For demonstration, we'll mock the score and feedback.

        // Example: Read file content (for text-based analysis)
        // const resumeText = fs.readFileSync(req.file.path, 'utf8');

        // --- LLM API Call (Gemini API) ---
        // This is a placeholder. You'll integrate with Gemini API here.
        // You might need to convert PDF/DOCX to text first (using a library like 'pdf-parse' or 'mammoth')
        const prompt = `Analyze the following resume content and provide a score out of 100 based on its completeness, clarity, keyword optimization, and overall professionalism. Also, provide constructive feedback for improvement.
        
        Resume Content (as text): [Resume content extracted from file, or a summary of its key points]
        
        Provide the response in JSON format with 'score' (integer) and 'feedback' (string).`;

        // For actual file content, you'd extract text from req.file.buffer or req.file.path
        // For now, let's use a placeholder for resume content.
        const resumeContentPlaceholder = `This is a placeholder for the actual resume content of ${req.file.originalname}.`;

        let chatHistory = [];
        chatHistory.push({ role: "user", parts: [{ text: prompt.replace('[Resume content extracted from file, or a summary of its key points]', resumeContentPlaceholder) }] });
        
        const payload = { 
            contents: chatHistory,
            generationConfig: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: "OBJECT",
                    properties: {
                        "score": { "type": "INTEGER" },
                        "feedback": { "type": "STRING" }
                    },
                    "propertyOrdering": ["score", "feedback"]
                }
            }
        };
        const apiKey = "GEMINI_API_KEY"; // Leave as empty string, Canvas will provide it
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

        const geminiResponse = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const geminiResult = await geminiResponse.json();
        
        // Delete the temporary local file after processing
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }

        if (geminiResult.candidates && geminiResult.candidates.length > 0 &&
            geminiResult.candidates[0].content && geminiResult.candidates[0].content.parts &&
            geminiResult.candidates[0].content.parts.length > 0) {
            const jsonResponse = JSON.parse(geminiResult.candidates[0].content.parts[0].text);
            
            res.status(200).json({
                message: 'Resume scored successfully!',
                score: jsonResponse.score,
                feedback: jsonResponse.feedback,
            });

        } else {
            console.error("Gemini API response structure unexpected:", geminiResult);
            res.status(500).json({ message: 'AI scoring failed: Unexpected API response.' });
        }

    } catch (error) {
        console.error('Error checking resume score:', error);
        // Ensure local temp file is deleted on error too
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        res.status(500).json({ message: error.message || 'Server error checking resume score.' });
    }
});

module.exports = router;
