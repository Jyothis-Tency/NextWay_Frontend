import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Pencil } from "lucide-react";

import Header from "../Common/UserCommon/Header";
import Footer from "../Common/UserCommon/Footer";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Icons } from "@/components/ui/icons";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RootState } from "@/redux/store";
import { axiosSeeker } from "@/Utils/axiosUtil";
import { toast } from "sonner";

interface ISeeker {
  seeker_id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  profilePicture?: string;
  isBlocked: boolean;
  dob?: Date;
  gender?: string;
  location?: string;
  lastLogin?: Date;
  status: "active" | "inactive" | "suspended";
  preferredLocation?: string;
  preferredRoles?: string[];
  salaryExpectation?: number;
  remoteWork?: boolean;
  willingToRelocate?: boolean;
  resume?: string;
  bio?: string;
  skills?: string[];
  proficiency?: { skill: string; level: string }[];
  experience?: {
    jobTitle: string;
    company: string;
    location: string;
    startDate: Date;
    endDate?: Date;
    responsibilities: string[];
    reasonForLeaving?: string;
  }[];
  education?: {
    degree: string;
    institution: string;
    fieldOfStudy: string;
    startDate: Date;
    endDate: Date;
  }[];
  certifications?: string[];
  languages?: { language: string; proficiency: string }[];
  portfolioLink?: string;
  jobAlerts?: string[];
}

interface SeekerProfileResponse {
  seekerProfile: ISeeker;
  image:any
}

const JobSeekerProfile: React.FC = () => {
  const [seeker, setSeeker] = useState<ISeeker | null>(null);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const seekerId = useSelector(
    (state: RootState) => state.seeker.seekerInfo?.seeker_id
  );

  useEffect(() => {
    const fetchSeekerData = async () => {
      try {
        const response = await axiosSeeker.get<SeekerProfileResponse>(
          `/seeker-profile/${seekerId}`
        );
        console.log("seekerProfile - ", response.data.seekerProfile);
        console.log("image - ", response.data.image);
        
        setSeeker(response.data.seekerProfile);
        setImage(response.data.image);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch seeker data");
        setLoading(false);
      }
    };

    fetchSeekerData();
  }, [seekerId]);

  const handleEditProfile = () => {
    navigate("../profile-edit");
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setIsModalOpen(true);
    }
  };

  const handleConfirmUpload = async () => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append("profilePicture", selectedFile);
      console.log(selectedFile);
      const seeker_id = seekerId
      try {
        const response = await axiosSeeker.post(
          `/upload-profile-picture/${seeker_id}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (response.data.status) {
          toast.success("Profile picture updated")
        } else {
          console.error("Failed to upload profile picture");
        }
      } catch (error) {
        console.error("Error uploading profile picture:", error);
      }
    }
    setIsModalOpen(false);
    setSelectedFile(null);
  };

  const handleCancelUpload = () => {
    setIsModalOpen(false);
    setSelectedFile(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        {error}
      </div>
    );
  }

  if (!seeker) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        No seeker data found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <main className="container mx-auto px-4 py-8 space-y-8">
        <section className="flex flex-col md:flex-row gap-8 items-start">
          <Card className="w-full md:w-1/3 bg-gray-800 text-white">
            <CardHeader>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Avatar className="w-20 h-20">
                    <AvatarImage
                      src={image || "/placeholder.svg?height=80&width=80"}
                      alt="Profile picture"
                    />
                    <AvatarFallback>
                      {seeker.firstName[0]}
                      {seeker.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    className="absolute bottom-0 right-0 rounded-full p-1 bg-blue-500 hover:bg-blue-600"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    className="hidden"
                    accept="image/*"
                  />
                </div>
                <div>
                  <CardTitle className="text-2xl">
                    {seeker.firstName} {seeker.lastName}
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    {seeker.experience?.[0]?.jobTitle ?? "Job Seeker"}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Icons.MapPin className="h-4 w-4 text-gray-400" />
                  <span>{seeker.location ?? "Location not specified"}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Icons.Mail className="h-4 w-4 text-gray-400" />
                  <span>{seeker.email}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Icons.Phone className="h-4 w-4 text-gray-400" />
                  <span>{seeker.phone}</span>
                </div>
                {seeker.portfolioLink && (
                  <div className="flex items-center space-x-2">
                    <Icons.Link className="h-4 w-4 text-gray-400" />
                    <a
                      href={seeker.portfolioLink}
                      className="text-blue-400 hover:underline"
                    >
                      Portfolio
                    </a>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          <div className="w-full md:w-2/3 space-y-8">
            <Card className="bg-gray-800 text-white">
              <CardHeader>
                <CardTitle>About Me</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{seeker.bio ?? "No bio provided yet."}</p>
              </CardContent>
            </Card>
            <Card className="bg-gray-800 text-white">
              <CardHeader>
                <CardTitle>Skills</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {seeker.skills?.length ? (
                    seeker.skills.map((skill, index) => (
                      <Badge key={index} variant="secondary">
                        {skill}
                      </Badge>
                    ))
                  ) : (
                    <p>No skills listed yet.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
        <section className="space-y-8">
          <Card className="bg-gray-800 text-white">
            <CardHeader>
              <CardTitle>Work Experience</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {seeker.experience?.length ? (
                  seeker.experience.map((exp, index) => (
                    <div key={index}>
                      <h3 className="text-lg font-semibold">{exp.jobTitle}</h3>
                      <p className="text-gray-400">
                        {exp.company} | {exp.location} |{" "}
                        {new Date(exp.startDate).getFullYear()} -{" "}
                        {exp.endDate
                          ? new Date(exp.endDate).getFullYear()
                          : "Present"}
                      </p>
                      <ul className="list-disc list-inside mt-2 text-gray-300">
                        {exp.responsibilities.map((resp, idx) => (
                          <li key={idx}>{resp}</li>
                        ))}
                      </ul>
                    </div>
                  ))
                ) : (
                  <p>No work experience added yet.</p>
                )}
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gray-800 text-white">
            <CardHeader>
              <CardTitle>Education</CardTitle>
            </CardHeader>
            <CardContent>
              {seeker.education?.length ? (
                seeker.education.map((edu, index) => (
                  <div key={index}>
                    <h3 className="text-lg font-semibold">
                      {edu.degree} in {edu.fieldOfStudy}
                    </h3>
                    <p className="text-gray-400">
                      {edu.institution} |{" "}
                      {new Date(edu.startDate).getFullYear()} -{" "}
                      {new Date(edu.endDate).getFullYear()}
                    </p>
                  </div>
                ))
              ) : (
                <p>No education history added yet.</p>
              )}
            </CardContent>
          </Card>
          <Card className="bg-gray-800 text-white">
            <CardHeader>
              <CardTitle>Job Preferences</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold">Desired Roles</h3>
                  <p className="text-gray-300">
                    {seeker.preferredRoles?.join(", ") ?? "Not specified"}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold">Preferred Location</h3>
                  <p className="text-gray-300">
                    {seeker.preferredLocation ?? "Not specified"}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold">Work Environment</h3>
                  <p className="text-gray-300">
                    {seeker.remoteWork ? "Remote" : "On-site"}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold">Salary Expectation</h3>
                  <p className="text-gray-300">
                    {seeker.salaryExpectation
                      ? `$${seeker.salaryExpectation.toLocaleString()} per year`
                      : "Not specified"}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold">Willing to Relocate</h3>
                  <p className="text-gray-300">
                    {seeker.willingToRelocate ? "Yes" : "No"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
        <section className="flex justify-center space-x-4">
          <Button
            className="bg-red-600 hover:bg-red-700 text-white"
            disabled={!seeker.resume}
          >
            {seeker.resume ? "Download Resume" : "No Resume Available"}
          </Button>
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white"
            onClick={handleEditProfile}
          >
            Edit Profile
          </Button>
        </section>
      </main>
      <Footer />
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Profile Picture Upload</DialogTitle>
            <DialogDescription>
              Are you sure you want to upload this image as your new profile
              picture?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={handleCancelUpload}>
              Cancel
            </Button>
            <Button onClick={handleConfirmUpload}>Confirm Upload</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default JobSeekerProfile;
