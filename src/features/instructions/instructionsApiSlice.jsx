import { apiSlice } from "../../app/api/apiSlice";

export const instructionsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getInstructions: builder.query({
      query: ({ id }) => ({
        url: `/instruction/${id}`,
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError;
        },
      }),
      providesTags: (result, error, { id }) =>
        result
          ? [{ type: "Instruction", id }] // If result exists, provide tag for that instruction
          : [{ type: "Instruction", id: "LIST" }],
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
      query: ({ instruction_id, instruction_text, step_number }) => ({
        url: `/instruction?instruction_id=${instruction_id}`,
        method: "PATCH",
        body: {
          step_number,
          instruction_text,
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
