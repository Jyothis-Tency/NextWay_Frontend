import React from "react";
import { LayoutDashboard, Users, Building,DollarSign } from "lucide-react";

export const Sidebar: React.FC = () => {
  const sidebarContents = [
    { icon: LayoutDashboard, label: "Dashboard", path: "./dashboard" },
    { icon: Users, label: "Users", path: "./user-list" },
    { icon: Building, label: "Companies", path: "./company-list" },
    { icon: DollarSign, label: "Subscriptions", path: "./subscriptions" },
  ];

  return (
    <aside className="fixed top-16 left-0 bg-[#0f1117] w-64 h-[calc(100vh-4rem)] overflow-y-auto border-r border-gray-800">
      <nav className="space-y-1 p-4">
        {sidebarContents.map((item, index) => (
          <a
            key={index}
            href={item.path}
            className={`flex items-center w-full px-2 py-2 text-sm font-medium rounded-md text-gray-400 hover:text-white hover:bg-gray-800`}
          >
            <item.icon className="mr-3 h-6 w-6" />
            {item.label}
          </a>
        ))}
      </nav>
    </aside>
  );
};
