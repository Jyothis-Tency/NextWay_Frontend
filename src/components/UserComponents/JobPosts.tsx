import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
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
  Clock,
  DollarSign,
  MapPin,
  Search,
  Building,
} from "lucide-react";
import { fetchJobs, submitJobApplication } from "@/API/userAPI";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RootState } from "@/redux/store";
import { toast } from "sonner";

export default function JobPosts() {
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [filteredJobs, setFilteredJobs] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchLocation, setSearchLocation] = useState("");
  const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false);
  const [isOverviewModalOpen, setIsOverviewModalOpen] = useState(false);
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
  const navigate = useNavigate();
  const userInfo = useSelector((state: RootState) => state.user.userInfo);

  useEffect(() => {
    const getJobPosts = async () => {
      try {
        const jobs = await fetchJobs();
        setFilteredJobs(jobs);
        if (jobs.length > 0) {
          setSelectedJob(jobs[0]);
        }
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };

    getJobPosts();
  }, []);

  useEffect(() => {
    if (userInfo) {
      setApplicationData((prevData) => ({
        ...prevData,
        firstName: userInfo.firstName || "",
        lastName: userInfo.lastName || "",
        email: userInfo.email || "",
        phone: userInfo.phone || "",
        location: "",
      }));
    }
  }, [userInfo]);

  const handleSearch = async () => {
    if (searchQuery.trim() === "" && searchLocation.trim() === "") {
      try {
        const jobs = await fetchJobs();
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
    setIsSkillBasedSorting(!isSkillBasedSorting);
    if (!isSkillBasedSorting) {
      const sortedJobs = [...filteredJobs].sort((a, b) => {
        const aMatchCount = countSkillMatches(a.requirements);
        const bMatchCount = countSkillMatches(b.requirements);
        return bMatchCount - aMatchCount;
      });
      setFilteredJobs(sortedJobs);
      if (sortedJobs.length > 0) {
        setSelectedJob(sortedJobs[0]);
      }
    } else {
      handleSearch(); // Reset to original order
    }
  };

  const countSkillMatches = (requirements: string[]) => {
    if (!userInfo || !userInfo.skills) return 0;
    return requirements.filter((req) =>
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

  const handleViewCompany = () => {
    if (selectedJob) {
      navigate(`/company/${selectedJob.company._id}`);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setApplicationData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setApplicationData((prev) => ({ ...prev, resume: e.target.files![0] }));
    }
  };

  const handleNext = () => {
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
        await submitJobApplication({
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
    <div className="bg-black text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-center mb-4">Job Listings</h1>
        <section className="max-w-3xl mx-auto mb-8 relative z-20">
          <div className="relative">
            <div className="flex flex-col sm:flex-row gap-2 p-2 bg-gray-900 rounded-lg border border-red-500 shadow-[0_0_15px_rgba(255,0,0,0.3)] hover:shadow-[0_0_20px_rgba(255,0,0,0.4)] transition-shadow">
              <Input
                type="text"
                placeholder="Job title, skills, or company"
                className="flex-1 bg-transparent border-none focus:ring-1 focus:ring-red-500 text-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="flex items-center gap-2 sm:px-4 sm:border-l border-gray-700">
                <MapPin className="w-5 h-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Location"
                  className="bg-transparent border-none focus:ring-1 focus:ring-red-500 text-white"
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                />
              </div>
              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white shadow-[0_0_10px_rgba(0,0,255,0.3)]"
                onClick={handleSearch}
              >
                <Search className="w-5 h-5 mr-2" />
                Search
              </Button>
            </div>
          </div>
        </section>
        <div className="flex justify-end mb-4">
          <Button
            onClick={handleSkillBasedSort}
            className={`${
              isSkillBasedSorting
                ? "bg-green-600 hover:bg-green-700"
                : "bg-blue-600 hover:bg-blue-700"
            } text-white`}
          >
            {isSkillBasedSorting ? "Reset Sorting" : "Sort by Skills"}
          </Button>
        </div>
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Job list */}
          <Card className="w-full lg:w-1/3 bg-gray-800 text-white">
            <CardHeader>
              <CardTitle>Available Positions</CardTitle>
              <CardDescription className="text-gray-400">
                Click on a job to view details
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-6">
              <ScrollArea className="h-[calc(100vh-400px)]">
                {filteredJobs.length > 0 ? (
                  filteredJobs.map((job) => (
                    <div key={job._id} className="mb-4">
                      <button
                        id={`job-${job._id}`}
                        onClick={() => setSelectedJob(job)}
                        className={`w-full text-left p-4 rounded-lg transition-colors ${
                          selectedJob?._id === job._id
                            ? "bg-blue-500 text-white"
                            : "bg-gray-800 hover:bg-gray-700"
                        }`}
                      >
                        <h3 className="font-semibold">{job.title}</h3>
                        <p className="text-sm text-black-400">
                          {job.company.companyName}
                        </p>
                        <p className="text-sm text-black-400">{job.location}</p>
                        {isSkillBasedSorting && (
                          <p className="text-sm text-green-400">
                            Skill Matches: {countSkillMatches(job.requirements)}
                          </p>
                        )}
                      </button>
                      {job._id !==
                        filteredJobs[filteredJobs.length - 1]._id && (
                        <Separator className="my-2 bg-gray-400" />
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-gray-400">
                    No job posts found. Please try a different search.
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
          {/* Job details */}
          <Card className="w-full lg:w-2/3 bg-gray-800 text-white">
            <CardHeader>
              <CardTitle>
                {filteredJobs.length > 0
                  ? selectedJob
                    ? selectedJob.title
                    : "No Job Selected"
                  : "No Jobs Found"}
              </CardTitle>
              <CardDescription className="text-gray-400">
                {filteredJobs.length > 0 && selectedJob
                  ? selectedJob.company.companyName
                  : ""}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {filteredJobs.length > 0 ? (
                selectedJob ? (
                  <ScrollArea className="h-[calc(100vh-400px)]">
                    <div className="space-y-4">
                      <div className="flex flex-wrap gap-2">
                        <Badge
                          variant="secondary"
                          className="bg-gray-700 text-white"
                        >
                          <MapPin className="mr-1 h-3 w-3" />
                          {selectedJob.location}
                        </Badge>
                        <Badge
                          variant="secondary"
                          className="bg-gray-700 text-white"
                        >
                          <DollarSign className="mr-1 h-3 w-3" />
                          {selectedJob.salaryRange.min} -{" "}
                          {selectedJob.salaryRange.max}
                        </Badge>
                        <Badge
                          variant="secondary"
                          className="bg-gray-700 text-white"
                        >
                          <Clock className="mr-1 h-3 w-3" />
                          {selectedJob.employmentType}
                        </Badge>
                        <Badge
                          variant="secondary"
                          className="bg-gray-700 text-white"
                        >
                          <Calendar className="mr-1 h-3 w-3" />
                          Posted {selectedJob.posted}
                        </Badge>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold mb-2">
                          Job Description
                        </h3>
                        <p className="text-gray-300">
                          {selectedJob.description}
                        </p>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold mb-2">
                          Responsibilities
                        </h3>
                        <ul className="list-disc pl-5 space-y-1 text-gray-300">
                          {selectedJob.responsibilities.map(
                            (resp: string, index: number) => (
                              <li key={index}>{resp}</li>
                            )
                          )}
                        </ul>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold mb-2">
                          Requirements
                        </h3>
                        <ul className="list-disc pl-5 space-y-1 text-gray-300">
                          {selectedJob.requirements.map(
                            (req: string, index: number) => (
                              <li key={index}>{req}</li>
                            )
                          )}
                        </ul>
                      </div>
                      <div className="flex gap-4">
                        {userInfo && (
                          <Button
                            className={`flex-1 ${
                              hasUserApplied(selectedJob)
                                ? "bg-gray-500 hover:bg-gray-500 cursor-not-allowed"
                                : "bg-blue-600 hover:bg-blue-700"
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
                  </ScrollArea>
                ) : (
                  <div className="text-center py-4 text-gray-400">
                    No job selected. Please choose a job from the list.
                  </div>
                )
              ) : (
                <div className="text-center py-4 text-gray-400">
                  No job posts found. Please try a different search.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Application Modal */}
      <Dialog
        open={isApplicationModalOpen}
        onOpenChange={setIsApplicationModalOpen}
      >
        <DialogContent className="bg-gray-800 text-white">
          <DialogHeader>
            <DialogTitle>Apply for {selectedJob?.title}</DialogTitle>
            <DialogDescription>
              Please fill out the application form below.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={applicationData.firstName}
                  onChange={handleInputChange}
                  className="bg-gray-700 text-white"
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  value={applicationData.lastName}
                  onChange={handleInputChange}
                  className="bg-gray-700 text-white"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                value={applicationData.email}
                onChange={handleInputChange}
                className="bg-gray-700 text-white"
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                name="phone"
                value={applicationData.phone}
                onChange={handleInputChange}
                className="bg-gray-700 text-white"
              />
            </div>
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                name="location"
                value={applicationData.location}
                onChange={handleInputChange}
                className="bg-gray-700 text-white"
              />
            </div>
            <div>
              <Label htmlFor="coverLetter">Cover Letter</Label>
              <Textarea
                id="coverLetter"
                name="coverLetter"
                value={applicationData.coverLetter}
                onChange={handleInputChange}
                className="bg-gray-700 text-white"
                rows={4}
              />
            </div>
            <div>
              <Label htmlFor="resume">Resume</Label>
              <Input
                id="resume"
                name="resume"
                type="file"
                onChange={handleFileChange}
                className="bg-gray-700 text-white"
                accept=".pdf,.doc,.docx"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={handleNext}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Next
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Overview Modal */}
      <Dialog open={isOverviewModalOpen} onOpenChange={setIsOverviewModalOpen}>
        <DialogContent className="bg-gray-800 text-white">
          <DialogHeader>
            <DialogTitle>Application Overview</DialogTitle>
            <DialogDescription>
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
              <p className="text-sm text-gray-300">
                {applicationData.coverLetter}
              </p>
            </div>
            <div>
              <h3 className="font-semibold">Resume</h3>
              <p className="text-sm text-gray-300">
                {applicationData.resume
                  ? applicationData.resume.name
                  : "No resume uploaded"}
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={handlePrevious}
              className="bg-gray-600 hover:bg-gray-700 text-white"
            >
              Previous
            </Button>
            <Button
              onClick={handleConfirmApply}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Confirm Apply
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
