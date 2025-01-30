import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Icons } from "@/components/ui/icons";
import { axiosCompany, axiosUser } from "@/Utils/axiosUtil";
import { InterviewModal } from "../Common/CompanyCommon/InterviewModal";
import { v4 as uuidv4 } from "uuid";
import { useSocket } from "@/Context/SocketContext";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "../ui/textarea";

interface IUser {
  user_id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: string;
  dob: string;
  gender: string;
  preferredLocation: string;
  preferredRoles: string[];
  salaryExpectation: number;
  remoteWork: boolean;
  willingToRelocate: boolean;
  resume: string;
  profileImage: string;
  bio: string;
  skills: string[];
  proficiency: { skill: string; level: string }[];
  experience: {
    jobTitle: string;
    company: string;
    location: string;
    startDate: string;
    endDate: string;
    responsibilities: string[];
    reasonForLeaving: string;
  }[];
  education: {
    degree: string;
    institution: string;
    fieldOfStudy: string;
    startDate: string;
    endDate: string;
  }[];
  certifications: string[];
  languages: { language: string; proficiency: string }[];
  portfolioLink: string;
}

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
  resume: string;
  coverLetter: string;
  status: "Pending" | "Shortlisted" | "Rejected" | "Hired";
  statusMessage: string;
  interview?: {
    interviewStatus: "scheduled" | "conducted" | "canceled" | "postponed";
    dateTime?: Date;
    message?: string;
  };
  companyName: string;
  jobTitle: string;
  createdAt: string;
}

export function JobApplicationDetailed() {
  const [application, setApplication] = useState<IJobApplication | null>(null);
  const [confirm, setConfirm] = useState(false);
  console.log("applicationnnnn", application);
  const [userDetails, setUserDetails] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);
  const { applicationId } = useParams<{ applicationId: string }>();
  const userId = "some_user_id";
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<
    "schedule" | "postpone" | "cancel" | "reopen"
  >("schedule");
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [newStatus, setNewStatus] =
    useState<IJobApplication["status"]>("Pending");
  const [statusMessage, setStatusMessage] = useState("");

  const companyState = useSelector((state: RootState) => state.company);

  const socket = useSocket();
  function randomID(): string {
    return uuidv4();
  }

  useEffect(() => {
    const fetchApplicationDetails = async () => {
      try {
        setLoading(true);
        const applicationResponse = await axiosCompany.get(
          `job-applications-detailed/${applicationId}`
        );
        setApplication(applicationResponse.data.application);
        const user_id = applicationResponse.data.application.user_id;

        const userResponse = await axiosUser.get(`/user-profile/${user_id}`);
        setUserDetails({
          ...userResponse.data.userProfile,
          profileImage: userResponse.data.image,
        });
      } catch (error) {
        console.error("Error fetching application details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (applicationId) fetchApplicationDetails();
  }, [applicationId, userId, confirm]);

  const handleStatusChange = async (
    status: IJobApplication["status"],
    message: string
  ) => {
    try {
      await axiosCompany.put(`update-application-status/${applicationId}`, {
        status,
        statusMessage: message,
      });
      setApplication((prev) =>
        prev ? { ...prev, status, statusMessage: message } : null
      );
      setStatusMessage("");
    } catch (error) {
      console.error("Error updating application status:", error);
    }
  };

  const openStatusModal = (status: IJobApplication["status"]) => {
    setNewStatus(status);
    setIsStatusModalOpen(true);
  };

  const openResume = () => {
    if (application && application.resume) {
      // Remove the "data:application/pdf;base64," prefix if present
      const base64Data = application.resume.replace(
        /^data:application\/pdf;base64,/,
        ""
      );

      // Convert base64 to Blob
      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: "application/pdf" });

      // Create a URL for the Blob
      const url = URL.createObjectURL(blob);

      // Open the PDF in a new tab
      window.open(url, "_blank");
    }
  };

  const handleInterviewAction = (
    action: "schedule" | "postpone" | "cancel" | "reopen"
  ) => {
    setModalType(action);
    setIsModalOpen(true);
  };

  const handleInterviewUpdate = async (dateTime: string, message: string) => {
    try {
      console.log("dateTime", dateTime);
      console.log("message", message);

      const response = await axiosCompany.put(
        `set-interview-details/${applicationId}`,
        {
          interviewStatus: modalType === "cancel" ? "canceled" : "scheduled",
          dateTime: modalType !== "cancel" ? dateTime : undefined,
          message,
        }
      );
      setApplication(response.data.application);
      setIsModalOpen(false);
      setConfirm((prev) => !prev);
    } catch (error) {
      console.error("Error updating interview:", error);
    }
  };

  const startInterview = async () => {
    try {
      console.log("Starting interview...");

      const roomID = randomID();
      console.log("roomID", roomID);
      // socket?.emit("start-interview", {
      //   roomID,
      //   applicationId,
      //   user_id: application?.user_id,
      //   companyName:companyState.companyInfo?.name||`Unknown Company`,
      // });

      navigate(
        `../video-call?roomId=${roomID}&applicationId=${applicationId}&user_id=${application?.user_id}`
      );
    } catch (error) {
      console.error("Error starting interview:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-white">
        Loading...
      </div>
    );
  }

  if (!application || !userDetails) {
    return (
      <div className="flex justify-center items-center h-screen text-white">
        Application not found.
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 ml-64">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">Application Details</h1>
        <Button
          onClick={() => navigate(-1)}
          className="bg-blue-500 hover:bg-blue-600"
        >
          <Icons.ArrowLeft className="w-4 h-4 mr-2" />
          Back to Applications
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-gray-800 text-white">
          <CardHeader>
            <CardTitle>Job Application Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p>
                  <strong>Job Title:</strong> {application.jobTitle}
                </p>
                <p>
                  <strong>Company:</strong> {application.companyName}
                </p>
                <p>
                  <strong>Applied On:</strong>{" "}
                  {new Date(application.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p>
                  <strong>Status:</strong>
                  <Badge
                    className={`ml-2 ${
                      application.status === "Pending"
                        ? "bg-yellow-500"
                        : application.status === "Shortlisted"
                        ? "bg-blue-500"
                        : application.status === "Rejected"
                        ? "bg-red-500"
                        : "bg-green-500"
                    }`}
                  >
                    {application.status}
                  </Badge>
                </p>
                <select
                  value={application.status}
                  onChange={(e) =>
                    openStatusModal(e.target.value as IJobApplication["status"])
                  }
                  className="mt-2 bg-gray-700 text-white rounded p-2 w-full"
                >
                  <option value="Pending">Pending</option>
                  <option value="Shortlisted">Shortlisted</option>
                  <option value="Rejected">Rejected</option>
                  <option value="Hired">Hired</option>
                </select>
              </div>
              <p>
                <strong>Status message for user:</strong>{" "}
                {application.statusMessage}
              </p>
              {application.coverLetter && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">Cover Letter</h3>
                  <p className="text-sm">{application.coverLetter}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 text-white">
          <CardHeader>
            <CardTitle>Interview Status</CardTitle>
          </CardHeader>
          <CardContent>
            {application.interview &&
            (application.interview.interviewStatus === "conducted" ||
              application.interview.interviewStatus) ? (
              <div className="space-y-4">
                <p>
                  <strong>Status:</strong>{" "}
                  {application.interview.interviewStatus}
                </p>
                {application.interview.dateTime && (
                  <p>
                    <strong>Scheduled for:</strong>{" "}
                    {new Date(application.interview.dateTime).toLocaleString()}
                  </p>
                )}
                <div className="flex flex-wrap gap-2">
                  {application.interview.interviewStatus === "scheduled" && (
                    <>
                      <Button onClick={() => handleInterviewAction("postpone")}>
                        Postpone
                      </Button>
                      <Button onClick={() => handleInterviewAction("cancel")}>
                        Cancel
                      </Button>
                      <Button onClick={() => startInterview()}>
                        Start Interview
                      </Button>
                    </>
                  )}
                  {application.interview.interviewStatus === "conducted" && (
                    <Button onClick={() => handleInterviewAction("schedule")}>
                      Schedule Interview
                    </Button>
                  )}
                  {application.interview.interviewStatus === "canceled" && (
                    <Button onClick={() => handleInterviewAction("reopen")}>
                      Reopen Interview
                    </Button>
                  )}
                </div>
              </div>
            ) : (
              <Button onClick={() => handleInterviewAction("schedule")}>
                Schedule Interview
              </Button>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="bg-gray-800 text-white">
        <CardHeader>
          <CardTitle>Applicant Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-8">
            <div className="flex flex-col items-center">
              {userDetails.profileImage && (
                <img
                  src={userDetails.profileImage || "/placeholder.svg"}
                  alt="Profile"
                  className="w-40 h-40 rounded-full object-cover border-4 border-blue-500 shadow-lg mb-4"
                />
              )}
              <h2 className="text-2xl font-bold text-center">
                {userDetails.firstName} {userDetails.lastName}
              </h2>
            </div>
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  Contact Information
                </h3>
                <p>
                  <strong>Email:</strong> {userDetails.email}
                </p>
                <p>
                  <strong>Phone:</strong> {userDetails.phone}
                </p>
                <p>
                  <strong>Location:</strong> {userDetails.location}
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Job Preferences</h3>
                <p>
                  <strong>Preferred Location:</strong>{" "}
                  {userDetails.preferredLocation}
                </p>
                <p>
                  <strong>Salary Expectation:</strong> $
                  {userDetails.salaryExpectation}
                </p>
                <p>
                  <strong>Remote Work:</strong>{" "}
                  {userDetails.remoteWork ? "Yes" : "No"}
                </p>
                <p>
                  <strong>Willing to Relocate:</strong>{" "}
                  {userDetails.willingToRelocate ? "Yes" : "No"}
                </p>
              </div>
            </div>
          </div>
          {userDetails.bio && (
            <div className="mt-6">
              <h3 className="text-xl font-semibold mb-2">Bio</h3>
              <p className="text-sm">{userDetails.bio}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-gray-800 text-white">
          <CardHeader>
            <CardTitle>Skills and Proficiency</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Skills</h3>
                <ul className="list-disc list-inside">
                  {userDetails.skills.map((skill, index) => (
                    <li key={index}>{skill}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Proficiency</h3>
                <ul className="list-disc list-inside">
                  {userDetails.proficiency.map((prof, index) => (
                    <li key={index}>
                      {prof.skill}: {prof.level}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 text-white">
          <CardHeader>
            <CardTitle>Experience</CardTitle>
          </CardHeader>
          <CardContent>
            {userDetails.experience.map((exp, index) => (
              <div key={index} className="mb-4">
                <h3 className="text-lg font-semibold">
                  {exp.jobTitle} at {exp.company}
                </h3>
                <p className="text-sm">{exp.location}</p>
                <p className="text-sm">
                  {new Date(exp.startDate).toLocaleDateString()} -{" "}
                  {exp.endDate
                    ? new Date(exp.endDate).toLocaleDateString()
                    : "Present"}
                </p>
                <ul className="list-disc list-inside mt-2 text-sm">
                  {exp.responsibilities.map((resp, respIndex) => (
                    <li key={respIndex}>{resp}</li>
                  ))}
                </ul>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="bg-gray-800 text-white">
        <CardHeader>
          <CardTitle>Education</CardTitle>
        </CardHeader>
        <CardContent>
          {userDetails.education.map((edu, index) => (
            <div key={index} className="mb-4">
              <h3 className="text-lg font-semibold">
                {edu.degree} in {edu.fieldOfStudy}
              </h3>
              <p className="text-sm">{edu.institution}</p>
              <p className="text-sm">
                {new Date(edu.startDate).toLocaleDateString()} -{" "}
                {new Date(edu.endDate).toLocaleDateString()}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>

      {userDetails.certifications.length > 0 && (
        <Card className="bg-gray-800 text-white">
          <CardHeader>
            <CardTitle>Certifications</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside">
              {userDetails.certifications.map((cert, index) => (
                <li key={index}>{cert}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {userDetails.languages.length > 0 && (
        <Card className="bg-gray-800 text-white">
          <CardHeader>
            <CardTitle>Languages</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside">
              {userDetails.languages.map((lang, index) => (
                <li key={index}>
                  {lang.language}: {lang.proficiency}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {userDetails.portfolioLink && (
        <Card className="bg-gray-800 text-white">
          <CardHeader>
            <CardTitle>Portfolio</CardTitle>
          </CardHeader>
          <CardContent>
            <a
              href={userDetails.portfolioLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:underline"
            >
              View Portfolio
            </a>
          </CardContent>
        </Card>
      )}

      {application.resume && (
        <Card className="bg-gray-800 text-white">
          <CardHeader>
            <CardTitle>Resume</CardTitle>
          </CardHeader>
          <CardContent>
            <Button
              onClick={openResume}
              className="bg-blue-500 hover:bg-blue-600"
            >
              <Icons.FileText className="w-4 h-4 mr-2" />
              Open Resume
            </Button>
          </CardContent>
        </Card>
      )}

      <InterviewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleInterviewUpdate}
        type={modalType}
      />
      <Dialog open={isStatusModalOpen} onOpenChange={setIsStatusModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Status</DialogTitle>
          </DialogHeader>
          <p>
            Selected status of this application: <b>{newStatus}</b>
          </p>
          <Textarea
            value={statusMessage}
            onChange={(e) => setStatusMessage(e.target.value)}
            placeholder="Enter status message"
          />
          <DialogFooter>
            <Button onClick={() => setIsStatusModalOpen(false)}>Cancel</Button>
            <Button
              onClick={() => {
                handleStatusChange(newStatus, statusMessage);
                setIsStatusModalOpen(false);
              }}
            >
              Update
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
