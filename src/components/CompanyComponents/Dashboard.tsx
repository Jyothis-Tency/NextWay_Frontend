"use client";

import React, { useState } from "react";
import { Header } from "../Common/RecruiterCommon/Header";
import { Sidebar } from "../Common/RecruiterCommon/Sidebar";
import { DashboardContent } from "../Common/RecruiterCommon/Dashboard-Contents";
import { Footer } from "../Common/RecruiterCommon/Footer";

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
