import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar } from "lucide-react";

const upcomingInterviews = [
  {
    id: 1,
    candidate: "David Lee",
    role: "Product Manager",
    date: "2023-07-15",
    time: "10:00 AM",
  },
  {
    id: 2,
    candidate: "Emma Wilson",
    role: "Data Scientist",
    date: "2023-07-16",
    time: "2:00 PM",
  },
  {
    id: 3,
    candidate: "Frank Taylor",
    role: "DevOps Engineer",
    date: "2023-07-17",
    time: "11:30 AM",
  },
];

export const UpcomingInterviews: React.FC = () => {
  return (
    <Card className="bg-[#0f1117] border border-red-500 hover:border-red-400 transition-colors">
      <CardHeader>
        <CardTitle className="text-white">Upcoming Interviews</CardTitle>
        <CardDescription className="text-gray-400">
          Scheduled interviews for the next few days
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {upcomingInterviews.map((interview) => (
            <li key={interview.id} className="flex items-center space-x-4">
              <Calendar className="text-red-500" />
              <div>
                <p className="text-sm font-medium text-white">
                  {interview.candidate}
                </p>
                <p className="text-xs text-gray-400">{interview.role}</p>
                <p className="text-xs text-gray-400">
                  {interview.date} at {interview.time}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};
