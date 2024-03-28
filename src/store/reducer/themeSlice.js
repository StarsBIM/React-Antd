import { createSlice } from "@reduxjs/toolkit";

export const themeSlice = createSlice({
  name: "themeSlice",
  initialState: {
    myToken: {
      colorPrimary: "#1677FF",
      borderRadius: 6,
    },
    themeType: "default",
    compactType: "default",
  },
  reducers: {
    setThemeType(state, action) {
      state.themeType = action.payload;
    },
    setMyToken(state, action) {
      state.myToken = action.payload;
    },
    setCompactType(state, action) {
      state.compactType = action.payload;
    },
  },
});

export const { setThemeType, setMyToken, setCompactType } = themeSlice.actions;
