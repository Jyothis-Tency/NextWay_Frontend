import axios from "axios";
import { toast } from "sonner";

const seekerURL = "http://localhost:3000/data/seeker";
const companyURL = "http://localhost:3000/data/company";
const adminURL = "http://localhost:3000/data/admin";

// Retrieve and parse the 'seeker' data in one step, then access seekerInfo
const seeker_id = JSON.parse(
  JSON.parse(localStorage.getItem("persist:root") || "{}").seeker || "{}"
).seekerInfo?.seeker_id;

const company_id = JSON.parse(
  JSON.parse(localStorage.getItem("persist:root") || "{}").company || "{}"
).companyInfo?.company_id;

// const adminInfo = JSON.parse(
//   JSON.parse(localStorage.getItem("persist:root") || "{}").admin || "{}"
// ).adminInfo;

export const axiosSeeker = axios.create({
  baseURL: seekerURL,
  withCredentials: true,
  headers: seeker_id ? { seeker_id: seeker_id } : {},
});

export const axiosCompany = axios.create({
  baseURL: companyURL,
  withCredentials: true,
  // headers: company_id ? { company_id: company_id } : {},
});

if (company_id) {
  axiosCompany.defaults.headers.common["company_id"] = company_id;
}

export const axiosAdmin = axios.create({
  baseURL: adminURL,
  withCredentials: true,
});

axiosSeeker.interceptors.response.use(
  (response) => {
    // Return the response if successful
    return response;
  },
  (error) => {
    // Check for specific "seeker blocked" error from middleware
    if (
      error.response &&
      error.response.status === 403 &&
      error.response.data === "seeker blocked" // Ensure it's the specific message
    ) {
      // Show a toast notification for blocked seekers
      toast.error("Your account is blocked by admin. Redirecting to login...");
      // Redirect to login page after 1500ms
      setTimeout(() => {
        window.location.href = "/seeker/login"; // Or use `navigate("/login")` if in React Router
      }, 1500);
    }
    // Return the error for other cases
    return Promise.reject(error);
  }
);
axiosCompany.interceptors.response.use(
  (response) => {
    // Return the response if successful
    return response;
  },
  (error) => {
    // Check for specific "seeker blocked" error from middleware
    if (
      error.response &&
      error.response.status === 403 &&
      error.response.data === "company blocked" // Ensure it's the specific message
    ) {
      // Show a toast notification for blocked seekers
      toast.error("Your account is blocked by admin. Redirecting to login...");
      // Redirect to login page after 1500ms
      setTimeout(() => {
        window.location.href = "/company/login"; // Or use `navigate("/login")` if in React Router
      }, 1500);
    }
    // Return the error for other cases
    return Promise.reject(error);
  }
);
