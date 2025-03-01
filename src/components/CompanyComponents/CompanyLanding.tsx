import type React from "react";
import MainBg from "../../../public/Main-Bg.jpg";
import { useNavigate } from "react-router-dom";

const CompanyLanding: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="w-screen h-screen bg-[#121212] grid grid-cols-1 md:grid-cols-2 gap-6 relative">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={MainBg}
          alt="Background"
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-[#121212] bg-opacity-70"></div>
      </div>

      {/* Content Container (on top of background) */}
      <div className="relative z-10 w-full h-full flex">
        {/* Left Side - Company Name */}
        <div className="w-full flex items-center justify-center">
          <div className="p-8 text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              Next Way <span className="text-[#756dff]">Company</span>
            </h1>
          </div>
        </div>
      </div>

      {/* Right Side - Quote and Login Button */}
      <div className="relative z-10 w-full h-full flex">
        <div className="w-full flex flex-col items-center justify-center p-8">
          <blockquote className="text-xl md:text-2xl text-gray-300 italic mb-12 max-w-md">
            "Ready to find top talent for your company and and build your dream
            team faster than ever before?"
          </blockquote>

          <button
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition duration-300 shadow-lg"
            onClick={() => navigate("/company/login")}
          >
            Move to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompanyLanding;
