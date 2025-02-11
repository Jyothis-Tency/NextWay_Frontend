import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosMain } from "@/Utils/axiosUtil";
import { addTokens } from "../Slices/tokenSlice";

export const registerUserAct = (userData: {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}): any => {
  return async () => {
    try {
      console.log(`userData in registerFrom at userActions: ${userData}`);
      const response = await axiosMain.post(`/user/register`, userData);
      console.log(response);
      if (response.status === 200) {
        localStorage.setItem("userEmail", userData.email);
        return { success: true, message: "OTP send to mail successfully" };
      }
    } catch (error: any) {
      console.log(`Error in registerFrom at userActions`);
      if (error.response) {
        if (error.response.status === 409) {
          return { success: false, message: "Email already in use" };
        } else if (error.response.status === 503) {
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
      const response = await axiosMain.post(`/user/verify-otp`, {
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
        if (error.response.status === 401) {
          return { success: false, message: "Incorrect OTP" };
        } else if (error.response.status === 410) {
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

export const loginUserAct = createAsyncThunk(
  "user/login",
  async (
    { email, password }: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosMain.post(`/user/login`, { email, password });
      console.log(response);
      
      if (response.status === 200) {
        return {
          success: true,
          message: "User Registered Successfully",
          userData: response.data.userData,
        };
      }
    } catch (error: any) {
      console.error(`Error in loginUser at userActions`);
      if (error.response) {
        if (error.response.status === 404) {
          return rejectWithValue({ message: "Email not found" });
        } else if (error.response.status === 401) {
          return rejectWithValue({ message: "Incorrect Password" });
        } else if (error.response.status === 403) {
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
      const response = await axiosMain.post(`/user/forgot-password-email`, {
        email,
      });
      if (response.status === 200) {
        localStorage.setItem("userEmail", email);
        return {
          success: true,
          message: "OTP send to mail",
        };
      }
    } catch (error: any) {
      console.log(`Error in emailValidation at userActions`);
      if (error.response) {
        if (error.response.status === 404) {
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
      const response = await axiosMain.post(`/user/forgot-password-OTP`, {
        email,
        otp,
      });
      if (response.status === 200) {
        localStorage.clear();
        return {
          success: true,
          message: "OTP verified Successfully",
        };
      }
    } catch (error: any) {
      console.log(`Error in emailValidation at userActions`);
      if (error.response) {
        if (error.response.status === 401) {
          return { success: false, message: "Incorrect OTP" };
        } else if (error.response.status === 410) {
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
      const response = await axiosMain.post(`/user/forgot-password-reset`, {
        email,
        password,
      });
      if (response.status === 200) {
        return {
          success: true,
          message: "Password reset successfully",
        };
      }
    } catch (error: any) {
      console.log(`Error in emailValidation at userActions`);
      if (error.response) {
        if (error.response.status === 404) {
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

export const updateUserProfileAct = createAsyncThunk(
  "user/updateProfile",
  async (
    profileData: {
      userId: string;
      firstName: string;
      lastName: string;
      email: string;
      phone?: string;
      location?: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const { userId, ...data } = profileData;
      const response = await axiosMain.put(
        `/user/edit-profile/${userId}`,
        data
      );
      console.log("response.data in updateUserProfileAct",response.data);
      
      if (response.status === 200) {
        return {
          success: true,
          message: "Profile updated successfully!",
          updatedData: response.data,
        };
      }
    } catch (error: any) {
      console.error(`Error in updateUserProfileAct:`, error);

      if (error.response) {
        return rejectWithValue({
          message: error.response.data?.message || "Failed to update profile",
        });
      }

      return rejectWithValue({
        message: "Something went wrong. Please try again later.",
      });
    }
  }
);