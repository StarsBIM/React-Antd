import { createSlice } from "@reduxjs/toolkit";

export const operateSlice = createSlice({
  name: "operateSlice",
  initialState: {
    operateItem: null,
    operateType: null,
  },
  reducers: {
    setOperateItem(state, action) {
      state.operateItem = action.payload;
    },
    setOperateType(state, action) {
      state.operateType = action.payload;
    },
  },
});
export const { setOperateItem, setOperateType } = operateSlice.actions;
