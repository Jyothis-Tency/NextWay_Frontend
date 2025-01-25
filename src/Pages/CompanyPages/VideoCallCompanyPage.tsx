import React from "react";
import VideoCallCompany from "@/components/CompanyComponents/VideoCallCompany";
import { Header } from "@/components/Common/CompanyCommon/Header";
import Footer from "../../components/Common/UserCommon/Footer";

const VideoCallCompanyPage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-black">
      <Header />
      <main className="flex-grow">
        <VideoCallCompany />
      </main>
  
    </div>
  );
};

export default VideoCallCompanyPage;
