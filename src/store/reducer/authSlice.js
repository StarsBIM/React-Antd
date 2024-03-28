import { createSlice } from "@reduxjs/toolkit";

export const authSlice = createSlice({
  name: "authSlice",
  initialState: () => {
    const token = localStorage.getItem("token");
    const refreshToken = localStorage.getItem("refreshToken");
    if (!token) {
      return {
        isLogged: false,
        token: null, // 服务器发送给我们的token默认有效期是一个月
        refreshToken: null,
        currentUser: null,
        expirationTime: 0, //登录状态失效的时间
      };
    }
    return {
      isLogged: true,
      token: token,
      refreshToken: refreshToken,
      currentUser: JSON.parse(localStorage.getItem("currentUser")),
      expirationTime: +localStorage.getItem("expirationTime"),
    };
  },
  reducers: {
    setLogin(state, action) {
      state.isLogged = true;
      state.token = action.payload.token;
      state.refreshToken = action.payload.refreshToken;
      state.currentUser = action.payload.user;

      // 获取当前的时间戳
      const currnetTime = Date.now();
      // 设置登录的有效时间
      const timeout = 1000 * 60 * 60 * 24 * 7; // 一周
      // const timeout = 1000 * 10; // 10秒
      // 设置失效时间
      state.expirationTime = currnetTime + timeout;

      //将数据同时存储到本地存储中
      localStorage.setItem("token", state.token);
      localStorage.setItem("refreshToken", state.refreshToken);
      localStorage.setItem("currentUser", JSON.stringify(state.currentUser));
      localStorage.setItem("expirationTime", state.expirationTime + "");
    },
    setLogout(state, action) {
      state.isLogged = false;
      state.token = null;
      state.refreshToken = null;
      state.currentUser = null;

      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("currentUser");
      localStorage.removeItem("expirationTime");
    },
  },
});
export const { setLogin, setLogout } = authSlice.actions;
