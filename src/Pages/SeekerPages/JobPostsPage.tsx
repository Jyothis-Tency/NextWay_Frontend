import React from "react";
import JobPosts from "../../components/SeekerComponents/JobPosts";
import Header from "../../components/Common/UserCommon/Header";
import Footer from "../../components/Common/UserCommon/Footer";

const JobPostsPage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-black">
      <Header />
      <main className="flex-grow">
        <JobPosts />
      </main>
      <Footer />
    </div>
  );
};

export default JobPostsPage;
