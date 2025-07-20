# ProTrack - Full-Stack Job & Internship Portal

ProTrack is a comprehensive, role-based web application built with the MERN stack (MongoDB, Express, React, Node.js). It serves as a bridge between students seeking opportunities and recruiters looking for talent, all managed under an admin's supervision.

---

### Key Features

The application is divided into three distinct roles, each with its own dedicated dashboard and functionalities:

#### 🧑‍💼 **Admin Panel**
* **Analytics Dashboard:** View key metrics like user registration trends and platform activity on interactive charts.
* **User Management:** Full CRUD (Create, Read, Update, Delete) functionality for all users on the platform.
* **Recruiter Approval System:** Manually review and approve or reject new recruiter registrations to maintain platform quality.
* **Reporting:** Generate and view detailed reports on various platform activities.

#### 🏢 **Recruiter Dashboard**
* **Post Opportunities:** Easily create and post new job and internship listings through dedicated forms.
* **Application Management:** View all applications received for their job postings, and update candidate statuses (Viewed, Shortlisted, Rejected, etc.).
* **Company Profile:** Create and manage a detailed public profile for their company, including logo, banner, and description.
* **Personalized Stats:** View a dashboard with key stats like the number of active listings and total applications received.

#### 🎓 **Student Dashboard**
* **Profile Management:** Build and maintain a detailed personal profile with skills, education, and experience.
* **Resume Manager:** Upload and manage multiple versions of their resume.
* **(Future Scope) Job Listings & Application:** Search for available jobs/internships and apply with a selected resume.
* **(Future Scope) Track Applications:** Monitor the real-time status of all submitted applications.

---

### Tech Stack

* **Frontend:** React.js, React Router, React Hot Toast
* **Backend:** Node.js, Express.js
* **Database:** MongoDB with Mongoose
* **Authentication:** JSON Web Tokens (JWT) & bcryptjs for password hashing

---

### How to Run This Project

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    ```

2.  **Setup Backend:**
    ```bash
    cd backend
    npm install
    ```
    * Create a `.env` file in the `backend` root.
    * Add your MongoDB Connection String as `MONGO_URI`.
    * Add a secret key for JWT as `JWT_SECRET`.
    ```bash
    npm run dev
    ```
    The backend server will start on `http://localhost:5000`.

3.  **Setup Frontend:**
    ```bash
    cd ../job-portal 
    npm install
    npm run dev
    ```
    The React app will start on `http://localhost:5173` (or another available port).

---

### 🚀 Deployment Guide

To deploy a MERN stack app, we need to deploy the frontend and backend separately.

#### Part 1: Deploying the Backend to Render

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
    * Add your `MONGO_URI` and `JWT_SECRET` from your local `.env` file.
6.  **Deploy:** Click "Create Web Service". Render will build and deploy your backend. After deployment, Render will provide a public URL. Your backend URL is: `https://pro-track-job-portal-backend.onrender.com`.

#### Part 2: Deploying the Frontend to Vercel

1.  **Update API URL:**
    * In your frontend code, replace all instances of `fetch('http://localhost:5000/api/...')` with your live backend URL from Render.
    * **Example:** `fetch('https://pro-track-job-portal-backend.onrender.com/api/...')`
    * Apply this change in all relevant files (`Login-Register.jsx`, `RecruiterDashboard.jsx`, etc.).
2.  **Push Code to GitHub:** Commit and push this change.
3.  **Import to Vercel:**
    * Log in to [Vercel.com](https://vercel.com/) with your GitHub account.
    * Click "Add New... -> Project" and import your repository.
4.  **Configure Project:**
    * **Framework Preset:** Vercel should automatically detect `Vite`.
    * **Root Directory:** `job-portal` (This tells Vercel that your React app is inside this folder).
5.  **Deploy:** Click the "Deploy" button. Vercel will build and deploy your frontend.

After following these steps, your application will be live on Vercel and will communicate with your backend hosted on Render.
