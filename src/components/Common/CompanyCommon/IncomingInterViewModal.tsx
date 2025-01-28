import type React from "react";
import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { RootState } from "@/redux/store";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Video, X } from "lucide-react";

const InterviewModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasClosedModal, setHasClosedModal] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const navigate = useNavigate();
  const videoCallState = useSelector((state: RootState) => state.videoCall);

  useEffect(() => {
    if (!videoCallState.roomId) {
      localStorage.removeItem("interviewModalClosed");
      setIsOpen(false);
      stopVideoPreview();
    }
  }, [videoCallState.roomId]);

  useEffect(() => {
    const modalClosed = localStorage.getItem("interviewModalClosed");
    if (videoCallState.roomId && !modalClosed) {
      setIsOpen(true);
      startVideoPreview();
    } else {
      setIsOpen(false);
      stopVideoPreview();
    }
    setHasClosedModal(!!modalClosed);
  }, [videoCallState.roomId]);

  const startVideoPreview = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
    }
  };

  const stopVideoPreview = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach((track) => track.stop());
    }
  };

  const handleJoinInterview = () => {
    navigate(`/user/video-call?roomId=${videoCallState.roomId}`);
    setIsOpen(false);
  };

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem("interviewModalClosed", "true");
    setHasClosedModal(true);
  };

  return (
    <AnimatePresence>
      {isOpen && !hasClosedModal && (
        <Dialog open={isOpen}>
          <DialogContent className="sm:max-w-[500px] bg-gradient-to-br from-gray-900 to-gray-800 text-white border-0 rounded-lg shadow-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-center text-blue-400">
                Incoming Video Interview
              </DialogTitle>
            </DialogHeader>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="mt-6 space-y-4"
            >
              <p className="text-center text-lg">
                <span className="font-semibold text-blue-300">
                  {videoCallState.companyName}
                </span>{" "}
                is starting an interview.
              </p>
              <p className="text-center text-blue-200">
                Are you ready to join?
              </p>
              <div className="relative mt-6 rounded-lg overflow-hidden shadow-xl">
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  className="w-full h-64 object-cover bg-gray-700"
                />
                {/* <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                  <span className="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded">
                    LIVE
                  </span>
                </div> */}
              </div>
            </motion.div>
            <DialogFooter className="mt-8 space-x-4">
              <Button
                variant="outline"
                onClick={handleClose}
                className="w-full sm:w-auto bg-gray-600 hover:bg-gray-700 text-white border-0 transition-all duration-300 ease-in-out transform hover:scale-105"
              >
                <X className="w-4 h-4 mr-2" />
                Close
              </Button>
              <Button
                onClick={handleJoinInterview}
                className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white transition-all duration-300 ease-in-out transform hover:scale-105"
              >
                <Video className="w-4 h-4 mr-2" />
                Join Interview
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
};

export default InterviewModal;
