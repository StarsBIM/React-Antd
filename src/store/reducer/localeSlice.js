import { createSlice } from "@reduxjs/toolkit";
import zh_cn from "../../locales/zh_cn";

export const localeSlice = createSlice({
  name: "localeSlice",
  initialState: {
    large: "zh-cn",
    myLocale: zh_cn,
  },
  reducers: {
    setLarge(state, action) {
      state.large = action.payload;
    },
    setMyLocale(state, action) {
      state.myLocale = action.payload;
    },
  },
});

export const { setLarge, setMyLocale } = localeSlice.actions;
