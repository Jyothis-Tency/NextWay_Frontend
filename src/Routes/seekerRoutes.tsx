import { Route, Routes } from "react-router-dom";
import HomePage from "@/Pages/SeekerPages/HomePage";
import RegisterSeekerPage from "@/Pages/SeekerPages/RegisterSeekerPage";
import OTPVerifyPage from "@/Pages/SeekerPages/OTPVerifyPage";
import LoginSeekerPage from "@/Pages/SeekerPages/LoginSeekerPage";
import ForgotPassword from "@/Pages/SeekerPages/ForgotPasswordPage";
import JobPostsPage from "@/Pages/SeekerPages/JobPostsPage";
import JobPostDetailedPage from "@/Pages/SeekerPages/JobPostDetailedPage";
import SeekerProfilePage from "@/Pages/SeekerPages/ProfilePage";
import ProfileEditPage from "@/Pages/SeekerPages/ProfileEditPage";
import SeekerProtector from "@/Utils/seekerProtector";

const SeekerRoutes = () => {
  return (
    <>
      <Routes>
        <Route path="home" element={<HomePage />} />

        <Route path="register" element={<RegisterSeekerPage />} />
        <Route path="otp" element={<OTPVerifyPage />} />
        <Route path="login" element={<LoginSeekerPage />} />
        <Route path="forgot-password" element={<ForgotPassword />} />

        <Route path="job-posts" element={<JobPostsPage />} />
        <Route path="job-post-details/:_id" element={<JobPostDetailedPage />} />
        <Route
          path="profile"
          element={
            <SeekerProtector>
              <SeekerProfilePage />
            </SeekerProtector>
          }
        />
        <Route
          path="profile-edit"
          element={
            <SeekerProtector>
              <ProfileEditPage />
            </SeekerProtector>
          }
        />
      </Routes>
    </>
  );
};

export default SeekerRoutes;
