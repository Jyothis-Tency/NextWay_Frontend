import { Route, Routes } from "react-router-dom";
import DashboardPage from "@/Pages/CompanyPages/DashboardPage";
import JobPostListPage from "@/Pages/CompanyPages/JobPostListPage";
import NewJobPostFormPage from "@/Pages/CompanyPages/NewJobFormPage";
import CompanyFormPage from "@/Pages/CompanyPages/CompanyProfileEditPage";
import CompanyDetailsPage from "@/Pages/CompanyPages/CompanyProfilePage";
import RegisterCompanyPage from "@/Pages/CompanyPages/RegisterCompanyPage";
import OtpVerifyPage from "@/Pages/CompanyPages/OTPVerifyPage";
import LoginCompanyPage from "@/Pages/CompanyPages/LoginCompanyPage";
import ForgotPassword from "@/Pages/CompanyPages/ForgotPasswordPage";
import CompanyProfilePage from "@/Pages/CompanyPages/CompanyProfilePage";
import CompanyProfileEditPage from "@/Pages/CompanyPages/CompanyProfileEditPage";
import CreateJobPostPage from "@/Pages/CompanyPages/CreateJobPostPage";
import JobPostDetailsPage from "@/Pages/CompanyPages/JobPostDetailsPage";
import CompanyProtector from "@/Utils/companyProtector";
import JobApplicationsListPage from "@/Pages/CompanyPages/JobApplicationsListPage";

const CompanyRoutes = () => {
  return (
    <>
      <Routes>
        <Route
          path="dashboard"
          element={
            <CompanyProtector>
              <DashboardPage />
            </CompanyProtector>
          }
        />

        <Route path="register" element={<RegisterCompanyPage />} />
        <Route path="otp" element={<OtpVerifyPage />} />
        <Route path="login" element={<LoginCompanyPage />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
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
        {/* 
        
        
        <Route path="company-form" element={<CompanyFormPage />} />
        <Route path="company-details" element={<CompanyDetailsPage />} /> */}
      </Routes>
    </>
  );
};

export default CompanyRoutes;
