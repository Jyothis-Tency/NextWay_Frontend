"use client";

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Calendar,
  Clock,
  DollarSign,
  MapPin,
  Building,
  ArrowLeft,
  Briefcase,
  CheckCircle,
  Users,
} from "lucide-react";
import { fetchJobById } from "@/API/userAPI"; // You'll need to implement this function

export default function JobPostDetailed() {
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { _id } = useParams<{ _id: string }>();

  useEffect(() => {
    const getJobDetails = async () => {
      if (!_id) return;
      try {
        const jobData = await fetchJobById(_id);
        setJob(jobData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching job details:", error);
        setLoading(false);
      }
    };

    getJobDetails();
  }, [_id]);

  const handleApply = () => {
    // Implement apply functionality
    console.log("Applying for job:", job.title);
  };

  const handleExploreCompany = () => {
    // Navigate to company page
    navigate(`/company/${job.company._id}`);
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="bg-black text-white min-h-screen flex items-center justify-center">
        <div className="text-2xl">Loading...</div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="bg-black text-white min-h-screen flex items-center justify-center">
        <div className="text-2xl">Job not found</div>
      </div>
    );
  }

  const formattedDate = new Date(job.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="bg-black text-white min-h-screen">
      <div className="container mx-auto px-4 pt-4 pb-8">
        <Button
          variant="ghost"
          className="mb-4 text-white hover:text-red-500"
          onClick={handleGoBack}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Job Listings
        </Button>
        <Card className="bg-gray-800 text-white flex flex-col h-[calc(100vh-140px)]">
          <CardHeader className="pb-2">
            <CardTitle className="text-3xl font-bold">{job.title}</CardTitle>
            <p className="text-xl text-gray-400">{job.company.companyName}</p>
          </CardHeader>
          <CardContent className="flex-grow overflow-hidden">
            <ScrollArea className="h-full pr-4">
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center">
                    <MapPin className="mr-2 h-4 w-4 text-red-500" />
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center">
                    <DollarSign className="mr-2 h-4 w-4 text-green-500" />
                    <span>
                      ${job.salaryRange.min.toLocaleString()} - $
                      {job.salaryRange.max.toLocaleString()} / year
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="mr-2 h-4 w-4 text-blue-500" />
                    <span>{job.employmentType}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="mr-2 h-4 w-4 text-yellow-500" />
                    <span>Posted on {formattedDate}</span>
                  </div>
                </div>

                <Separator className="bg-gray-700" />

                <div>
                  <h3 className="text-2xl font-semibold mb-2 flex items-center">
                    <Briefcase className="mr-2 h-5 w-5 text-red-500" />
                    Job Overview
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    {job.description}
                  </p>
                </div>

                <Separator className="bg-gray-700" />

                <div>
                  <h3 className="text-2xl font-semibold mb-2 flex items-center">
                    <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                    Key Responsibilities
                  </h3>
                  <ul className="space-y-2 text-gray-300">
                    {job.responsibilities.map((resp: string, index: number) => (
                      <li key={index} className="flex items-start">
                        <span className="mr-2 mt-1 text-red-500">•</span>
                        <span>{resp}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Separator className="bg-gray-700" />

                <div>
                  <h3 className="text-2xl font-semibold mb-2 flex items-center">
                    <Users className="mr-2 h-5 w-5 text-blue-500" />
                    Qualifications & Skills
                  </h3>
                  <ul className="space-y-2 text-gray-300">
                    {job.skills.map((req: string, index: number) => (
                      <li key={index} className="flex items-start">
                        <span className="mr-2 mt-1 text-red-500">•</span>
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Separator className="bg-gray-700" />

                <div>
                  <h3 className="text-2xl font-semibold mb-2 flex items-center">
                    <Building className="mr-2 h-5 w-5 text-yellow-500" />
                    About {job.company.companyName}
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    {job.company.description}
                  </p>
                </div>
              </div>
            </ScrollArea>
          </CardContent>
          <CardFooter className="mt-6 pt-4 bg-gray-900 rounded-b-lg border-t border-gray-700">
            <div className="flex gap-4 justify-center w-full max-w-2xl mx-auto">
              <Button
                className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6"
                onClick={handleApply}
              >
                Apply Now
              </Button>
              <Button
                className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6"
                onClick={handleExploreCompany}
              >
                <Building className="mr-2 h-4 w-4" />
                Explore Company
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
