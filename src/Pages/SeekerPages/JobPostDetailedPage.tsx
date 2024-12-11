import React from "react";
import JobPostDetailed from "@/components/SeekerComponents/JobPostDetailed";
import Header from "../../components/Common/UserCommon/Header";
import Footer from "../../components/Common/UserCommon/Footer";

const JobPostDetailedPage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-black">
      <Header />
      <main className="flex-grow">
        <JobPostDetailed />
      </main>
      <Footer />
    </div>
  );
};

export default JobPostDetailedPage;
