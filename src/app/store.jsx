import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./api/apiSlice.jsx";
import authReducer from "../features/auth/authSlice";
import sidebarSlice from "../components/Sidebar/sidebarSlice.jsx";
import dashboardSlice from "../components/dashboard/dashboardSlice.jsx";

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authReducer,
    sidebar: sidebarSlice,
    dashboard: dashboardSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: true, // false when production
});
