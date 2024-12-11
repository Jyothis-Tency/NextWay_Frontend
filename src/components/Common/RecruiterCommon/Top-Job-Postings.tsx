import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const topJobPostings = [
  {
    id: 1,
    title: "Senior Frontend Developer",
    department: "Engineering",
    applicants: 45,
    daysLeft: 5,
  },
  {
    id: 2,
    title: "UX/UI Designer",
    department: "Design",
    applicants: 32,
    daysLeft: 7,
  },
  {
    id: 3,
    title: "Product Manager",
    department: "Product",
    applicants: 28,
    daysLeft: 3,
  },
  {
    id: 4,
    title: "Data Scientist",
    department: "Data",
    applicants: 39,
    daysLeft: 6,
  },
];

export const TopJobPostings: React.FC = () => {
  return (
    <Card className="bg-[#0f1117] border border-red-500 hover:border-red-400 transition-colors">
      <CardHeader>
        <CardTitle className="text-white">Top Job Postings</CardTitle>
        <CardDescription className="text-gray-400">
          Most active job listings
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {topJobPostings.map((job) => (
            <li key={job.id} className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white">{job.title}</p>
                <p className="text-xs text-gray-400">{job.department}</p>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary">{job.applicants} applicants</Badge>
                <Badge variant="outline">{job.daysLeft} days left</Badge>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};
