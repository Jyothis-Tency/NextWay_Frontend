import axios from "axios";
import { toast } from "sonner";

const baseURL = "http://localhost:3000/data";
const userURL = "http://localhost:3000/data/user";
const companyURL = "http://localhost:3000/data/company";
const adminURL = "http://localhost:3000/data/admin";
const chatURL = "http://localhost:3000/data/chat";
const subscribeURL = "http://localhost:3000/data/subscribe";

// Retrieve and parse the 'user' data in one step, then access userInfo
const userToken = JSON.parse(
  JSON.parse(localStorage.getItem("persist:root") || "{}").user || "{}"
).userInfo?.accessToken;

const companyToken = JSON.parse(
  JSON.parse(localStorage.getItem("persist:root") || "{}").company || "{}"
).companyInfo?.accessToken;

export const axiosMain = axios.create({
  baseURL: baseURL,
  withCredentials: true,
});

export const axiosUser = axios.create({
  baseURL: userURL,
  withCredentials: true,
});

export const axiosCompany = axios.create({
  baseURL: companyURL,
  withCredentials: true,
});

export const axiosAdmin = axios.create({
  baseURL: adminURL,
  withCredentials: true,
});

export const axiosChat = axios.create({
  baseURL: chatURL,
  withCredentials: true,
});

export const axiosSubscription = axios.create({
  baseURL: subscribeURL,
  withCredentials: true,
});

axiosUser.interceptors.request.use((config) => {
  const accessToken = userToken || "";

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

axiosCompany.interceptors.request.use((config) => {
  const accessToken = companyToken || "";

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
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

    // if (
    //   error.response &&
    //   error.response.status === 401 &&
    //   !originalRequest._retry
    // ) {
    //   if (!isRefreshing) {
    //     isRefreshing = true;
    //     const newToken = await refreshToken();
    //     isRefreshing = false;
    //     if (!newToken) return Promise.reject(error);
    //   }

    //   return new Promise((resolve) => {
    //     refreshClients.push((token) => {
    //       originalRequest.headers.Authorization = `Bearer ${token}`;
    //       resolve(axiosUser(originalRequest));
    //     });
    //   });
    // }
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
