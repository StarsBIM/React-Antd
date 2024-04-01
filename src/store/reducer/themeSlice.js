import { createSlice } from "@reduxjs/toolkit";

//读取本地的主题设置
const myTheme = JSON.parse(localStorage.getItem("myTheme"));

export const themeSlice = createSlice({
  name: "themeSlice",
  initialState: {
    myToken: myTheme === null ? { colorPrimary: "#1677FF", borderRadius: 6 } : myTheme.myToken,
    themeType: myTheme === null ? "default" : myTheme.themeType,
    compactType: myTheme === null ? "default" : myTheme.compactType,
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
