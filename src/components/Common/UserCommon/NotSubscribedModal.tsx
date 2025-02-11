import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotSubscribedModal = ({ isOpen, onClose }: SubscriptionModalProps) => {
  const navigate = useNavigate();
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#2D2D2D] text-white border-[#4F46E5]">
        <DialogHeader>
          <DialogTitle>Subscription Required</DialogTitle>
          <DialogDescription className="text-[#A0A0A0]">
            This feature is only available for subscribed users. Please
            subscribe to access the sort by skills feature.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            onClick={onClose}
            className="bg-[rgb(229,70,70)] hover:bg-[#6366F1] text-white"
          >
            Close
          </Button>
          <Button
            onClick={() => navigate("/user/subscriptions")}
            className="bg-[#4F46E5] hover:bg-[#6366F1] text-white"
          >
            Subscribe Now
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NotSubscribedModal;
