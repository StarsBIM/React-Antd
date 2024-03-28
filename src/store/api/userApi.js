import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://localhost:5001/api/User/",
    prepareHeaders: (headers, { getState }) => {
      //获取token
      const token = getState().authSlice.token;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    }, //统一设置请求头
  }),
  tagTypes: ["users"], // 用来指定Api中的标签类型
  endpoints(build) {
    return {
      getUsers: build.query({
        query() {
          return "GetUsers";
        },
        transformResponse(baseQueryReturnValue) {
          return baseQueryReturnValue.data;
        },
        providesTags: [{ type: "users" }],
      }),
      getUserById: build.query({
        query(id) {
          return `GetUser/?id=${id}`;
        },
        transformResponse(baseQueryReturnValue) {
          return baseQueryReturnValue.data;
        },
        keepUnusedDataFor: 60, // 设置数据缓存时间，单位秒，默认60秒
      }),
      addUser: build.mutation({
        query(user) {
          return {
            url: "AddUser",
            method: "post",
            body: { ...user },
          };
        },
        invalidatesTags: ["users"],
      }),
      deleteUser: build.mutation({
        query(id) {
          return {
            url: `DeleteUser/?id=${id}`,
            method: "delete",
          };
        },
        invalidatesTags: ["users"],
      }),
      updateUser: build.mutation({
        query(user) {
          return {
            url: "UpdateUser",
            method: "put",
            body: { ...user },
          };
        },
        invalidatesTags: ["users"],
      }),
      enabledUser: build.mutation({
        query(user) {
          return {
            url: "EnabledUser",
            method: "put",
            body: { ...user },
          };
        },
        invalidatesTags: ["users"],
      }),
    };
  },
});

export const {
  useGetUsersQuery,
  useGetUserByIdQuery,
  useAddUserMutation,
  useDeleteUserMutation,
  useUpdateUserMutation,
  useEnabledUserMutation,
} = userApi;
