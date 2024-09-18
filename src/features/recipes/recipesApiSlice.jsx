import { apiSlice } from "../../app/api/apiSlice";

export const recipesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getRecipes: builder.query({
      query: () => "/recipes",
      keepUnusedDataFor: 5,
    }),
  }),
});

export const { useGetRecipesQuery } = recipesApiSlice;
