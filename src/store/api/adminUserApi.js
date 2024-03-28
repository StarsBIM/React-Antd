import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";

export const adminUserApi = createApi({
  reducerPath: "adminUserApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://localhost:5001/api/AdminUser/",
    prepareHeaders: (headers, { getState }) => {
      //获取token
      const token = getState().authSlice.token;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    }, //统一设置请求头
  }),
  tagTypes: ["admins"], // 用来指定Api中的标签类型
  endpoints(build) {
    return {
      getAdminUsers: build.query({
        query() {
          return "GetAdminUsers";
        },
        transformResponse(baseQueryReturnValue) {
          return baseQueryReturnValue.data;
        },
        providesTags: [{ type: "admins" }],
      }),
      getAdminUserById: build.query({
        query(id) {
          return `GetAdminUser/?id=${id}`;
        },
        transformResponse(baseQueryReturnValue) {
          return baseQueryReturnValue.data;
        },
        keepUnusedDataFor: 60, // 设置数据缓存时间，单位秒，默认60秒
      }),
      addAdminUser: build.mutation({
        query(user) {
          return {
            url: "AddAdminUser",
            method: "post",
            body: { ...user },
          };
        },
        invalidatesTags: ["admins"],
      }),
      deleteAdminUser: build.mutation({
        query(id) {
          return {
            url: `DeleteAdminUser/?id=${id}`,
            method: "delete",
          };
        },
        invalidatesTags: ["admins"],
      }),
      updateAdminUser: build.mutation({
        query(user) {
          return {
            url: "UpdateAdminUser",
            method: "put",
            body: { ...user },
          };
        },
        invalidatesTags: ["admins"],
      }),
      enabledAdminUser: build.mutation({
        query(user) {
          return {
            url: "EnabledAdminUser",
            method: "put",
            body: { ...user },
          };
        },
        invalidatesTags: ["admins"],
      }),
    };
  },
});

export const {
  useGetAdminUsersQuery,
  useGetAdminUserByIdQuery,
  useAddAdminUserMutation,
  useDeleteAdminUserMutation,
  useUpdateAdminUserMutation,
  useEnabledAdminUserMutation,
} = adminUserApi;
