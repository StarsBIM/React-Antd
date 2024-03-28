import { createSlice } from "@reduxjs/toolkit";

export const currentRouteSlice = createSlice({
  name: "currentRouteSlice",
  initialState: {
    currentRoute: { name: "首页", url: "/admin/home" },
  },
  reducers: {
    setCurrentRoute(state, action) {
      state.currentRoute = action.payload;
    },
  },
});
export const { setCurrentRoute } = currentRouteSlice.actions;
