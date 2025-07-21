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
    * Add your frontend and backend URLs for local development and deployment:
        ```env
        MONGO_URI=YOUR_MONGODB_CONNECTION_STRING_HERE
        JWT_SECRET=YOUR_JWT_SECRET_KEY_HERE
        BREVO_HOST=smtp-relay.brevo.com
        BREVO_PORT=587
        BREVO_USER=YOUR_BREVO_EMAIL_HERE
        BREVO_API_KEY=YOUR_BREVO_API_KEY_HERE

        # Local Development URLs
        FRONTEND_URL=http://localhost:5173
        BACKEND_URL=http://localhost:5000

        # Deployed URLs (Update after deployment)
        # FRONTEND_URL=https://pro-track-job-portal.vercel.app
        # BACKEND_URL=https://pro-track-job-portal-backend.onrender.com
        ```
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
    * Create a `.env` file in the `job-portal` (frontend) root.
    * Add your backend URL:
        ```env
        VITE_BACKEND_URL=http://localhost:5000 # For local development
        # VITE_BACKEND_URL=https://pro-track-job-portal-backend.onrender.com # For deployed backend
        ```
    * Start the React app:
        ```bash
        npm run dev
        ```
        The React app will start on `http://localhost:5173` (or another available port).

---

## 🚀 Deployment Guide

To deploy a MERN stack app, we need to deploy the frontend and backend separately.

### Part 1: Deploying the Backend to Render

Render is an excellent free service for hosting Node.js servers.

1.  **Push to GitHub:** Ensure your entire project (with both `backend` and `job-portal` folders) is pushed to a GitHub repository.
2.  **Create a Render Account:** Go to [Render.com](https://render.com/) and sign up using your GitHub account.
3.  **Create a New Web Service:**
    * On your Render dashboard, click "New +" and select "Web Service".
    * Connect your GitHub repository.
4.  **Configuration Settings:**
    * **Name:** Give your service a name (e.g., `protrack-backend`).
    * **Root Directory:** `backend` (This tells Render where your server code is).
    * **Runtime:** `Node`.
    * **Build Command:** `npm install`.
    * **Start Command:** `node server.js`.
5.  **Add Environment Variables:**
    * In the "Environment" tab, click "Add Environment Variable".
    * Add your `MONGO_URI`, `JWT_SECRET`, `BREVO_HOST`, `BREVO_PORT`, `BREVO_USER`, `BREVO_API_KEY`.
    * **Crucially, add `FRONTEND_URL` with the exact URL of your deployed Vercel frontend.**
        * `Key`: `FRONTEND_URL`
        * `Value`: `https://pro-track-job-portal.vercel.app` (or your actual Vercel domain)
    * **Also, add `BACKEND_URL` with the URL Render provides for your backend service.**
        * `Key`: `BACKEND_URL`
        * `Value`: `https://pro-track-job-portal-backend.onrender.com` (or your actual Render backend domain)
6.  **Deploy:** Click "Create Web Service". Render will build and deploy your backend. After deployment, Render will provide a public URL. Your backend URL is: `https://pro-track-job-portal-backend.onrender.com`.

### Part 2: Deploying the Frontend to Vercel

1.  **Push Code to GitHub:** Ensure your frontend code (including the `job-portal` folder) is pushed to the same GitHub repository.
2.  **Import to Vercel:**
    * Log in to [Vercel.com](https://vercel.com/) with your GitHub account.
    * Click "Add New... -> Project" and import your repository.
4.  **Configure Project:**
    * **Framework Preset:** Vercel should automatically detect `Vite`.
    * **Root Directory:** `job-portal` (This tells Vercel that your React app is inside this folder).
    * **Environment Variables:** Go to "Environment Variables" in Vercel project settings.
        * **Add `VITE_BACKEND_URL`:**
            * `Name`: `VITE_BACKEND_URL`
            * `Value`: `https://pro-track-job-portal-backend.onrender.com` (the exact URL of your Render backend).
5.  **Deploy:** Click the "Deploy" button. Vercel will build and deploy your frontend.

After following these steps, your application will be live on Vercel and will communicate with your backend hosted on Render.
