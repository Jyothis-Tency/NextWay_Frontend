import React, { useState } from "react";
import { Header } from "@/components/Common/RecruiterCommon/Header";
import { Footer } from "@/components/Common/RecruiterCommon/Footer";
import { Sidebar } from "@/components/Common/RecruiterCommon/Sidebar";
import { JobApplicationByPosts } from "@/components/CompanyComponents/JobApplicationByPosts";

const JobApplicationByPostsPage = () => {
  const [currentPage, setCurrentPage] = useState("Job Posts");
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar currentPage={currentPage} />
        <div className="flex-1 flex flex-col">
          <main className="flex-1 overflow-y-auto pt-16">
            <JobApplicationByPosts />
          </main>
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default JobApplicationByPostsPage;
