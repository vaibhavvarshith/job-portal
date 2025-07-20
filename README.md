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
