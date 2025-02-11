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
  isSubscribed: boolean | undefined;
  subscriptionFeatures: string[] | null;
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
    setSubscriptions(state, action) {
      if (state.userInfo) {
        console.log("state.userInfo.....................", state.userInfo);
        state.userInfo.isSubscribed = true;
        state.userInfo.subscriptionFeatures =
          action.payload;
      }
    },
    clearSubscriptions(state) {
      if (state.userInfo) {
        state.userInfo.isSubscribed = false;
        state.userInfo.subscriptionFeatures = null;
      }
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

export const { clearUser, setSubscriptions, clearSubscriptions } =
  userSlice.actions;
export default userSlice.reducer;
