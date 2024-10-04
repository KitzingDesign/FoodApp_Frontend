import { apiSlice } from "../../app/api/apiSlice";

export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUser: builder.query({
      query: (userId) => `/user/${userId}`,
      keepUnusedDataFor: 5,
      providesTags: (result, error, arg) => {
        if (result?.userId) {
          return [{ type: "User", id: result.userId }];
        } else return [{ type: "User", id: "LIST" }];
      },
    }),
    updateUser: builder.mutation({
      query: ({ userId, userFormData }) => ({
        url: "/user",
        method: "PATCH",
        body: userFormData,
      }),
      invalidatesTags: (result, error, { userId }) => [
        { type: "User", id: userId }, // Invalidate the specific user
        { type: "User", id: "LIST" }, // Optional: invalidate the user list if needed
      ],
    }),
  }),
});

export const { useGetUserQuery, useUpdateUserMutation } = usersApiSlice;
