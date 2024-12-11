import React, { useEffect, ReactNode } from "react";
import { useNavigate } from "react-router-dom";

interface AdminProtectorProps {
  children: ReactNode;
}

const AdminProtector: React.FC<AdminProtectorProps> = ({ children }) => {
  const navigate = useNavigate();
  const admin = JSON.parse(
    JSON.parse(localStorage.getItem("persist:root") || "{}").admin || "{}"
  ).adminInfo;

  useEffect(() => {
    if (!admin) {
      navigate("../login", {
        state: { message: "Authorization failed" },
        replace: true,
      });
    }
  }, [navigate, admin]);

  return admin ? <>{children}</> : null;
};

export default AdminProtector;
