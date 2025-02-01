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
        return "bg-[#F59E0B] text-[#FFFFFF]";
      case "Viewed":
        return "bg-[#3B82F6] text-[#FFFFFF]";
      case "Shortlisted":
        return "bg-[#8B5CF6] text-[#FFFFFF]";
      case "Rejected":
        return "bg-[#EF4444] text-[#FFFFFF]";
      case "Hired":
        return "bg-[#10B981] text-[#FFFFFF]";
      default:
        return "bg-[#6B7280] text-[#FFFFFF]";
    }
  };

  return (
    <div className="space-y-6 p-4 md:p-6 ml-0 md:ml-64 bg-[#121212]">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
        <h1 className="text-2xl md:text-3xl font-bold text-[#FFFFFF]">
          Job Applications
        </h1>
        <Button
          onClick={() => navigate("../job-post-list")}
          className="bg-[#4F46E5] hover:bg-[#4338CA] text-[#FFFFFF] w-full md:w-auto"
        >
          <Icons.ArrowLeft className="w-4 h-4 mr-2" />
          Back to Job Posts
        </Button>
      </div>
      <Card className="bg-[#1E1E1E] text-[#FFFFFF] border-[#4B5563]">
        <CardHeader>
          <CardTitle>Received Applications</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center">Loading...</div>
          ) : applications.length === 0 ? (
            <div className="text-center">No applications found.</div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-[#A0A0A0]">Name</TableHead>
                    <TableHead className="text-[#A0A0A0]">Email</TableHead>
                    <TableHead className="text-[#A0A0A0] hidden md:table-cell">
                      Location
                    </TableHead>
                    <TableHead className="text-[#A0A0A0] hidden md:table-cell">
                      Phone
                    </TableHead>
                    <TableHead className="text-[#A0A0A0]">Status</TableHead>
                    <TableHead className="text-[#A0A0A0] hidden md:table-cell">
                      Applied Date
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {applications.map((application) => (
                    <TableRow
                      key={application._id}
                      onClick={() => handleApplicationClick(application._id)}
                      className="cursor-pointer hover:bg-[#2D2D2D] transition-colors"
                    >
                      <TableCell className="font-medium">
                        {`${application.firstName} ${application.lastName}`}
                      </TableCell>
                      <TableCell>{application.email}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        {application.location}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {application.phone}
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(application.status)}>
                          {application.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {new Date(application.createdAt).toLocaleDateString()}
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
