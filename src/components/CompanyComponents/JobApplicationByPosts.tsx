import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useParams, useNavigate } from "react-router-dom";
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
  firstName: string;
  lastName: string;
  email: string;
  location: string;
  phone: string;
  resume: string;
  coverLetter: string;
  status: "Pending" | "Shortlisted" | "Rejected" | "Hired";
  createdAt: string;
}

export function JobApplicationByPosts() {
  const [applications, setApplications] = useState<IJobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  // const [jobTitle, setJobTitle] = useState("");
  const location = useLocation();
  const jobTitle = location.state?.jobTitle;
  const { jobId } = useParams<{ jobId: string }>();
  console.log("jobId", jobId);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        const response = await axiosCompany.get(
          `job-applications-post/${jobId}`
        );
        console.log("response", response.data);
        setApplications(response.data.jobApplications);
        // setJobTitle(response.data.jobTitle);
      } catch (error) {
        console.error("Error fetching job applications:", error);
      } finally {
        setLoading(false);
      }
    };

    if (jobId) fetchApplications();
  }, [jobId]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-500";
      case "Shortlisted":
        return "bg-blue-500";
      case "Rejected":
        return "bg-red-500";
      case "Hired":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  const handleStatusChange = async (
    applicationId: string,
    newStatus: string
  ) => {
    try {
      await axiosCompany.put(`update-application-status/${applicationId}`, {
        status: newStatus,
      });
      setApplications(
        applications.map((app) =>
          app._id === applicationId
            ? { ...app, status: newStatus as IJobApplication["status"] }
            : app
        )
      );
    } catch (error) {
      console.error("Error updating application status:", error);
    }
  };

  return (
    <div className="space-y-6 p-6 ml-64">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">
          Job Applications for {jobTitle}
        </h1>
        <Button
          onClick={() => navigate(-1)}
          className="bg-blue-500 hover:bg-blue-600"
        >
          <Icons.ArrowLeft className="w-4 h-4 mr-2" />
          Back to Job Listings
        </Button>
      </div>
      <Card className="bg-gray-800 text-white">
        <CardHeader>
          <CardTitle>Applications</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center">Loading...</div>
          ) : applications.length === 0 ? (
            <div className="text-center">
              No applications found for this job.
            </div>
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
                  <TableHead className="text-white">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {applications.map((application) => (
                  <TableRow
                    key={application._id}
                    className="hover:bg-gray-700 transition-colors"
                  >
                    <TableCell className="font-medium">{`${application.firstName} ${application.lastName}`}</TableCell>
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
                    <TableCell>
                      <Button
                        onClick={() =>
                          navigate(
                            `../job-application-detailed/${application._id}`
                          )
                        }
                        className="bg-blue-500 hover:bg-blue-600 mr-2"
                      >
                        View Details
                      </Button>
                      {/* <select
                        value={application.status}
                        onChange={(e) =>
                          handleStatusChange(application._id, e.target.value)
                        }
                        className="bg-gray-700 text-white rounded p-1"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Shortlisted">Shortlisted</option>
                        <option value="Rejected">Rejected</option>
                        <option value="Hired">Hired</option>
                      </select> */}
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
