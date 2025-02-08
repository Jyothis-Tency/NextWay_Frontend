import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Common/AdminCommon/Header";
import { Sidebar } from "@/components/Common/AdminCommon/Sidebar";
import { Footer } from "@/components/Common/AdminCommon/Footer";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { axiosAdmin } from "@/Utils/axiosUtil"; // Adjust the import path as needed
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import CompanyStatic from "../../../public/Comany-Static-Logo.svg";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";

interface ICompany {
  company_id: string;
  name: string;
  industry: string;
  location: string;
  isBlocked: boolean;
}

const CompanyList = () => {
  const [companies, setCompanies] = useState<ICompany[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [allProfileImages, setAllProfileImages] = useState<
    {
      company_id: string;
      profileImage: string;
    }[]
  >([]);
  const navigate = useNavigate();

  const getAllProfileImages = async () => {
    try {
      const response = await axiosAdmin.get("/getAllCompanyProfileImages");
      console.log(response.data);
      setAllProfileImages(response.data);
    } catch (error) {
      console.error("Error fetching profile images:", error);
    }
  };

  useEffect(() => {
    getAllProfileImages();
  }, [companies]);

  const renderCompanyAvatar = (companyId: string, companyName: string) => {
    const companyProfileImage = allProfileImages.find(
      (img) => img.company_id === companyId
    )?.profileImage;

    return (
      <Avatar className="h-8 w-12 mr-2 mb-3">
        <AvatarImage
          src={companyProfileImage || CompanyStatic}
          alt={companyName}
          className="w-12 h-12 rounded-full"
        />
        <AvatarFallback>{companyName[0]}</AvatarFallback>
      </Avatar>
    );
  };

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await axiosAdmin.get("/all-companies");
        console.log("API response:", response.data.companyData);
        setCompanies(
          Array.isArray(response.data.companyData)
            ? response.data.companyData
            : []
        );
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching companies:", err);
        setError("Failed to fetch companies. Please try again later.");
        setIsLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  const handleBlockUnblock = async (
    companyId: string,
    currentBlockStatus: boolean
  ) => {
    try {
      await axiosAdmin.post("/block-unblock-company", {
        company_id: companyId,
        block: !currentBlockStatus,
      });
      setCompanies(
        companies.map((company) =>
          company.company_id === companyId
            ? { ...company, isBlocked: !currentBlockStatus }
            : company
        )
      );
    } catch (err) {
      console.error("Error blocking/unblocking company:", err);
      // Optionally, show an error message to the user
      toast.error("Failed to block-unblock company");
    }
  };

  const navigateToDetails = (companyId: string) => {
    navigate(`/admin/company/${companyId}`);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <main className="flex-1 overflow-y-auto pt-16 pl-64">
            <div className="p-6">
              <h1 className="text-2xl font-bold mb-6">Companies</h1>
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : error ? (
                <div className="text-red-500 text-center">{error}</div>
              ) : Array.isArray(companies) && companies.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Profile Image</TableHead>
                      <TableHead>Company ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Industry</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {companies.map((company) => (
                      <TableRow
                        key={company.company_id}
                        className="cursor-pointer hover:bg-gray-800"
                        onClick={() => navigateToDetails(company.company_id)}
                      >
                        <TableCell>
                          {renderCompanyAvatar(
                            company.company_id,
                            company.name
                          )}
                        </TableCell>
                        <TableCell>{company.company_id}</TableCell>
                        <TableCell>{company.name}</TableCell>
                        <TableCell>{company.industry}</TableCell>
                        <TableCell>{company.location}</TableCell>
                        <TableCell>
                          <Button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleBlockUnblock(
                                company.company_id,
                                company.isBlocked
                              );
                            }}
                            variant={
                              company.isBlocked ? "default" : "destructive"
                            }
                          >
                            {company.isBlocked ? "Unblock" : "Block"}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center text-gray-500">
                  No companies found or invalid data format.
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

export default CompanyList;
