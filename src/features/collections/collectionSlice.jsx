import { createSlice } from "@reduxjs/toolkit";

const collectionSlice = createSlice({
  name: "collection",
  initialState: {
    collections: [],
  },
  reducers: {
    setCollection: (state, action) => {
      state.collections = action.payload.collections || [];
    },
    addCollection: (state, action) => {
      state.collections.push(action.payload.collection);
    },
  },
});

export const { setCollection, addCollection } = collectionSlice.actions;

export const selectCurrentCollection = (state) =>
  state.collection.collections || [];

export default collectionSlice.reducer;
