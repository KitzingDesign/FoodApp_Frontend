import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./api/apiSlice.jsx";
import authReducer from "../features/auth/authSlice";
import collectionReducer from "../features/collections/collectionSlice";
import sidebarSlice from "../components/Sidebar/sidebarSlice.jsx";
import dashboardSlice from "../components/dashboard/dashboardSlice.jsx";

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authReducer,
    collection: collectionReducer,
    sidebar: sidebarSlice,
    dashboard: dashboardSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: true, // false when production
});
