import React from "react";
import { UserChatInterface } from "@/components/UserComponents/userChat";
import Header from "@/components/Common/UserCommon/Header";

const UserChatPage: React.FC = () => {
  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex-1 overflow-hidden">
        <UserChatInterface />
      </div>
    </div>
  );
};

export default UserChatPage;
