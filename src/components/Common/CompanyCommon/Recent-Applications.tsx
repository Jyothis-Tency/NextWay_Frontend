import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const recentApplications = [
  {
    id: 1,
    name: "Alice Johnson",
    role: "Frontend Developer",
    company: "TechCorp",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 2,
    name: "Bob Smith",
    role: "UX Designer",
    company: "DesignHub",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 3,
    name: "Charlie Brown",
    role: "Backend Engineer",
    company: "DataSystems",
    avatar: "/placeholder.svg?height=40&width=40",
  },
];

export const RecentApplications: React.FC = () => {
  return (
    <Card className="bg-[#0f1117] border border-red-500 hover:border-red-400 transition-colors">
      <CardHeader>
        <CardTitle className="text-white">Recent Applications</CardTitle>
        <CardDescription className="text-gray-400">
          Latest candidates who applied
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {recentApplications.map((application) => (
            <li key={application.id} className="flex items-center space-x-4">
              <Avatar>
                <AvatarImage src={application.avatar} alt={application.name} />
                <AvatarFallback>
                  {application.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium text-white">
                  {application.name}
                </p>
                <p className="text-xs text-gray-400">
                  {application.role} at {application.company}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};
