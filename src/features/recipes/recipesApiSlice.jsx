import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";

export const recipesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getRecipes: builder.query({
      query: (userId) => ({
        url: "/recipe",
        params: { user_id: userId },
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError;
        },
      }),
      // Provide tags so this query can be invalidated
      providesTags: (result, error, userId) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Recipe", id })),
              { type: "Recipe", id: "LIST" }, // Add a 'LIST' tag to invalidate the entire recipe list
            ]
          : [{ type: "Recipe", id: "LIST" }],
    }),
    getOneRecipe: builder.query({
      query: ({ id }) => ({
        url: `/recipe/${id}`,
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError;
        },
      }),
      // Invalidate single recipe when needed
      providesTags: (result, error, arg) => [{ type: "Recipe", id: arg.id }],
    }),
    addNewRecipe: builder.mutation({
      query: ({ recipeFormData }) => ({
        url: "/recipe/create",
        method: "POST",
        body: recipeFormData,
      }),
      // Invalidate the recipe list so it refetches after adding a new recipe
      invalidatesTags: (result, error, { collection_id }) => [
        { type: "Recipe", id: "LIST" },
        { type: "Collection", id: collection_id },
        { type: "Collection", id: "LIST" },
      ],
    }),
    updateRecipe: builder.mutation({
      query: ({ recipeFormData }) => ({
        url: "/recipe",
        method: "PATCH",
        body: recipeFormData,
      }),
      // Invalidate the specific recipe that was updated
      invalidatesTags: (result, error, arg) => [{ type: "Recipe", id: arg.id }],
    }),
    deleteRecipe: builder.mutation({
      query: ({ id }) => ({
        url: `/recipe?recipe_id=${id}`,
        method: "DELETE",
      }),
      // Invalidate the specific recipe that was deleted
      invalidatesTags: (result, error, arg) => [
        { type: "Recipe", id: arg.id },
        { type: "Recipe", id: "LIST" }, // This invalidates the entire recipe list
      ],
    }),
    getRecipeFromUrl: builder.query({
      query: (urlTest) => ({
        url: "/recipe/url",
        params: { url: urlTest },
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError;
        },
      }),
    }),
    uploadImage: builder.mutation({
      query: (imageFile) => ({
        url: "/recipe/upload", // Your endpoint to handle image uploads
        method: "POST",
        body: imageFile, // Assuming the backend expects the file directly
      }),
    }),
  }),
});

export const {
  useGetRecipesQuery,
  useAddNewRecipeMutation,
  useUpdateRecipeMutation,
  useGetRecipeFromUrlQuery,
  useDeleteRecipeMutation,
  useGetOneRecipeQuery,
  useUploadImageMutation,
} = recipesApiSlice;
