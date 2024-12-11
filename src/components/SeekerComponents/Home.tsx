import React from "react";
import Header from "../Common/UserCommon/Header";
import WelcomeSection from "../Common/UserCommon/Welcome";
import SearchSection from "../Common/UserCommon/Search";
import About from "../Common/UserCommon/About";
import RecommendedJobs from "../Common/UserCommon/RecommendJobs";
import Statistics from "../Common/UserCommon/Statistics";
import TopCompanies from "../Common/UserCommon/Companies";
import FAQ from "../Common/UserCommon/FAQ";
import Footer from "../Common/UserCommon/Footer";

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-black text-white scrollbar-thin scrollbar-thumb-scroll-thumb scrollbar-track-scroll-track scrollbar-thumb-rounded-md scrollbar-track-rounded-md">
      <Header />
      <main className="space-y-12">
        <WelcomeSection />
        <div className="container mx-auto px-4 max-w-7xl">
          <About />
          <RecommendedJobs />
          <Statistics />
          <TopCompanies />
          <FAQ />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Home;
