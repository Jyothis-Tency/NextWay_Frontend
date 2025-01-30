import React, { useState, useEffect, useRef } from "react";

import { Bell, Mail, User } from "lucide-react";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { clearUser } from "@/redux/Slices/userSlice";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSocket } from "@/Context/SocketContext";
import { useToast } from "@/components/ui/use-toast";
import { toast } from "sonner";
import { set } from "react-hook-form";

interface Notification {
  id: number;
  type: "newJob" | "applicationStatus";
  title: string;
  message: string;
  time: string;
  data: {
    jobId?: string;
    applicationId?: string;
    company?: string;
    jobTitle?: string;
    status?: string;
  };
}

const Header: React.FC = () => {
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [newChatMessage, setNewChatMessage] = useState(0);
  const videoCallState = useSelector((state: RootState) => state.videoCall);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const socket = useSocket();

  const userData = useSelector((state: RootState) => state.user.userInfo);

  const firstName = userData?.firstName;
  const lastName = userData?.lastName;
  const isLoggedIn = !!userData;

  useEffect(() => {
    const storedNotifications = localStorage.getItem("userNotifications");
    if (storedNotifications) {
      setNotifications(JSON.parse(storedNotifications));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("userNotifications", JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    if (socket) {
      socket.on("notification:newJob", (data) => {
        console.log("New Job Notification:", data);
        const newNotification: Notification = {
          id: Date.now(),
          type: "newJob",
          title: "New Job Posted!",
          message: `${data.company} is hiring for ${data.title} in ${data.location}`,
          time: new Date().toLocaleString(),
          data: {
            jobId: data.job_id,
            company: data.company,
            jobTitle: data.title,
          },
        };
        setNotifications((prev) => [newNotification, ...prev]);

        // toast({
        //   title: newNotification.title,
        //   description: newNotification.message,
        // });
      });

      socket.on("notification:applicationStatusUpdate", (data) => {
        console.log("Application Status Notification:", data);
        const newNotification: Notification = {
          id: Date.now(),
          type: "applicationStatus",
          title: "Application Status Updated!",
          message: `Your application for ${data.jobTitle} at ${data.companyName} is now ${data.status}`,
          time: new Date().toLocaleString(),
          data: {
            applicationId: data.applicationId,
            jobId: data.jobId,
            company: data.companyName,
            jobTitle: data.jobTitle,
            status: data.status,
          },
        };
        setNotifications((prev) => [newNotification, ...prev]);

        // toast({
        //   title: newNotification.title,
        //   description: newNotification.message,
        // });
      });
      socket.on("receiveMessage", (message) => {
        console.log(`socket.on("receiveMessage" on header`);
        setNewChatMessage((prev) => prev + 1);
        
      });
    }

    return () => {
      if (socket) {
        socket.off("notification:newJob");
        socket.off("notification:applicationStatus");
      }
    };
  }, [socket]);

  const handleNotificationClick = (notification: Notification) => {
    console.log("Notification Clicked:", notification);
    switch (notification.type) {
      case "newJob":
        // Navigate to the specific job details page
        if (notification.data.jobId) {
          navigate("../job-posts");
        }
        break;
      case "applicationStatus":
        // Navigate to the specific application in My Applications
        if (notification.data.applicationId) {
          navigate(`../my-jobs`);
        }
        break;
    }
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    localStorage.setItem("userNotifications", JSON.stringify([]));
  };

  const clearNotification = (e: React.MouseEvent, id: number) => {
    e.stopPropagation(); // Prevent triggering the notification click
    const updatedNotifications = notifications.filter(
      (notification) => notification.id !== id
    );
    setNotifications(updatedNotifications);
    localStorage.setItem(
      "userNotifications",
      JSON.stringify(updatedNotifications)
    );
  };

  const handleLogout = () => {
    setIsLogoutModalOpen(true);
  };

  const confirmLogout = () => {
    dispatch(clearUser());
    setIsLogoutModalOpen(false);
    navigate("../login");
  };

  return (
    <header className="bg-[#0a0a0a] text-white px-6 py-4 flex items-center justify-between border-b border-gray-800 h-16">
      <div
        className="flex items-center space-x-2 cursor-pointer"
        onClick={() => navigate("../home")}
      >
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
      </nav>

      {isLoggedIn ? (
        <div className="flex items-center space-x-6">
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-400 hover:text-white hover:bg-gray-800 relative"
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
                <DropdownMenuItem disabled>
                  No new notifications
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center space-x-2 text-gray-400 hover:text-white hover:bg-gray-800"
              >
                {userData?.profileImage ? (
                  <Avatar className="w-7 h-7">
                    <AvatarImage src={userData.profileImage} alt="Profile" />
                    <AvatarFallback>
                      <User className="w-3 h-3" />
                    </AvatarFallback>
                  </Avatar>
                ) : (
                  <User className="w-5 h-5" />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-gray-800 text-gray-300 border-gray-700">
              <DropdownMenuLabel>
                {firstName} {lastName}
              </DropdownMenuLabel>
              <DropdownMenuLabel className="text-xs text-gray-500">
                Job User
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onSelect={() => window.open("/company/dashboard", "_blank")}
              >
                Go to Company Section
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => navigate("/user/profile")}>
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => navigate("/user/my-jobs")}>
                My Applications
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => navigate("/user/subscriptions")}
              >
                Subscription
              </DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem onSelect={handleLogout}>
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ) : (
        <div className="flex items-center space-x-6">
          <a
            className="text-gray-300 hover:text-white cursor-pointer transition-colors duration-200 border-b border-transparent hover:border-white"
            onClick={() => navigate("../login")}
          >
            Login as User
          </a>
          <span className="text-gray-500">|</span>
          <a
            className="text-gray-300 hover:text-white cursor-pointer transition-colors duration-200 border-b border-transparent hover:border-white"
            onClick={() => window.open("/company/login", "_blank")}
          >
            Login as Company
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

export default Header;
