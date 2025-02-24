import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { RootState } from "@/redux/store";
import { Button } from "@/components/ui/button";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Icons } from "@/components/ui/icons";
import ReusableTable from "../Common/Reusable/Table";
import companyAPIs from "@/API/companyAPIs";

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
        const response = await companyAPIs.getCompanyJobs(company_id || "");
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

  const columns = [
    { key: "title", label: "Job Title" },
    { key: "location", label: "Location" },
    { key: "employmentType", label: "Type" },
    {
      key: "salaryRange",
      label: "Salary Range",
      render: (row: IJobPost) => (
        <>
          <p>
            ₹{row.salaryRange.min.toLocaleString()} - ₹
            {row.salaryRange.max.toLocaleString()}
          </p>
        </>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (row: IJobPost) => (
        <Badge className={getStatusColor(row.status)}>{row.status}</Badge>
      ),
    },
    {
      key: "createdAt",
      label: "Posted Date",
      render: (row: IJobPost) => (
        <>{new Date(row.createdAt).toLocaleDateString()}</>
      ),
    },
    {
      key: "action",
      label: "Action",
      render: (row: IJobPost) => (
        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
          <Button
            onClick={() => navigate(`../job-post-details/${row._id}`)}
            className="bg-[#F59E0B] hover:bg-[#D97706] text-[#FFFFFF] text-xs md:text-sm"
          >
            Edit
          </Button>
          <Button
            onClick={() =>
              navigate(`../job-applications-by-post/${row._id}`, {
                state: { jobTitle: row.title },
              })
            }
            className="bg-[#4F46E5] hover:bg-[#4338CA] text-[#FFFFFF] text-xs md:text-sm"
          >
            View Application
          </Button>
        </div>
      ),
    },
  ];

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
              <ReusableTable
                columns={columns}
                data={jobs}
                defaultRowsPerPage={5}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
