import type React from "react";
import { useState } from "react";
import {
  LayoutDashboard,
  Briefcase,
  Users,
  Building,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const Sidebar: React.FC<{ currentPage: string }> = ({ currentPage }) => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const sidebarContents = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/company/dashboard" },
    { icon: Building, label: "Company", path: "/company/profile" },
    { icon: Briefcase, label: "Job Posts", path: "/company/job-post-list" },
    {
      icon: Users,
      label: "Applications",
      path: "/company/job-applications-list",
    },
    // { icon: Calendar, label: "Interviews", path: "/recruiter/interviews" },

    // {
    //   icon: CreditCard,
    //   label: "Subscription",
    //   path: "/recruiter/subscription",
    // },
    // { icon: Settings, label: "Settings", path: "/recruiter/settings" },
    // { icon: HelpCircle, label: "Help", path: "/recruiter/help" },
  ];

  return (
    <>
      <button
        className="md:hidden fixed top-20 left-4 z-30 bg-[#4F46E5] text-white p-2 rounded-full"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>
      <aside
        className={`fixed top-16 left-0 bg-[#1E1E1E] w-64 h-[calc(100vh-4rem)] overflow-y-auto border-r border-[#4B5563] z-20 transition-transform duration-300 ease-in-out transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        <nav className="space-y-1 p-4">
          {sidebarContents.map((item, index) => (
            <Button
              key={index}
              variant="ghost"
              onClick={() => navigate(item.path)}
              className={`w-full justify-start text-[#E0E0E0] hover:text-[#FFFFFF] hover:bg-[#2D2D2D] ${
                currentPage.toLowerCase() === item.label.toLowerCase()
                  ? "bg-[#4F46E5] text-[#FFFFFF]"
                  : ""
              }`}
            >
              <item.icon className="mr-2 h-4 w-4" />
              {item.label}
            </Button>
          ))}
        </nav>
      </aside>
    </>
  );
};
