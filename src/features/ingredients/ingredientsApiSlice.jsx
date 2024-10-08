import { apiSlice } from "../../app/api/apiSlice";

export const ingredientsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getIngredients: builder.query({
      query: ({ id }) => ({
        url: `/ingredient/${id}`,
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError;
        },
      }),
      providesTags: (result, error, { id }) =>
        result
          ? [{ type: "Ingredient", id }] // Provide tag for specific ingredient
          : [{ type: "Ingredient", id: "LIST" }], // Provide list tag in case of error
    }),
    addNewIngredient: builder.mutation({
      query: (addIngredient) => ({
        url: "/ingredient",
        method: "POST",
        body: {
          ...addIngredient,
        },
      }),
      invalidatesTags: [{ type: "Ingredient", id: "LIST" }], // Invalidate the list after adding a new ingredient
    }),
    updateIngredient: builder.mutation({
      query: ({ ingredient_id, name }) => ({
        url: `/ingredient?ingredient_id=${ingredient_id}`,
        method: "PATCH",
        body: {
          name,
        },
      }),
      invalidatesTags: (result, error, { ingredient_id }) => [
        { type: "Ingredient", id: ingredient_id }, // Invalidate the specific ingredient
        { type: "Ingredient", id: "LIST" }, // Optionally invalidate the list as well
      ],
    }),
    deleteIngredient: builder.mutation({
      query: ({ id }) => ({
        url: "/ingredient",
        method: "DELETE",
        body: { ingredient_id: id },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Ingredient", id }, // Invalidate the specific ingredient
        { type: "Ingredient", id: "LIST" }, // Invalidate the list after deletion
      ],
    }),
  }),
});

// Export hooks for usage in functional components
export const {
  useGetIngredientsQuery,
  useAddNewIngredientMutation,
  useUpdateIngredientMutation,
  useDeleteIngredientMutation,
} = ingredientsApiSlice;
