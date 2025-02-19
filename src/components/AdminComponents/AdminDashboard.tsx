import React, { useEffect, useState } from "react";
import { Header } from "@/components/Common/AdminCommon/Header";
import { Sidebar } from "@/components/Common/AdminCommon/Sidebar";
import { Footer } from "@/components/Common/AdminCommon/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Building, Briefcase, Loader2 } from "lucide-react";
import adminAPIs from "@/API/adminAPIs";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface DashboardData {
  totalUsers: number;
  totalCompanies: number;
  activeJobPosts: number;
  jobPostsData: [];
}

interface IJobPost {
  _id: string;
  title: string;
  description: string;
  location: string;
  employmentType?: "Full-time" | "Part-time" | "Contract" | "Internship";
  salaryRange?: { min: number; max: number };
  skills?: string[];
  jobApplications?: string;
  responsibilities?: string[];
  perks?: string[];
  postedBy: string; // Reference to Recruiter
  company_id: string; // Reference to Company
  companyName: string;
  applicants?: string; // References JobApplication IDs
  status?: "open" | "closed" | "paused";
  createdAt: Date;
}

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    totalUsers: 0,
    totalCompanies: 0,
    activeJobPosts: 0,
    jobPostsData: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [usersResponse, companiesResponse, jobPostsResponse] =
          await Promise.all([
            adminAPIs.fetchAllUsers(),
            adminAPIs.fetchAllCompanies(),
            adminAPIs.fetchAllJobPosts(),
          ]);
        console.log("jyobpost", jobPostsResponse.data.jobPosts);

        const totalUsers = Array.isArray(usersResponse.data.userData)
          ? usersResponse.data.userData.length
          : 0;
        const totalCompanies = Array.isArray(companiesResponse.data.companyData)
          ? companiesResponse.data.companyData.length
          : 0;
        const activeJobPosts = Array.isArray(jobPostsResponse.data.jobPosts)
          ? jobPostsResponse.data.jobPosts.length
          : 0;
        console.log("...", activeJobPosts);

        const jobPosts = jobPostsResponse.data.jobPosts || [];

        setDashboardData({
          totalUsers,
          totalCompanies,
          activeJobPosts,
          jobPostsData: jobPosts,
        });
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Failed to fetch dashboard data. Please try again later.");
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const getTodayPosts = () => {
    const today = new Date().toDateString();
    return [
      {
        name: "Today",
        posts: dashboardData.jobPostsData.filter(
          (post: IJobPost) => new Date(post.createdAt).toDateString() === today
        ).length,
      },
    ];
  };

  // Calculate monthly posts
  const getMonthlyPosts = () => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 12 }, (_, month) => ({
      name: new Date(currentYear, month).toLocaleString("default", {
        month: "short",
      }),
      posts: dashboardData.jobPostsData.filter((post: IJobPost) => {
        const postDate = new Date(post.createdAt);
        return (
          postDate.getMonth() === month &&
          postDate.getFullYear() === currentYear
        );
      }).length,
    }));
  };

  // Calculate yearly posts
  const getYearlyPosts = () => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 5 }, (_, index) => {
      const year = currentYear - 4 + index;
      return {
        name: year.toString(),
        posts: dashboardData.jobPostsData.filter(
          (post: IJobPost) => new Date(post.createdAt).getFullYear() === year
        ).length,
      };
    });
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <main className="flex-1 overflow-y-auto pt-16 pl-64">
            <div className="p-6">
              <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : error ? (
                <div className="text-red-500 text-center">{error}</div>
              ) : (
                <>
                  {" "}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                          Total Users
                        </CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          {dashboardData.totalUsers}
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                          Total Companies
                        </CardTitle>
                        <Building className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          {dashboardData.totalCompanies}
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                          Active Job Posts
                        </CardTitle>
                        <Briefcase className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          {dashboardData.activeJobPosts}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Today's Job Posts</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="h-[300px] w-full">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={getTodayPosts()}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="name" />
                              <YAxis />
                              <Tooltip />
                              <Bar dataKey="posts" fill="#8884d8" />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Monthly Job Posts</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="h-[300px] w-full">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={getMonthlyPosts()}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="name" />
                              <YAxis />
                              <Tooltip />
                              <Bar dataKey="posts" fill="#82ca9d" />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Yearly Job Posts</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="h-[300px] w-full">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={getYearlyPosts()}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="name" />
                              <YAxis />
                              <Tooltip />
                              <Bar dataKey="posts" fill="#ffc658" />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </>
              )}
            </div>
          </main>
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
