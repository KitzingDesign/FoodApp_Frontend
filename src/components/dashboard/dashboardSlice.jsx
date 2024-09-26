import { createSlice } from "@reduxjs/toolkit";

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState: {
    activeTitle: "All Recipes",
  },
  reducers: {
    setActiveTitle: (state, action) => {
      state.activeTitle = action.payload.activeTitle;
    },
  },
});

export const { setActiveTitle } = dashboardSlice.actions;

export const selectCurrentActiveTitle = (state) => state.dashboard.activeTitle;

export default dashboardSlice.reducer;
