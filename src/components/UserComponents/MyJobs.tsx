import type React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Loader2,
  Briefcase,
  CheckCircle,
  XCircle,
  BookmarkIcon,
  PlusCircle,
  Clock,
  Calendar,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
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
import type { RootState } from "@/redux/store";
import { axiosUser } from "@/Utils/axiosUtil";

interface JobApplication {
  _id: string;
  job_id: { title: string; _id: string };
  company_id: { name: string; _id: string };
  status: "Pending" | "Shortlisted" | "Rejected" | "Hired";
  statusMessage?: string;
  interview?: {
    interviewStatus: "scheduled" | "over" | "canceled" | "postponed";
    dateTime?: Date;
    message?: string;
  };
  createdAt: string;
  companyName: string;
  jobTitle: string;
}

const MyJobs: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [jobApplications, setJobApplications] = useState<JobApplication[]>([]);
  const [currentJobApplication, setCurrentJobApplication] =
    useState<JobApplication | null>(null);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("pending");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const videoCallState = useSelector((state: RootState) => state.videoCall);

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

  const openStatusModal = (application: JobApplication) => {
    setCurrentJobApplication(application);
    setIsStatusModalOpen(true);
  };

  const handleJoinInterview = async (roomID: string) => {
    try {
      navigate(`../video-call?roomId=${roomID}`);
    } catch (err) {
      console.error("Error joining interview:", err);
    }
  };

  const renderJobApplicationsTable = (applications: JobApplication[]) => (
    <Card className="bg-[#1E1E1E] text-white mb-12 border border-[#2D2D2D]">
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="border-b border-[#2D2D2D] hover:bg-[#2D2D2D] transition-colors">
              <TableHead className="text-[#A0A0A0] font-semibold">
                Job Title
              </TableHead>
              <TableHead className="text-[#A0A0A0] font-semibold">
                Company
              </TableHead>
              <TableHead className="text-[#A0A0A0] font-semibold">
                Status
              </TableHead>
              <TableHead className="text-[#A0A0A0] font-semibold">
                Applied Date
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {applications.map((app) => (
              <TableRow
                key={app._id}
                className="border-b border-[#2D2D2D] hover:bg-[#2D2D2D] transition-colors"
              >
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
                    className="mb-1"
                  >
                    {app.status}
                  </Badge>
                  <p
                    className="text-sm text-[#6366F1] cursor-pointer hover:underline mt-1"
                    onClick={() => openStatusModal(app)}
                  >
                    View Message
                  </p>
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

  const renderInterviewsTable = (applications: JobApplication[]) => {
    const applicationsWithInterviews = applications.filter(
      (app) => app.interview
    );

    if (applicationsWithInterviews.length === 0) {
      return (
        <Card className="bg-[#1E1E1E] text-white mb-12 border border-[#2D2D2D]">
          <CardContent className="p-6">
            <p className="text-center text-[#A0A0A0]">
              No Interviews Scheduled
            </p>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card className="bg-[#1E1E1E] text-white mb-12 border border-[#2D2D2D]">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">Interviews</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-b border-[#2D2D2D] hover:bg-[#2D2D2D] transition-colors">
                <TableHead className="text-[#A0A0A0] font-semibold">
                  Job Title
                </TableHead>
                <TableHead className="text-[#A0A0A0] font-semibold">
                  Company
                </TableHead>
                <TableHead className="text-[#A0A0A0] font-semibold">
                  Interview Status
                </TableHead>
                <TableHead className="text-[#A0A0A0] font-semibold">
                  Date & Time
                </TableHead>
                <TableHead className="text-[#A0A0A0] font-semibold">
                  Message
                </TableHead>
                <TableHead className="text-[#A0A0A0] font-semibold">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {applicationsWithInterviews.map((app) => (
                <TableRow
                  key={app._id}
                  className="border-b border-[#2D2D2D] hover:bg-[#2D2D2D] transition-colors"
                >
                  <TableCell>{app.jobTitle}</TableCell>
                  <TableCell>{app.companyName}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        app.interview?.interviewStatus === "scheduled"
                          ? "default"
                          : app.interview?.interviewStatus === "over"
                          ? "secondary"
                          : app.interview?.interviewStatus === "canceled"
                          ? "destructive"
                          : "default"
                      }
                    >
                      {app.interview?.interviewStatus}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {app.interview?.dateTime
                      ? new Date(app.interview.dateTime).toLocaleString()
                      : "N/A"}
                  </TableCell>
                  <TableCell>{app.interview?.message || "N/A"}</TableCell>
                  <TableCell>
                    <Button
                      disabled={
                        !(
                          videoCallState &&
                          videoCallState.roomId &&
                          videoCallState.applicationId === app._id
                        )
                      }
                      onClick={() =>
                        handleJoinInterview(videoCallState.roomId || "")
                      }
                      className="bg-[#4F46E5] hover:bg-[#6366F1] text-white"
                    >
                      Join Interview
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="h-8 w-8 animate-spin text-[#4F46E5]" />
      </div>
    );
  }

  if (error) {
    return (
      <Card className="bg-[#1E1E1E] text-white mb-12 border border-[#2D2D2D]">
        <CardContent className="p-6">
          <p className="text-center text-red-500">{error}</p>
        </CardContent>
      </Card>
    );
  }

  if (jobApplications.length === 0) {
    return (
      <Card className="bg-[#1E1E1E] text-white mb-12 max-w-2xl mx-auto border border-[#2D2D2D]">
        <CardContent className="p-8 text-center">
          <PlusCircle className="h-16 w-16 text-[#A0A0A0] mx-auto mb-4" />
          <h2 className="text-2xl font-semibold mb-4">No Applications Found</h2>
          <p className="text-[#A0A0A0] mb-6">
            You haven't applied for any jobs yet. Start by applying to jobs.
          </p>
          <Button
            className="bg-[#4F46E5] hover:bg-[#6366F1] text-white"
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

  const applicationsWithInterviews = jobApplications.filter(
    (app) => app.interview
  );

  return (
    <main className="container mx-auto px-4 py-8 space-y-8 min-h-[calc(100vh-16rem)] bg-[#000000]">
      <h1 className="text-3xl font-bold mb-6 text-white flex items-center">
        <Briefcase className="h-8 w-8 text-[#4F46E5] mr-2" />
        Your Job Applications
      </h1>

      <Tabs
        defaultValue="pending"
        className="w-full"
        onValueChange={setActiveTab}
      >
        <TabsList className="grid w-full grid-cols-5 gap-4 mb-6">
          <TabsTrigger
            value="pending"
            className={`bg-[#1E1E1E] text-white ${
              activeTab === "pending" ? "border-b-2 border-[#4F46E5]" : ""
            }`}
          >
            <Clock className="h-4 w-4 mr-2" />
            Pending ({pendingApplications.length})
          </TabsTrigger>
          <TabsTrigger
            value="shortlisted"
            className={`bg-[#1E1E1E] text-white ${
              activeTab === "shortlisted" ? "border-b-2 border-[#4F46E5]" : ""
            }`}
          >
            <BookmarkIcon className="h-4 w-4 mr-2" />
            Shortlisted ({shortlistedApplications.length})
          </TabsTrigger>
          <TabsTrigger
            value="rejected"
            className={`bg-[#1E1E1E] text-white ${
              activeTab === "rejected" ? "border-b-2 border-[#4F46E5]" : ""
            }`}
          >
            <XCircle className="h-4 w-4 mr-2" />
            Rejected ({rejectedApplications.length})
          </TabsTrigger>
          <TabsTrigger
            value="hired"
            className={`bg-[#1E1E1E] text-white ${
              activeTab === "hired" ? "border-b-2 border-[#4F46E5]" : ""
            }`}
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Hired ({hiredApplications.length})
          </TabsTrigger>
          <TabsTrigger
            value="interviews"
            className={`bg-[#1E1E1E] text-white ${
              activeTab === "interviews" ? "border-b-2 border-[#4F46E5]" : ""
            }`}
          >
            <Calendar className="h-4 w-4 mr-2" />
            Interviews ({applicationsWithInterviews.length})
          </TabsTrigger>
        </TabsList>
        <TabsContent value="pending">
          <h2 className="text-2xl font-semibold mb-4 text-white">
            Pending Applications
          </h2>
          {pendingApplications.length > 0 ? (
            renderJobApplicationsTable(pendingApplications)
          ) : (
            <Card className="bg-[#1E1E1E] text-white mb-12 border border-[#2D2D2D]">
              <CardContent className="p-6">
                <p className="text-center text-[#A0A0A0]">
                  No Pending Applications Found
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        <TabsContent value="shortlisted">
          <h2 className="text-2xl font-semibold mb-4 text-white">
            Shortlisted Applications
          </h2>
          {shortlistedApplications.length > 0 ? (
            renderJobApplicationsTable(shortlistedApplications)
          ) : (
            <Card className="bg-[#1E1E1E] text-white mb-12 border border-[#2D2D2D]">
              <CardContent className="p-6">
                <p className="text-center text-[#A0A0A0]">
                  No Shortlisted Applications Found
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        <TabsContent value="rejected">
          <h2 className="text-2xl font-semibold mb-4 text-white">
            Rejected Applications
          </h2>
          {rejectedApplications.length > 0 ? (
            renderJobApplicationsTable(rejectedApplications)
          ) : (
            <Card className="bg-[#1E1E1E] text-white mb-12 border border-[#2D2D2D]">
              <CardContent className="p-6">
                <p className="text-center text-[#A0A0A0]">
                  No Rejected Applications Found
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        <TabsContent value="hired">
          <h2 className="text-2xl font-semibold mb-4 text-white">
            Hired Applications
          </h2>
          {hiredApplications.length > 0 ? (
            renderJobApplicationsTable(hiredApplications)
          ) : (
            <Card className="bg-[#1E1E1E] text-white mb-12 border border-[#2D2D2D]">
              <CardContent className="p-6">
                <p className="text-center text-[#A0A0A0]">
                  No Hired Applications Found
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        <TabsContent value="interviews">
          <h2 className="text-2xl font-semibold mb-4 text-white">Interviews</h2>
          {renderInterviewsTable(jobApplications)}
        </TabsContent>
      </Tabs>
      <Dialog open={isStatusModalOpen} onOpenChange={setIsStatusModalOpen}>
        <DialogContent className="bg-[#1E1E1E] text-white border border-[#2D2D2D]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold">
              Application Status
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <h5 className="text-lg mb-2">
              Current Status:{" "}
              <span className="font-bold">{currentJobApplication?.status}</span>
            </h5>
            <p className="font-semibold mb-1">Message from Company:</p>
            <p className="text-[#A0A0A0]">
              {currentJobApplication?.statusMessage || "No message provided."}
            </p>
          </div>
          <DialogFooter>
            <Button
              onClick={() => setIsStatusModalOpen(false)}
              className="bg-[#4F46E5] hover:bg-[#6366F1] text-white"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
};

export default MyJobs;
