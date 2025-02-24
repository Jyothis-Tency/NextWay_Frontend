import { useEffect, useState } from "react";
import { Header } from "@/components/Common/AdminCommon/Header";
import { Sidebar } from "@/components/Common/AdminCommon/Sidebar";
import { Footer } from "@/components/Common/AdminCommon/Footer";

import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import UserStatic from "../../../public/User-Static-Logo.svg";
import ReusableTable from "../Common/Reusable/Table";
import adminAPIs from "@/API/adminAPIs";

interface IUser {
  user_id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  isBlocked: boolean;
}

const UserList = () => {
  const [users, setUsers] = useState<IUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [allProfileImages, setAllProfileImages] = useState<
    {
      user_id: string;
      profileImage: string;
    }[]
  >([]);

  const getAllProfileImages = async () => {
    try {
      const response = await adminAPIs.getAllUserProfileImages();
      console.log(response.data);
      setAllProfileImages(response.data);
    } catch (error) {
      console.error("Error fetching profile images:", error);
    }
  };

  useEffect(() => {
    getAllProfileImages();
  }, [users]);

  const renderCompanyAvatar = (companyId: string, companyName: string) => {
    const companyProfileImage = allProfileImages.find(
      (img) => img.user_id === companyId
    )?.profileImage;

    return (
      <Avatar className="h-8 w-12 mr-2 mb-3">
        <AvatarImage
          src={companyProfileImage || UserStatic}
          alt={companyName}
          className="w-12 h-12 rounded-full"
        />
        <AvatarFallback>{companyName[0]}</AvatarFallback>
      </Avatar>
    );
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await adminAPIs.fetchAllUsers();
        console.log("API response:", response.data.userData);
        setUsers(
          Array.isArray(response.data.userData) ? response.data.userData : []
        );
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching users:", err);
        setError("Failed to fetch users. Please try again later.");
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleBlockUnblock = async (userId: string) => {
    try {
      const updatedUser = await adminAPIs.toggleUserBlock(userId);
      setUsers(
        users.map((user: IUser) =>
          user.user_id === userId
            ? { ...user, isBlocked: updatedUser.isBlocked }
            : user
        )
      );
    } catch (err) {
      console.error("Error blocking/unblocking user:", err);
      // Optionally, show an error message to the user
      toast.error("Failed to block-unblock user");
    }
  };

  const columns = [
    {
      key: "profileImage",
      label: "Profile Image",
      render: (row: IUser) => renderCompanyAvatar(row.user_id, row.firstName),
    },
    { key: "user_id", label: "Company ID" },
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone" },
    {
      key: "action",
      label: "Action",
      render: (row: IUser) => (
        <Button
          onClick={(e) => {
            e.stopPropagation();
            handleBlockUnblock(row.user_id);
          }}
          variant={row.isBlocked ? "default" : "destructive"}
        >
          {row.isBlocked ? "Unblock" : "Block"}
        </Button>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar currentPage={"Users"} />
        <div className="flex-1 flex flex-col">
          <main className="flex-1 overflow-y-auto pt-16 pl-64">
            <div className="p-6">
              <h1 className="text-2xl font-bold mb-6">Users</h1>
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : error ? (
                <div className="text-red-500 text-center">{error}</div>
              ) : Array.isArray(users) && users.length > 0 ? (
                <ReusableTable
                  columns={columns}
                  data={users}
                  defaultRowsPerPage={4}
                />
              ) : (
                <div className="text-center text-gray-500">
                  No users found or invalid data format.
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

export default UserList;
