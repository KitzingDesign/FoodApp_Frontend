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
      // Provide tags for the collections
      providesTags: (result, error, userId) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Collection", id })),
              { type: "Collection", id: "LIST" }, // Tag for the entire collection list
            ]
          : [{ type: "Collection", id: "LIST" }],
    }),
    getOneCollection: builder.query({
      query: ({ id }) => ({
        url: `/collection/${id}`,
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError;
        },
      }),
      // Invalidate single recipe when needed
      providesTags: (result, error, arg) => [
        { type: "Collection", id: arg.id },
      ],
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
      // Invalidate the entire collection list to refetch it after a new collection is added
      invalidatesTags: [{ type: "Collection", id: "LIST" }],
    }),
    // Update an existing collection
    updateCollection: builder.mutation({
      query: (updatedCollection) => ({
        url: "/collection",
        method: "PATCH",
        body: { ...updatedCollection },
      }),
      invalidatesTags: [{ type: "Collection", id: "LIST" }],
    }),
    // Delete a collection
    deleteCollection: builder.mutation({
      query: (id) => ({
        url: `/collection?collection_id=${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [{ type: "Collection", id }],
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
