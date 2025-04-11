import { configureStore } from "@reduxjs/toolkit";
import reportSlice from "./slices/reportSlice";
import { useDispatch, useSelector } from "react-redux";
import { loadState, saveState } from "../local-storage";

const preloadedState = {
  report: loadState() || undefined,
};

export const store = configureStore({
  reducer: {
    report: reportSlice,
  },
  preloadedState,
});

store.subscribe(() => {
  const state = store.getState();
  saveState(state.report);
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
