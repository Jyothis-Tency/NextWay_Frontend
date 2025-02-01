import { Route, Routes } from "react-router-dom";
import CompanyDashboard from "@/Pages/CompanyPages/DashboardPage";
import JobPostListPage from "@/Pages/CompanyPages/JobPostListPage";
import RegisterCompanyPage from "@/Pages/CompanyPages/RegisterCompanyPage";
import OtpVerifyPage from "@/Pages/CompanyPages/OTPVerifyPage";
import LoginCompanyPage from "@/Pages/CompanyPages/LoginCompanyPage";
import ForgotPassword from "@/Pages/CompanyPages/ForgotPasswordPage";
import CompanyProfilePage from "@/Pages/CompanyPages/CompanyProfilePage";
import CompanyProfileEditPage from "@/Pages/CompanyPages/CompanyProfileEditPage";
import CreateJobPostPage from "@/Pages/CompanyPages/CreateJobPostPage";
import JobPostDetailsPage from "@/Pages/CompanyPages/JobPostDetailsPage";
import CompanyProtector from "@/Utils/companyProtector";
import CompanyPublicOnlyProtector from "@/Utils/companyPublicOnlyRoute";
import JobApplicationsListPage from "@/Pages/CompanyPages/JobApplicationsListPage";
import JobApplicationByPostsPage from "@/Pages/CompanyPages/JobApplicationByPostsPage";
import JobApplicationDetailedPage from "@/Pages/CompanyPages/JobApplicationDetailedPage";
import CompanyChatPage from "@/Pages/CompanyPages/CompanyChatPage";
import VideoCallCompanyPage from "@/Pages/CompanyPages/VideoCallCompanyPage";

const CompanyRoutes = () => {
  return (
    <>
      <Routes>
        <Route
          path="dashboard"
          element={
            <CompanyProtector>
              <CompanyDashboard />
            </CompanyProtector>
          }
        />

        <Route
          path="register"
          element={
            <CompanyPublicOnlyProtector>
              <RegisterCompanyPage />
            </CompanyPublicOnlyProtector>
          }
        />
        <Route
          path="otp"
          element={
            <CompanyPublicOnlyProtector>
              <OtpVerifyPage />
            </CompanyPublicOnlyProtector>
          }
        />
        <Route
          path="login"
          element={
            <CompanyPublicOnlyProtector>
              <LoginCompanyPage />
            </CompanyPublicOnlyProtector>
          }
        />
        <Route
          path="forgot-password"
          element={
            <CompanyPublicOnlyProtector>
              <ForgotPassword />
            </CompanyPublicOnlyProtector>
          }
        />
        <Route
          path="profile"
          element={
            <CompanyProtector>
              <CompanyProfilePage />
            </CompanyProtector>
          }
        />
        <Route
          path="profile-edit"
          element={
            <CompanyProtector>
              <CompanyProfileEditPage />
            </CompanyProtector>
          }
        />
        <Route
          path="create-job-post"
          element={
            <CompanyProtector>
              <CreateJobPostPage />
            </CompanyProtector>
          }
        />
        <Route
          path="job-post-list"
          element={
            <CompanyProtector>
              <JobPostListPage />
            </CompanyProtector>
          }
        />
        <Route
          path="job-post-details/:jobId"
          element={
            <CompanyProtector>
              <JobPostDetailsPage />
            </CompanyProtector>
          }
        />
        <Route
          path="job-applications-list"
          element={
            <CompanyProtector>
              <JobApplicationsListPage />
            </CompanyProtector>
          }
        />
        <Route
          path="job-applications-by-post/:jobId"
          element={
            <CompanyProtector>
              <JobApplicationByPostsPage />
            </CompanyProtector>
          }
        />
        <Route
          path="job-application-detailed/:applicationId"
          element={
            <CompanyProtector>
              <JobApplicationDetailedPage />
            </CompanyProtector>
          }
        />
        <Route
          path="chat"
          element={
            <CompanyProtector>
              <CompanyChatPage />
            </CompanyProtector>
          }
        />
        <Route
          path="video-call"
          element={
            <CompanyProtector>
              <VideoCallCompanyPage />
            </CompanyProtector>
          }
        />
        {/* 
        
        
        <Route path="company-form" element={<CompanyFormPage />} />
        <Route path="company-details" element={<CompanyDetailsPage />} /> */}
      </Routes>
    </>
  );
};

export default CompanyRoutes;
