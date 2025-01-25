import React, { useEffect, useRef } from "react";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { useDispatch, useSelector } from "react-redux";
import { clearVideoCallInvitation } from "@/redux/Slices/videoCallSlice";
import { RootState } from "@/redux/store";
import { useNavigate } from "react-router-dom";

const ZEGO_APP_ID = parseInt(import.meta.env.VITE_ZEGO_APP_ID, 10);
const ZEGO_SERVER_SECRET = import.meta.env.VITE_ZEGO_SERVER_SECRET;

export function getUrlParams(
  url: string = window.location.href
): URLSearchParams {
  const urlStr = url.split("?")[1];
  return new URLSearchParams(urlStr);
}

const VideoCallUser: React.FC = () => {
  console.log("VideoCallUser");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { roomId } = useSelector((state: RootState) => state.videoCall);
  console.log("roomId from state", roomId);
  console.log("getUrlParams().get(roomId)", getUrlParams().get("roomId"));
  const containerRef = useRef<HTMLDivElement | null>(null);
  const userState = useSelector((state: RootState) => state.user);
  const user_id = userState.userInfo?.user_id || "";
  const user_name =
    `${userState.userInfo?.firstName} ${userState.userInfo?.lastName}` || "";
  const roomID = getUrlParams().get("roomId") || roomId || "";
  useEffect(() => {
    const myMeeting = async () => {
      if (containerRef.current) {
        const appID = ZEGO_APP_ID;
        const serverSecret = ZEGO_SERVER_SECRET;

        console.log("🔑 Token Generation Parameters:", {
          appID,
          serverSecret,
          roomID,
          user_id,
          user_name,
        });
        const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
          appID,
          serverSecret,
          roomID,
          user_id,
          user_name
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
            navigate("../my-jobs");
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

export default VideoCallUser;
