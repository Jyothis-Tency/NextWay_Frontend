import React, { useState, useEffect, useRef } from "react";
import { Bell, Mail, User, ChevronDown } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { clearUser } from "@/redux/Slices/userSlice";
// import { logoutUser } from "@/redux/slices/userSlice"; // Assuming you have this action

const Header: React.FC = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(3);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const userData = useSelector((state: RootState) => state.user.userInfo);
  const firstName = userData?.firstName;
  const lastName = userData?.lastName;
  const isLoggedIn = !!userData;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    setIsLogoutModalOpen(true);
  };

  const confirmLogout = () => {
    dispatch(clearUser());
    setIsLogoutModalOpen(false);
    navigate("../login");
  };

  return (
    <header className="bg-black text-white px-6 py-4 flex items-center justify-between border-b border-gray-800">
      <div className="flex items-center space-x-2">
        <span className="text-2xl font-bold text-white">Next</span>
        <span className="text-2xl font-bold text-red-600">Gig</span>
      </div>
      <nav className="hidden md:flex space-x-6">
        <a
          onClick={() => navigate("../home")}
          className="text-gray-300 hover:text-white cursor-pointer"
        >
          Home
        </a>
        <a
          onClick={() => navigate("../job-posts")}
          className="text-gray-300 hover:text-white cursor-pointer"
        >
          Jobs
        </a>
        {/* <a href="/companies" className="text-gray-300 hover:text-white">
          Companies
        </a> */}
        {/* <a href="/resources" className="text-gray-300 hover:text-white">
          Resources
        </a> */}
      </nav>
      {isLoggedIn ? (
        <div className="flex items-center space-x-6">
          <Mail className="w-5 h-5 text-gray-300 cursor-pointer hover:text-white" />
          <div className="relative">
            <Bell className="w-5 h-5 text-gray-300 cursor-pointer hover:text-white" />
            {notificationCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                {notificationCount}
              </span>
            )}
          </div>
          <div className="relative" ref={dropdownRef}>
            <button
              className="flex items-center space-x-2 text-gray-300 hover:text-white"
              onClick={() => setIsProfileOpen(!isProfileOpen)}
            >
              <User className="w-5 h-5" />
              <ChevronDown className="w-4 h-4" />
            </button>
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-1 z-10">
                <div className="px-4 py-2 text-sm text-gray-300">
                  {firstName} {lastName}
                </div>
                <div className="px-4 py-2 text-xs text-gray-500">Job User</div>
                {/* <a
                  className="block px-4 py-2 text-xs text-red-500 hover:bg-gray-700"
                  href="/recruiter/dashboard"
                >
                  Go to Recruiter Page
                </a> */}
                <a
                  href="/user/profile"
                  className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 cursor-pointer"
                >
                  Profile
                </a>
                <a
                  href="/user/subscriptions"
                  className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 cursor-pointer"
                >
                  Subscription
                </a>
                <a
                  href="/settings"
                  className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 cursor-pointer"
                >
                  Settings
                </a>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div>
          <a
            onClick={() => navigate("../login")}
            className="text-red-500 hover:text-red-400 cursor-pointer"
          >
            Login
          </a>
        </div>
      )}

      <Dialog open={isLogoutModalOpen} onOpenChange={setIsLogoutModalOpen}>
        <DialogContent className="sm:max-w-[425px] bg-gray-800 text-white">
          <DialogHeader>
            <DialogTitle>Confirm Logout</DialogTitle>
            <DialogDescription className="text-gray-400">
              Are you sure you want to log out?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsLogoutModalOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmLogout}>
              Logout
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </header>
  );
};

export default Header;
