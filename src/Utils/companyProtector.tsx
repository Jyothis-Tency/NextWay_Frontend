import React, { useEffect, ReactNode } from "react";
import { useNavigate } from "react-router-dom";

interface CompanyProtectorProps {
  children: ReactNode;
}

const CompanyProtector: React.FC<CompanyProtectorProps> = ({ children }) => {
  const navigate = useNavigate();
  const company = JSON.parse(
    JSON.parse(localStorage.getItem("persist:root") || "{}").company || "{}"
  ).companyInfo?.company_id;

  useEffect(() => {
    if (!company) {
      navigate("../login", {
        state: { message: "Authorization failed" },
        replace: true,
      });
    }
  }, [navigate, company]);

  return company ? <>{children}</> : null;
};

export default CompanyProtector;
