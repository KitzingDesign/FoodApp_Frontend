import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setCredentials, logOut } from "../../features/auth/authSlice";

const baseQuery = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:3500" }),
  credentials: "include",
  prepareHeaders: (header, { getState }) => {
    const token = getState().auth.token;
    if (token) {
      header.set("authorization", `Bearer ${token}`);
    }
    return header;
  },
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result?.error?.originalStatus === 403) {
    console.log("Sending refresh token request");
    // Send refresh token request to get new access token
    const refreshResult = await baseQuery(
      "/refresh", // check if the api endpoint is correct(could be with /auth)
      api,
      extraOptions
    );
    console.log("Refresh token request result", refreshResult); // check if the api endpoint is correct(could be without /auth)
    if (refreshResult?.data) {
      const user = api.getState().auth.user;
      // store the new token
      api.dispatch(
        setCredentials({
          ...refreshResult.data,
          user,
        })
      );
      // retry the original query with new access token
      result = await baseQuery(args, api, extraOptions);
    } else {
      api.dispatch(logOut());
    }
  }
  return result;
};

export const apiSlice = createApi({
  baseQuery: baseQueryWithReauth,
  endpoints: () => ({}),
});
