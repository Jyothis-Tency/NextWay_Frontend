import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { RootState } from "@/redux/store";
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
        return "bg-[#10B981] text-[#FFFFFF]";
      case "closed":
        return "bg-[#EF4444] text-[#FFFFFF]";
      case "paused":
        return "bg-[#F59E0B] text-[#FFFFFF]";
      default:
        return "bg-[#6B7280] text-[#FFFFFF]";
    }
  };

  return (
    <div className="space-y-6 p-4 md:p-6 ml-0 md:ml-64 bg-[#121212]">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
        <h1 className="text-2xl md:text-3xl font-bold text-[#FFFFFF]">
          Job Listings
        </h1>
        <Button
          onClick={handleCreateNewJob}
          className="bg-[#4F46E5] hover:bg-[#4338CA] text-[#FFFFFF] w-full md:w-auto"
        >
          <Icons.Plus className="w-4 h-4 mr-2" />
          Create New Job Post
        </Button>
      </div>
      <Card className="bg-[#1E1E1E] text-[#FFFFFF] border-[#4B5563]">
        <CardHeader>
          <CardTitle>Your Job Posts</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center">Loading...</div>
          ) : jobs.length === 0 ? (
            <div className="text-center">No job posts found.</div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-[#A0A0A0]">Title</TableHead>
                    <TableHead className="text-[#A0A0A0]">Location</TableHead>
                    <TableHead className="text-[#A0A0A0]">Type</TableHead>
                    <TableHead className="text-[#A0A0A0]">
                      Salary Range
                    </TableHead>
                    <TableHead className="text-[#A0A0A0]">Status</TableHead>
                    <TableHead className="text-[#A0A0A0]">
                      Posted Date
                    </TableHead>
                    <TableHead className="text-[#A0A0A0]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {jobs.map((job) => (
                    <TableRow
                      key={job._id}
                      className="cursor-pointer hover:bg-[#2D2D2D] transition-colors"
                    >
                      <TableCell className="font-medium">{job.title}</TableCell>
                      <TableCell>{job.location}</TableCell>
                      <TableCell>{job.employmentType}</TableCell>
                      <TableCell>
                        ₹{job.salaryRange.min.toLocaleString()} - ₹
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
                      <TableCell>
                        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
                          <Button
                            onClick={() =>
                              navigate(`../job-post-details/${job._id}`)
                            }
                            className="bg-[#F59E0B] hover:bg-[#D97706] text-[#FFFFFF] text-xs md:text-sm"
                          >
                            Edit
                          </Button>
                          <Button
                            onClick={() =>
                              navigate(
                                `../job-applications-by-post/${job._id}`,
                                {
                                  state: { jobTitle: job.title },
                                }
                              )
                            }
                            className="bg-[#4F46E5] hover:bg-[#4338CA] text-[#FFFFFF] text-xs md:text-sm"
                          >
                            View Application
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
