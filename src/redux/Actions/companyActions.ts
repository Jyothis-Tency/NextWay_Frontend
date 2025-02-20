import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosMain } from "@/Utils/axiosUtil";
import store from "../store";
import { addTokens, clearTokens } from "../Slices/tokenSlice";
import HttpStatusCode from "@/enums/httpStatusCodes";

export const registerCompanyAct = (userData: {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  certificate: any;
}): any => {
  return async () => {
    try {
      console.log(`userData in registerFrom at userActions: ${userData}`);
      const formData = new FormData();
      Object.keys(userData).forEach((key) => {
        if (key === "certificate" && userData.certificate) {
          formData.append(key, userData.certificate);
        } else {
          formData.append(
            key,
            userData[key as keyof typeof userData] as string
          );
        }
      });

      const response = await axiosMain.post(`/company/register`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log(response);
      if (response.status === HttpStatusCode.OK) {
        localStorage.setItem("userEmail", userData.email);
        return { success: true, message: "OTP send to mail successfully" };
      }
    } catch (error: any) {
      console.log(`Error in registerFrom at userActions`);
      if (error.response) {
        if (error.response.status === HttpStatusCode.CONFLICT) {
          return { success: false, message: "Email already in use" };
        } else if (error.response.status === HttpStatusCode.SERVICE_UNAVAILABLE) {
          return {
            success: false,
            message: "Service unavailable, please try again later",
          };
        }
      }
      return {
        success: false,
        message: "Something went wrong. Please try again later.",
      };
    }
  };
};

export const OTPVerifyAct = (otp: string) => {
  return async () => {
    try {
      const email = localStorage.getItem("userEmail");
      const response = await axiosMain.post(`/company/verify-otp`, {
        email,
        receivedOTP: otp,
      });
      if (response.data.message === "verified") {
        localStorage.clear();
        return { success: true, message: "User Registered Successfully" };
      }
    } catch (error: any) {
      console.log(`Error in verifyOTP at userActions`);
      if (error.response) {
        if (error.response.status === HttpStatusCode.UNAUTHORIZED) {
          return { success: false, message: "Incorrect OTP" };
        } else if (error.response.status === HttpStatusCode.EXPIRED) {
          return {
            success: false,
            message: "OTP expired or doesn't exist",
          };
        }
      }
      return {
        success: false,
        message: "Something went wrong. Please try again later.",
      };
    }
  };
};

export const loginCompanyAct = createAsyncThunk(
  "company/login",
  async (
    { email, password }: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosMain.post(`/company/login`, {
        email,
        password,
      });
      console.log(response);
      const { accessToken, refreshToken, role } = response.data.userData;
      console.log(
        "accessToken, refreshToken, role",
        accessToken,
        refreshToken,
        role
      );
      if (response.status === HttpStatusCode.OK) {
        store.dispatch(clearTokens());
        store.dispatch(addTokens({ accessToken, refreshToken, role }));
        return {
          success: true,
          message: "User Registered Successfully",
          userData: response.data.userData,
        };
      }
    } catch (error: any) {
      console.error(`Error in loginUser at userActions`);
      if (error.response) {
        if (error.response.status === HttpStatusCode.NOT_FOUND) {
          return rejectWithValue({ message: "Email not found" });
        } else if (error.response.status === HttpStatusCode.UNAUTHORIZED) {
          return rejectWithValue({ message: "Incorrect Password" });
        } else if (error.response.status === HttpStatusCode.FORBIDDEN) {
          return rejectWithValue({ message: "User is blocked" });
        }
      }
      return rejectWithValue({
        message: "Something went wrong. Please try again later.",
      });
    }
  }
);

export const forgotPasswordEmailAct = (email: string) => {
  return async () => {
    try {
      const response = await axiosMain.post(`/company/forgot-password-email`, {
        email,
      });
      if (response.status === HttpStatusCode.OK) {
        localStorage.setItem("userEmail", email);
        return {
          success: true,
          message: "OTP send to mail",
        };
      }
    } catch (error: any) {
      console.log(`Error in emailValidation at userActions`);
      if (error.response) {
        if (error.response.status === HttpStatusCode.NOT_FOUND) {
          return { success: false, message: "Email not found" };
        }
      }
      return {
        success: false,
        message: "Something went wrong. Please try again later.",
      };
    }
  };
};

export const forgotPasswordOTPAct = (otp: string) => {
  return async () => {
    try {
      const email = localStorage.getItem("userEmail");
      const response = await axiosMain.post(`/company/forgot-password-OTP`, {
        email,
        otp,
      });
      if (response.status === HttpStatusCode.OK) {
        localStorage.clear();
        return {
          success: true,
          message: "OTP verified Successfully",
        };
      }
    } catch (error: any) {
      console.log(`Error in emailValidation at userActions`);
      if (error.response) {
        if (error.response.status === HttpStatusCode.UNAUTHORIZED) {
          return { success: false, message: "Incorrect OTP" };
        } else if (error.response.status === HttpStatusCode.EXPIRED) {
          return { success: false, message: "OTP expired or doesn't exist" };
        }
      }
      return {
        success: false,
        message: "Something went wrong. Please try again later.",
      };
    }
  };
};

export const forgotPasswordResetAct = (email: string, password: string) => {
  return async () => {
    try {
      const response = await axiosMain.post(`/company/forgot-password-reset`, {
        email,
        password,
      });
      if (response.status === HttpStatusCode.OK) {
        return {
          success: true,
          message: "Password reset successfully",
        };
      }
    } catch (error: any) {
      console.log(`Error in emailValidation at userActions`);
      if (error.response) {
        if (error.response.status === HttpStatusCode.NOT_FOUND) {
          return { success: false, message: "Email not found" };
        }
      }
      return {
        success: false,
        message: "Something went wrong. Please try again later.",
      };
    }
  };
};

export const updateCompanyProfile = (
  company_id: string | undefined,
  profileData: Record<string, any>
) => {
  return async () => {
    try {
      console.log(
        `Profile Data in updateCompanyProfile: ${JSON.stringify(profileData)}`
      );

      const response = await axiosMain.put(
        `/company/edit-company/${company_id}`,
        profileData
      );

      console.log(`response - ${response}`);

      if (response.status === HttpStatusCode.OK) {
        console.log(`Profile updated successfully: ${response.data}`);
        return { success: true, message: "Profile updated successfully!" };
      }
    } catch (error: any) {
      console.error(`Error in updateUserProfile:`, error);

      if (error.response) {
        return {
          success: false,
          message: error.response.data?.message || "Failed to update profile",
        };
      }
      return {
        success: false,
        message: "Something went wrong. Please try again later.",
      };
    }
  };
};
