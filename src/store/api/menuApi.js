import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";

export const menuApi = createApi({
  reducerPath: "menuApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://localhost:5001/api/Menu/",
    prepareHeaders: (headers, { getState }) => {
      //获取token
      const token = getState().authSlice.token;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    }, //统一设置请求头
  }),
  tagTypes: ["allMenus", "menus", "dirs"], // 用来指定Api中的标签类型
  endpoints(build) {
    return {
      getAllMenus: build.query({
        query() {
          return "GetAllMenus";
        },
        transformResponse(baseQueryReturnValue) {
          return baseQueryReturnValue.data;
        },
        providesTags: [{ type: "allMenus" }],
      }),
      getMenus: build.query({
        query() {
          return "GetMenus";
        },
        transformResponse(baseQueryReturnValue) {
          return baseQueryReturnValue.data;
        },
        providesTags: [{ type: "menus" }],
      }),
      getDirs: build.query({
        query() {
          return "GetDirs";
        },
        transformResponse(baseQueryReturnValue) {
          return baseQueryReturnValue.data;
        },
        providesTags: [{ type: "dirs" }],
      }),
      getBtnsByMenuId: build.query({
        query(id) {
          return `GetBtnsByMenuId/?id=${id}`;
        },
        transformResponse(baseQueryReturnValue) {
          return baseQueryReturnValue.data;
        },
        keepUnusedDataFor: 60, // 设置数据缓存时间，单位秒，默认60秒
      }),
      getNavMenuByRoleIds: build.query({
        query(ids) {
          return {
            url: "GetNavMenuByRoleIds",
            method: "post",
            body: { roleIds: ids },
          };
        },
        transformResponse(baseQueryReturnValue) {
          return baseQueryReturnValue.data;
        },
        keepUnusedDataFor: 60, // 设置数据缓存时间，单位秒，默认60秒
      }),
      getMenuById: build.query({
        query(id) {
          return `GetMenu/?id=${id}`;
        },
        transformResponse(baseQueryReturnValue) {
          return baseQueryReturnValue.data;
        },
        keepUnusedDataFor: 60, // 设置数据缓存时间，单位秒，默认60秒
      }),
      addMenu: build.mutation({
        query(menu) {
          return {
            url: "addMenu",
            method: "post",
            body: { ...menu },
          };
        },
        invalidatesTags: ["allMenus", "menus"],
      }),
      deleteMenu: build.mutation({
        query(id) {
          return {
            url: `DeleteMenu/?id=${id}`,
            method: "delete",
          };
        },
        invalidatesTags: ["allMenus", "menus"],
      }),
      updateMenu: build.mutation({
        query(menu) {
          return {
            url: "UpdateMenu",
            method: "put",
            body: { ...menu },
          };
        },
        invalidatesTags: ["allMenus", "menus"],
      }),
      enabledMenu: build.mutation({
        query(menu) {
          return {
            url: "EnabledMenu",
            method: "put",
            body: { ...menu },
          };
        },
        invalidatesTags: ["allMenus", "menus"],
      }),
    };
  },
});

export const {
  useGetAllMenusQuery,
  useGetMenusQuery,
  useGetDirsQuery,
  useGetMenuBtnByIdQuery,
  useGetNavMenuByRoleIdsQuery,
  useGetMenuByIdQuery,
  useAddMenuMutation,
  useDeleteMenuMutation,
  useUpdateMenuMutation,
  useEnabledMenuMutation,
} = menuApi;
