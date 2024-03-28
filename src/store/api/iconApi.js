import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";

export const iconApi = createApi({
  reducerPath: "iconApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://localhost:5001/api/Icon/",
    prepareHeaders: (headers, { getState }) => {
      //获取token
      const token = getState().authSlice.token;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    }, //统一设置请求头
  }),
  tagTypes: ["icons"], // 用来指定Api中的标签类型
  endpoints(build) {
    return {
      getIcons: build.query({
        query() {
          return "GetIcons";
        },
        transformResponse(baseQueryReturnValue) {
          return baseQueryReturnValue.data;
        },
        providesTags: [{ type: "icons" }],
      }),
      getIconById: build.query({
        query(id) {
          return `GetIcon/?id=${id}`;
        },
        transformResponse(baseQueryReturnValue) {
          return baseQueryReturnValue.data;
        },
        keepUnusedDataFor: 60, // 设置数据缓存时间，单位秒，默认60秒
      }),
      addIcon: build.mutation({
        query(icon) {
          return {
            url: "AddIcon",
            method: "post",
            body: { ...icon },
          };
        },
        invalidatesTags: ["icons"],
      }),
      deleteIcon: build.mutation({
        query(id) {
          return {
            url: `DeleteIcon/?id=${id}`,
            method: "delete",
          };
        },
        invalidatesTags: ["icons"],
      }),
      updateIcon: build.mutation({
        query(icon) {
          return {
            url: "UpdateIcon",
            method: "put",
            body: { ...icon },
          };
        },
        invalidatesTags: ["icons"],
      }),
    };
  },
});

export const {
  useGetIconsQuery,
  useGetIconByIdQuery,
  useAddIconMutation,
  useDeleteIconMutation,
  useUpdateIconMutation,
} = iconApi;
