import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://localhost:5001/api/Auth/",
  }),
  endpoints(build) {
    return {
      register: build.mutation({
        query(user) {
          return {
            url: "auth/local/register",
            method: "post",
            body: user,
          };
        },
      }),
      login: build.mutation({
        query(user) {
          return {
            url: "Login",
            method: "post",
            body: user, // identifier
          };
        },
      }),
    };
  },
});
export const { useRegisterMutation, useLoginMutation } = authApi;
