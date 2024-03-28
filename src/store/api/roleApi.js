import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";

export const roleApi = createApi({
  reducerPath: "roleApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://localhost:5001/api/Role/",
    prepareHeaders: (headers, { getState }) => {
      //获取token
      const token = getState().authSlice.token;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    }, //统一设置请求头
  }),
  tagTypes: ["roles"], // 用来指定Api中的标签类型
  endpoints(build) {
    return {
      getRoles: build.query({
        query() {
          return "GetRoles";
        },
        transformResponse(baseQueryReturnValue) {
          return baseQueryReturnValue.data;
        },
        providesTags: [{ type: "roles" }],
      }),
      getRoleById: build.query({
        query(id) {
          return `GetRole/?id=${id}`;
        },
        transformResponse(baseQueryReturnValue) {
          return baseQueryReturnValue.data;
        },
        keepUnusedDataFor: 60, // 设置数据缓存时间，单位秒，默认60秒
      }),
      addRole: build.mutation({
        query(role) {
          return {
            url: "AddRole",
            method: "post",
            body: { ...role },
          };
        },
        invalidatesTags: ["roles"],
      }),
      deleteRole: build.mutation({
        query(id) {
          return {
            url: `DeleteRole/?id=${id}`,
            method: "delete",
          };
        },
        invalidatesTags: ["roles"],
      }),
      updateRole: build.mutation({
        query(role) {
          return {
            url: "UpdateRole",
            method: "put",
            body: { ...role },
          };
        },
        invalidatesTags: ["roles"],
      }),
      enabledRole: build.mutation({
        query(role) {
          return {
            url: "EnabledRole",
            method: "put",
            body: { ...role },
          };
        },
        invalidatesTags: ["roles"],
      }),
    };
  },
});

export const {
  useGetRolesQuery,
  useGetRoleByIdQuery,
  useAddRoleMutation,
  useDeleteRoleMutation,
  useUpdateRoleMutation,
  useEnabledRoleMutation,
} = roleApi;
