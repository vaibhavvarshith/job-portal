# ProTrack - Full-Stack Job & Internship Portal

[![Vercel Deployment Status](https://vercel.com/api/docs/api/badges/deployments/YOUR_VERCEL_USERNAME/YOUR_VERCEL_PROJECT_ID/PRODUCTION_DEPLOYMENT_ID)](https://pro-track-job-portal.vercel.app/)
[![Render Deployment Status](https://api.render.com/v1/services/srv-YOUR_RENDER_SERVICE_ID/badges/deploy.svg)](https://pro-track-job-portal-backend.onrender.com/)

ProTrack is a comprehensive, role-based web application designed to revolutionize how students and recruiters connect. It offers a seamless and efficient platform for managing career opportunities and talent acquisition, all overseen by an administrative panel.

This project was a collaborative effort during our internship at **Infotact Solutions**.

---

## 🌟 Key Features

The application is structured around three distinct user roles, each provided with a dedicated dashboard and tailored functionalities to streamline their specific interactions within the portal:

### 🧑‍💼 **Admin Panel**
* **Analytics & Reporting:** Gain insights into platform performance with interactive charts on user registration trends, activity metrics, and the ability to generate detailed reports.
* **User Management:** Comprehensive tools to manage all users (students, recruiters, other admins), including activation, deactivation, and role adjustments.
* **Recruiter Approval System:** A streamlined workflow for reviewing and approving or rejecting new recruiter registrations, ensuring platform quality and security.

### 🏢 **Recruiter Dashboard**
* **Opportunity Posting:** Intuitive forms to easily create and publish new job and internship listings with all necessary details.
* **Application Management:** Efficiently view, filter, and manage all applications received for posted opportunities, with capabilities to update candidate statuses (e.g., Viewed, Shortlisted, Interview Scheduled, Rejected).
* **Company Profile Management:** A dedicated section to create, update, and showcase a public profile for their company, including branding elements like logos and banners, and detailed company descriptions.
* **Personalized Performance Metrics:** A dashboard displaying key statistics relevant to their recruitment activities, such as active listings and total applications received.

### 🎓 **Student Dashboard**
* **Comprehensive Profile Management:** Tools to build and maintain a detailed personal profile, including educational background, work experience, and a dynamic skills section.
* **Advanced Resume Manager:** Upload and organize multiple versions of their resume. This module also integrates **AI-powered tools** for building optimized resumes from scratch and a **Resume Score Checker** to provide feedback and improve resume effectiveness.
* **Job & Internship Discovery:** Functionality to search and browse available job and internship listings.
* **Application Tracking:** A centralized system to monitor the real-time status of all submitted job and internship applications.
* **Real-time Notifications:** Instant alerts and updates regarding application status changes, new job matches, and other important platform activities.

---

## 💻 Tech Stack

* **Frontend:** React.js, React Router DOM, React Hot Toast, Chart.js, Vite
* **Backend:** Node.js, Express.js, Multer, Nodemailer
* **Database:** MongoDB (with Mongoose ODM)
* **Authentication:** JSON Web Tokens (JWT), bcryptjs
* **AI Integration:** Google Gemini API

---

## 🤝 Team

This project was a collaborative effort between:
* **[Your Name Here]** (Backend Developer)
* **Ayush Kumar Verma** (Frontend Developer)

---

## 📸 Screenshots

Here are some screenshots of the application demonstrating its key features:

**Landing Page**
!

**Login/Register Page**
!

**Student Dashboard**
!

**Student Profile Page (Edit Mode)**
!

**Recruiter Dashboard**
!

**Recruiter Company Profile**
!

**Admin Dashboard**
!

**Admin User Management**
!

---

## ⚙️ How to Run This Project Locally

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    ```bash
    cd ProTrack # Or the name of your cloned folder
    ```

2.  **Setup Backend:**
    ```bash
    cd backend
    npm install
    ```
    * Create a `.env` file in the `backend` root.
    * Add your MongoDB Connection String as `MONGO_URI`.
    * Add a secret key for JWT as `JWT_SECRET`.
    * Add Brevo (Sendinblue) SMTP details: `BREVO_HOST`, `BREVO_PORT`, `BREVO_USER`, `BREVO_API_KEY`.
    
    * Start the server:
        ```bash
        npm run dev
        ```
        The backend server will start on `http://localhost:5000`.

3.  **Setup Frontend:**
    ```bash
    cd ../job-portal # If your frontend folder is named 'job-portal'
    npm install
    ```
    * Start the React app:
        ```bash
        npm run dev
        ```
        The React app will start on `http://localhost:5173` (or another available port).

---
