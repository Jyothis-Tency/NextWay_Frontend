import axios from "axios";
import { toast } from "sonner";
import store from "../redux/store";
import { clearTokens } from "@/redux/Slices/tokenSlice";
import HttpStatusCode from "@/enums/httpStatusCodes";

const BACKEND_URL = import.meta.env.VITE_SERVER_URL;

const baseURL = `${BACKEND_URL}/data`;

import { RootState } from "@/redux/store"; // Adjust the import according to your project structure

const state: RootState = store.getState();

const getAccessToken = () => {
  return (
    state.token.accessToken ||
    JSON.parse(
      JSON.parse(localStorage.getItem("persist:root") || "{}").token || "{}"
    ).accessToken
  );
};

const getRefreshToken = () => {
  return (
    state.token.refreshToken ||
    JSON.parse(
      JSON.parse(localStorage.getItem("persist:root") || "{}").token || "{}"
    ).refreshToken
  );
};

export const axiosMain = axios.create({
  baseURL: baseURL,
  withCredentials: true,
});

axiosMain.defaults.withCredentials = true;

axiosMain.interceptors.request.use((config) => {
  console.log("Request interceptor");

  const accessToken: string = getAccessToken() || "";
  const refreshToken: string = getRefreshToken() || "";
  // console.log("axiosMain.interceptors.request.getResfrshToken",getRefreshToken());

  if (accessToken) {
    config.headers["Authorization"] = `Bearer ${accessToken}`;
    config.headers["x-refresh-token"] = refreshToken;
  }

  return config;
});

axiosMain.interceptors.response.use(
  (response) => response,
  async (error) => {
    console.log("interceptor response");
    const originalRequest = error.config;

    const excludedEndpoints = [
      "/user/login",
      "/user/googleAuth",
      "/user/register",
      "/user/verify-otp",
      "/user/resent-otp",
      "/user/forgot-password-email",
      "/user/forgot-password-OTP",
      "/user/forgot-password-reset",
      "/get-company/:company_id",
      "/company/login",
      "/company/register",
      "/company/verify-otp",
      "/company/resent-otp",
      "/company/forgot-password-email",
      "/company/forgot-password-OTP",
      "/company/forgot-password-reset",
      "/admin/login",
    ];

    // Check if the request is one of the excluded endpoints
    if (
      excludedEndpoints.some((endpoint) =>
        originalRequest.url.includes(endpoint)
      )
    ) {
      return Promise.reject(error);
    }

    if (error.response) {
      const { status, data } = error.response;
      const role = data.role;
      if (
        (status === HttpStatusCode.FORBIDDEN &&
          data.message === "Your account is blocked by Admin") ||
        (status === HttpStatusCode.FORBIDDEN &&
          data.message === "Your role is not matching")
      ) {
        toast.error(data.message);
        localStorage.clear();
        clearTokens();
        setTimeout(() => {
          redirectToLogin(role);
        }, 1500);
      }
      if (
        status === HttpStatusCode.FORBIDDEN &&
        data.message === "Your account has rejected by Admin"
      ) {
        toast.error("Your account has rejected by Admin");
        localStorage.clear();
        clearTokens();
        setTimeout(() => {
          redirectToLogin(role);
        }, 1500);
      }
      if (status === HttpStatusCode.UNAUTHORIZED && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          const refreshResponse = await axiosMain.get(
            `/${data.role}/auth/refresh`
          );
          const newAccessToken = refreshResponse.headers["x-access-token"];

          if (newAccessToken) {
            const storedToken =
              JSON.parse(localStorage.getItem("persist:root") || "{}").token ||
              "{}";
            const updatedToken = {
              ...JSON.parse(storedToken),
              accessToken: newAccessToken,
            };

            localStorage.setItem(
              "persist:root",
              JSON.stringify({
                ...JSON.parse(localStorage.getItem("persist:root") || "{}"),
                token: JSON.stringify(updatedToken),
              })
            );

            // localStorage.setItem(
            //   "token",
            //   JSON.stringify({
            //     ...getAccessToken(),
            //     accessToken: newAccessToken,
            //   })
            // );
            originalRequest.headers[
              "Authorization"
            ] = `Bearer ${newAccessToken}`;
            return axiosMain(originalRequest);
          }
        } catch (refreshError) {
          toast.error("Session expired. Please login again.");
          localStorage.clear();
          setTimeout(() => {
            redirectToLogin(role);
          }, 1500);
        }
      }
      // toast.error(data.message || "An error occurred");
    }

    return Promise.reject(error);
  }
);

const redirectToLogin = (role: string) => {
  // const role = JSON.parse(localStorage.getItem("user") || "{}").role;
  if (role === "admin") {
    window.location.href = "/admin/login";
    clearTokens();
  } else if (role === "company") {
    window.location.href = "/company/login";
    clearTokens();
  } else {
    console.log("problem............");

    window.location.href = "/login";
    clearTokens();
  }
};

// axiosMain.interceptors.response.use(
//   (response) => {
//     return response;
//   },
//   async (error) => {
//     const originalRequest = error.config;
//     if (
//       error.response &&
//       error.response.status === 401 &&
//       error.response.data === "user blocked"
//     ) {
//       const persistedRootString = localStorage.getItem("persist:root");
//       if (persistedRootString) {
//         const persistedRoot = JSON.parse(persistedRootString);
//         if (persistedRoot.user) {
//           delete persistedRoot.user;
//           localStorage.setItem("persist:root", JSON.stringify(persistedRoot));
//         } else {
//           console.log("User data not found in persist:root");
//         }
//       } else {
//         console.log("'persist:root' key does not exist in localStorage");
//       }
//       toast.error("Your account is blocked by admin. Redirecting to login...");
//       setTimeout(() => {
//         window.location.href = "/user/login";
//       }, 1500);
//     }

//     if (error.response?.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;
//       try {
//         const token = refreshToken;
//         if (token) {
//           const { data } = await axios.post(
//             `${baseURL}/refresh-token`,
//             {},
//             {
//               headers: { "x-refresh-token": token },
//             }
//           );

//           localStorage.setItem("accessToken", data.accessToken);
//           axios.defaults.headers.common[
//             "Authorization"
//           ] = `Bearer ${data.accessToken}`;

//           return axiosMain(originalRequest);
//         }
//       } catch (refreshError) {
//         localStorage.removeItem("accessToken");
//         localStorage.removeItem("refreshToken");
//         window.location.href = "/login";
//       }
//     }
//     return Promise.reject(error);
//   }
// );

// const userURL = "http://localhost:3000/data/user";
// const companyURL = "http://localhost:3000/data/company";
// const adminURL = "http://localhost:3000/data/admin";
// const chatURL = "http://localhost:3000/data/chat";
// const subscribeURL = "http://localhost:3000/data/subscribe";

// export const axiosUser = axios.create({
//   baseURL: userURL,
//   withCredentials: true,
// });

// export const axiosCompany = axios.create({
//   baseURL: companyURL,
//   withCredentials: true,
// });

// export const axiosAdmin = axios.create({
//   baseURL: adminURL,
//   withCredentials: true,
// });

// export const axiosChat = axios.create({
//   baseURL: chatURL,
//   withCredentials: true,
// });

// export const axiosSubscription = axios.create({
//   baseURL: subscribeURL,
//   withCredentials: true,
// });

// axiosCompany.interceptors.request.use((config) => {
//   const accessToken = companyToken || "";

//   if (accessToken) {
//     config.headers.Authorization = `Bearer ${accessToken}`;
//   }

//   return config;
// });

// axiosCompany.interceptors.response.use(
//   (response) => {
//     // Return the response if successful
//     return response;
//   },
//   (error) => {
//     // Check for specific "user blocked" error from middleware
//     if (
//       error.response &&
//       error.response.status === 403 &&
//       error.response.data === "company blocked" // Ensure it's the specific message
//     ) {
//       const persistedRootString = localStorage.getItem("persist:root");
//       if (persistedRootString) {
//         const persistedRoot = JSON.parse(persistedRootString);
//         if (persistedRoot.company) {
//           delete persistedRoot.company;
//           localStorage.setItem("persist:root", JSON.stringify(persistedRoot));
//         }
//       }
//       // Show a toast notification for blocked users
//       toast.error("Your account is blocked by admin. Redirecting to login...");
//       // Redirect to login page after 1500ms
//       setTimeout(() => {
//         window.location.href = "/company/login"; // Or use `navigate("/login")` if in React Router
//       }, 1500);
//     }
//     // Return the error for other cases
//     return Promise.reject(error);
//   }
// );
