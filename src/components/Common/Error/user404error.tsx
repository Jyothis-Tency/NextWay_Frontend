import { RootState } from "@/redux/store";
import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Error404: React.FC = () => {
  const userData = useSelector((state: RootState) => state.user.userInfo?.user_id);
  const navigate = useNavigate();

  const navigateToHome = () => {
    if (userData) {
      navigate("/");
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-[#121212] relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="w-full h-full bg-[url('/placeholder.svg?height=1080&width=1920')] bg-cover bg-center opacity-30" />
        <div className="absolute inset-0 bg-[#121212] bg-opacity-70"></div>
      </div>

      <div className="z-10 w-full max-w-md">
        <div className="flex justify-center mb-6">
          <div className="flex items-center space-x-2">
            <span className="text-3xl font-bold text-white">Next</span>
            <span className="text-3xl font-bold text-[#4F46E5]">Way</span>
          </div>
        </div>

        <div className="bg-[#1E1E1E] bg-opacity-50 p-8 rounded-lg border-2 border-[#4F46E5] shadow-lg shadow-[#4F46E5]/50">
          <h1 className="mb-2 text-center text-7xl font-bold text-[#4F46E5]">
            404
          </h1>

          <h2 className="mb-6 text-center text-2xl font-semibold text-white">
            Page Not Found
          </h2>

          <p className="text-center text-[#E0E0E0] mb-8">
            The page you are looking for doesn't exist or has been moved.
          </p>

          <a
            onClick={() => navigateToHome()}
            className="block w-full bg-[#4F46E5] hover:bg-[#4338CA] text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline text-center transition-colors duration-300"
          >
            {userData ? "Back to Home" : "Go to Login"}
          </a>
        </div>
      </div>
    </div>
  );
};

export default Error404;
