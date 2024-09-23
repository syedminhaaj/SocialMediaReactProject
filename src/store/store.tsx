import { configureStore } from "@reduxjs/toolkit";
import socialMediaReducer from "../reducer/mediaSlice";
export const store = configureStore({
  reducer: socialMediaReducer,
  devTools: true,
});

export type AppDispatch = typeof store.dispatch;
