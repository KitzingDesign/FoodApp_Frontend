import { apiSlice } from "../../app/api/apiSlice";

export const instructionsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getInstructions: builder.query({
      query: (recipeId) => ({
        url: "/instructions",
        params: { recipe_id: recipeId },
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError;
        },
      }),
    }),
    addNewInstruction: builder.mutation({
      query: (addInstruction) => ({
        url: "/instruction",
        method: "POST",
        body: {
          ...addInstruction,
        },
      }),
    }),
    updateInstruction: builder.mutation({
      query: (initialInstruction) => ({
        url: "/instruction",
        method: "PATCH",
        body: {
          ...initialInstruction,
        },
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Instruction", id: arg.id },
      ],
    }),
    deleteInstruction: builder.mutation({
      query: ({ id }) => ({
        url: `/instruction`,
        method: "DELETE",
        body: { id },
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "instruction", id: arg.id },
      ],
    }),
  }),
});

export const {
  useGetInstructionsQuery,
  useAddNewInstructionMutation,
  useUpdateInstructionMutation,
  useDeleteInstructionMutation,
} = instructionsApiSlice;
