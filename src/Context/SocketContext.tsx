import React, { createContext, useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { io, Socket } from "socket.io-client";
import { RootState } from "@/redux/store";

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
  console.log("companyInRedux", companyInRedux);
  
  // Determine client type and ID
  const clientType = userInRedux.userInfo ? "user" : "company";
  const clientId =
    userInRedux.userInfo?.user_id || companyInRedux?.companyInfo?.company_id;

  useEffect(() => {
    if (clientId) {
      const newSocket = io("http://localhost:3000", {
        query: {
          clientType,
          clientId,
        },
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });

      newSocket.on("connect", () => {
        console.log("Socket connected", newSocket.id);
        setSocket(newSocket);
      });

      return () => {
        newSocket.disconnect();
      };
    } else {
      setSocket(null);
    }
  }, [clientId, clientType]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};
