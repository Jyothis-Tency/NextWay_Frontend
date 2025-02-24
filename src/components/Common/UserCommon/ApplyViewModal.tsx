import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowLeft,
  ArrowRight,
  Briefcase,
  Mail,
  MapPin,
  Phone,
  User,
} from "lucide-react";

interface ApplicationOverviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  onPrevious: () => void;
  applicationData: {
    firstName: string;
    lastName: string;
    email: string;
    location: string;
    number: string;
    jobTitle: string;
    companyName: string;
  };
}

export function ApplicationOverviewModal({
  isOpen,
  onClose,
  onConfirm,
  onPrevious,
  applicationData,
}: ApplicationOverviewModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] bg-gray-900 text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            Application Overview
          </DialogTitle>
        </DialogHeader>
        <div className="py-6">
          <Card className="bg-gray-800 border-red-500 border-2 shadow-lg shadow-red-500/50">
            <CardContent className="p-6">
              <h3 className="font-semibold text-xl mb-4 text-red-400">
                Your Details
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center">
                  <User className="mr-2 h-5 w-5 text-red-400" />
                  <p>
                    <span className="font-medium">Name:</span>{" "}
                    {applicationData.firstName} {applicationData.lastName}
                  </p>
                </div>
                <div className="flex items-center">
                  <Mail className="mr-2 h-5 w-5 text-red-400" />
                  <p>
                    <span className="font-medium">Email:</span>{" "}
                    {applicationData.email}
                  </p>
                </div>
                <div className="flex items-center">
                  <MapPin className="mr-2 h-5 w-5 text-red-400" />
                  <p>
                    <span className="font-medium">Location:</span>{" "}
                    {applicationData.location}
                  </p>
                </div>
                <div className="flex items-center">
                  <Phone className="mr-2 h-5 w-5 text-red-400" />
                  <p>
                    <span className="font-medium">Phone:</span>{" "}
                    {applicationData.number}
                  </p>
                </div>
              </div>
              <h3 className="font-semibold text-xl mt-6 mb-4 text-red-400">
                Job Details
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center">
                  <Briefcase className="mr-2 h-5 w-5 text-red-400" />
                  <p>
                    <span className="font-medium">Job Title:</span>{" "}
                    {applicationData.jobTitle}
                  </p>
                </div>
                <div className="flex items-center">
                  <Briefcase className="mr-2 h-5 w-5 text-red-400" />
                  <p>
                    <span className="font-medium">Company:</span>{" "}
                    {applicationData.companyName}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <DialogFooter className="flex justify-between">
          <Button
            onClick={onPrevious}
            variant="outline"
            className="bg-gray-700 hover:bg-gray-600"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>
          <Button onClick={onConfirm} className="bg-red-600 hover:bg-red-700">
            Confirm Apply
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
