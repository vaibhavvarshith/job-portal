const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Resume = require("../models/Resume");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, "../uploads/resumes");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${req.user.id}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /pdf|doc|docx/;
    const extname = allowedTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error("Only PDF, DOC, and DOCX files are allowed!"));
    }
  },
});

/**
 * @route   GET /api/student/resumes
 * @desc    Get all resumes for the logged-in student
 * @access  Private (Student)
 */
router.get("/", auth, async (req, res) => {
  if (req.user.role !== "student") {
    return res.status(403).json({ message: "Access denied." });
  }
  try {
    const resumes = await Resume.find({ studentId: req.user.id }).sort({
      createdAt: -1,
    });
    res.status(200).json(resumes);
  } catch (error) {
    console.error("Error fetching resumes:", error);
    res.status(500).json({ message: "Server error fetching resumes." });
  }
});

/**
 * @route   POST /api/student/resumes/upload
 * @desc    Upload a new resume file
 * @access  Private (Student)
 */
router.post("/upload", auth, upload.single("resumeFile"), async (req, res) => {
  if (req.user.role !== "student") {
    return res.status(403).json({ message: "Access denied." });
  }
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded." });
  }

  try {
    const fileUrl = `${req.protocol}://${req.get("host")}/uploads/resumes/${
      req.file.filename
    }`;

    if (req.body.isDefault === "true") {
      await Resume.updateMany(
        { studentId: req.user.id, isDefault: true },
        { isDefault: false }
      );
    }

    const newResume = new Resume({
      studentId: req.user.id,
      name: req.body.resumeName || req.file.originalname,
      fileName: req.file.originalname,
      url: fileUrl,
      size: `${(req.file.size / 1024).toFixed(1)}KB`,
      mimeType: req.file.mimetype,
      isDefault: req.body.isDefault === "true" || false,
    });

    await newResume.save();
    res
      .status(201)
      .json({ message: "Resume uploaded successfully!", resume: newResume });
  } catch (error) {
    console.error("Error uploading resume:", error);
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res
      .status(500)
      .json({ message: error.message || "Server error uploading resume." });
  }
});

/**
 * @route   PATCH /api/student/resumes/:id/set-default
 * @desc    Set a specific resume as the default
 * @access  Private (Student)
 */
router.patch("/:id/set-default", auth, async (req, res) => {
  if (req.user.role !== "student") {
    return res.status(403).json({ message: "Access denied." });
  }
  try {
    const { id } = req.params;

    await Resume.updateMany(
      { studentId: req.user.id, isDefault: true },
      { isDefault: false }
    );

    const resume = await Resume.findOneAndUpdate(
      { _id: id, studentId: req.user.id },
      { isDefault: true },
      { new: true }
    );

    if (!resume) {
      return res
        .status(404)
        .json({ message: "Resume not found or unauthorized." });
    }
    res
      .status(200)
      .json({ message: "Resume set as default successfully!", resume });
  } catch (error) {
    console.error("Error setting default resume:", error);
    res.status(500).json({ message: "Server error setting default resume." });
  }
});

/**
 * @route   DELETE /api/student/resumes/:id
 * @desc    Delete a specific resume
 * @access  Private (Student)
 */
router.delete("/:id", auth, async (req, res) => {
  if (req.user.role !== "student") {
    return res.status(403).json({ message: "Access denied." });
  }
  try {
    const { id } = req.params;
    const resume = await Resume.findOneAndDelete({
      _id: id,
      studentId: req.user.id,
    });
    if (!resume) {
      return res
        .status(404)
        .json({ message: "Resume not found or unauthorized." });
    }

    res.status(200).json({ message: "Resume deleted successfully!" });
  } catch (error) {
    console.error("Error deleting resume:", error);
    res.status(500).json({ message: "Server error deleting resume." });
  }
});

/**
 * @route   POST /api/student/resumes/ai-build
 * @desc    Generate a resume using AI based on provided data
 * @access  Private (Student)
 */
router.post("/ai-build", auth, async (req, res) => {
  if (req.user.role !== "student") {
    return res.status(403).json({ message: "Access denied." });
  }
  const aiResumeData = req.body;
  try {
    const prompt = `Generate a professional resume in a structured, readable format (e.g., Markdown or plain text) based on the following student profile data. Focus on clarity, impact, and standard resume sections.
        
        Personal Details: ${aiResumeData.personalDetails.fullName}, ${
      aiResumeData.personalDetails.email
    }, ${aiResumeData.personalDetails.phone}, LinkedIn: ${
      aiResumeData.personalDetails.linkedin
    }, GitHub: ${aiResumeData.personalDetails.github}, Portfolio: ${
      aiResumeData.personalDetails.portfolio
    }
        Summary: ${aiResumeData.summary}
        Education: ${JSON.stringify(aiResumeData.education)}
        Experience: ${JSON.stringify(aiResumeData.experience)}
        Skills: ${aiResumeData.skills.join(", ")}
        Projects: ${JSON.stringify(aiResumeData.projects)}
        
        Ensure the output is clean text, suitable for a resume. Do NOT include any conversational filler or code block markers.`;

    let chatHistory = [];
    chatHistory.push({ role: "user", parts: [{ text: prompt }] });
    const payload = { contents: chatHistory };
    const apiKey = "";
    const apiUrl = `https:generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    const geminiResponse = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const geminiResult = await geminiResponse.json();

    if (
      geminiResult.candidates &&
      geminiResult.candidates.length > 0 &&
      geminiResult.candidates[0].content &&
      geminiResult.candidates[0].content.parts &&
      geminiResult.candidates[0].content.parts.length > 0
    ) {
      const generatedResumeContent =
        geminiResult.candidates[0].content.parts[0].text;

      const mockResume = {
        studentId: req.user.id,
        name: `AI-Generated Resume ${Date.now()}`,
        fileName: `ai_resume_${Date.now()}.txt`,
        url: "https://example.com/ai-generated-resume.pdf",
        size: "10KB",
        mimeType: "text/plain",
        isDefault: false,
        isAIGenerated: true,
      };

      res.status(200).json({
        message: "AI resume generated successfully!",
        generatedContent: generatedResumeContent,
        resume: mockResume,
      });
    } else {
      console.error("Gemini API response structure unexpected:", geminiResult);
      res
        .status(500)
        .json({ message: "AI generation failed: Unexpected API response." });
    }
  } catch (error) {
    console.error("Error generating AI resume:", error);
    res
      .status(500)
      .json({
        message: error.message || "Server error during AI resume generation.",
      });
  }
});

/**
 * @route   POST /api/student/resumes/check-score
 * @desc    Check resume score using AI
 * @access  Private (Student)
 */
router.post(
  "/check-score",
  auth,
  upload.single("resumeFile"),
  async (req, res) => {
    if (req.user.role !== "student") {
      return res.status(403).json({ message: "Access denied." });
    }
    if (!req.file) {
      return res
        .status(400)
        .json({ message: "No resume file provided for scoring." });
    }

    try {
      const prompt = `Analyze the following resume content and provide a score out of 100 based on its completeness, clarity, keyword optimization, and overall professionalism. Also, provide constructive feedback for improvement.
        
        Resume Content (as text): [Resume content extracted from file, or a summary of its key points]
        
        Provide the response in JSON format with 'score' (integer) and 'feedback' (string).`;

      const resumeContentPlaceholder = `This is a placeholder for the actual resume content of ${req.file.originalname}.`;

      let chatHistory = [];
      chatHistory.push({
        role: "user",
        parts: [
          {
            text: prompt.replace(
              "[Resume content extracted from file, or a summary of its key points]",
              resumeContentPlaceholder
            ),
          },
        ],
      });

      const payload = {
        contents: chatHistory,
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: {
            type: "OBJECT",
            properties: {
              score: { type: "INTEGER" },
              feedback: { type: "STRING" },
            },
            propertyOrdering: ["score", "feedback"],
          },
        },
      };
      const apiKey = "GEMINI_API_KEY";
      const apiUrl = `https:generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

      const geminiResponse = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const geminiResult = await geminiResponse.json();

      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }

      if (
        geminiResult.candidates &&
        geminiResult.candidates.length > 0 &&
        geminiResult.candidates[0].content &&
        geminiResult.candidates[0].content.parts &&
        geminiResult.candidates[0].content.parts.length > 0
      ) {
        const jsonResponse = JSON.parse(
          geminiResult.candidates[0].content.parts[0].text
        );

        res.status(200).json({
          message: "Resume scored successfully!",
          score: jsonResponse.score,
          feedback: jsonResponse.feedback,
        });
      } else {
        console.error(
          "Gemini API response structure unexpected:",
          geminiResult
        );
        res
          .status(500)
          .json({ message: "AI scoring failed: Unexpected API response." });
      }
    } catch (error) {
      console.error("Error checking resume score:", error);
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      res
        .status(500)
        .json({
          message: error.message || "Server error checking resume score.",
        });
    }
  }
);

module.exports = router;
