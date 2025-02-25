"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { Bell, Mail, User } from "lucide-react";
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
import type { RootState } from "@/redux/store";
import { useLocation, useNavigate } from "react-router-dom";
import { clearCompany } from "@/redux/Slices/companySlice";
import { useSocket } from "@/Context/SocketContext";
import { useToast } from "@/components/ui/use-toast";

import { clearTokens } from "@/redux/Slices/tokenSlice";

interface Notification {
  id: number;
  type: "jobApplicationSubmitted" | "other";
  title: string;
  message: string;
  time: string;
  data: {
    applicationId?: string;
    jobId?: string;
    applicantName?: string;
    jobTitle?: string;

    applicantEmail?: string;
  };
}

export const Header: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [newChatMessage, setNewChatMessage] = useState(0);
  const { toast } = useToast();
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const socket = useSocket();

  const companyData = useSelector(
    (state: RootState) => state.company.companyInfo
  );

  socket?.emit("join:company", companyData?.company_id);

  useEffect(() => {
    const storedNotifications = localStorage.getItem("companyNotifications");
    if (storedNotifications) {
      setNotifications(JSON.parse(storedNotifications));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("companyNotifications", JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    const storedMessageCount = localStorage.getItem("newChatMessageCount");
    if (storedMessageCount && location.pathname !== "/company/chat") {
      setNewChatMessage(parseInt(storedMessageCount));
    }
  }, [location.pathname]);

  // Update localStorage when newChatMessage changes
  useEffect(() => {
    if (location.pathname === "/company/chat") {
      setNewChatMessage(0);
      localStorage.removeItem("newChatMessageCount");
    } else {
      localStorage.setItem("newChatMessageCount", newChatMessage.toString());
    }
  }, [newChatMessage, location.pathname]);

  useEffect(() => {
    if (socket) {
      console.log("Socket connected in header:", socket.id);

      socket.on("notification:newApplication", (data) => {
        console.log("New application notification received on socket:", data);
        const newNotification: Notification = {
          id: Date.now(),
          type: "jobApplicationSubmitted",
          title: "New Job Application",
          message: `${data.applicantName} applied for ${data.jobTitle}`,
          time: new Date().toLocaleString(),
          data: {
            applicationId: data.applicationId,
            jobId: data.jobId,
            applicantName: data.applicantName,
            jobTitle: data.jobTitle,
            applicantEmail: data.applicantEmail,
          },
        };
        if (data.companyId === companyData?.company_id) {
          setNotifications((prevNotifications) => [
            newNotification,
            ...prevNotifications,
          ]);
          toast({
            title: "New Job Application",
            description: `${data.applicantName} applied for ${data.jobTitle}`,
          });
        }
      });

      socket.on("newMessageArrived", (sender) => {
        console.log(`socket.on("newMessageArrived" on header`);
        console.log(sender);
        console.log(companyData?.company_id);

        if (
          sender.sender !== companyData?.company_id &&
          sender.company_id === companyData?.company_id &&
          location.pathname !== "/company/chat"
        ) {
          setNewChatMessage((prev) => prev + 1);
        }
      });
    }
    return () => {
      if (socket) {
        socket.off("notification:newApplication");
        socket.off("receiveMessage");
        socket.off("newMessageArrived");
      }
    };
  }, [socket]);

  const handleLogout = () => {
    setIsLogoutModalOpen(true);
  };

  const confirmLogout = () => {
    dispatch(clearCompany());
    dispatch(clearTokens());
    setIsLogoutModalOpen(false);
    toast({ title: "Logging out" });
    setTimeout(() => {
      navigate("../login");
    }, 1500);
  };

  const handleNotificationClick = (notification: Notification) => {
    console.log("Notification Clicked:", notification);
    if (
      notification.type === "jobApplicationSubmitted" &&
      notification.data.applicationId
    ) {
      navigate(
        `../job-application-detailed/${notification.data.applicationId}`
      );
    }
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    localStorage.setItem("companyNotifications", JSON.stringify([]));
  };

  const clearNotification = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    const updatedNotifications = notifications.filter(
      (notification) => notification.id !== id
    );
    setNotifications(updatedNotifications);
    localStorage.setItem(
      "companyNotifications",
      JSON.stringify(updatedNotifications)
    );
  };

  return (
    <header className="bg-[#121212] text-[#FFFFFF] px-4 md:px-6 py-2 md:py-4 flex items-center justify-between border-b border-[#4B5563] h-16 fixed top-0 left-0 right-0 z-50">
      <div
        className="flex items-center space-x-2 cursor-pointer"
        onClick={() => navigate("../dashboard")}
      >
        <span className="text-2xl font-bold text-white">Next</span>
        <span className="text-2xl font-bold text-red-600">Way</span>
        <span className="text-sm font-semibold text-gray-400 ml-2">
          Company
        </span>
      </div>
      <div className="flex items-center space-x-6">
        <Button
          variant="ghost"
          size="icon"
          className="text-[#E0E0E0] hover:text-[#FFFFFF] hover:bg-[#2D2D2D] relative"
          onClick={() => navigate("../chat")}
        >
          <Mail className="w-5 h-5" />
          {newChatMessage > 0 && (
            <span className="absolute -mx-2 -top-1 right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center text-[10px] ">
              {newChatMessage}
            </span>
          )}
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="text-[#E0E0E0] hover:text-[#FFFFFF] hover:bg-[#2D2D2D] relative"
            >
              <Bell className="w-5 h-5" />
              {notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {notifications.length}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-80 bg-[#1E1E1E] text-[#E0E0E0] border-[#4B5563]">
            <div className="flex justify-between items-center px-2">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              {notifications.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs text-red-400 hover:text-red-300"
                  onClick={clearAllNotifications}
                >
                  Clear All
                </Button>
              )}
            </div>
            <DropdownMenuSeparator />
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <DropdownMenuItem
                  key={notification.id}
                  className="flex flex-col items-start py-2 cursor-pointer hover:bg-gray-700"
                  onClick={() => handleNotificationClick(notification)}
                >
                  <span className="font-bold">{notification.title}</span>
                  <span className="text-sm">{notification.message}</span>
                  <div className="flex justify-between items-center w-full mt-1">
                    <span className="text-xs text-gray-500">
                      {notification.time}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs text-red-400 hover:text-red-300"
                      onClick={(e) => clearNotification(e, notification.id)}
                    >
                      Clear
                    </Button>
                  </div>
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
              className="flex items-center space-x-2 text-[#E0E0E0] hover:text-[#FFFFFF] hover:bg-[#2D2D2D]"
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
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 bg-[#1E1E1E] text-[#E0E0E0] border-[#4B5563]">
            <DropdownMenuLabel>{companyData?.name}</DropdownMenuLabel>
            <DropdownMenuLabel className="text-xs text-gray-500">
              Recruiter
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {/* <DropdownMenuItem
              onSelect={() => window.open("/user/home", "_blank")}
            >
              Go to User Section
            </DropdownMenuItem> */}
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem onSelect={handleLogout}>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Dialog open={isLogoutModalOpen} onOpenChange={setIsLogoutModalOpen}>
        <DialogContent className="sm:max-w-[425px] bg-[#1E1E1E] text-[#FFFFFF]">
          <DialogHeader>
            <DialogTitle>Confirm Logout</DialogTitle>
            <DialogDescription className="text-gray-400">
              Are you sure you want to log out?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              className="text-black"
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
