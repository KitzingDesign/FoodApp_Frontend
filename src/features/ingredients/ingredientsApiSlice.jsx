import { apiSlice } from "../../app/api/apiSlice";

export const ingredientsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getIngredients: builder.query({
      query: (recipeId) => ({
        url: "/ingredients",
        params: { recipe_id: recipeId },
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError;
        },
      }),
    }),
    addNewIngredient: builder.mutation({
      query: (addIngredient) => ({
        url: "/ingredient",
        method: "POST",
        body: {
          ...addIngredient,
        },
      }),
    }),
    updateIngredient: builder.mutation({
      query: (initialIngredient) => ({
        url: "/ingredient",
        method: "PATCH",
        body: {
          ...initialIngredient,
        },
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Ingredient", id: arg.id },
      ],
    }),
    deleteIngredient: builder.mutation({
      query: ({ id }) => ({
        url: "/ingredient",
        method: "DELETE",
        body: { ingredient_id: id },
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "ingredient", id: arg.id },
      ],
    }),
  }),
});

export const {
  useGetIngredientsQuery,
  useAddNewIngredientMutation,
  useUpdateIngredientMutation,
  useDeleteIngredientMutation,
} = ingredientsApiSlice;
