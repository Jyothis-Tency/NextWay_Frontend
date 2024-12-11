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
import { toggleSeekerBlock } from "@/API/adminAPI"; // Import toggle function
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface ISeeker {
  seeker_id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  isBlocked: boolean;
}

const SeekerList = () => {
  const [seekers, setSeekers] = useState<ISeeker[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSeekers = async () => {
      try {
        const response = await axiosAdmin.get("/all-seekers");
        console.log("API response:", response.data.seekerData);
        setSeekers(
          Array.isArray(response.data.seekerData)
            ? response.data.seekerData
            : []
        );
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching seekers:", err);
        setError("Failed to fetch seekers. Please try again later.");
        setIsLoading(false);
      }
    };

    fetchSeekers();
  }, []);

  const handleBlockUnblock = async (
    seekerId: string,
    currentBlockStatus: boolean
  ) => {
    try {
      const updatedSeeker = await toggleSeekerBlock(
        seekerId,
        currentBlockStatus
      );
      setSeekers(
        seekers.map((seeker) =>
          seeker.seeker_id === seekerId
            ? { ...seeker, isBlocked: updatedSeeker.isBlocked }
            : seeker
        )
      );
    } catch (err) {
      console.error("Error blocking/unblocking seeker:", err);
      // Optionally, show an error message to the user
      toast.error("Failed to block-unblock seeker")
    }
  };

  const navigateToDetails = (seekerId: string) => {
    navigate(`/admin/seeker/${seekerId}`);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <main className="flex-1 overflow-y-auto pt-16 pl-64">
            <div className="p-6">
              <h1 className="text-2xl font-bold mb-6">Seekers</h1>
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : error ? (
                <div className="text-red-500 text-center">{error}</div>
              ) : Array.isArray(seekers) && seekers.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Seeker ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Array.isArray(seekers) &&
                      seekers.map((seeker) => (
                        <TableRow
                          key={seeker.seeker_id}
                          className="cursor-pointer hover:bg-gray-800"
                          onClick={() => navigateToDetails(seeker.seeker_id)}
                        >
                          <TableCell>{seeker.seeker_id}</TableCell>
                          <TableCell>{`${seeker.firstName} ${seeker.lastName}`}</TableCell>
                          <TableCell>{seeker.email}</TableCell>
                          <TableCell>{seeker.phone}</TableCell>
                          <TableCell>
                            <Button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleBlockUnblock(
                                  seeker.seeker_id,
                                  seeker.isBlocked
                                );
                              }}
                              variant={
                                seeker.isBlocked ? "default" : "destructive"
                              }
                            >
                              {seeker.isBlocked ? "Unblock" : "Block"}
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center text-gray-500">
                  No seekers found or invalid data format.
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

export default SeekerList;
