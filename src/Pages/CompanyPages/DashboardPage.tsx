import React, { useState } from "react";
import { Header } from "../../components/Common/CompanyCommon/Header";
import { Sidebar } from "../../components/Common/CompanyCommon/Sidebar";
import { Footer } from "../../components/Common/CompanyCommon/Footer";
import CompanyDashboard from "../../components/CompanyComponents/Dashboard";

const CompanyDashboardPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState("Dashboard");

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar currentPage={currentPage} />
        <div className="flex-1 flex flex-col">
          <main className="flex-1 overflow-y-auto pt-16">
            <CompanyDashboard />
          </main>
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default CompanyDashboardPage;
