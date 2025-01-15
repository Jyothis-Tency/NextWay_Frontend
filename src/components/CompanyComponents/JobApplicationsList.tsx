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

interface IJobApplication {
  _id: string;
  job_id: string;
  user_id: string;
  company_id: string;
  firstName: string;
  lastName: string;
  email: string;
  location: string;
  phone: string;
  status: "Pending" | "Viewed" | "Shortlisted" | "Rejected" | "Hired";
  createdAt: string;
  updatedAt: string;
}

export function JobApplicationsList() {
  const [applications, setApplications] = useState<IJobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const company_id = useSelector(
    (state: RootState) => state.company.companyInfo?.company_id
  );

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        const response = await axiosCompany.get(
          `job-applications/${company_id}`
        );
        setApplications(response.data.jobApplications);
      } catch (error) {
        console.error("Error fetching applications:", error);
      } finally {
        setLoading(false);
      }
    };

    if (company_id) fetchApplications();
  }, [company_id]);

  const handleApplicationClick = (applicationId: string) => {
    navigate(`../application-details/${applicationId}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-500";
      case "Viewed":
        return "bg-blue-500";
      case "Shortlisted":
        return "bg-purple-500";
      case "Rejected":
        return "bg-red-500";
      case "Hired":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="space-y-6 p-6 ml-64">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Job Applications</h1>
        {/* <Button
          onClick={() => navigate("../job-posts")}
          className="bg-blue-500 hover:bg-blue-600"
        >
          <Icons.ArrowLeft className="w-4 h-4 mr-2" />
          Back to Job Posts
        </Button> */}
      </div>
      <Card className="bg-gray-800 text-white">
        <CardHeader>
          <CardTitle>Received Applications</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center">Loading...</div>
          ) : applications.length === 0 ? (
            <div className="text-center">No applications found.</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-white">Name</TableHead>
                  <TableHead className="text-white">Email</TableHead>
                  <TableHead className="text-white">Location</TableHead>
                  <TableHead className="text-white">Phone</TableHead>
                  <TableHead className="text-white">Status</TableHead>
                  <TableHead className="text-white">Applied Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {applications.map((application) => (
                  <TableRow
                    key={application._id}
                    onClick={() => handleApplicationClick(application._id)}
                    className="cursor-pointer hover:bg-gray-700 transition-colors"
                  >
                    <TableCell className="font-medium">
                      {`${application.firstName} ${application.lastName}`}
                    </TableCell>
                    <TableCell>{application.email}</TableCell>
                    <TableCell>{application.location}</TableCell>
                    <TableCell>{application.phone}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(application.status)}>
                        {application.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(application.createdAt).toLocaleDateString()}
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
