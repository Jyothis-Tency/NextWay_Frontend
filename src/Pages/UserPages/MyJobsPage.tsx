import React from "react";
import MyJobs from "@/components/UserComponents/MyJobs";
import Header from "@/components/Common/UserCommon/Header";
import Footer from "@/components/Common/UserCommon/Footer";

const MyJobsPage = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <MyJobs />
      <Footer />
    </div>
  );
};

export default MyJobsPage;
