"use client";

import React, { useEffect, useState } from "react";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { useNavigate } from "react-router-dom";
import { clearCompany } from "@/redux/Slices/companySlice";
import io from "socket.io-client";

interface Notification {
  id: number;
  message: string;
  timestamp: string;
}

export const Header: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const companyData = useSelector(
    (state: RootState) => state.company.companyInfo
  );

  useEffect(() => {
    const socket = io("http://localhost:3000");

    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
    });

    socket.on("disconnect", (reason) => {
      console.log("Socket disconnected:", reason);
    });

    socket.on("jobApplicationSubmitted", (data) => {
      console.log("Job application submitted event received:", data);

      setNotifications((prevNotifications) => [
        ...prevNotifications,
        {
          id: Date.now(),
          message: data.message,
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
    });

    const storedNotifications = localStorage.getItem("notifications");
    if (storedNotifications) {
      setNotifications(JSON.parse(storedNotifications));
    }

    return () => {
      socket.disconnect();
      console.log("Socket disconnected on cleanup");
    };
  }, []);

  useEffect(() => {
    localStorage.setItem("notifications", JSON.stringify(notifications));
  }, [notifications]);

  const handleLogout = () => {
    setIsLogoutModalOpen(true);
  };

  const confirmLogout = () => {
    dispatch(clearCompany());
    setIsLogoutModalOpen(false);
    navigate("../login");
  };

  const clearNotification = (id: number) => {
    setNotifications(
      notifications.filter((notification) => notification.id !== id)
    );
    const updatedNotifications = notifications.filter(
      (notification) => notification.id !== id
    );
    localStorage.setItem("notifications", JSON.stringify(updatedNotifications));
  };

  return (
    <header className="bg-[#0a0a0a] text-white px-6 py-4 flex items-center justify-between border-b border-gray-800 h-16">
      <div
        className="flex items-center space-x-2 cursor-pointer"
        onClick={() => navigate("../dashboard")}
      >
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
          onClick={() => navigate("../chat")}
        >
          <Mail className="w-5 h-5" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-400 hover:text-white hover:bg-gray-800 relative"
            >
              <Bell className="w-5 h-5" />
              {notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {notifications.length}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-80 bg-gray-800 text-gray-300 border-gray-700">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <DropdownMenuItem
                  key={notification.id}
                  className="flex flex-col items-start py-2"
                >
                  <span className="text-sm">{notification.message}</span>
                  <span className="text-xs text-gray-500">
                    {notification.timestamp}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-1 text-xs text-red-400 hover:text-red-300"
                    onClick={() => clearNotification(notification.id)}
                  >
                    Clear
                  </Button>
                </DropdownMenuItem>
              ))
            ) : (
              <DropdownMenuItem disabled>No new notifications</DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center space-x-2 text-gray-400 hover:text-white hover:bg-gray-800"
            >
              {companyData?.profileImage ? (
                <Avatar className="w-7 h-7">
                  <AvatarImage src={companyData.profileImage} alt="Profile" />
                  <AvatarFallback>
                    <User className="w-3 h-3" />
                  </AvatarFallback>
                </Avatar>
              ) : (
                <User className="w-5 h-5" />
              )}
              {/* <ChevronDown className="w-4 h-4" /> */}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 bg-gray-800 text-gray-300 border-gray-700">
            <DropdownMenuLabel>{companyData?.name}</DropdownMenuLabel>
            <DropdownMenuLabel className="text-xs text-gray-500">
              Recruiter
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
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
