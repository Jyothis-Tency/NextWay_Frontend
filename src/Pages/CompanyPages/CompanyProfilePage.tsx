import { useState } from "react";
import { Header } from "@/components/Common/CompanyCommon/Header";
import { Footer } from "@/components/Common/CompanyCommon/Footer";
import { Sidebar } from "@/components/Common/CompanyCommon/Sidebar";
import { CompanyProfile } from "@/components/CompanyComponents/CompanyProfile";

const CompanyProfilePage = () => {
  const [currentPage] = useState("Company");
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar currentPage={currentPage} />
        <div className="flex-1 flex flex-col">
          <main className="flex-1 overflow-y-auto pt-16">
            <CompanyProfile />
          </main>
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default CompanyProfilePage;
