import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Header } from "../Common/AdminCommon/Header";
import { Sidebar } from "../Common/AdminCommon/Sidebar";
import { Footer } from "../Common/AdminCommon/Footer";
import {
  Loader2,
  ArrowLeft,
  Home,
  Users,
  Briefcase,
  Settings,
  LogOut,
  MapPin,
  Mail,
  Phone,
  LinkIcon,
} from "lucide-react";
import { toast } from "sonner";
import { axiosMain } from "@/Utils/axiosUtil";
import { Icons } from "../ui/icons";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ICompany {
  company_id: string;
  email: string;
  phone: string;
  role: string;
  profileImage?: string;
  certificate?: string;
  name: string;
  description?: string;
  isVerified?: string;
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
}

const CompanyDetailed = () => {
  const [company, setCompany] = useState<ICompany | null>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [verificationStatus, setVerificationStatus] = useState("");
  const [isUpdating, setIsUpdating] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { company_id } = useParams<{ company_id: string }>();
  console.log("company_idddd", company_id);
  console.log(company);

  console.log(verificationStatus);

  useEffect(() => {
    const fetchCompanyDetails = async () => {
      try {
        // Replace this with your actual API call
        const response = await axiosMain.get(
          `/admin/get-company/${company_id}`
        );
        if (response.status !== 200) {
          throw new Error("Failed to fetch company details");
        }
        const data = response.data.companyProfile;
        console.log("data", data);

        const image = response.data.image;
        setCompany(data);
        setVerificationStatus(data.isVerified);
        setProfileImage(image);
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching company details:", err);
        setError("Failed to fetch company details. Please try again later.");
        setIsLoading(false);
      }
    };

    fetchCompanyDetails();
  }, [company_id]);

  const handleBlockUnblock = async () => {
    if (!company) return;

    try {
      // Replace this with your actual API call
      const response = await fetch(`/api/company/${company.company_id}/block`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ block: !company.isBlocked }),
      });

      if (!response.ok) {
        throw new Error("Failed to block/unblock company");
      }

      setCompany({ ...company, isBlocked: !company.isBlocked });
      toast.success(
        `Company ${company.isBlocked ? "unblocked" : "blocked"} successfully`
      );
    } catch (err) {
      console.error("Error blocking/unblocking company:", err);
      toast.error("Failed to block/unblock company");
    }
  };

  const openCertificate = () => {
    console.log("open certificate");
    console.log(company);
    if (company && company.certificate) {
      console.log(company.certificate);

      const base64Data = company.certificate.replace(
        /^data:application\/pdf;base64,/,
        ""
      );
      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
    } else {
      toast.info("certificate not provided");
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    setIsUpdating(true);
    try {
      const response = await axiosMain.patch(
        `/admin/update-verification/${company?.company_id}`,
        {
          newStatus: newStatus,
        }
      );

      if (response.status === 200) {
        setVerificationStatus(newStatus);
        toast.success("Verification status updated successfully");
      }
    } catch (error) {
      console.error("Error updating verification status:", error);
      toast.error("Failed to update verification status");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <main className="flex-1 overflow-y-auto">
            <div className="space-y-6 p-4 md:p-6 ml-0 md:ml-64">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h1 className="text-2xl md:text-3xl font-bold text-[#FFFFFF]">
                  Company Details
                </h1>
                <div className="flex gap-2 w-full md:w-auto">
                  <Link to="/admin/companies">
                    <Button variant="outline" className="w-full md:w-auto">
                      <ArrowLeft className="mr-2 h-4 w-4" /> Back to Companies
                    </Button>
                  </Link>
                  <Button
                    onClick={handleBlockUnblock}
                    variant={company?.isBlocked ? "default" : "destructive"}
                    className="w-full md:w-auto"
                  >
                    {company?.isBlocked ? "Unblock" : "Block"}
                  </Button>
                </div>
              </div>

              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : error ? (
                <div className="text-red-500 text-center">{error}</div>
              ) : company ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card className="md:col-span-1 bg-[#1E1E1E] text-[#FFFFFF] border-[#4B5563]">
                    <CardHeader>
                      <div className="flex flex-col md:flex-row items-center md:space-x-4">
                        <div className="relative mb-4 md:mb-0">
                          <Avatar className="w-20 h-20">
                            <AvatarImage
                              src={
                                profileImage ||
                                "/placeholder.svg?height=80&width=80"
                              }
                              alt="Company logo"
                            />
                            <AvatarFallback>{company.name[0]}</AvatarFallback>
                          </Avatar>
                        </div>
                        <div className="text-center md:text-left">
                          <CardTitle className="text-xl md:text-2xl">
                            {company.name}
                          </CardTitle>
                          <CardDescription className="text-[#A0A0A0]">
                            {company.industry || "Industry not specified"}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-4 w-4 text-[#A0A0A0]" />
                          <span>
                            {company.location || "Location not specified"}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Mail className="h-4 w-4 text-[#A0A0A0]" />
                          <span>{company.email}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Phone className="h-4 w-4 text-[#A0A0A0]" />
                          <span>{company.phone}</span>
                        </div>
                        {company.website && (
                          <div className="flex items-center space-x-2">
                            <LinkIcon className="h-4 w-4 text-[#A0A0A0]" />
                            <a
                              href={company.website}
                              className="text-[#60A5FA] hover:underline"
                            >
                              Website
                            </a>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="md:col-span-2 bg-[#1E1E1E] text-[#FFFFFF] border-[#4B5563]">
                    <CardHeader>
                      <CardTitle>About Us</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>
                        {company.description || "No description provided yet."}
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="bg-[#1E1E1E] text-[#FFFFFF] border-[#4B5563]">
                    <CardHeader>
                      <CardTitle>Company Size</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>
                        {company.companySize || "Company size not specified"}{" "}
                        employees
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="bg-[#1E1E1E] text-[#FFFFFF] border-[#4B5563]">
                    <CardHeader>
                      <CardTitle>Social Links</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-4">
                        {company.socialLinks?.linkedin && (
                          <a
                            href={company.socialLinks.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#60A5FA] hover:underline"
                          >
                            LinkedIn
                          </a>
                        )}
                        {company.socialLinks?.twitter && (
                          <a
                            href={company.socialLinks.twitter}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#60A5FA] hover:underline"
                          >
                            Twitter
                          </a>
                        )}
                        {company.socialLinks?.facebook && (
                          <a
                            href={company.socialLinks.facebook}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#60A5FA] hover:underline"
                          >
                            Facebook
                          </a>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="bg-[#1E1E1E] text-[#FFFFFF] border-[#4B5563]">
                    <CardHeader>
                      <CardTitle>Verification</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex flex-col space-y-2">
                        <label className="text-sm text-[#A0A0A0]">
                          Verification Status
                        </label>
                        <Select
                          value={verificationStatus}
                          onValueChange={handleStatusChange}
                        >
                          <SelectTrigger className="w-full bg-[#2E2E2E] border-[#4B5563]">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="accept">Accepted</SelectItem>
                            <SelectItem value="reject">Rejected</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button
                        onClick={() =>
                          company?.certificate && openCertificate()
                        }
                        className="bg-[#4F46E5] hover:bg-[#4338CA] text-[#FFFFFF] w-full"
                      >
                        <Icons.FileText className="w-4 h-4 mr-2" />
                        Open Certificate
                      </Button>
                    </CardContent>
                  </Card>
                  {/* <Card className="bg-[#1E1E1E] text-[#FFFFFF] border-[#4B5563]">
                    <CardHeader>
                      <CardTitle>Job Posts</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>{company.jobPosts?.length || 0} active job posts</p>
                    </CardContent>
                  </Card> */}
                </div>
              ) : (
                <div className="text-center">Company not found</div>
              )}
            </div>
          </main>
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default CompanyDetailed;
