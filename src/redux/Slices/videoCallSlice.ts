import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface VideoCallState {
  isInvited: boolean;
  roomId: string | null;
  applicationId: string | null;
  companyName:string|null
}

const initialState: VideoCallState = {
  isInvited: false,
  roomId: null,
  applicationId: null,
  companyName:null
};

const videoCallSlice = createSlice({
  name: "videoCall",
  initialState,
  reducers: {
    setVideoCallInvitation: (
      state,
      action: PayloadAction<{
        roomId: string;
        applicationId: string;
        companyName:string
      }>
    ) => {
      state.isInvited = true;
      state.roomId = action.payload.roomId;
      state.applicationId = action.payload.applicationId;
      state.companyName=action.payload.companyName
    },
    clearVideoCallInvitation: (state) => {
      state.isInvited = false;
      state.roomId = null;
      state.applicationId = null;
      state.companyName=null
    },
  },
});

export const { setVideoCallInvitation, clearVideoCallInvitation } =
  videoCallSlice.actions;
export default videoCallSlice.reducer;
