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
import UserPublicOnlyProtector from "@/Utils/userPublicOnlyRoute";
import MyJobsPage from "@/Pages/UserPages/MyJobsPage";
import UserChatPage from "@/Pages/UserPages/UserChatPage";
import VideoCallUserPage from "@/Pages/UserPages/VideoCallUserPage";
import { AnimatePresence } from "framer-motion";
import InterviewModal from "../components/Common/CompanyCommon/IncomingInterViewModal";
import CompanyDetailedPage from "@/Pages/UserPages/CompanyDetailedPage";
import Error404 from "@/components/Common/Error/user404error";

const UserRoutes = () => {
  return (
    <>
      <AnimatePresence>
        <InterviewModal />
      </AnimatePresence>
      <Routes>
        <Route path="" element={<HomePage />} />

        <Route
          path="register"
          element={
            <UserPublicOnlyProtector>
              <RegisterUserPage />
            </UserPublicOnlyProtector>
          }
        />
        <Route
          path="otp"
          element={
            <UserPublicOnlyProtector>
              <OTPVerifyPage />
            </UserPublicOnlyProtector>
          }
        />
        <Route
          path="login"
          element={
            <UserPublicOnlyProtector>
              <LoginUserPage />
            </UserPublicOnlyProtector>
          }
        />
        <Route
          path="forgot-password"
          element={
            <UserPublicOnlyProtector>
              <ForgotPassword />
            </UserPublicOnlyProtector>
          }
        />

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
        <Route
          path="chat"
          element={
            <UserProtector>
              <UserChatPage />
            </UserProtector>
          }
        />
        <Route
          path="video-call"
          element={
            <UserProtector>
              <VideoCallUserPage />
            </UserProtector>
          }
        />
        <Route
          path="company-profile/:company_id"
          element={
            <UserPublicOnlyProtector>
              <CompanyDetailedPage />
            </UserPublicOnlyProtector>
          }
        />
        <Route path="*" element={<Error404 />} />
      </Routes>
    </>
  );
};

export default UserRoutes;
