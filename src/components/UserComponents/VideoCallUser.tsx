import React, { useEffect, useRef, useState } from "react";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { useDispatch, useSelector } from "react-redux";
import { clearVideoCallInvitation } from "@/redux/Slices/videoCallSlice";
import { RootState } from "@/redux/store";
import { useNavigate } from "react-router-dom";
import { useSocket } from "@/Context/SocketContext";
import { toast } from "sonner";
import { set } from "react-hook-form";

const ZEGO_APP_ID = parseInt(import.meta.env.VITE_ZEGO_APP_ID, 10);
const ZEGO_SERVER_SECRET = import.meta.env.VITE_ZEGO_SERVER_SECRET;

export function getUrlParams(
  url: string = window.location.href
): URLSearchParams {
  const urlStr = url.split("?")[1];
  return new URLSearchParams(urlStr);
}

const VideoCallUser: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [userEndedCall, setUserEndedCall] = useState(false);
  const socket = useSocket();
  const { roomId } = useSelector((state: RootState) => state.videoCall);
  console.log("roooooooomId", roomId);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const zegoInstanceRef = useRef<any>(null);
  const previousRoomIdRef = useRef<string | null>(null);

  const userState = useSelector((state: RootState) => state.user);
  const user_id = userState.userInfo?.user_id || "";
  const user_name =
    `${userState.userInfo?.firstName} ${userState.userInfo?.lastName}` || "";
  const roomID = getUrlParams().get("roomId") || roomId || "";

  const handleLeaveRoom = async (zp: any, isIntentonal: boolean = false) => {
    try {
      if (isIntentonal) {
        setUserEndedCall(true);
      }
      if (zp && typeof zp.leaveRoom === "function") {
        await zp.leaveRoom();
      } else {
        console.warn("leaveRoom method not found, skipping.");
      }
      socket?.emit("user:leave", {
        roomID,
        userId: user_id,
      });
      if (zp) {
        zp.destroy();
      }
      console.log("onLeaveRoom");
      if (!isIntentonal) {
        dispatch(clearVideoCallInvitation());
      }
      navigate("../my-jobs");
    } catch (error) {
      console.error("Error during room leave:", error);
      // Force cleanup even if there's an error
      if (zp) {
        zp.destroy();
      }
      dispatch(clearVideoCallInvitation());
      navigate("../my-jobs");
    }
  };

  useEffect(() => {
    const myMeeting = async () => {
      if (!roomID) {
        console.error("Room ID is missing. Cannot initialize the call.");
        return;
      }
      if (containerRef.current === null) {
        console.error("Container element is null. Cannot initialize Zego UI.");
        return;
      }
      if (containerRef.current) {
        const appID = ZEGO_APP_ID;
        const serverSecret = ZEGO_SERVER_SECRET;

        const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
          appID,
          serverSecret,
          roomID,
          user_id,
          user_name
        );

        const zp = ZegoUIKitPrebuilt.create(kitToken);
        if (!zp) {
          console.error("Zego UIKit Prebuilt instance could not be created.");
          return;
        }
        zegoInstanceRef.current = zp;

        zp.joinRoom({
          container: containerRef.current,
          scenario: {
            mode: ZegoUIKitPrebuilt.OneONoneCall,
          },
          turnOnMicrophoneWhenJoining: true,
          turnOnCameraWhenJoining: true,
          showPreJoinView: false,

          onLeaveRoom() {
            handleLeaveRoom(zp, true);
          },
          onUserLeave: (users: any[]) => {
            console.log("Users left the room:", users);
          },
        });

        socket?.on("interview:end", (room_Id) => {
          if (roomID === room_Id) {
            toast.success("Interview ended");
            setTimeout(() => {
              handleLeaveRoom(zp);
            }, 2500);
          }
        });

        // Handle window/tab close
        const handleBeforeUnload = () => {
          handleLeaveRoom(zp);
        };
        window.addEventListener("beforeunload", handleBeforeUnload);

        return () => {
          window.removeEventListener("beforeunload", handleBeforeUnload);
          socket?.off("interview:end");

          handleLeaveRoom(zp);
        };
      }
    };

    myMeeting();
  }, [roomID]);

  // Handle any changes in roomId state
  useEffect(() => {
    if (
      zegoInstanceRef.current &&
      previousRoomIdRef.current !== null &&
      roomId !== previousRoomIdRef.current
    ) {
      toast.success("Interview ended");
      setTimeout(() => {
        const zp = zegoInstanceRef.current;
        handleLeaveRoom(zp);
      }, 2500);
    }

    // Update previous roomId for comparison
    previousRoomIdRef.current = roomId;
  }, [roomId, dispatch, navigate]);

  return (
    <div className="flex flex-col h-screen">
      <header className="bg-[#0a0a0a] text-white px-6 py-4 flex items-center border-b border-gray-800 h-16">
        <div
          className="flex items-center space-x-2 cursor-pointer"
          onClick={() => navigate("../home")}
        >
          <span className="text-2xl font-bold text-white">Next</span>
          <span className="text-2xl font-bold text-red-600">Gig</span>
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

export default VideoCallUser;
