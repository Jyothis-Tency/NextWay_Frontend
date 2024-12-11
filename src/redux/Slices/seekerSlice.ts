import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { loginSeekerAct } from "../Actions/seekerActions";

interface Seeker {
  seeker_id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  isBlocked: boolean;
}

interface SeekerState {
  seekerInfo: Seeker | null;
}

const initialState: SeekerState = {
  seekerInfo: null,
};

const seekerSlice = createSlice({
  name: "seeker",
  initialState,
  reducers: {
    clearSeeker(state) {
      state.seekerInfo = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginSeekerAct.rejected, (state, action) => {})
      .addCase(loginSeekerAct.fulfilled, (state, action) => {
        if (action.payload) {
          state.seekerInfo = action.payload.userData; // Assuming userData contains the user details
        }
      });
  },
});

export const { clearSeeker } = seekerSlice.actions;
export default seekerSlice.reducer;
