import { createSlice } from "@reduxjs/toolkit";

const sidebarSlice = createSlice({
  name: "sidebar",
  initialState: {
    isExpanded: true,
    activeTab: "ALL_RECIPES",
  },
  reducers: {
    setIsExpanded: (state, action) => {
      state.isExpanded = !state.isExpanded;
    },
    setActiveTab: (state, action) => {
      state.activeTab = action.payload.activeTab;
    },
  },
});

export const { setIsExpanded, setActiveTab } = sidebarSlice.actions;

export const selectCurrentActiveTab = (state) => state.sidebar.activeTab;
export const selectIsExpanded = (state) => state.sidebar.isExpanded;

export default sidebarSlice.reducer;
