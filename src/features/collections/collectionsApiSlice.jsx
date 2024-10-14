import { createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";

const collectionAdapter = createEntityAdapter({});
const initialState = collectionAdapter.getInitialState();

export const collectionsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Fetch all collections
    getCollections: builder.query({
      query: (userId) => ({
        url: "/collection",
        params: { user_id: userId },
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError;
        },
      }),
      // Provide tags to collections
      providesTags: (result, error, userId) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Collection", id })),
              { type: "Collection", id: "LIST" }, // Tag for the entire collection list
            ]
          : [{ type: "Collection", id: "LIST" }],
    }),

    // Fetch a single collection by ID
    getOneCollection: builder.query({
      query: ({ id }) => ({
        url: `/collection/one/${id}`,
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError;
        },
      }),
      // Invalidate single collection by ID
      providesTags: (result, error, arg) => [
        { type: "Collection", id: arg.id },
      ],
    }),

    // Add a new collection
    addNewCollection: builder.mutation({
      query: (newCollection) => ({
        url: "/collection",
        method: "POST",
        body: {
          ...newCollection,
        },
      }),
      // Invalidate the entire collection list after adding a new collection
      invalidatesTags: [{ type: "Collection", id: "LIST" }],
    }),

    // Update an existing collection
    updateCollection: builder.mutation({
      query: (updatedCollection) => ({
        url: "/collection",
        method: "PATCH",
        body: { ...updatedCollection },
      }),
      // Invalidate both the specific collection and the list
      invalidatesTags: (result, error, arg) => [
        { type: "Collection", id: arg.id }, // Invalidate the updated collection
        { type: "Collection", id: "LIST" }, // Invalidate the entire list in case the update affects the collection list
      ],
    }),

    // Delete a collection
    deleteCollection: builder.mutation({
      query: ({ id }) => ({
        url: `/collection/${id}`,
        method: "DELETE",
      }),
      // Invalidate both the specific collection and the list
      invalidatesTags: (result, error, id) => [
        { type: "Collection", id }, // Invalidate the deleted collection
        { type: "Collection", id: "LIST" }, // Invalidate the entire list
      ],
    }),

    // Fetch all recipes in a specific collection
    getCollectionRecipes: builder.query({
      query: (collectionId) => `/collection/${collectionId}/recipes`,
      providesTags: (result, error, collectionId) => [
        { type: "Collection", id: collectionId },
      ],
    }),
  }),
});

export const {
  useGetCollectionsQuery,
  useGetOneCollectionQuery,
  useAddNewCollectionMutation,
  useUpdateCollectionMutation,
  useDeleteCollectionMutation,
  useGetCollectionRecipesQuery,
} = collectionsApiSlice;
