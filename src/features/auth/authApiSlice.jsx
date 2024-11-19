import { apiSlice } from "../../app/api/apiSlice";

export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: "/auth",
        method: "POST",
        body: credentials,
      }),
    }),
    loginWithGoogle: builder.mutation({
      query: (credentials) => ({
        url: "/auth/google",
        method: "POST",
        body: credentials,
      }),
    }),
    register: builder.mutation({
      query: (credentials) => ({
        url: "/user",
        method: "POST",
        body: credentials,
      }),
      // Optional: Handle success or failure cases directly here
      onQueryStarted: async (args, { dispatch, queryFulfilled }) => {
        try {
          // Handle the successful response from backend
          const { data } = await queryFulfilled;
          dispatch(setCredentials(data)); // Update Redux state with user data
        } catch (error) {
          console.error("Registration Error:", error);
          // Optionally dispatch a failure action or set error state
        }
      },
      // Handling the response (optional)
      onError: (error) => {
        console.error("Registration Error:", error);
      },
    }),
    logout: builder.mutation({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
    }),
    delete: builder.mutation({
      query: (userId) => ({
        url: `/auth/${userId}`,
        method: "DELETE",
      }),
    }),
    refresh: builder.mutation({
      query: () => ({
        url: "/auth/refresh",
        method: "GET",
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          const { accessToken } = data;
          dispatch(setCredentials({ accessToken }));
        } catch (err) {
          console.log(err);
        }
      },
    }),
  }),
});

export const {
  useLoginMutation,
  useLoginWithGoogleMutation,
  useRefreshMutation,
  useRegisterMutation,
  useLogoutMutation,
  useDeleteMutation,
} = usersApiSlice;
