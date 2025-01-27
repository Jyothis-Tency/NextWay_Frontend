import React, { useEffect, useRef, useState } from "react";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { clearVideoCallInvitation } from "@/redux/Slices/videoCallSlice";
import { useNavigate } from "react-router-dom";
import { useSocket } from "@/Context/SocketContext";
import { toast } from "sonner";

const ZEGO_APP_ID = parseInt(import.meta.env.VITE_ZEGO_APP_ID, 10);
const ZEGO_SERVER_SECRET = import.meta.env.VITE_ZEGO_SERVER_SECRET;

export function getUrlParams(
  url: string = window.location.href
): URLSearchParams {
  const urlStr = url.split("?")[1];
  return new URLSearchParams(urlStr);
}

const VideoCallCompany: React.FC = () => {
  console.log("VideoCallCompany");
  const [refreshFlag, setRefreshFlag] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const socket = useSocket();

  const jobApplicationId = getUrlParams().get("applicationId");
  const user_id = getUrlParams().get("user_id");

  console.log("getUrlParams().get(roomId)", getUrlParams().get("roomId"));

  const containerRef = useRef<HTMLDivElement | null>(null);
  const companyState = useSelector((state: RootState) => state.company);
  const company_id = companyState.companyInfo?.company_id || "";
  const company_name = companyState.companyInfo?.name || "";
  const roomID = getUrlParams().get("roomId") || "";
  if (!roomID) {
    console.error("No roomID found in URL");
  }
  const forceRefreshLayout = () => {
    setRefreshFlag((prev) => !prev);
  };
  useEffect(() => {
    const myMeeting = async () => {
      if (containerRef.current) {
        // Replace with your actual appID and serverSecret
        const appID = ZEGO_APP_ID; // Replace with your ZEGOCLOUD appID
        const serverSecret = ZEGO_SERVER_SECRET; // Replace with your ZEGOCLOUD serverSecret
        console.log("🔑 Token Generation Parameters:", {
          appID,
          serverSecret,
          roomID,
          company_id,
          company_name,
        });
        const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
          appID,
          serverSecret,
          roomID,
          company_id, // User ID
          company_name // User Name
        );

        // Create instance object from Kit Token
        const zp = ZegoUIKitPrebuilt.create(kitToken);

        // Start the call
        zp.joinRoom({
          container: containerRef.current,

          scenario: {
            mode: ZegoUIKitPrebuilt.OneONoneCall, // Change to OneONoneCall for 1-on-1 calls
          },
          turnOnMicrophoneWhenJoining: true,
          turnOnCameraWhenJoining: true,
          showPreJoinView: false,
          onLeaveRoom() {
            socket?.emit("end-interview", {
              roomID,
              applicationId: jobApplicationId,
              user_id,
            });
            zp.destroy();
            console.log("onLeaveRoom");
            dispatch(clearVideoCallInvitation());
            navigate(`../job-application-detailed/${jobApplicationId}`);
          },
          onUserLeave: (users: any[]) => {
            // Just log when users leave, but stay in the call
            console.log("Users left the room:", users);
            forceRefreshLayout()
          },
        });

        socket?.on("user:left", ({ roomID: leftRoomID, userId }) => {
          console.log("User left event received:", { leftRoomID, userId });
          if (leftRoomID === roomID) {
            forceRefreshLayout();
            toast.info("User has left the interview");
          }
        });

        return () => {
          socket?.off("user:left");
          zp.destroy(); // Use destroy method to clean up the instance
        };
      }
    };

    myMeeting();
  }, [roomID]);

  return (
    <div className="flex flex-col h-screen">
      <header className="bg-[#0a0a0a] text-white px-6 py-4 flex items-center border-b border-gray-800 h-16">
        <div
          className="flex items-center space-x-2 cursor-pointer"
          onClick={() => navigate("../home")}
        >
          <span className="text-2xl font-bold text-white">Next</span>
          <span className="text-2xl font-bold text-red-600">Gig</span>
          <span className="text-sm font-semibold text-gray-400 ml-2">
            Company
          </span>
        </div>
      </header>
      <div
        className="myCallContainer flex-grow"
        ref={containerRef}
        style={{ width: "100%", height: "calc(100vh - 64px)" }}
      />
    </div>
  );
};

export default VideoCallCompany;
