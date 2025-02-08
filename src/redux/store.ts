import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import userSlice from "./Slices/userSlice";
import companySlice from "./Slices/companySlice";
import adminSlice from "./Slices/adminSlice";
import videoCallSlice from "./Slices/videoCallSlice";
import tokenSlice from "./Slices/tokenSlice";

const persistConfig = {
  key: "root",
  storage,
};

const rootReducer = combineReducers({
  user: userSlice,
  company: companySlice,
  admin: adminSlice,
  videoCall: videoCallSlice,
  token: tokenSlice,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const persistor = persistStore(store);
export default store;
