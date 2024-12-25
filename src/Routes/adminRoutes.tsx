import AdminDashBoardPage from "@/Pages/AdminPages/AdminDashBoardPage";
import CompanyListPage from "@/Pages/AdminPages/CompanyList";
import AdminLoginPage from "@/Pages/AdminPages/LoginPage";
import UserListPage from "@/Pages/AdminPages/UserListPage";
import SubscriptionsPage from "@/Pages/AdminPages/SubscriptionsPage";
import AdminProtector from "@/Utils/adminProtector";
import React from "react";
import { Route, Routes } from "react-router-dom";

const AdminRoutes: React.FC = () => {
  return (
    <>
      <Routes>
        <Route path="login" element={<AdminLoginPage />} />

        <Route
          path="dashboard"
          element={
            <AdminProtector>
              <AdminDashBoardPage />
            </AdminProtector>
          }
        />
        <Route
          path="user-list"
          element={
            <AdminProtector>
              <UserListPage />
            </AdminProtector>
          }
        />
        <Route
          path="company-list"
          element={
            <AdminProtector>
              <CompanyListPage />
            </AdminProtector>
          }
        />
        <Route
          path="subscriptions"
          element={
            <AdminProtector>
              <SubscriptionsPage />
            </AdminProtector>
          }
        />
      </Routes>
    </>
  );
};

export default AdminRoutes;
