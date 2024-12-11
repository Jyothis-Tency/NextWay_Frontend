import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Icons } from "@/components/ui/icons";
import { axiosCompany } from "@/Utils/axiosUtil";

interface ICompany {
  company_id: string;
  email: string;
  phone: string;
  profilePicture?: string;
  name: string;
  description?: string;
  industry?: string;
  companySize?: number;
  location?: string;
  website?: string;
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
  };
  employees?: Array<{
    employeeId: string;
    role: string;
  }>;
  logo?: string;
  images?: string[];
  status: "pending" | "approved" | "rejected";
  jobPosts?: string[];
  isBlocked: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export function CompanyProfile() {
  const [company, setCompany] = useState<ICompany | null>(null);
  const [loading, setLoading] = useState(true);
  const company_id = useSelector(
    (state: RootState) => state.company.companyInfo?.company_id
  );

  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        setLoading(true);
        const response = await axiosCompany.get(`get-company/${company_id}`);
        console.log(`get-company - ${response.data.companyData.name}`);

        setCompany(response.data.companyData);
      } catch (error) {
        console.error("Error fetching company data:", error);
        setCompany(null);
      } finally {
        setLoading(false);
      }
    };

    if (company_id) fetchCompanyData();
  }, [company_id]);

  if (loading) {
    return <div className="text-white text-center mt-8">Loading...</div>;
  }

  if (!company) {
    return (
      <div className="text-white text-center mt-8">
        <p>No company details found.</p>
        <Button
          onClick={() => (window.location.href = "/recruiter/company-form")}
          className="mt-4 bg-blue-500 hover:bg-blue-600"
        >
          Add Company Details
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 ml-64">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Company Profile</h1>
        <Button
          onClick={() => (window.location.href = "/company/profile-edit")}
          className="bg-blue-500 hover:bg-blue-600"
        >
          <Icons.Pencil className="w-4 h-4 mr-2" />
          Edit Company Profile
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1 bg-gray-800 text-white">
          <CardHeader>
            <div className="flex items-center space-x-4">
              <Avatar className="w-20 h-20">
                <img
                  src={company.logo || "/placeholder.svg?height=80&width=80"}
                  alt="Company logo"
                />
              </Avatar>
              <div>
                <CardTitle className="text-2xl">{company.name}</CardTitle>
                <CardDescription className="text-gray-400">
                  {company.industry || "Industry not specified"}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Icons.MapPin className="h-4 w-4 text-gray-400" />
                <span>{company.location || "Location not specified"}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Icons.Mail className="h-4 w-4 text-gray-400" />
                <span>{company.email}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Icons.Phone className="h-4 w-4 text-gray-400" />
                <span>{company.phone}</span>
              </div>
              {company.website && (
                <div className="flex items-center space-x-2">
                  <Icons.Link className="h-4 w-4 text-gray-400" />
                  <a
                    href={company.website}
                    className="text-blue-400 hover:underline"
                  >
                    Website
                  </a>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        <Card className="md:col-span-2 bg-gray-800 text-white">
          <CardHeader>
            <CardTitle>About Us</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{company.description || "No description provided yet."}</p>
          </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-gray-800 text-white">
          <CardHeader>
            <CardTitle>Company Size</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              {company.companySize || "Company size not specified"} employees
            </p>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 text-white">
          <CardHeader>
            <CardTitle>Social Links</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-4">
              {company.socialLinks?.linkedin && (
                <a
                  href={company.socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:underline"
                >
                  LinkedIn
                </a>
              )}
              {company.socialLinks?.twitter && (
                <a
                  href={company.socialLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:underline"
                >
                  Twitter
                </a>
              )}
              {company.socialLinks?.facebook && (
                <a
                  href={company.socialLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:underline"
                >
                  Facebook
                </a>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      {/* <Card className="bg-gray-800 text-white">
        <CardHeader>
          <CardTitle>Job Posts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {company.jobPosts && company.jobPosts.length > 0 ? (
              company.jobPosts.slice(0, 5).map((job, index) => (
                <div key={index}>
                  <h3 className="text-lg font-semibold">{job}</h3>
                </div>
              ))
            ) : (
              <p>No job posts added yet.</p>
            )}
            {(company.jobPosts?.length || 0) > 5 && (
              <p className="text-blue-400 mt-2 cursor-pointer">
                View all job posts
              </p>
            )}
          </div>
        </CardContent>
      </Card>
      <Card className="bg-gray-800 text-white">
        <CardHeader>
          <CardTitle>Key Employees</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {company.employees && company.employees.length > 0 ? (
              company.employees.slice(0, 5).map((employee, index) => (
                <div key={index}>
                  <h3 className="text-lg font-semibold">{employee.role}</h3>
                </div>
              ))
            ) : (
              <p>No key employees listed yet.</p>
            )}
            {(company.employees?.length || 0) > 5 && (
              <p className="text-blue-400 mt-2 cursor-pointer">
                View all employees
              </p>
            )}
          </div>
        </CardContent>
      </Card> */}
    </div>
  );
}
