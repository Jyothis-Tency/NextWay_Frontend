"use client";

import React, { useState } from "react";
import { Header } from "../Common/CompanyCommon/Header";
import { Sidebar } from "../Common/CompanyCommon/Sidebar";
import { DashboardContent } from "../Common/CompanyCommon/Dashboard-Contents";
import { Footer } from "../Common/CompanyCommon/Footer";

const RecruiterDashboard: React.FC = () => {
  const [currentPage, setCurrentPage] = useState("Dashboard");

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar currentPage={currentPage} />
        <div className="flex-1 flex flex-col">
          <main className="flex-1 overflow-y-auto pt-16">
            <DashboardContent />
          </main>
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default RecruiterDashboard;
