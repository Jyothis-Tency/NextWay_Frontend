import React from "react";
import { Button } from "@/components/ui/button";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useNavigate } from "react-router-dom";

export const WelcomeSection: React.FC = () => {
  const companyName = useSelector(
    (state: RootState) => state.company.companyInfo?.name
  );
  console.log(companyName);
  const navigate = useNavigate();
  return (
    <section
      className="relative w-full h-[400px] flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://as2.ftcdn.net/v2/jpg/08/10/92/69/1000_F_810926942_LcXpqYlTiWNcNntJpVTh8nr510jnZniK.jpg')",
      }}
    >
      <div className="absolute inset-0 bg-black opacity-90"></div>
      <div className="relative z-10 text-center space-y-6 px-4 max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-bold text-white">
          Welcome {companyName}!
        </h1>
        <p className="text-xl text-gray-300">
          Ready to find top talent for your company?
        </p>
        <Button
          className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-full text-lg"
          onClick={() => navigate("../create-job-post")}
        >
          Post a New Job
        </Button>
      </div>
    </section>
  );
};
