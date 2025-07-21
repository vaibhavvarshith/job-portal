import React from 'react';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast'; 
import LandingPage from './Pages/LandingPage';
import AuthModule from './Pages/Login-Register';
import ForgotPasswordPage from './Components/ForgotPassword.jsx';
import AdminDashboard from './Pages/AdminPages/AdminDashboard';
import UserManagementPage from './Pages/AdminPages/AdminUserManagement';
import RecruiterApprovalsPage from './Pages/AdminPages/AdminRecruiterApproval';
import AnalyticsAndReportsPage from './Pages/AdminPages/AdminAnalytics&Reports';
import StudentLayout from './Pages/StudentPages/StudentLayout';
import StudentDashboardPage from './Pages/StudentPages/StudentDashboard';
import MyProfileStandalonePage from './Pages/StudentPages/StudentProfile';
import ResumeManagerStandalonePage from './Pages/StudentPages/StudentResumeManager';
import ApplicationsStandalonePage from './Pages/StudentPages/StudentApplication';
import NotificationsStandalonePage from './Pages/StudentPages/StudentNotifications';
import RecruiterDashboardStandalonePage from './Pages/RecruiterPages/RecruiterDashboard';
import PostJobStandalonePage from './Pages/RecruiterPages/RecruiterJobPost';
import PostInternshipStandalonePage from './Pages/RecruiterPages/RecruiterPostInternship';
import ApplicationsApprovalStandalonePage from './Pages/RecruiterPages/RecruiterApplications';
import CompanyProfileStandalonePage from './Pages/RecruiterPages/RecruiterCompanyProfile';

const JobListingPage = () => (
  <div style={{ padding: '2rem', textAlign: 'center', fontSize: '1.5rem', color: '#333' }}>
    <h2>Job Listings Page Coming Soon!</h2>
    <p>This is where students can find and browse available jobs and internships.</p>
    <p>Please create the `JobListingPage.jsx` component.</p>
  </div>
);


const RootLayout = () => {
  return (
    <>
      
      <Toaster
        position="top-right"
        toastOptions={{
                    duration: 5000,
          style: {
            background: '#363636',
            color: '#fff',
          },
                    success: {
            duration: 3000,
            theme: {
              primary: 'green',
              secondary: 'black',
            },
          },
        }}
      />
      <Outlet />
    </>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
            {
        index: true,
        path: "/",
        element: <LandingPage />,
      },
      {
        index: true,
        path: "/home",
        element: <LandingPage />,
      },
      {
        path: "/login",
        element: <AuthModule />,
      },
      {
        path: "/forgot",
        element: <ForgotPasswordPage />,
      },
      {
        path: "/admin-dashboard",
        element: <AdminDashboard />
      },
      {
        path: "/admin-user-management",
        element: <UserManagementPage />
      },
      {
        path: "/admin-recruiter-approvals",
        element: <RecruiterApprovalsPage />
      },
      {
        path: "/admin-analytics-reports",
        element: <AnalyticsAndReportsPage />
      },
      {
        path: "/student-dashboard",
        element: <StudentDashboardPage />
      },
      {
        path: "/student-profile",
        element: <MyProfileStandalonePage />
      },
      {
        path: "/student-resume",
        element: <ResumeManagerStandalonePage />
      },
      {
        path: "/student-applications",
        element: <ApplicationsStandalonePage />
      },
            {
        path: "/student/job-listings",
        element: <JobListingPage />       },
      {
        path: "/student-notifications",
        element: <NotificationsStandalonePage />
      },
      {
        path: "/recruiter-dashboard",
        element: <RecruiterDashboardStandalonePage />
      },
      {
        path: "/recruiter-post-job",
        element: <PostJobStandalonePage />
      },
      {
        path: "/recruiter-post-internship",
        element: <PostInternshipStandalonePage />
      },
      {
        path: "/recruiter-applications-approval",
        element: <ApplicationsApprovalStandalonePage />
      },
      {
        path: "/recruiter-company-profile",
        element: <CompanyProfileStandalonePage />
      }
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
