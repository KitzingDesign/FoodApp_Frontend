import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";

const recipeAdapter = createEntityAdapter({});

const initialState = recipeAdapter.getInitialState();

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
    }),
    addNewRecipe: builder.mutation({
      query: (addRecipe) => ({
        url: "/recipe/create",
        method: "POST",
        body: {
          ...addRecipe,
        },
      }),
    }),
    updateRecipe: builder.mutation({
      query: (initialRecipe) => ({
        url: "/recipe",
        method: "PATCH",
        body: {
          ...initialRecipe,
        },
      }),
      invalidatesTags: (result, error, arg) => [{ type: "Recipe", id: arg.id }],
    }),
    deleteRecipe: builder.mutation({
      query: ({ id }) => ({
        url: `/recipes`,
        method: "DELETE",
        body: { id },
      }),
      invalidatesTags: (result, error, arg) => [{ type: "Recipe", id: arg.id }],
    }),
  }),
});

export const { useGetRecipesQuery, useAddNewRecipeMutation } = recipesApiSlice;
