import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
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
import { axiosCompany } from "@/Utils/axiosUtil";
import { toast } from "sonner";
import { Pencil } from "lucide-react";

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
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const company_id = useSelector(
    (state: RootState) => state.company.companyInfo?.company_id
  );

  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        setLoading(true);
        const response = await axiosCompany.get(`get-company/${company_id}`);
        setCompany(response.data.companyProfile);
        setProfileImage(response.data.image);
      } catch (error) {
        console.error("Error fetching company data:", error);
        setCompany(null);
      } finally {
        setLoading(false);
      }
    };

    if (company_id) fetchCompanyData();
  }, [company_id]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setIsModalOpen(true);
    }
  };

  const handleConfirmUpload = async () => {
    if (selectedFile && company_id) {
      const formData = new FormData();
      formData.append("profilePicture", selectedFile);
      try {
        const response = await axiosCompany.post(
          `/upload-profile-img/${company_id}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (response.data.status) {
          toast.success("Company profile picture updated");
          // Refetch company data to get the updated profile picture
          const updatedResponse = await axiosCompany.get(
            `get-company/${company_id}`
          );
          setCompany(updatedResponse.data.companyProfile);
          setProfileImage(updatedResponse.data.image);
        } else {
          toast.error("Failed to upload company profile picture");
        }
      } catch (error) {
        console.error("Error uploading company profile picture:", error);
        toast.error("Error uploading company profile picture");
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
              <div className="relative">
                <Avatar className="w-20 h-20">
                  <AvatarImage
                    src={profileImage || "/placeholder.svg?height=80&width=80"}
                    alt="Company logo"
                  />
                  <AvatarFallback>{company.name[0]}</AvatarFallback>
                </Avatar>
                <Button
                  className="absolute bottom-0 right-0 w-8 h-8 rounded-full p-0 bg-blue-500 hover:bg-blue-600 flex items-center justify-center"
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
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Company Profile Picture Upload</DialogTitle>
            <DialogDescription>
              Are you sure you want to upload this image as your new company
              profile picture?
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
}
