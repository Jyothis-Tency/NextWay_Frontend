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
import { axiosMain } from "@/Utils/axiosUtil"; // Adjust the import path as needed
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import CompanyStatic from "../../../public/Comany-Static-Logo.svg";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import ReusableTable from "../Common/Reusable/Table";

interface ICompany {
  company_id: string;
  name: string;
  industry: string;
  location: string;
  isBlocked: boolean;
}

const CompanyList: React.FC = () => {
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
      const response = await axiosMain.get("/admin/getAllCompanyProfileImages");
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
        const response = await axiosMain.get("/admin/all-companies");
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
      await axiosMain.post("/admin/block-unblock-company", {
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
    navigate(`/admin/company-detailed/${companyId}`);
  };

  const columns = [
    {
      key: "profileImage",
      label: "Profile Image",
      render: (row: ICompany) => renderCompanyAvatar(row.company_id, row.name),
    },
    { key: "company_id", label: "Company ID" },
    { key: "name", label: "Name" },
    { key: "industry", label: "Industry" },
    { key: "location", label: "Location" },
    {
      key: "action",
      label: "Action",
      render: (row: ICompany) => (
        <Button
          onClick={(e) => {
            e.stopPropagation();
            handleBlockUnblock(row.company_id, row.isBlocked);
          }}
          variant={row.isBlocked ? "default" : "destructive"}
        >
          {row.isBlocked ? "Unblock" : "Block"}
        </Button>
      ),
    },
    {
      key: "view",
      label: "View",
      render: (row: ICompany) => (
        <Button onClick={() => navigateToDetails(row.company_id)}>
          View Company
        </Button>
      ),
    },
  ];

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
                <ReusableTable
                  columns={columns}
                  data={companies}
                  defaultRowsPerPage={4}
                />
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
