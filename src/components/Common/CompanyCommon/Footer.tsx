import type React from "react";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#121212] text-[#A0A0A0] py-4 px-4 md:px-6 border-t border-[#4B5563] ml-0 md:ml-64">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
        <p className="text-sm md:text-base">
          &copy; 2024 NextWay Company. All rights reserved.
        </p>
        <div className="flex items-center space-x-2">
        </div>
      </div>
    </footer>
  );
};
