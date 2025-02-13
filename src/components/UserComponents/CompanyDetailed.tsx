import type React from "react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Icons } from "@/components/ui/icons";
import { axiosMain } from "@/Utils/axiosUtil";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import NotSubscribedModal from "../Common/UserCommon/NotSubscribedModal";

interface ICompany {
  company_id: string;
  name: string;
  email: string;
  phone: string;
  logo?: string;
  isVerified: boolean;
  industry?: string;
  companySize?: number;
  location?: string;
  website?: string;
  description?: string;
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
  };
  jobPosts?: string[];
}

interface CompanyProfileResponse {
  companyProfile: ICompany;
  image: string;
}

const CompanyDetailed: React.FC = () => {
  const [company, setCompany] = useState<ICompany | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notSubscribedModalOpen, setNotSubscribedModalOpen] = useState(false);

  const userData = useSelector((state: RootState) => state.user.userInfo);
  const isSubscribed = userData?.isSubscribed;
  const subFeatures = userData?.subscriptionFeatures;
  const { company_id } = useParams<{ company_id: string }>();

  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        const response = await axiosMain.get<CompanyProfileResponse>(
          `/user/get-company/${company_id}`
        );
        setCompany(response.data.companyProfile);
        setImage(response.data.image);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch company data");
        setLoading(false);
      }
    };

    fetchCompanyData();
  }, [company_id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#121212] text-white flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#121212] text-white flex items-center justify-center">
        {error}
      </div>
    );
  }

  if (!company) {
    return (
      <div className="min-h-screen bg-[#121212] text-white flex items-center justify-center">
        No company data found
      </div>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8 space-y-8 bg-[#000000] text-white">
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card className="col-span-1 bg-[#1E1E1E] text-white border-[#2D2D2D]">
          <CardHeader>
            <div className="flex items-center space-x-4">
              <Avatar className="w-20 h-20">
                <AvatarImage
                  src={image || "/placeholder.svg?height=80&width=80"}
                  alt="Company logo"
                />
                <AvatarFallback>{company.name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-2xl">{company.name}</CardTitle>
                <CardDescription className="text-[#A0A0A0]">
                  {company.industry ?? "Industry not specified"}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Icons.MapPin className="h-4 w-4 text-[#A0A0A0]" />
                <span>{company.location ?? "Location not specified"}</span>
              </div>
              {isSubscribed && subFeatures?.includes("company_contacts") ? (
                <>
                  <div className="flex items-center space-x-2">
                    <Icons.Mail className="h-4 w-4 text-[#A0A0A0]" />
                    <span>{company.email}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Icons.Phone className="h-4 w-4 text-[#A0A0A0]" />
                    <span>{company.phone}</span>
                  </div>
                  {company.website && (
                    <div className="flex items-center space-x-2">
                      <Icons.Link className="h-4 w-4 text-[#A0A0A0]" />
                      <a
                        href={company.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#6366F1] hover:underline"
                      >
                        {company.website}
                      </a>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <div className="flex items-center space-x-2">
                    <Icons.Mail className="h-4 w-4 text-[#A0A0A0]" />
                    <span>********@gmail.com</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Icons.Phone className="h-4 w-4 text-[#A0A0A0]" />
                    <span>**3***7**0</span>
                  </div>
                  {company.website && (
                    <div className="flex items-center space-x-2">
                      <Icons.Link className="h-4 w-4 text-[#A0A0A0]" />
                      <a
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#6366F1] hover:underline"
                      >
                        https://********.com
                      </a>
                    </div>
                  )}
                  <div className="flex items-center space-x-2">
                    <p>
                      You cant access contact details{" "}
                      <span
                        className="text-[#6366F1] hover:underline"
                        onClick={() => setNotSubscribedModalOpen(true)}
                      >
                        Why ?
                      </span>
                    </p>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
        <div className="col-span-2 space-y-8">
          <Card className="bg-[#1E1E1E] text-white border-[#2D2D2D]">
            <CardHeader>
              <CardTitle>About Us</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{company.description ?? "No company description provided."}</p>
            </CardContent>
          </Card>
          <Card className="bg-[#1E1E1E] text-white border-[#2D2D2D]">
            <CardHeader>
              <CardTitle>Company Size</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                {company.companySize
                  ? `${company.companySize} employees`
                  : "Company size not specified"}
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="bg-[#1E1E1E] text-white border-[#2D2D2D]">
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
                  className="text-[#6366F1] hover:underline"
                >
                  LinkedIn
                </a>
              )}
              {company.socialLinks?.twitter && (
                <a
                  href={company.socialLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#6366F1] hover:underline"
                >
                  Twitter
                </a>
              )}
              {company.socialLinks?.facebook && (
                <a
                  href={company.socialLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#6366F1] hover:underline"
                >
                  Facebook
                </a>
              )}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-[#1E1E1E] text-white border-[#2D2D2D]">
          <CardHeader>
            <CardTitle>Job Posts</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{company.jobPosts?.length || 0} active job posts</p>
          </CardContent>
        </Card>
      </section>
      <NotSubscribedModal
        isOpen={notSubscribedModalOpen}
        onClose={() => setNotSubscribedModalOpen(false)}
      />
    </main>
  );
};

export default CompanyDetailed;
