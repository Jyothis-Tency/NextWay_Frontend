import React, { createContext, useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { io, Socket } from "socket.io-client";
import { RootState } from "@/redux/store";
import {
  setVideoCallInvitation,
  clearVideoCallInvitation,
} from "@/redux/Slices/videoCallSlice";
const SOCKET_SERVER_URL = import.meta.env.VITE_SERVER_URL;

const SocketContext = createContext<Socket | null>(null);

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const userInRedux = useSelector((state: RootState) => state.user);
  const companyInRedux = useSelector((state: RootState) => state.company);
  const dispatch = useDispatch();

  // Determine client type and ID
  const clientType = userInRedux.userInfo ? "user" : "company";
  const clientId =
    userInRedux.userInfo?.user_id || companyInRedux?.companyInfo?.company_id;

  useEffect(() => {
    if (clientId) {
      const newSocket = io(SOCKET_SERVER_URL as string, {
        query: {
          clientType,
          clientId,
        },
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });

      // console.log("Socket connected", newSocket.id);
      // If it's a user, automatically join their subscription room on connection
      if (clientType === "user") {
        newSocket.emit("join:subscription", clientId);
      }
      setSocket(newSocket);

      if (clientType === "user") {
        newSocket.on("interview:started", (interviewData) => {
          // console.log("Interview started:", interviewData);

          // Dispatch interview details to Redux
          dispatch(
            setVideoCallInvitation({
              roomId: interviewData.roomID,
              applicationId: interviewData.applicationId,
              companyName: interviewData.companyName || `Unknown Company`,
            })
          );
        });

        newSocket.on("interview:ended", () => {
          // console.log("Interview ended in socketContext");
          dispatch(clearVideoCallInvitation());
        });
      }

      return () => {
        if (clientType === "user") {
          newSocket.emit("leave:subscription", clientId);
        }
        newSocket.disconnect();
      };
    } else {
      setSocket(null);
    }
  }, [clientId, clientType, dispatch]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};
