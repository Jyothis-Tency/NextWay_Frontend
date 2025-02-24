import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Icons } from "@/components/ui/icons";
import { InterviewModal } from "../Common/CompanyCommon/InterviewModal";

import { v4 as uuidv4 } from "uuid";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "../ui/input";
import { Label } from "@/components/ui/label";
import companyAPIs from "@/API/companyAPIs";
import { useFormik } from "formik";
import * as Yup from "yup";

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

export const JobApplicationDetailed: React.FC = () => {
  const [application, setApplication] = useState<IJobApplication | null>(null);
  const [confirm, setConfirm] = useState(false);
  const [userDetails, setUserDetails] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);
  const { applicationId } = useParams<{ applicationId: string }>();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<
    "schedule" | "postpone" | "cancel" | "reopen"
  >("schedule");
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [newStatus, setNewStatus] =
    useState<IJobApplication["status"]>("Pending");
  const [statusMessage, setStatusMessage] = useState("");

  const statusUpdateSchema = Yup.object().shape({
    status: Yup.string()
      .oneOf(["Pending", "Shortlisted", "Rejected", "Hired"])
      .required("Status is required"),
    statusMessage: Yup.string()
      .required("Status message is required")
      .min(10, "Message must be at least 10 characters")
      .max(500, "Message must not exceed 500 characters"),
    offerLetter: Yup.mixed().when("status", {
      is: "Hired",
      then: (schema) =>
        schema.required("Offer letter is required when status is Hired"),
      otherwise: (schema) => schema.nullable(),
    }),
  });

  const formik = useFormik({
    initialValues: {
      status: newStatus,
      statusMessage: statusMessage,
      offerLetter: null,
    },
    validationSchema: statusUpdateSchema,
    onSubmit: async (values) => {
      try {
        await handleStatusChange(
          values.status as IJobApplication["status"],
          values.statusMessage,
          values.offerLetter
        );
        setIsStatusModalOpen(false);
        formik.resetForm();
      } catch (error) {
        console.error("Error updating status:", error);
      }
    },
  });

  useEffect(() => {
    formik.setFieldValue("status", newStatus);
  }, [newStatus]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      formik.setFieldValue("offerLetter", e.target.files[0]);
    }
  };

  useEffect(() => {
    const fetchApplicationDetails = async () => {
      try {
        setLoading(true);
        const applicationResponse = await companyAPIs.jobApplicationsDetailed(
          applicationId || ""
        );
        setApplication(applicationResponse.data.application);
        const user_id = applicationResponse.data.application.user_id;

        const userResponse = await companyAPIs.getUserProfile(user_id);
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
  }, [applicationId, confirm]);

  const handleStatusChange = async (
    status: IJobApplication["status"],
    message: string,
    pdfFile: File | null
  ) => {
    try {
      const formData = new FormData();
      formData.append("status", status);
      formData.append("statusMessage", message);
      if (pdfFile) {
        formData.append("offerLetter", pdfFile);
      }

      await companyAPIs.updateApplicationStatus(applicationId || "", formData);

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
      const base64Data = application.resume.replace(
        /^data:application\/pdf;base64,/,
        ""
      );
      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
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
      const response = await companyAPIs.setInterviewDetails(
        applicationId || "",
        dateTime,
        message,
        modalType
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
      const roomID = uuidv4();
      navigate(
        `../video-call?roomId=${roomID}&applicationId=${applicationId}&user_id=${application?.user_id}`
      );
    } catch (error) {
      console.error("Error starting interview:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-[#FFFFFF]">
        Loading...
      </div>
    );
  }

  if (!application || !userDetails) {
    return (
      <div className="flex justify-center items-center h-screen text-[#FFFFFF]">
        Application not found.
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 md:p-6 ml-0 md:ml-64 bg-[#121212]">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
        <h1 className="text-2xl md:text-3xl font-bold text-[#FFFFFF]">
          Application Details
        </h1>
        <Button
          onClick={() => navigate(-1)}
          className="bg-[#4F46E5] hover:bg-[#4338CA] text-[#FFFFFF] w-full md:w-auto"
        >
          <Icons.ArrowLeft className="w-4 h-4 mr-2" />
          Back to Applications
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-[#1E1E1E] text-[#FFFFFF] border-[#4B5563]">
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
                        ? "bg-[#F59E0B]"
                        : application.status === "Shortlisted"
                        ? "bg-[#3B82F6]"
                        : application.status === "Rejected"
                        ? "bg-[#EF4444]"
                        : "bg-[#10B981]"
                    } text-[#FFFFFF]`}
                  >
                    {application.status}
                  </Badge>
                </p>
                <Select
                  onValueChange={(value) =>
                    openStatusModal(value as IJobApplication["status"])
                  }
                >
                  <SelectTrigger className="w-full mt-2 bg-[#2D2D2D] text-[#FFFFFF] border-[#4B5563]">
                    <SelectValue placeholder="Change status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Shortlisted">Shortlisted</SelectItem>
                    <SelectItem value="Rejected">Rejected</SelectItem>
                    <SelectItem value="Hired">Hired</SelectItem>
                  </SelectContent>
                </Select>
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

        <Card className="bg-[#1E1E1E] text-[#FFFFFF] border-[#4B5563]">
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
                      <Button
                        onClick={() => handleInterviewAction("postpone")}
                        className="bg-[#F59E0B] hover:bg-[#D97706] text-[#FFFFFF]"
                      >
                        Postpone
                      </Button>
                      <Button
                        onClick={() => handleInterviewAction("cancel")}
                        className="bg-[#EF4444] hover:bg-[#DC2626] text-[#FFFFFF]"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={() => startInterview()}
                        className="bg-[#10B981] hover:bg-[#059669] text-[#FFFFFF]"
                      >
                        Start Interview
                      </Button>
                    </>
                  )}
                  {application.interview.interviewStatus === "conducted" && (
                    <Button
                      onClick={() => handleInterviewAction("schedule")}
                      className="bg-[#4F46E5] hover:bg-[#4338CA] text-[#FFFFFF]"
                    >
                      Schedule Interview
                    </Button>
                  )}
                  {application.interview.interviewStatus === "canceled" && (
                    <Button
                      onClick={() => handleInterviewAction("reopen")}
                      className="bg-[#4F46E5] hover:bg-[#4338CA] text-[#FFFFFF]"
                    >
                      Reopen Interview
                    </Button>
                  )}
                </div>
              </div>
            ) : (
              <Button
                onClick={() => handleInterviewAction("schedule")}
                className="bg-[#4F46E5] hover:bg-[#4338CA] text-[#FFFFFF]"
              >
                Schedule Interview
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
      <Card className="bg-[#1E1E1E] text-[#FFFFFF] border-[#4B5563]">
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
                  className="w-40 h-40 rounded-full object-cover border-4 border-[#4F46E5] shadow-lg mb-4"
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
                  <strong>Salary Expectation:</strong> ₹
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
        <Card className="bg-[#1E1E1E] text-[#FFFFFF] border-[#4B5563]">
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

        <Card className="bg-[#1E1E1E] text-[#FFFFFF] border-[#4B5563]">
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
      <Card className="bg-[#1E1E1E] text-[#FFFFFF] border-[#4B5563]">
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
        <Card className="bg-[#1E1E1E] text-[#FFFFFF] border-[#4B5563]">
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
        <Card className="bg-[#1E1E1E] text-[#FFFFFF] border-[#4B5563]">
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
        <Card className="bg-[#1E1E1E] text-[#FFFFFF] border-[#4B5563]">
          <CardHeader>
            <CardTitle>Portfolio</CardTitle>
          </CardHeader>
          <CardContent>
            <a
              href={userDetails.portfolioLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#60A5FA] hover:underline"
            >
              View Portfolio
            </a>
          </CardContent>
        </Card>
      )}
      {application.resume && (
        <Card className="bg-[#1E1E1E] text-[#FFFFFF] border-[#4B5563]">
          <CardHeader>
            <CardTitle>Resume</CardTitle>
          </CardHeader>
          <CardContent>
            <Button
              onClick={openResume}
              className="bg-[#4F46E5] hover:bg-[#4338CA] text-[#FFFFFF]"
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
        <DialogContent className="bg-[#1E1E1E] text-[#FFFFFF] border-[#4B5563]">
          <DialogHeader>
            <DialogTitle>Update Status</DialogTitle>
          </DialogHeader>
          <form onSubmit={formik.handleSubmit}>
            <p>
              Selected status of this application: <b>{newStatus}</b>
            </p>
            <div className="space-y-4 mb-4">
              <div>
                <Textarea
                  id="statusMessage"
                  name="statusMessage"
                  value={formik.values.statusMessage}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="Enter status message"
                  className={`bg-[#2D2D2D] text-[#FFFFFF] border-[#4B5563] ${
                    formik.touched.statusMessage && formik.errors.statusMessage
                      ? "border-red-500"
                      : ""
                  }`}
                />
                {formik.touched.statusMessage &&
                  formik.errors.statusMessage && (
                    <p className="text-red-500 text-sm mt-1">
                      {formik.errors.statusMessage}
                    </p>
                  )}
              </div>

              {newStatus === "Hired" && (
                <div className="space-y-2">
                  <Label htmlFor="offerLetter">Upload Offer Letter (PDF)</Label>
                  <Input
                    id="offerLetter"
                    name="offerLetter"
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                    onBlur={formik.handleBlur}
                    className={`bg-[#2D2D2D] text-[#FFFFFF] border-[#4B5563] ${
                      formik.touched.offerLetter && formik.errors.offerLetter
                        ? "border-red-500"
                        : ""
                    }`}
                  />
                  {formik.touched.offerLetter && formik.errors.offerLetter && (
                    <p className="text-red-500 text-sm mt-1">
                      {formik.errors.offerLetter}
                    </p>
                  )}
                </div>
              )}
            </div>

            <DialogFooter>
              <Button
                type="button"
                onClick={() => {
                  setIsStatusModalOpen(false);
                  formik.resetForm();
                }}
                className="bg-[#4F46E5] hover:bg-[#4338CA] text-[#FFFFFF]"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-[#10B981] hover:bg-[#059669] text-[#FFFFFF]"
                disabled={formik.isSubmitting || !formik.isValid}
              >
                {formik.isSubmitting ? "Updating..." : "Update"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* <Dialog open={isStatusModalOpen} onOpenChange={setIsStatusModalOpen}>
        <DialogContent className="bg-[#1E1E1E] text-[#FFFFFF] border-[#4B5563]">
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
            className="bg-[#2D2D2D] text-[#FFFFFF] border-[#4B5563]"
          />
          {newStatus === "Hired" && (
            <div className="space-y-2">
              <Label htmlFor="pdf-upload">Upload Offer Letter (PDF)</Label>
              <Input
                id="pdf-upload"
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="bg-[#2D2D2D] text-[#FFFFFF] border-[#4B5563]"
              />
            </div>
          )}
          <DialogFooter>
            <Button
              onClick={() => setIsStatusModalOpen(false)}
              className="bg-[#4F46E5] hover:bg-[#4338CA] text-[#FFFFFF]"
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                handleStatusChange(newStatus, statusMessage, pdfFile);
                setIsStatusModalOpen(false);
              }}
              className="bg-[#10B981] hover:bg-[#059669] text-[#FFFFFF]"
            >
              Update
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog> */}
    </div>
  );
};
