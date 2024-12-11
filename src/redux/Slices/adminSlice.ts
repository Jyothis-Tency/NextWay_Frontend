import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { loginAdminAct } from "../Actions/adminActions";

interface Admin {
  email: string;
  // Add other fields from userData if needed
}

interface AdminState {
  adminInfo: Admin | null;
  loading: boolean;
  error: string | null;
  successMessage: string | null;
}

const initialState: AdminState = {
  adminInfo: null,
  loading: false,
  error: null,
  successMessage: null,
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    clearAdmin(state) {
      state.adminInfo = null;
      state.error = null;
      state.successMessage = null;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginAdminAct.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(
        loginAdminAct.fulfilled,
        (state, action: PayloadAction<Admin>) => {
          state.adminInfo = action.payload;
          state.loading = false;
          state.successMessage = "Admin logged in successfully!";
        }
      )
      .addCase(loginAdminAct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearAdmin, setLoading } = adminSlice.actions;
export default adminSlice.reducer;
