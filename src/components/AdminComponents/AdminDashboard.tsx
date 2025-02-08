import React, { useEffect, useState } from "react";
import { Header } from "@/components/Common/AdminCommon/Header";
import { Sidebar } from "@/components/Common/AdminCommon/Sidebar";
import { Footer } from "@/components/Common/AdminCommon/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Building, Briefcase, Loader2 } from "lucide-react";
import { axiosAdmin } from "@/Utils/axiosUtil"; // Adjust the import path as needed

interface DashboardData {
  totalUsers: number;
  totalCompanies: number;
  activeJobPosts: number;
}

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    totalUsers: 0,
    totalCompanies: 0,
    activeJobPosts: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [usersResponse, companiesResponse, jobPostsResponse] =
          await Promise.all([
            axiosAdmin.get("/all-users"),
            axiosAdmin.get("/all-companies"),
            axiosAdmin.get("/getAllJobPosts"),
          ]);
        console.log(jobPostsResponse.data.jobPosts.length);

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

        setDashboardData({
          totalUsers,
          totalCompanies,
          activeJobPosts, // This is still hardcoded as we don't have an API for this yet
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
