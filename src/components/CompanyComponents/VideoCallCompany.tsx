import React, { useEffect, useRef, useState } from "react";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { clearVideoCallInvitation } from "@/redux/Slices/videoCallSlice";
import { useNavigate } from "react-router-dom";
import { useSocket } from "@/Context/SocketContext";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { getUrlParams } from "@/Utils/getUrlParams";

const ZEGO_APP_ID = parseInt(import.meta.env.VITE_ZEGO_APP_ID, 10);
const ZEGO_SERVER_SECRET = import.meta.env.VITE_ZEGO_SERVER_SECRET;

// export function getUrlParams(
//   url: string = window.location.href
// ): URLSearchParams {
//   const urlStr = url.split("?")[1];
//   return new URLSearchParams(urlStr);
// }

const VideoCallCompany: React.FC = () => {
  console.log("VideoCallCompany");
  const [, setRefreshFlag] = useState(false);
  const [userInOtherInterview, setUserInOtherInterview] = useState(false);
  // const [startTime, setStartTime] = useState(``);

  const [isUserAllowed, setIsUserAllowed] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const socket = useSocket();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const timeoutDuration = 3000; //

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

  // Start emitting presence
  const startPresenceEmission = () => {
    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current as NodeJS.Timeout);
    }

    // Start new interval
    intervalRef.current = setInterval(() => {
      console.log("Emitting presence setInterval");
      socket?.emit("user:in-interview", {
        userId: user_id,
        companyId: company_id,
        roomID,
      });
    }, 2000); // Emit every 2 seconds
  };

  // Stop emitting presence
  const stopPresenceEmission = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current as NodeJS.Timeout);
      intervalRef.current = null;
    }
  };

  const allowUserToEnter = () => {
    const timeStamp = Date.now();
    const currentDateTime = new Date(timeStamp);
    const date = currentDateTime.toISOString().split("T")[0];
    const time = currentDateTime.toISOString().split("T")[1].split(".")[0];
    localStorage.setItem("startTime", `${date}T${time}`);

    socket?.emit("start-interview", {
      roomID,
      applicationId: jobApplicationId,
      user_id,
      companyName: company_name,
    });
    setIsUserAllowed(true);
    toast.success("User has been allowed to enter the interview");
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
          company_name, // User Name
          3600
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

          onUserJoin() {
            startPresenceEmission();
          },

          onLeaveRoom() {
            const startTime = localStorage.getItem("startTime") || "";

            socket?.emit("end-interview", {
              roomID,
              applicationId: jobApplicationId,
              user_id,
              startTime: startTime,
            });
            stopPresenceEmission();
            zp.destroy();
            console.log("onLeaveRoom");
            dispatch(clearVideoCallInvitation());
            localStorage.removeItem("startTime");
            navigate(`../job-application-detailed/${jobApplicationId}`);
          },
          onUserLeave: (users: any[]) => {
            // Just log when users leave, but stay in the call
            console.log("Users left the room:", users);
            forceRefreshLayout();
          },

          sharedLinks: [],
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
          stopPresenceEmission();
          zp.destroy(); // Use destroy method to clean up the instance
        };
      }
    };

    myMeeting();
  }, [roomID]);

  useEffect(() => {
    if (!socket) return;

    const handleInterviewStatus = (data: {
      userId: string;
      companyId: string;
      roomID: number;
    }) => {
      console.log("user:in-interview-going on on");
      console.log("Interview status event received:", data);
      const { userId, companyId } = data;

      // Clear any existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      if (user_id === userId && company_id !== companyId) {
        setUserInOtherInterview(true);

        // Set new timeout
        timeoutRef.current = setTimeout(() => {
          setUserInOtherInterview(false);
          console.log(
            "No interview status received for 3 seconds, marking as not in interview"
          );
        }, timeoutDuration);
      }
    };

    socket.on("user:in-interview-going", handleInterviewStatus);

    return () => {
      socket.off("user:in-interview-going", handleInterviewStatus);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [socket, user_id, timeoutDuration]);

  useEffect(() => {
    return () => {
      stopPresenceEmission();
    };
  }, []);

  return (
    <div className="flex flex-col h-screen">
      <header className="bg-[#0a0a0a] text-white px-6 py-4 flex items-center border-b border-gray-800 h-16">
        <div
          className="flex items-center space-x-2 cursor-pointer"
          onClick={() => navigate("../home")}
        >
          <span className="text-2xl font-bold text-white">Next</span>
          <span className="text-2xl font-bold text-red-600">Way</span>
          <span className="text-sm font-semibold text-gray-400 ml-2">
            Company
          </span>
        </div>
        {!isUserAllowed && (
          <Button
            onClick={!userInOtherInterview ? allowUserToEnter : undefined}
            disabled={userInOtherInterview}
            className={`px-4 py-2 rounded ${
              userInOtherInterview
                ? "bg-gray-400 cursor-not-allowed opacity-50"
                : "bg-green-600 hover:bg-green-700"
            } text-white`}
          >
            {userInOtherInterview
              ? "User in another interview"
              : "Allow User to Enter"}
          </Button>
        )}
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
