import { apiSlice } from "../../app/api/apiSlice";

export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUser: builder.query({
      query: (userId) => `/user/${userId}`,
      keepUnusedDataFor: 5,
    }),
  }),
});

export const { useGetUserQuery } = usersApiSlice;
