"use client";

import React, { useState } from "react";
import { Bell, Mail, User, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { useNavigate } from "react-router-dom";
import { clearCompany } from "@/redux/Slices/companySlice"; // Assuming you have this action

export const Header: React.FC = () => {
  const [notificationCount, setNotificationCount] = useState(3);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userName = useSelector(
    (state: RootState) => state.company.companyInfo?.name
  );

  const handleLogout = () => {
    setIsLogoutModalOpen(true);
  };

  const confirmLogout = () => {
    dispatch(clearCompany());
    setIsLogoutModalOpen(false);
    navigate("../login");
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a] text-white px-6 py-4 flex items-center justify-between border-b border-gray-800 h-16">
      <div className="flex items-center space-x-2">
        <span className="text-2xl font-bold text-white">Next</span>
        <span className="text-2xl font-bold text-red-600">Gig</span>
        <span className="text-sm font-semibold text-gray-400 ml-2">
          Company
        </span>
      </div>
      <div className="flex items-center space-x-6">
        <Button
          variant="ghost"
          size="icon"
          className="text-gray-400 hover:text-white hover:bg-gray-800"
        >
          <Mail className="w-5 h-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="text-gray-400 hover:text-white hover:bg-gray-800 relative"
        >
          <Bell className="w-5 h-5" />
          {notificationCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
              {notificationCount}
            </span>
          )}
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center space-x-2 text-gray-400 hover:text-white hover:bg-gray-800"
            >
              <User className="w-5 h-5" />
              <ChevronDown className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 bg-gray-800 text-gray-300 border-gray-700">
            <DropdownMenuLabel>{userName}</DropdownMenuLabel>
            <DropdownMenuLabel className="text-xs text-gray-500">
              Recruiter
            </DropdownMenuLabel>
            {/* <a className="px-4 py-2 text-xs text-red-500" href="/">
              Go to Seeker
            </a> */}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate("../profile")}>
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem onSelect={handleLogout}>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

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
