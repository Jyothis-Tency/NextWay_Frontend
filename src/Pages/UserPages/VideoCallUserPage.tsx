import React from "react";
import VideoCallUser from "@/components/UserComponents/VideoCallUser";
import Header from "../../components/Common/UserCommon/Header";
import Footer from "../../components/Common/UserCommon/Footer";

const VideoCallUserPage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-black">
      <Header />
      <main className="flex-grow">
        <VideoCallUser />
      </main>
      <Footer />
    </div>
  );
};

export default VideoCallUserPage;
