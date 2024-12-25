import React from "react";
import Subscriptions from "@/components/UserComponents/Subscriptions";
import Header from "@/components/Common/UserCommon/Header";
import Footer from "@/components/Common/UserCommon/Footer";

const SubscriptionsPage = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <Subscriptions />
      <Footer />
    </div>
  );
};

export default SubscriptionsPage;
