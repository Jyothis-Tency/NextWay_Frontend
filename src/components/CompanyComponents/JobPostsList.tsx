import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "@/redux/store";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Icons } from "@/components/ui/icons";
import { axiosCompany } from "@/Utils/axiosUtil";

interface IJobPost {
  _id: string;
  title: string;
  location: string;
  employmentType: string;
  salaryRange: {
    min: number;
    max: number;
  };
  status: "open" | "closed" | "paused";
  createdAt: string;
}

export function JobPostsList() {
  const [jobs, setJobs] = useState<IJobPost[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const company_id = useSelector(
    (state: RootState) => state.company.companyInfo?.company_id
  );

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const response = await axiosCompany.get(
          `get-company-jobs/${company_id}`
        );
        setJobs(response.data.jobPosts);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      } finally {
        setLoading(false);
      }
    };

    if (company_id) fetchJobs();
  }, [company_id]);

  const handleCreateNewJob = () => {
    navigate("../create-job-post");
  };

  const handleJobClick = (jobId: string) => {
    navigate(`../job-post-details/${jobId}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-green-500";
      case "closed":
        return "bg-red-500";
      case "paused":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="space-y-6 p-6 ml-64">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Job Listings</h1>
        <Button
          onClick={handleCreateNewJob}
          className="bg-blue-500 hover:bg-blue-600"
        >
          <Icons.Plus className="w-4 h-4 mr-2" />
          Create New Job Post
        </Button>
      </div>
      <Card className="bg-gray-800 text-white">
        <CardHeader>
          <CardTitle>Your Job Posts</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center">Loading...</div>
          ) : jobs.length === 0 ? (
            <div className="text-center">No job posts found.</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-white">Title</TableHead>
                  <TableHead className="text-white">Location</TableHead>
                  <TableHead className="text-white">Type</TableHead>
                  <TableHead className="text-white">Salary Range</TableHead>
                  <TableHead className="text-white">Status</TableHead>
                  <TableHead className="text-white">Posted Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {jobs.map((job) => (
                  <TableRow
                    key={job._id}
                    onClick={() => handleJobClick(job._id)}
                    className="cursor-pointer hover:bg-gray-700 transition-colors"
                  >
                    <TableCell className="font-medium">{job.title}</TableCell>
                    <TableCell>{job.location}</TableCell>
                    <TableCell>{job.employmentType}</TableCell>
                    <TableCell>
                      ${job.salaryRange.min.toLocaleString()} - $
                      {job.salaryRange.max.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(job.status)}>
                        {job.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(job.createdAt).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
