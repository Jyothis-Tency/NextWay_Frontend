import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosMain } from "@/Utils/axiosUtil";
import store from "../store";
import { addTokens, clearTokens } from "../Slices/tokenSlice";

export const loginAdminAct = createAsyncThunk(
  "admin/login",
  async (
    { email, password }: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosMain.post(`/admin/login`, {
        email,
        password,
      });
      const { accessToken, refreshToken, role } = response.data.adminData;
      console.log(
        "accessToken, refreshToken, role",
        accessToken,
        refreshToken,
        role
      );
      if (response.status === 200) {
        store.dispatch(clearTokens());
        store.dispatch(addTokens({ accessToken, refreshToken, role }));
        // Only return userData to match the expected type
        return response.data;
      }
    } catch (error: any) {
      console.error(`Error in loginAdminAct`);
      if (error.response) {
        if (error.response.status === 404) {
          return rejectWithValue("Email not found");
        } else if (error.response.status === 401) {
          return rejectWithValue("Incorrect Password");
        }
      }
      return rejectWithValue("Something went wrong. Please try again later.");
    }
  }
);
