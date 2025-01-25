import React, { useEffect, useRef } from "react";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { clearVideoCallInvitation } from "@/redux/Slices/videoCallSlice";
import { useNavigate } from "react-router-dom";

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
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const jobApplicationId = getUrlParams().get("applicationId");

  console.log("getUrlParams().get(roomId)", getUrlParams().get("roomId"));

  const containerRef = useRef<HTMLDivElement | null>(null);
  const companyState = useSelector((state: RootState) => state.company);
  const company_id = companyState.companyInfo?.company_id || "";
  const company_name = companyState.companyInfo?.name || "";
  const roomID = getUrlParams().get("roomId") || "";
  if (!roomID) {
    console.error("No roomID found in URL");
  }
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
            mode: ZegoUIKitPrebuilt.GroupCall, // Change to OneONoneCall for 1-on-1 calls
          },
          turnOnMicrophoneWhenJoining: true,
          turnOnCameraWhenJoining: true,
          showPreJoinView: false,
          onLeaveRoom() {
            zp.destroy(); 
            console.log("onLeaveRoom");
            dispatch(clearVideoCallInvitation());
            navigate(`../job-application-detailed/${jobApplicationId}`);
          },
        });

        return () => {
          zp.destroy(); // Use destroy method to clean up the instance
        };
      }
    };

    myMeeting();
  }, [roomID]);

  return (
    <div
      className="myCallContainer"
      ref={containerRef}
      style={{ width: "100vw", height: "100vh" }}
    />
  );
};

export default VideoCallCompany;
