import React from "react";
import { CompanyChatInterface } from "@/components/CompanyComponents/companyChat";
import { Header } from "@/components/Common/CompanyCommon/Header";

const CompanyChatPage: React.FC = () => {
  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex-1 overflow-hidden">
        <CompanyChatInterface />
      </div>
    </div>
  );
};

export default CompanyChatPage;
