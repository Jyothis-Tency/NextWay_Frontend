import { RootState } from "@/redux/store";
import React, { useState } from "react";
import { Mail, Bell, User, ChevronDown } from "react-feather";
import { useSelector } from "react-redux";

const Header: React.FC = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);

    const userName = useSelector(
      (state: RootState) => state.user.userInfo?.firstName
    );

  return (
    <header className="bg-black text-white px-6 py-4 flex items-center justify-between border-b border-gray-800">
      {/* Logo */}
      <div className="flex items-center space-x-2">
        <span className="text-2xl font-bold text-white">Work</span>
        <span className="text-2xl font-bold text-red-600">IT</span>
      </div>

      {/* Breadcrumbs */}
      <nav className="hidden md:flex space-x-6">
        <a href="/" className="text-gray-300 hover:text-white">
          Home
        </a>
        <a href="/jobs" className="text-gray-300 hover:text-white">
          Jobs
        </a>
        <a href="/companies" className="text-gray-300 hover:text-white">
          Companies
        </a>
        <a href="/resources" className="text-gray-300 hover:text-white">
          Resources
        </a>
      </nav>

      {/* Right side icons */}
      <div className="flex items-center space-x-6">
        <Mail className="w-5 h-5 text-gray-300 cursor-pointer hover:text-white" />
        <Bell className="w-5 h-5 text-gray-300 cursor-pointer hover:text-white" />
        <div className="relative">
          <button
            className="flex items-center space-x-2 text-gray-300 hover:text-white"
            onClick={() => setIsProfileOpen(!isProfileOpen)}
          >
            <User className="w-5 h-5" />
            <ChevronDown className="w-4 h-4" />
          </button>
          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-1 z-10">
              <div className="px-4 py-2 text-sm text-gray-300">{ userName}</div>
              <div className="px-4 py-2 text-xs text-gray-500">Job Seeker</div>
              <a className="px-4 py-2 text-xs text-gray-500" href="/recruiter/dashboard">Go toRecruiter</a>
              <a
                href="/profile"
                className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
              >
                Profile
              </a>
              <a
                href="/settings"
                className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
              >
                Settings
              </a>
              <a
                href="/logout"
                className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
              >
                Logout
              </a>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
