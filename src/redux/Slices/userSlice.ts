import { createSlice } from "@reduxjs/toolkit";
import { loginUserAct, updateUserProfileAct } from "../Actions/userActions";

interface User {
  user_id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  isBlocked: boolean;
  profileImage: any;
  location: string;
  skills: string[];
  accessToken: string | null;
  refreshToken: string | null;
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
      })

      //  builder
      //    .addCase(updateUserProfileAct.pending, (state) => {
      //      state.loading = true;
      //      state.error = null;
      //    })
      .addCase(updateUserProfileAct.fulfilled, (state, action) => {
        //  state.loading = false;
        console.log("action.payload in userSlice", action.payload);
        if (state.userInfo && action.payload?.updatedData) {
          // Update only the relevant user fields
          state.userInfo = {
            ...state.userInfo,
            ...action.payload.updatedData,
          };
        }
      });
  },
});

export const { clearUser } = userSlice.actions;
export default userSlice.reducer;
