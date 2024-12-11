import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from "recharts";
import { WelcomeSection } from "./Welcome-Section";
import { RecentApplications } from "./Recent-Applications";
import { UpcomingInterviews } from "./Upcoming-Interviews";
import { TopJobPostings } from "./Top-Job-Postings";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { axiosCompany } from "@/Utils/axiosUtil";

const analyticsData = [
  { name: "Jan", applications: 400, interviews: 240, hires: 24 },
  { name: "Feb", applications: 300, interviews: 139, hires: 20 },
  { name: "Mar", applications: 200, interviews: 980, hires: 29 },
  { name: "Apr", applications: 278, interviews: 390, hires: 35 },
  { name: "May", applications: 189, interviews: 480, hires: 40 },
  { name: "Jun", applications: 239, interviews: 380, hires: 37 },
  { name: "Jul", applications: 349, interviews: 430, hires: 42 },
];

const hiringFunnelData = [
  { stage: "Applications", count: 1000 },
  { stage: "Screened", count: 500 },
  { stage: "Interviewed", count: 200 },
  { stage: "Offered", count: 50 },
  { stage: "Hired", count: 30 },
];

export const DashboardContent: React.FC = () => {
  const [jobs, setJobs] = useState([]);
  const [applications,setApplications]=useState([])
  const company_id = useSelector(
    (state: RootState) => state.company.companyInfo?.company_id
  );
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axiosCompany.get(
          `get-company-jobs/${company_id}`
        );
        const applications = await axiosCompany.get(
          `job-applications/${company_id}`
        );
        setApplications(applications.data.jobApplications)
        setJobs(response.data.jobPosts);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };

    if (company_id) fetchJobs();
  }, [company_id]);

  return (
    <div className="space-y-6 p-6 ml-64">
      <WelcomeSection />

      <h1 className="text-3xl font-bold text-white mt-8">
        Recruiter Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            title: "Total Job Posts",
            description: "Active job listings",
            value: jobs.length,
          },
          {
            title: "Total Applications",
            description: "Received this month",
            value: applications.length,
          },
          {
            title: "Interviews Scheduled",
            description: "For the next 7 days",
            value: 0,
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
