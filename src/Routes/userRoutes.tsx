import { Route, Routes } from "react-router-dom";
import HomePage from "@/Pages/UserPages/HomePage";
import RegisterUserPage from "@/Pages/UserPages/RegisterUserPage";
import OTPVerifyPage from "@/Pages/UserPages/OTPVerifyPage";
import LoginUserPage from "@/Pages/UserPages/LoginUserPage";
import ForgotPassword from "@/Pages/UserPages/ForgotPasswordPage";
import JobPostsPage from "@/Pages/UserPages/JobPostsPage";
import JobPostDetailedPage from "@/Pages/UserPages/JobPostDetailedPage";
import UserProfilePage from "@/Pages/UserPages/ProfilePage";
import ProfileEditPage from "@/Pages/UserPages/ProfileEditPage";
import SubscriptionsPage from "@/Pages/UserPages/SubscriptionsPage";
import UserProtector from "@/Utils/userProtector";
import MyJobsPage from "@/Pages/UserPages/MyJobsPage";

const UserRoutes = () => {
  return (
    <>
      <Routes>
        <Route path="home" element={<HomePage />} />

        <Route path="register" element={<RegisterUserPage />} />
        <Route path="otp" element={<OTPVerifyPage />} />
        <Route path="login" element={<LoginUserPage />} />
        <Route path="forgot-password" element={<ForgotPassword />} />

        <Route path="job-posts" element={<JobPostsPage />} />
        <Route path="job-post-details/:_id" element={<JobPostDetailedPage />} />
        <Route
          path="profile"
          element={
            <UserProtector>
              <UserProfilePage />
            </UserProtector>
          }
        />
        <Route
          path="profile-edit"
          element={
            <UserProtector>
              <ProfileEditPage />
            </UserProtector>
          }
        />
        <Route
          path="subscriptions"
          element={
            <UserProtector>
              <SubscriptionsPage />
            </UserProtector>
          }
        />
        <Route
          path="my-jobs"
          element={
            <UserProtector>
              <MyJobsPage />
            </UserProtector>
          }
        />
      </Routes>
    </>
  );
};

export default UserRoutes;
