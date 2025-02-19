import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { loginCompanyAct } from "../Actions/companyActions";

interface Company {
  company_id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  isBlocked: boolean;
  profileImage: string;
  isVerified: string;
  accessToken: string | null;
  refreshToken: string | null;
}

interface CompanyState {
  companyInfo: Company | null;
}

const initialState: CompanyState = {
  companyInfo: null,
};

const companySlice = createSlice({
  name: "company",
  initialState,
  reducers: {
    clearCompany(state) {
      state.companyInfo = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginCompanyAct.rejected, (state, action) => {})
      .addCase(loginCompanyAct.fulfilled, (state, action) => {
        if (action.payload) {
          state.companyInfo = action.payload.userData; // Assuming userData contains the user details
        }
      });
  },
});

export const { clearCompany } = companySlice.actions;
export default companySlice.reducer;
