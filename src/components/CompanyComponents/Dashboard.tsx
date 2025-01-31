import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { axiosCompany } from "@/Utils/axiosUtil";
import { useNavigate } from "react-router-dom";

interface IJobApplication {
  job_id: string;
  user_id: string;
  company_id: string;
  companyName: string;
  jobTitle: string;
  firstName: string;
  lastName: string;
  email: string;
  location?: string;
  phone?: string;
  resume: string; // URL to the resume file
  coverLetter?: string; // Optional cover letter text
  status: "Pending" | "Viewed" | "Shortlisted" | "Rejected" | "Hired";
  interview?: {
    interviewStatus: "scheduled" | "over" | "canceled" | "postponed";
    dateTime?: Date;
    message?: string;
  };
  createdAt?: Date;
  updatedAt?: Date;
}

const CompanyDashboard: React.FC = () => {
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const companyData = useSelector(
    (state: RootState) => state.company.companyInfo
  );
  const navigate = useNavigate();
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axiosCompany.get(
          `get-company-jobs/${companyData?.company_id}`
        );
        const applications = await axiosCompany.get(
          `job-applications/${companyData?.company_id}`
        );
        setApplications(applications.data.jobApplications);
        setJobs(response.data.jobPosts);
        const filteredInterviews = applications.data.jobApplications
          .filter(
            (application: IJobApplication) =>
              application.interview !== null &&
              (application.interview?.interviewStatus === "scheduled" ||
                application.interview?.interviewStatus === "postponed")
          )
          .map((application: IJobApplication) => application); // Optional if you just need to pass the filtered applications

        setInterviews(filteredInterviews);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };

    if (companyData?.company_id) fetchJobs();
  }, [companyData?.company_id]);

  return (
    <div className="space-y-6 p-6 ml-64">
      <section
        className="relative w-full h-[400px] flex items-center justify-center bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://as2.ftcdn.net/v2/jpg/08/10/92/69/1000_F_810926942_LcXpqYlTiWNcNntJpVTh8nr510jnZniK.jpg')",
        }}
      >
        <div className="absolute inset-0 bg-black opacity-90"></div>
        <div className="relative z-10 text-center space-y-6 px-4 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-white">
            Welcome {companyData?.name}!
          </h1>
          <p className="text-xl text-gray-300">
            Ready to find top talent for your company?
          </p>
          <Button
            className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-full text-lg"
            onClick={() => navigate("../create-job-post")}
          >
            Post a New Job
          </Button>
        </div>
      </section>

      <h1 className="text-3xl font-bold text-white mt-8">
        Recruiter Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            title: "Total Job Posts",
            description: "Total active job posts currently",
            value: jobs.length,
          },
          {
            title: "Total Applications",
            description: "Total applications received currently",
            value: applications.length,
          },
          {
            title: "Interviews Scheduled",
            description: "Total interviews scheduled currently",
            value: interviews.length,
          },
        ].map((item, index) => (
          <Card
            key={index}
            className="bg-[#0f1117] border border-red-500 hover:border-red-400 transition-colors"
          >
            <CardHeader>
              <CardTitle className="text-white">{item.title}</CardTitle>
              <CardDescription className="text-gray-400">
                {item.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-white">{item.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      {/* 
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-[#0f1117] border border-red-500 hover:border-red-400 transition-colors">
          <CardHeader>
            <CardTitle className="text-white">Recruitment Analytics</CardTitle>
            <CardDescription className="text-gray-400">
              Applications, Interviews, and Hires over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={analyticsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="name" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1F2937",
                      border: "none",
                      borderRadius: "8px",
                    }}
                    itemStyle={{ color: "#E5E7EB" }}
                    labelStyle={{ color: "#E5E7EB" }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="applications"
                    stroke="#8884d8"
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="interviews"
                    stroke="#82ca9d"
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="hires"
                    stroke="#ffc658"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#0f1117] border border-red-500 hover:border-red-400 transition-colors">
          <CardHeader>
            <CardTitle className="text-white">Hiring Funnel</CardTitle>
            <CardDescription className="text-gray-400">
              Candidate progression through stages
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={hiringFunnelData}
                  layout="vertical"
                  barSize={20}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis type="number" stroke="#9CA3AF" />
                  <YAxis
                    dataKey="stage"
                    type="category"
                    stroke="#9CA3AF"
                    width={100}
                    tickFormatter={(value) => value.split(" ").join("\n")}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1F2937",
                      border: "none",
                      borderRadius: "8px",
                    }}
                    itemStyle={{ color: "#E5E7EB" }}
                    labelStyle={{ color: "#E5E7EB" }}
                  />
                  <Legend />
                  <Bar dataKey="count" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <RecentApplications />
        <UpcomingInterviews />
      </div>

      <TopJobPostings /> */}
    </div>
  );
};

export default CompanyDashboard;