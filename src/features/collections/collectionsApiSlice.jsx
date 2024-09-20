import { createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";

const collectionAdapter = createEntityAdapter({});
const initialState = collectionAdapter.getInitialState();

export const collectionsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCollections: builder.query({
      query: (userId) => ({
        url: "/collection",
        params: { user_id: userId },
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError;
        },
      }),
    }),
    // addFetch a single collection by ID
    //insert code here
    // addCreate a new collection
    addNewCollection: builder.mutation({
      query: (newCollection) => ({
        url: "/collection",
        method: "POST",
        body: {
          ...newCollection,
        },
      }),
    }),
    // Update an existing collection
    updateCollection: builder.mutation({
      query: ({ id, updatedCollection }) => ({
        url: "/collection",
        method: "PATCH",
        body: { ...updatedCollection, id },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Collection", id }],
    }),
    // Delete a collection
    deleteCollection: builder.mutation({
      query: (id) => ({
        url: `/collection`,
        body: {
          id,
        },
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [{ type: "Collection", id }],
    }),
    // Fetch all recipes in a specific collection
    getCollectionRecipes: builder.query({
      query: (collectionId) => `/${collectionId}/recipes`,
      providesTags: (result, error, collectionId) => [
        { type: "Collection", id: collectionId },
      ],
    }),
  }),
});

export const {
  useGetCollectionsQuery,
  useAddNewCollectionMutation,
  useUpdateCollectionMutation,
  useDeleteCollectionMutation,
  useGetCollectionRecipesQuery,
} = collectionsApiSlice;
