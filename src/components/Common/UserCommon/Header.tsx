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
// import { logoutUser } from "@/redux/slices/userSlice"; // Assuming you have this action

const Header: React.FC = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(3);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const socket = useSocket();
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<
    Array<{
      title: string;
      message: string;
      time: Date;
    }>
  >([]);

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

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on("notification:newJob", (data) => {
        const newNotification = {
          title: "New Job Posted!",
          message: `${data.company} is hiring for ${data.title} in ${data.location}`,
          time: new Date(),
        };
        setNotifications((prev) => [newNotification, ...prev]);
        setNotificationCount((prev) => prev + 1);

        toast({
          title: newNotification.title,
          description: newNotification.message,
        });
      });

      socket.on("notification:applicationStatus", (data) => {
        const newNotification = {
          title: "Application Status Updated!",
          message: `Your application for ${data.title} at ${data.company} is now ${data.status}`,
          time: new Date(),
        };
        setNotifications((prev) => [newNotification, ...prev]);
        setNotificationCount((prev) => prev + 1);

        toast({
          title: newNotification.title,
          description: newNotification.message,
        });
      });
    }

    return () => {
      if (socket) {
        socket.off("notification:newJob");
        socket.off("notification:applicationStatus");
      }
    };
  }, [socket]);

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

      {isLoggedIn && (
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
                {notificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    {notificationCount}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-gray-800 text-gray-300 border-gray-700">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {notifications.length > 0 ? (
                notifications.map((notification, index) => (
                  <DropdownMenuItem key={index}>
                    <div className="flex flex-col">
                      <span className="font-bold">{notification.title}</span>
                      <span className="text-sm">{notification.message}</span>
                      <span className="text-xs text-gray-500">
                        {new Date(notification.time).toLocaleString()}
                      </span>
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
