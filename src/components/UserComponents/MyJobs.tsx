import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  Loader2,
  Briefcase,
  CheckCircle,
  XCircle,
  BookmarkIcon,
  PlusCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { RootState } from "@/redux/store";
import { axiosUser } from "@/Utils/axiosUtil";
import { toast } from "sonner";

interface Job {
  _id: string;
  title: string;
  company: string;
  location: string;
  appliedDate?: string;
  status: "applied" | "accepted" | "rejected" | "saved";
}

interface JobApplication {
  _id: string;
  job_id: { title: string; _id: string };
  company_id: { name: string; _id: string };
  status: "Pending" | "Shortlisted" | "Rejected" | "Hired";
  createdAt: string;
}

const MyJobs: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [jobApplications, setJobApplications] = useState<JobApplication[]>([]);

  const userInfo = useSelector((state: RootState) => state.user.userInfo);
  const userId = userInfo?.user_id;

  useEffect(() => {
    const fetchJobApplications = async () => {
      if (!userId) return;
      try {
        const response = await axiosUser.get(`/job-applications/${userId}`);
        console.log(response.data.applications);
        setJobApplications(response.data.applications || []);
      } catch (err) {
        setError("Failed to load job applications. Please try again later.");
        console.error("Error fetching job applications:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchJobApplications();
  }, [userId]);

  const renderJobApplicationsSection = (
    title: string,
    applications: JobApplication[],
    icon: React.ReactNode
  ) => (
    <section>
      <h1 className="text-3xl font-bold mb-6">
        {icon}
        {title}
      </h1>
      {applications.length > 0 ? (
        <Card className="bg-gray-800 text-white mb-12">
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="text-white">
                  <TableHead className="text-white">Job Title</TableHead>
                  <TableHead className="text-white">Company</TableHead>
                  <TableHead className="text-white">Status</TableHead>
                  <TableHead className="text-white">Applied Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {applications.map((app) => (
                  <TableRow key={app._id} className="text-white">
                    <TableCell>
                      {app.job_id ? app.job_id.title : "N/A"}
                    </TableCell>
                    <TableCell>
                      {app.company_id ? app.company_id.name : "N/A"}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          app.status === "Shortlisted"
                            ? "secondary"
                            : app.status === "Rejected"
                            ? "destructive"
                            : app.status === "Hired"
                            ? "secondary"
                            : app.status === "Pending"
                            ? "default"
                            : "default"
                        }
                      >
                        {app.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(app.createdAt).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : null}
    </section>
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <main className="container mx-auto px-4 py-8 space-y-8 min-h-[calc(100vh-16rem)]">
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : error ? (
        <Card className="bg-gray-800 text-white mb-12">
          <CardContent className="p-6">
            <p className="text-center text-red-500">{error}</p>
          </CardContent>
        </Card>
      ) : jobApplications.length === 0 ? (
        <Card className="bg-gray-800 text-white mb-12 max-w-2xl mx-auto">
          <CardContent className="p-8 text-center">
            <PlusCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold mb-4">
              No Applications Found
            </h2>
            <p className="text-gray-400 mb-6">
              You haven't applied for any jobs yet. Start by applying to jobs.
            </p>
            <Button className="bg-blue-600 hover:bg-blue-700">
              Start Job Search
            </Button>
          </CardContent>
        </Card>
      ) : (
        renderJobApplicationsSection(
          "Your Job Applications",
          jobApplications,
          <Briefcase className="h-6 w-6 text-blue-500" />
        )
      )}
    </main>
  );
};

export default MyJobs;
