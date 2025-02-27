import AdminDashBoardPage from "@/Pages/AdminPages/AdminDashBoardPage";
import CompanyListPage from "@/Pages/AdminPages/CompanyList";
import AdminLoginPage from "@/Pages/AdminPages/LoginPage";
import UserListPage from "@/Pages/AdminPages/UserListPage";
import SubscriptionsPage from "@/Pages/AdminPages/SubscriptionsPage";
import AdminProtector from "@/Utils/adminProtector";
import React from "react";
import { Route, Routes } from "react-router-dom";
import CompanyDetailedPage from "@/Pages/AdminPages/CompanyDetailedPage";
import Error404 from "@/components/Common/Error/admin404error";

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
          path="company-detailed/:company_id"
          element={
            <AdminProtector>
              <CompanyDetailedPage />
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

        <Route path="*" element={<Error404 />} />
      </Routes>
    </>
  );
};

export default AdminRoutes;
