import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    email: null,
    token: null,
    userId: null,
  },
  reducers: {
    setCredentials: (state, action) => {
      const { email, token, user_id } = action.payload;
      state.email = email;
      state.token = token;
      state.userId = user_id;
    },
    logOut: (state) => {
      state.email = null;
      state.token = null;
      state.userId = null;
    },
  },
});

export const { setCredentials, logOut } = authSlice.actions;

export const selectCurrentUser = (state) => state.auth.email;
export const selectCurrentUserId = (state) => state.auth.userId;
export const selectCurrentToken = (state) => state.auth.token;

export default authSlice.reducer;
