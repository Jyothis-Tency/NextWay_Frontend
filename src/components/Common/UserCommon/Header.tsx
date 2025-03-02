import type React from "react";
import { useState, useEffect } from "react";

import { Bell, Crown, Mail, User } from "lucide-react";
import { useSelector} from "react-redux";
import type { RootState } from "@/redux/store";
import { useNavigate, useLocation } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSocket } from "@/Context/SocketContext";

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
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [newChatMessage, setNewChatMessage] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();
  const socket = useSocket();

  const userData = useSelector((state: RootState) => state.user.userInfo);

  const firstName = userData?.firstName;
  const lastName = userData?.lastName;
  const isLoggedIn = !!userData;
  const isSubscribed = userData?.isSubscribed;
  const subFeatures = userData?.subscriptionFeatures;
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
    const storedMessageCount = localStorage.getItem("newChatMessageCount");
    if (storedMessageCount && location.pathname !== "/chat") {
      setNewChatMessage(parseInt(storedMessageCount));
    }
  }, [location.pathname]);

  // Update localStorage when newChatMessage changes
  useEffect(() => {
    if (location.pathname === "/chat") {
      setNewChatMessage(0);
      localStorage.removeItem("newChatMessageCount");
    } else {
      localStorage.setItem("newChatMessageCount", newChatMessage.toString());
    }
  }, [newChatMessage, location.pathname]);

  useEffect(() => {
    if (socket) {
      socket.on("notification:newJob", (data) => {
        console.log("New Job Notification:", data);
        let newNotification: Notification;
        if (isSubscribed && subFeatures?.includes("new_job_notification")) {
          newNotification = {
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
        } else if (
          !isSubscribed &&
          !subFeatures?.includes("new_job_notification")
        ) {
          newNotification = {
            id: Date.now(),
            type: "newJob",
            title: "New Job Posted!",
            message: `****Company is hiring for ****Job Title in ****location. Subscribe for getting updates of New Job Posts as notifications`,
            time: new Date().toLocaleString(),
            data: {
              jobId: data.job_id,
              company: data.company,
              jobTitle: data.title,
            },
          };
        }
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

      socket.on("newMessageArrived", (sender) => {
        console.log(`socket.on("newMessageArrived" on header`);
        console.log(sender);

        if (
          sender.sender !== userData?.user_id &&
          sender.user_id === userData?.user_id &&
          location.pathname !== "/chat"
        ) {
          setNewChatMessage((prev) => prev + 1);
        }
      });
    }

    return () => {
      if (socket) {
        socket.off("notification:newJob");
        socket.off("notification:applicationStatusUpdate");
        socket.off("receiveMessage");
        socket.off("newMessageArrived");
      }
    };
  }, [socket]);

  const handleNotificationClick = (notification: Notification) => {
    console.log("Notification Clicked:", notification);
    switch (notification.type) {
      case "newJob":
        // Navigate to the specific job details page
        if (notification.data.jobId) {
          navigate("/job-posts");
        }
        break;
      case "applicationStatus":
        // Navigate to the specific application in My Applications
        if (notification.data.applicationId) {
          navigate(`/my-jobs`);
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



  return (
    <header className="bg-[#1E1E1E] text-white px-6 py-4 flex items-center justify-between border-b border-[#2D2D2D] h-16 ">
      <div
        className="flex items-center space-x-2 cursor-pointer"
        onClick={() => navigate("/")}
      >
        <span className="text-2xl font-bold text-white">Next</span>
        <span className="text-2xl font-bold text-[#4F46E5]">Way</span>
        {userData?.isSubscribed && (
          <span className="text-[#E5C100] ml-2">
            <Crown size={18} />
          </span>
        )}
      </div>

      <nav className="hidden md:flex space-x-6">
        <a
          onClick={() => navigate("/")}
          className="text-[#E0E0E0] hover:text-white cursor-pointer"
        >
          Home
        </a>
        <a
          onClick={() => navigate("/job-posts")}
          className="text-[#E0E0E0] hover:text-white cursor-pointer"
        >
          Jobs
        </a>
      </nav>

      {isLoggedIn ? (
        <div className="flex items-center space-x-6">
          <Button
            variant="ghost"
            size="icon"
            className="text-[#A0A0A0] hover:text-white hover:bg-[#2D2D2D] relative"
            onClick={() => navigate("/chat")}
          >
            <Mail className="w-5 h-5" />
            {newChatMessage > 0 && (
              <span className="absolute -mx-2 -top-1 right-1 bg-[#EF4444] text-white text-xs rounded-full w-4 h-4 flex items-center justify-center text-[10px] ">
                {newChatMessage}
              </span>
            )}
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-[#A0A0A0] hover:text-white hover:bg-[#2D2D2D] relative"
              >
                <Bell className="w-5 h-5" />
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#EF4444] text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    {notifications.length}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-80 bg-[#1E1E1E] text-[#E0E0E0] border-[#2D2D2D]">
              <div className="flex justify-between items-center px-2">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                {notifications.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs text-[#6366F1] hover:text-[#4F46E5]"
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
                    className="flex flex-col items-start py-2 cursor-pointer hover:bg-[#2D2D2D]"
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <span className="font-bold">{notification.title}</span>
                    <span className="text-sm">{notification.message}</span>
                    <div className="flex justify-between items-center w-full mt-1">
                      <span className="text-xs text-[#A0A0A0]">
                        {notification.time}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs text-[#6366F1] hover:text-[#4F46E5]"
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
                className="flex items-center space-x-2 text-[#A0A0A0] hover:text-white hover:bg-[#2D2D2D]"
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
            <DropdownMenuContent className="w-56 cursor-pointer bg-[#1E1E1E] text-[#E0E0E0] border-[#2D2D2D]">
              <DropdownMenuLabel>
                {firstName} {lastName}
              </DropdownMenuLabel>
              <DropdownMenuLabel className="text-xs cursor-pointer text-[#A0A0A0]">
                Job User
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {/* <DropdownMenuItem
                onSelect={() => window.open("/company/dashboard", "_blank")}
                className="cursor-pointer"
              >
                Go to Company Section
              </DropdownMenuItem> */}
              <DropdownMenuItem
                className="cursor-pointer"
                onSelect={() => navigate("/profile")}
              >
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer"
                onSelect={() => navigate("/my-jobs")}
              >
                My Applications
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer"
                onSelect={() => navigate("/subscriptions")}
              >
                Subscription
              </DropdownMenuItem>
              {/* <DropdownMenuItem>Settings</DropdownMenuItem> */}
              {/* <DropdownMenuItem
                className="cursor-pointer"
                onSelect={handleLogout}
              >
                Logout
              </DropdownMenuItem> */}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ) : (
        <div className="flex items-center space-x-6">
          <a
            className="text-[#E0E0E0] hover:text-white cursor-pointer transition-colors duration-200 border-b border-transparent hover:border-white"
            onClick={() => navigate("/login")}
          >
            Login as User
          </a>
        </div>
      )}

    </header>
  );
};

export default Header;
