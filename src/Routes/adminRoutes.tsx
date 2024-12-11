import AdminDashBoardPage from "@/Pages/AdminPages/AdminDashBoardPage";
import CompanyListPage from "@/Pages/AdminPages/CompanyList";
import AdminLoginPage from "@/Pages/AdminPages/LoginPage";
import SeekerListPage from "@/Pages/AdminPages/SeekerListPage";
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
          path="seeker-list"
          element={
            <AdminProtector>
              <SeekerListPage />
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
      </Routes>
    </>
  );
};

export default AdminRoutes;
