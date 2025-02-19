import { useEffect, useState } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
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
import ReusableTable from "../Common/Reusable/Table";
import companyAPIs from "@/API/companyAPIs";

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
  const location = useLocation();
  const jobTitle = location.state?.jobTitle;
  const { jobId } = useParams<{ jobId: string }>();
  const job_id = jobId || "";
  const navigate = useNavigate();

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        const response = await companyAPIs.fetchApplications(job_id);
        setApplications(response.data.jobApplications);
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
        return "bg-[#F59E0B] text-[#FFFFFF]";
      case "Shortlisted":
        return "bg-[#3B82F6] text-[#FFFFFF]";
      case "Rejected":
        return "bg-[#EF4444] text-[#FFFFFF]";
      case "Hired":
        return "bg-[#10B981] text-[#FFFFFF]";
      default:
        return "bg-[#6B7280] text-[#FFFFFF]";
    }
  };

  const columns = [
    {
      key: "name",
      label: "Applicant Name",
      render: (row: IJobApplication) => (
        <>{`${row.firstName} ${row.lastName}`}</>
      ),
    },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone" },
    { key: "location", label: "Location" },
    {
      key: "status",
      label: "Status",
      render: (row: IJobApplication) => (
        <Badge className={getStatusColor(row.status)}>{row.status}</Badge>
      ),
    },
    {
      key: "createdAt",
      label: "Applied Date",
      render: (row: IJobApplication) => (
        <>{new Date(row.createdAt).toLocaleDateString()}</>
      ),
    },
    {
      key: "action",
      label: "Actions",
      render: (row: IJobApplication) => (
        <Button
          onClick={() => navigate(`../job-application-detailed/${row._id}`)}
          className="bg-[#4F46E5] hover:bg-[#4338CA] text-[#FFFFFF] text-xs md:text-sm"
        >
          View Details
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6 p-4 md:p-6 ml-0 md:ml-64 bg-[#121212]">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
        <h1 className="text-2xl md:text-3xl font-bold text-[#FFFFFF]">
          Job Applications for {jobTitle}
        </h1>
        <Button
          onClick={() => navigate(-1)}
          className="bg-[#4F46E5] hover:bg-[#4338CA] text-[#FFFFFF] w-full md:w-auto"
        >
          <Icons.ArrowLeft className="w-4 h-4 mr-2" />
          Back to Job Listings
        </Button>
      </div>
      <Card className="bg-[#1E1E1E] text-[#FFFFFF] border-[#4B5563]">
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
            <div className="overflow-x-auto">
              {/* <Table>
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
                    <TableHead className="text-[#A0A0A0]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {applications.map((application) => (
                    <TableRow
                      key={application._id}
                      className="hover:bg-[#2D2D2D] transition-colors"
                    >
                      <TableCell className="font-medium">{`${application.firstName} ${application.lastName}`}</TableCell>
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
                      <TableCell>
                        <Button
                          onClick={() =>
                            navigate(
                              `../job-application-detailed/${application._id}`
                            )
                          }
                          className="bg-[#4F46E5] hover:bg-[#4338CA] text-[#FFFFFF] text-xs md:text-sm"
                        >
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table> */}
              <ReusableTable
                columns={columns}
                data={applications}
                defaultRowsPerPage={5}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
