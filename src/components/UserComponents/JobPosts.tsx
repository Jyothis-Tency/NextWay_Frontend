import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Calendar,
  CheckCircle,
  Clock,
  DollarSign,
  MapPin,
  Search,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import NotSubscribedModal from "../Common/UserCommon/NotSubscribedModal";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { RootState } from "@/redux/store";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import CompanyStatic from "../../../public/Comany-Static-Logo.svg";
import userAPIs from "@/API/userAPIs";

// Validation schema using Yup
const applicationSchema = Yup.object().shape({
  firstName: Yup.string().required("First name is required"),
  lastName: Yup.string().required("Last name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  phone: Yup.string().required("Phone number is required"),
  location: Yup.string().required("Location is required"),
  coverLetter: Yup.string().required("Cover letter is required"),
  resume: Yup.mixed()
    .required("Resume is required")
    .test("fileFormat", "Resume must be a PDF", (value) => {
      if (value && value instanceof File) {
        return value.type === "application/pdf";
      }
      return false;
    }),
});

export default function JobPosts() {
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [filteredJobs, setFilteredJobs] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchLocation, setSearchLocation] = useState("");
  const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false);
  const [isOverviewModalOpen, setIsOverviewModalOpen] = useState(false);
  const [notSubscribedModalOpen, setNotSubscribedModalOpen] = useState(false);
  const [applicationData, setApplicationData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    location: "",
    coverLetter: "",
    resume: null as File | null,
  });
  const [isSkillBasedSorting, setIsSkillBasedSorting] = useState(false);
  const [appliedJobs, setAppliedJobs] = useState<string[]>([]);
  const [allProfileImages, setAllProfileImages] = useState<
    {
      company_id: string;
      profileImage: string;
    }[]
  >([]);
  const navigate = useNavigate();
  const location = useLocation();
  const userInfo = useSelector((state: RootState) => state.user.userInfo);

  useEffect(() => {
    const getJobPosts = async () => {
      try {
        const jobs = await userAPIs.fetchJobs();
        setFilteredJobs(jobs);
        const params = new URLSearchParams(location.search);
        const jobIdFromUrl = params.get("selectedJobId");

        if (jobIdFromUrl) {
          const jobToSelect = jobs.find((job: any) => job._id === jobIdFromUrl);
          if (jobToSelect) {
            setSelectedJob(jobToSelect);
            return;
          }
        }
        if (jobs.length > 0) {
          setSelectedJob(jobs[0]);
        }
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };

    getJobPosts();
    getAllProfileImages();
  }, []);

  useEffect(() => {
    if (userInfo) {
      setApplicationData((prevData) => ({
        ...prevData,
        firstName: userInfo.firstName || "",
        lastName: userInfo.lastName || "",
        email: userInfo.email || "",
        phone: userInfo.phone || "",
        location: userInfo.location || "",
      }));
    }
  }, [userInfo]);

  const getAllProfileImages = async () => {
    try {
      const response = await userAPIs.getAllCompanyProfileImages();
      setAllProfileImages(response.data);
    } catch (error) {
      console.error("Error fetching profile images:", error);
    }
  };

  const renderCompanyAvatar = (companyId: string, companyName: string) => {
    const companyProfileImage = allProfileImages.find(
      (img) => img.company_id === companyId
    )?.profileImage;

    return (
      <Avatar className="h-8 w-12 mr-2 mb-3">
        <AvatarImage
          src={companyProfileImage || CompanyStatic}
          alt={companyName}
          className="w-12 h-12 rounded-full"
        />
        <AvatarFallback>{companyName[0]}</AvatarFallback>
      </Avatar>
    );
  };

  const handleSearch = async () => {
    if (searchQuery.trim() === "" && searchLocation.trim() === "") {
      try {
        const jobs = await userAPIs.fetchJobs();
        setFilteredJobs(jobs);
        if (jobs.length > 0) {
          setSelectedJob(jobs[0]);
        }
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    } else {
      const filtered = filteredJobs.filter(
        (job) =>
          (job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            job.skills.some((req: string) =>
              req.toLowerCase().includes(searchQuery.toLowerCase())
            ) ||
            job.company.companyName
              .toLowerCase()
              .includes(searchQuery.toLowerCase()) ||
            job.description
              .toLowerCase()
              .includes(searchQuery.toLowerCase())) &&
          job.location.toLowerCase().includes(searchLocation.toLowerCase())
      );
      setFilteredJobs(filtered);
      if (filtered.length > 0) {
        setSelectedJob(filtered[0]);
      }
    }
  };

  const handleSkillBasedSort = () => {
    if (
      userInfo?.isSubscribed &&
      userInfo.subscriptionFeatures?.includes("job_post_skill_filter")
    ) {
      setIsSkillBasedSorting(!isSkillBasedSorting);
      if (!isSkillBasedSorting) {
        const sortedJobs = [...filteredJobs].sort((a, b) => {
          const aMatchCount = countSkillMatches(a.skills);
          const bMatchCount = countSkillMatches(b.skills);
          return bMatchCount - aMatchCount;
        });
        setFilteredJobs(sortedJobs);
        if (sortedJobs.length > 0) {
          setSelectedJob(sortedJobs[0]);
        }
      } else {
        handleSearch(); // Reset to original order
      }
    } else {
      setNotSubscribedModalOpen(true);
    }
  };

  const countSkillMatches = (skills: string[]) => {
    if (!userInfo || !userInfo.skills) return 0;
    return skills.filter((req) =>
      userInfo.skills.some((skill) =>
        req.toLowerCase().includes(skill.toLowerCase())
      )
    ).length;
  };

  const hasUserApplied = (job: any) => {
    return (
      job.applicants.includes(userInfo?.user_id) ||
      appliedJobs.includes(job._id)
    );
  };

  const handleApply = () => {
    if (!hasUserApplied(selectedJob)) {
      setIsApplicationModalOpen(true);
    }
  };

  const handleNext = (values: typeof applicationData) => {
    setApplicationData(values);
    setIsApplicationModalOpen(false);
    setIsOverviewModalOpen(true);
  };

  const handlePrevious = () => {
    setIsOverviewModalOpen(false);
    setIsApplicationModalOpen(true);
  };

  const handleConfirmApply = async () => {
    if (selectedJob && userInfo && applicationData.resume) {
      try {
        console.log("resume: applicationData.resume", applicationData.resume);

        await userAPIs.submitJobApplication({
          job_id: selectedJob._id,
          company_id: selectedJob.company_id,
          user_id: userInfo.user_id,
          companyName: selectedJob.company.companyName,
          jobTitle: selectedJob.title,
          ...applicationData,
          resume: applicationData.resume,
        });
        setIsOverviewModalOpen(false);
        toast.success("Job Applied Successfully");
        setAppliedJobs((prev) => [...prev, selectedJob._id]);
      } catch (error) {
        toast.error("Error occurred while applying");
        console.error("Error submitting application:", error);
      }
    } else {
      toast.error("Please upload your resume before applying");
    }
  };

  return (
    <div className="bg-[#000000] text-white min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-center mb-4">Job Listings</h1>
        <section className="max-w-3xl mx-auto mb-8 relative z-20">
          <div className="relative">
            <div className="flex flex-col sm:flex-row gap-2 p-2 bg-[#2D2D2D] rounded-lg border border-[#4F46E5] shadow-[0_0_15px_rgba(79,70,229,0.3)] hover:shadow-[0_0_20px_rgba(79,70,229,0.4)] transition-shadow">
              <Input
                type="text"
                placeholder="Job title, skills, or company"
                className="flex-1 bg-transparent border-none focus:ring-1 focus:ring-[#4F46E5] text-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="flex items-center gap-2 sm:px-4 sm:border-l border-[#4F46E5]">
                <MapPin className="w-5 h-5 text-[#A0A0A0]" />
                <Input
                  type="text"
                  placeholder="Location"
                  className="bg-transparent border-none focus:ring-1 focus:ring-[#4F46E5] text-white"
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                />
              </div>
              <Button
                className="bg-[#4F46E5] hover:bg-[#6366F1] text-white shadow-[0_0_10px_rgba(79,70,229,0.3)]"
                onClick={handleSearch}
              >
                <Search className="w-5 h-5 mr-2" />
                Search
              </Button>
            </div>
          </div>
        </section>
        <div className="flex justify-end mb-4">
          {userInfo && (
            <Button
              onClick={handleSkillBasedSort}
              className={`${
                isSkillBasedSorting
                  ? "bg-[#22C55E] hover:bg-[#16A34A]"
                  : "bg-[#4F46E5] hover:bg-[#6366F1]"
              } text-white`}
            >
              {isSkillBasedSorting ? "Reset Sorting" : "Sort by Skills"}
            </Button>
          )}
        </div>
        <div className="flex flex-col lg:flex-row gap-6">
          <Card className="w-full lg:w-1/3 bg-[#2D2D2D] text-white border-[#4F46E5]">
            <CardHeader>
              <CardTitle>Available Positions</CardTitle>
              <CardDescription className="text-[#A0A0A0]">
                Click on a job to view details
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-6">
              <ScrollArea className="h-[calc(100vh-400px)]">
                {filteredJobs.length > 0 ? (
                  filteredJobs.map((job) => (
                    <div key={job._id} className="mb-4">
                      <button
                        onClick={() => setSelectedJob(job)}
                        className={`w-full text-left p-4 cursor-pointer rounded-lg transition-colors ${
                          selectedJob?._id === job._id
                            ? "bg-[#1b1938] text-white"
                            : "bg-[#2D2D2D] hover:bg-[#3D3D3D]"
                        }`}
                      >
                        {renderCompanyAvatar(job.company_id, "")}
                        <h3 className="font-semibold">{job.title}</h3>
                        <p
                          className="text-sm text-[#A0A0A0]"
                          onClick={() =>
                            navigate(`../company-profile/${job.company_id}`)
                          }
                        >
                          {job.company.companyName}
                        </p>
                        <CardDescription className="flex items-center space-x-2 mt-2">
                          {selectedJob?.company.isVerified === "accept" ? (
                            <>
                              <CheckCircle className="w-4 h-4 text-green-500" />
                              <span>Verified by Next Way</span>
                            </>
                          ) : (
                            <>
                              <Clock className="w-4 h-4 text-yellow-500" />
                              <span>Not Verified by Next Way</span>
                            </>
                          )}
                        </CardDescription>
                        <p className="text-sm text-[#A0A0A0]">{job.location}</p>
                        {isSkillBasedSorting && (
                          <p className="text-sm text-[#22C55E]">
                            Skill Matches: {countSkillMatches(job.skills)}
                          </p>
                        )}
                      </button>
                      {job._id !==
                        filteredJobs[filteredJobs.length - 1]._id && (
                        <Separator className="my-2 bg-[#4F46E5]" />
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-[#A0A0A0]">
                    No job posts found. Please try a different search.
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
          <Card className="w-full lg:w-2/3 bg-[#2D2D2D] text-white border-[#4F46E5]">
            <CardHeader>
              {renderCompanyAvatar(selectedJob?.company_id, "")}
              <CardTitle>
                {filteredJobs.length > 0
                  ? selectedJob
                    ? selectedJob.title
                    : "No Job Selected"
                  : "No Jobs Found"}
              </CardTitle>
              <CardDescription
                className="text-[#A0A0A0] cursor-pointer"
                onClick={() => {
                  console.log("onclick", selectedJob);

                  navigate(`../company-profile/${selectedJob.company_id}`);
                }}
              >
                {filteredJobs.length > 0 && selectedJob
                  ? selectedJob.company.companyName
                  : ""}
              </CardDescription>
              <CardDescription className="flex items-center space-x-2 mt-2">
                {selectedJob?.company.isVerified === "accept" ? (
                  <>
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Verified by Next Way</span>
                  </>
                ) : (
                  <>
                    <Clock className="w-4 h-4 text-yellow-500" />
                    <span>Not Verified by Next Way</span>
                  </>
                )}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {filteredJobs.length > 0 ? (
                selectedJob ? (
                  <div>
                    <ScrollArea className="h-[calc(100vh-400px)]">
                      <div className="space-y-4">
                        <div className="flex flex-wrap gap-2">
                          <Badge
                            variant="secondary"
                            className="bg-[#3D3D3D] text-white"
                          >
                            <MapPin className="mr-1 h-3 w-3" />
                            {selectedJob.location}
                          </Badge>
                          <Badge
                            variant="secondary"
                            className="bg-[#3D3D3D] text-white"
                          >
                            <DollarSign className="mr-1 h-3 w-3" />
                            {selectedJob.salaryRange.min} -{" "}
                            {selectedJob.salaryRange.max}
                          </Badge>
                          <Badge
                            variant="secondary"
                            className="bg-[#3D3D3D] text-white"
                          >
                            <Clock className="mr-1 h-3 w-3" />
                            {selectedJob.employmentType}
                          </Badge>
                          <Badge
                            variant="secondary"
                            className="bg-[#3D3D3D] text-white"
                          >
                            <Calendar className="mr-1 h-3 w-3" />
                            Posted {selectedJob.posted}
                          </Badge>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold mb-2">
                            Job Description
                          </h3>
                          <p className="text-[#E0E0E0]">
                            {selectedJob.description}
                          </p>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold mb-2">
                            Responsibilities
                          </h3>
                          <ul className="list-disc pl-5 space-y-1 text-[#E0E0E0]">
                            {selectedJob.responsibilities.map(
                              (resp: string, index: number) => (
                                <li key={index}>{resp}</li>
                              )
                            )}
                          </ul>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold mb-2">skills</h3>
                          <ul className="list-disc pl-5 space-y-1 text-[#E0E0E0]">
                            {selectedJob.skills.map(
                              (req: string, index: number) => (
                                <li key={index}>{req}</li>
                              )
                            )}
                          </ul>
                        </div>
                      </div>
                    </ScrollArea>
                    <div className="mt-4">
                      <div className="flex gap-4">
                        {userInfo && (
                          <Button
                            className={`flex-1 ${
                              hasUserApplied(selectedJob)
                                ? "bg-[#4B5563] hover:bg-[#4B5563] cursor-not-allowed"
                                : "bg-[#4F46E5] hover:bg-[#6366F1]"
                            } text-white`}
                            onClick={
                              hasUserApplied(selectedJob)
                                ? undefined
                                : handleApply
                            }
                            disabled={hasUserApplied(selectedJob)}
                          >
                            {hasUserApplied(selectedJob)
                              ? "Already Applied"
                              : "Apply"}
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4 text-[#A0A0A0]">
                    No job selected. Please choose a job from the list.
                  </div>
                )
              ) : (
                <div className="text-center py-4 text-[#A0A0A0]">
                  No job posts found. Please try a different search.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog
        open={isApplicationModalOpen}
        onOpenChange={setIsApplicationModalOpen}
      >
        <DialogContent className="bg-[#2D2D2D] text-white border-[#4F46E5]">
          <DialogHeader>
            <DialogTitle>Apply for {selectedJob?.title}</DialogTitle>
            <DialogDescription className="text-[#A0A0A0]">
              Please fill out the application form below.
            </DialogDescription>
          </DialogHeader>
          <Formik
            initialValues={applicationData}
            validationSchema={applicationSchema}
            onSubmit={handleNext}
          >
            {({ setFieldValue }) => (
              <Form className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Field
                      as={Input}
                      id="firstName"
                      name="firstName"
                      className="bg-[#3D3D3D] text-white"
                    />
                    <ErrorMessage
                      name="firstName"
                      component="div"
                      className="text-[#EF4444] text-sm"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Field
                      as={Input}
                      id="lastName"
                      name="lastName"
                      className="bg-[#3D3D3D] text-white"
                    />
                    <ErrorMessage
                      name="lastName"
                      component="div"
                      className="text-[#EF4444] text-sm"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Field
                    as={Input}
                    id="email"
                    name="email"
                    className="bg-[#3D3D3D] text-white"
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-[#EF4444] text-sm"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Field
                    as={Input}
                    id="phone"
                    name="phone"
                    className="bg-[#3D3D3D] text-white"
                  />
                  <ErrorMessage
                    name="phone"
                    component="div"
                    className="text-[#EF4444] text-sm"
                  />
                </div>
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Field
                    as={Input}
                    id="location"
                    name="location"
                    className="bg-[#3D3D3D] text-white"
                  />
                  <ErrorMessage
                    name="location"
                    component="div"
                    className="text-[#EF4444] text-sm"
                  />
                </div>
                <div>
                  <Label htmlFor="coverLetter">Cover Letter</Label>
                  <Field
                    as={Textarea}
                    id="coverLetter"
                    name="coverLetter"
                    className="bg-[#3D3D3D] text-white"
                    rows={4}
                  />
                  <ErrorMessage
                    name="coverLetter"
                    component="div"
                    className="text-[#EF4444] text-sm"
                  />
                </div>
                <div>
                  <Label htmlFor="resume">Resume (PDF only)</Label>
                  <input
                    id="resume"
                    name="resume"
                    type="file"
                    onChange={(event) => {
                      setFieldValue("resume", event.currentTarget.files?.[0]);
                    }}
                    className="bg-[#3D3D3D] text-white"
                    accept=".pdf"
                  />
                  <ErrorMessage
                    name="resume"
                    component="div"
                    className="text-[#EF4444] text-sm"
                  />
                </div>
                <DialogFooter>
                  <Button
                    type="submit"
                    className="bg-[#4F46E5] hover:bg-[#6366F1] text-white"
                  >
                    Next
                  </Button>
                </DialogFooter>
              </Form>
            )}
          </Formik>
        </DialogContent>
      </Dialog>

      <Dialog open={isOverviewModalOpen} onOpenChange={setIsOverviewModalOpen}>
        <DialogContent className="bg-[#2D2D2D] text-white border-[#4F46E5]">
          <DialogHeader>
            <DialogTitle>Application Overview</DialogTitle>
            <DialogDescription className="text-[#A0A0A0]">
              Please review your application details before submitting.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div>
              <h3 className="font-semibold">Job Details</h3>
              <p>Position: {selectedJob?.title}</p>
              <p>Company: {selectedJob?.company.companyName}</p>
              <p>Location: {selectedJob?.location}</p>
            </div>
            <div>
              <h3 className="font-semibold">Your Information</h3>
              <p>
                Name: {applicationData.firstName} {applicationData.lastName}
              </p>
              <p>Email: {applicationData.email}</p>
              <p>Phone: {applicationData.phone}</p>
              <p>Location: {applicationData.location}</p>
            </div>
            <div>
              <h3 className="font-semibold">Cover Letter</h3>
              <p className="text-sm text-[#E0E0E0]">
                {applicationData.coverLetter}
              </p>
            </div>
            <div>
              <h3 className="font-semibold">Resume</h3>
              <p className="text-sm text-[#E0E0E0]">
                {applicationData.resume
                  ? applicationData.resume.name
                  : "No resume uploaded"}
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={handlePrevious}
              className="bg-[#4B5563] hover:bg-[#6B7280] text-white"
            >
              Previous
            </Button>
            <Button
              onClick={handleConfirmApply}
              className="bg-[#4F46E5] hover:bg-[#6366F1] text-white"
            >
              Confirm Apply
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <NotSubscribedModal
        isOpen={notSubscribedModalOpen}
        onClose={() => setNotSubscribedModalOpen(false)}
      />
    </div>
  );
}
