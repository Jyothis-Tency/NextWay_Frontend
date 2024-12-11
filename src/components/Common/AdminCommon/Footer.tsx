import React from "react";
import { Heart } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#0f1117] text-gray-400 py-4 px-6 border-t border-gray-800 ml-64">
      <div className="container mx-auto flex justify-between items-center">
        <p>&copy; 2023 NextGig Admin. All rights reserved.</p>
        <div className="flex items-center space-x-2">
          <span>Made with</span>
          <Heart className="w-4 h-4 text-red-500" />
          <span>by NextGig Team</span>
        </div>
      </div>
    </footer>
  );
};
