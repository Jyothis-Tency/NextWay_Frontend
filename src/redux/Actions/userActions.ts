import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosMain } from "@/Utils/axiosUtil";
import store from "../store";
import { addTokens, clearTokens } from "../Slices/tokenSlice";
import HttpStatusCode from "@/enums/httpStatusCodes";

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

export const loginUserAct = createAsyncThunk(
  "user/login",
  async (
    { email, password }: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosMain.post(`/user/login`, { email, password });
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
export const googleLoginUserAct = createAsyncThunk(
  "user/googleLogin",
  async (credential: string, { rejectWithValue }) => {
    try {
      const response = await axiosMain.post(`/user/googleAuth`, {
        credential,
      });
      console.log("google back response", response);
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
      const response = await axiosMain.post(`/user/forgot-password-email`, {
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
      const response = await axiosMain.post(`/user/forgot-password-OTP`, {
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
      const response = await axiosMain.post(`/user/forgot-password-reset`, {
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
      console.log("response.data in updateUserProfileAct", response.data);

      if (response.status === HttpStatusCode.OK) {
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
