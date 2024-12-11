import React, { useEffect, ReactNode } from "react";
import { useNavigate } from "react-router-dom";

interface SeekerProtectorProps {
  children: ReactNode;
}

const SeekerProtector: React.FC<SeekerProtectorProps> = ({ children }) => {
  const navigate = useNavigate();
  const seeker = JSON.parse(
    JSON.parse(localStorage.getItem("persist:root") || "{}").seeker || "{}"
  ).seekerInfo?.seeker_id;

  useEffect(() => {
    if (!seeker) {
      navigate("../login", {
        state: { message: "Authorization failed" },
        replace: true,
      });
    }
  }, [navigate, seeker]);

  return seeker ? <>{children}</> : null;
};

export default SeekerProtector;
