import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { loginUserAct } from "../Actions/userActions";

interface User {
  user_id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  isBlocked: boolean;
  profileImage: any;
}

interface UserState {
  userInfo: User | null;
}

const initialState: UserState = {
  userInfo: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearUser(state) {
      state.userInfo = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUserAct.rejected, (state, action) => {})
      .addCase(loginUserAct.fulfilled, (state, action) => {
        if (action.payload) {
          state.userInfo = action.payload.userData; // Assuming userData contains the user details
        }
      });
  },
});

export const { clearUser } = userSlice.actions;
export default userSlice.reducer;
