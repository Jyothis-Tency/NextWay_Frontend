import React from "react";
import {
  LayoutDashboard,
  Briefcase,
  Users,
  Calendar,
  Building,
  CreditCard,
  Settings,
  HelpCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const Sidebar: React.FC<{ currentPage: string }> = ({ currentPage }) => {
  const navigate = useNavigate();

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
    <aside className="fixed top-16 left-0 bg-[#0f1117] w-64 h-[calc(100vh-4rem)] overflow-y-auto border-r border-gray-800">
      <nav className="space-y-1 p-4">
        {sidebarContents.map((item, index) => (
          <Button
            key={index}
            variant="ghost"
            onClick={() => navigate(item.path)}
            className={`w-full justify-start text-gray-400 hover:text-white hover:bg-gray-800 ${
              currentPage.toLowerCase() === item.label.toLowerCase()
                ? "bg-red-500 text-white"
                : ""
            }`}
          >
            <item.icon className="mr-2 h-4 w-4" />
            {item.label}
          </Button>
        ))}
      </nav>
    </aside>
  );
};
