import React, { useEffect, useRef } from "react";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";

// Generate a random ID
function randomID(len: number = 5): string {
  const chars =
    "12345qwertyuiopasdfgh67890jklmnbvcxzMNBVCZXASDQWERTYHGFUIOLKJP";
  let result = "";
  for (let i = 0; i < len; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Get URL parameters
export function getUrlParams(
  url: string = window.location.href
): URLSearchParams {
  const urlStr = url.split("?")[1];
  return new URLSearchParams(urlStr);
}

const App: React.FC = () => {
  const roomID = getUrlParams().get("roomID") || randomID(5);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const myMeeting = async () => {
      if (containerRef.current) {
        // Replace with your actual appID and serverSecret
        const appID = 1234567890; // Replace with your ZEGOCLOUD appID
        const serverSecret = "your_server_secret"; // Replace with your ZEGOCLOUD serverSecret
        const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
          appID,
          serverSecret,
          roomID,
          randomID(5), // User ID
          randomID(5) // User Name
        );

        // Create instance object from Kit Token
        const zp = ZegoUIKitPrebuilt.create(kitToken);

        // Start the call
        zp.joinRoom({
          container: containerRef.current,
          sharedLinks: [
            {
              name: "Personal link",
              url:
                window.location.protocol +
                "//" +
                window.location.host +
                window.location.pathname +
                "?roomID=" +
                roomID,
            },
          ],
          scenario: {
            mode: ZegoUIKitPrebuilt.GroupCall, // Change to OneONoneCall for 1-on-1 calls
          },
        });
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

export default App;
