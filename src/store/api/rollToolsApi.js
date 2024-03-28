import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";

export const rollToolsApi = createApi({
  reducerPath: "rollToolsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://www.mxnzp.com/api/",
  }),
  endpoints(build) {
    return {
      getAddress: build.query({
        query() {
          return "address/list?app_id=mnqjcptgmdxpfef7&app_secret=dYl1Hrfp4GdqQ9oS5EJ4KL5fGfJ0ACDz";
        },
        transformResponse(baseQueryReturnValue) {
          return baseQueryReturnValue.data;
        },
      }),
      getVerifycode: build.query({
        query() {
          return "verifycode/code?len=5&type=0&app_id=mnqjcptgmdxpfef7&app_secret=dYl1Hrfp4GdqQ9oS5EJ4KL5fGfJ0ACDz";
        },
        transformResponse(baseQueryReturnValue) {
          return baseQueryReturnValue.data;
        },
      }),
    };
  },
});

export const { useGetAddressQuery, useGetVerifycodeQuery } = rollToolsApi;
