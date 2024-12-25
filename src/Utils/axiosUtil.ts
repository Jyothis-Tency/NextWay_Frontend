import axios from "axios";
import { toast } from "sonner";

const userURL = "http://localhost:3000/data/user";
const companyURL = "http://localhost:3000/data/company";
const adminURL = "http://localhost:3000/data/admin";

// Retrieve and parse the 'user' data in one step, then access userInfo
const user_id = JSON.parse(
  JSON.parse(localStorage.getItem("persist:root") || "{}").user || "{}"
).userInfo?.user_id;

const company_id = JSON.parse(
  JSON.parse(localStorage.getItem("persist:root") || "{}").company || "{}"
).companyInfo?.company_id;


export const axiosUser = axios.create({
  baseURL: userURL,
  withCredentials: true,
  headers: user_id ? { user_id: user_id } : {},
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

axiosUser.interceptors.response.use(
  (response) => {
    // Return the response if successful
    return response;
  },
  (error) => {
    // Check for specific "user blocked" error from middleware
    if (
      error.response &&
      error.response.status === 403 &&
      error.response.data === "user blocked" // Ensure it's the specific message
    ) {
      const persistedRootString = localStorage.getItem("persist:root");
      if (persistedRootString) {
        const persistedRoot = JSON.parse(persistedRootString);
        if (persistedRoot.user) {
          delete persistedRoot.user;
          localStorage.setItem("persist:root", JSON.stringify(persistedRoot));
        } else {
          console.log("User data not found in persist:root");
        }
      } else {
        console.log("'persist:root' key does not exist in localStorage");
      }
      // Show a toast notification for blocked users
      toast.error("Your account is blocked by admin. Redirecting to login...");
      // Redirect to login page after 1500ms
      setTimeout(() => {
        window.location.href = "/user/login"; // Or use `navigate("/login")` if in React Router
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
    // Check for specific "user blocked" error from middleware
    if (
      error.response &&
      error.response.status === 403 &&
      error.response.data === "company blocked" // Ensure it's the specific message
    ) {
      const persistedRootString = localStorage.getItem("persist:root");
      if (persistedRootString) {
        const persistedRoot = JSON.parse(persistedRootString);
        if (persistedRoot.company) {
          delete persistedRoot.company;
          localStorage.setItem("persist:root", JSON.stringify(persistedRoot));
        }
      }
      // Show a toast notification for blocked users
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
