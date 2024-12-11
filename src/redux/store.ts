import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import seekerSlice from "./Slices/seekerSlice";
import companySlice from "./Slices/companySlice";
import adminSlice from "./Slices/adminSlice";

const persistConfig = {
  key: "root",
  storage,
};

const rootReducer = combineReducers({
  seeker: seekerSlice,
  company: companySlice,
  admin: adminSlice,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const persistor = persistStore(store);
export default store;
