import React, { useEffect, useRef, useState } from "react";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { useDispatch, useSelector } from "react-redux";
import { clearVideoCallInvitation } from "@/redux/Slices/videoCallSlice";
import { RootState } from "@/redux/store";
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

const VideoCallUser: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const socket = useSocket();
  const { roomId } = useSelector((state: RootState) => state.videoCall);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const zegoInstanceRef = useRef<any>(null);
  const previousRoomIdRef = useRef<string | null>(null);

  const [userEndedCall, setUserEndedCall] = useState(false);

  const userState = useSelector((state: RootState) => state.user);
  const user_id = userState.userInfo?.user_id || "";
  const user_name =
    `${userState.userInfo?.firstName} ${userState.userInfo?.lastName}` || "";
  const roomID = getUrlParams().get("roomId") || roomId || "";

  const handleLeaveRoom = async (zp: any) => {
    try {
      await zp.logoutRoom();
      socket?.emit("user:leave", {
        roomID,
        userId: user_id,
      });
      zp.destroy();
      console.log("onLeaveRoom");

      // Only clear video call invitation if not user-initiated leave
      if (!userEndedCall) {
        dispatch(clearVideoCallInvitation());
      }

      navigate("../my-jobs");
    } catch (error) {
      console.error("Error during room leave:", error);
      // Force cleanup even if there's an error
      zp.destroy();
      if (!userEndedCall) {
        dispatch(clearVideoCallInvitation());
      }
      navigate("../my-jobs");
    }
  };

  const handleUserLeave = () => {
    setUserEndedCall(true);
    const zp = zegoInstanceRef.current;
    if (zp) {
      handleLeaveRoom(zp);
    }
  };

  useEffect(() => {
    const myMeeting = async () => {
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
            handleLeaveRoom(zp);
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
        <button
          onClick={handleUserLeave}
          className="ml-auto text-red-600 font-bold"
        >
          End Call
        </button>
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
