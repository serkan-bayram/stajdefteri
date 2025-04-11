import { configureStore } from "@reduxjs/toolkit";
import reportSlice from "./slices/reportSlice";
import { useDispatch, useSelector } from "react-redux";

export const store = configureStore({
  reducer: {
    report: reportSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
