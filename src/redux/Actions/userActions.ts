import { createAsyncThunk } from "@reduxjs/toolkit";
import {axiosUser} from "@/Utils/axiosUtil";

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
      const response = await axiosUser.post(`/register`, userData);
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
      const response = await axiosUser.post(`/verify-otp`, {
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
      const response = await axiosUser.post(`/login`, { email, password });
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
      const response = await axiosUser.post(`/forgot-password-email`, {
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
      const response = await axiosUser.post(`/forgot-password-OTP`, {
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
      const response = await axiosUser.post(`/forgot-password-reset`, {
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

export const updateUserProfile = (profileData: {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  location?: string;
}): any => {
  return async () => {
    try {
      console.log(
        `Profile Data in updateUserProfile: ${JSON.stringify(profileData)}`
      );

      const { userId, ...data } = profileData;
      const response = await axiosUser.put(
        `${URL}/edit-profile/${userId}`,
        data
      );

      if (response.status === 200) {
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
