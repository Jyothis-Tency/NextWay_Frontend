import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Loader2,
  Briefcase,
  CheckCircle,
  XCircle,
  BookmarkIcon,
  PlusCircle,
  Clock,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RootState } from "@/redux/store";
import { axiosUser } from "@/Utils/axiosUtil";

interface JobApplication {
  _id: string;
  job_id: { title: string; _id: string };
  company_id: { name: string; _id: string };
  status: "Pending" | "Shortlisted" | "Rejected" | "Hired";
  createdAt: string;
  companyName: string;
  jobTitle: string;
}

const MyJobs: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [jobApplications, setJobApplications] = useState<JobApplication[]>([]);
  const [activeTab, setActiveTab] = useState("pending");
  const navigate = useNavigate();

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

  const renderJobApplicationsTable = (applications: JobApplication[]) => (
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
                <TableCell>{app.jobTitle}</TableCell>
                <TableCell>{app.companyName}</TableCell>
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
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <Card className="bg-gray-800 text-white mb-12">
        <CardContent className="p-6">
          <p className="text-center text-red-500">{error}</p>
        </CardContent>
      </Card>
    );
  }

  if (jobApplications.length === 0) {
    return (
      <Card className="bg-gray-800 text-white mb-12 max-w-2xl mx-auto">
        <CardContent className="p-8 text-center">
          <PlusCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold mb-4">No Applications Found</h2>
          <p className="text-gray-400 mb-6">
            You haven't applied for any jobs yet. Start by applying to jobs.
          </p>
          <Button
            className="bg-blue-600 hover:bg-blue-700"
            onClick={() => navigate("/user/job-posts")}
          >
            Start Job Search
          </Button>
        </CardContent>
      </Card>
    );
  }

  const pendingApplications = jobApplications.filter(
    (app) => app.status === "Pending"
  );
  const shortlistedApplications = jobApplications.filter(
    (app) => app.status === "Shortlisted"
  );
  const rejectedApplications = jobApplications.filter(
    (app) => app.status === "Rejected"
  );
  const hiredApplications = jobApplications.filter(
    (app) => app.status === "Hired"
  );

  return (
    <main className="container mx-auto px-4 py-8 space-y-8 min-h-[calc(100vh-16rem)]">
      <h1 className="text-3xl font-bold mb-6">
        <Briefcase className="h-8 w-8 text-blue-500 inline-block mr-2" />
        Your Job Applications
      </h1>

      <Tabs
        defaultValue="pending"
        className="w-full"
        onValueChange={setActiveTab}
      >
        <TabsList className="grid w-full grid-cols-4 gap-4">
          <TabsTrigger
            value="pending"
            className={`bg-gray-700 text-white ${
              activeTab === "pending" ? "border border-black" : ""
            }`}
          >
            <Clock className="h-4 w-4 mr-2" />
            Pending ({pendingApplications.length})
          </TabsTrigger>
          <TabsTrigger
            value="shortlisted"
            className={`bg-gray-700 text-white ${
              activeTab === "shortlisted" ? "border border-black" : ""
            }`}
          >
            <BookmarkIcon className="h-4 w-4 mr-2" />
            Shortlisted ({shortlistedApplications.length})
          </TabsTrigger>
          <TabsTrigger
            value="rejected"
            className={`bg-gray-700 text-white ${
              activeTab === "rejected" ? "border border-black" : ""
            }`}
          >
            <XCircle className="h-4 w-4 mr-2" />
            Rejected ({rejectedApplications.length})
          </TabsTrigger>
          <TabsTrigger
            value="hired"
            className={`bg-gray-700 text-white ${
              activeTab === "hired" ? "border border-black" : ""
            }`}
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Hired ({hiredApplications.length})
          </TabsTrigger>
        </TabsList>
        <TabsContent value="pending">
          <h2 className="text-2xl font-semibold mb-4">Pending Applications</h2>
          {pendingApplications.length > 0 ? (
            renderJobApplicationsTable(pendingApplications)
          ) : (
            <Card className="bg-gray-800 text-white mb-12">
              <CardContent className="p-6">
                <p className="text-center text-gray-400">
                  No Pending Applications Found
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        <TabsContent value="shortlisted">
          <h2 className="text-2xl font-semibold mb-4">
            Shortlisted Applications
          </h2>
          {shortlistedApplications.length > 0 ? (
            renderJobApplicationsTable(shortlistedApplications)
          ) : (
            <Card className="bg-gray-800 text-white mb-12">
              <CardContent className="p-6">
                <p className="text-center text-gray-400">
                  No Shortlisted Applications Found
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        <TabsContent value="rejected">
          <h2 className="text-2xl font-semibold mb-4">Rejected Applications</h2>
          {rejectedApplications.length > 0 ? (
            renderJobApplicationsTable(rejectedApplications)
          ) : (
            <Card className="bg-gray-800 text-white mb-12">
              <CardContent className="p-6">
                <p className="text-center text-gray-400">
                  No Rejected Applications Found
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        <TabsContent value="hired">
          <h2 className="text-2xl font-semibold mb-4">Hired Applications</h2>
          {hiredApplications.length > 0 ? (
            renderJobApplicationsTable(hiredApplications)
          ) : (
            <Card className="bg-gray-800 text-white mb-12">
              <CardContent className="p-6">
                <p className="text-center text-gray-400">
                  No Hired Applications Found
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </main>
  );
};

export default MyJobs;
