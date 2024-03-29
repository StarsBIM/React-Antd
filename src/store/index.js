import { configureStore } from "@reduxjs/toolkit";
import { menuApi } from "./api/menuApi";
import { iconApi } from "./api/iconApi";
import { roleApi } from "./api/roleApi";
import { adminUserApi } from "./api/adminUserApi";
import { userApi } from "./api/userApi";
import { authApi } from "./api/authApi";
import { rollToolsApi } from "./api/rollToolsApi";
import { setupListeners } from "@reduxjs/toolkit/query";
import { operateSlice } from "./reducer/operateSlice";
import { authSlice } from "./reducer/authSlice";
import { themeSlice } from "./reducer/themeSlice";
import { currentRouteSlice } from "./reducer/currentRouteSlice";
import { localeSlice } from "./reducer/localeSlice";

const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [menuApi.reducerPath]: menuApi.reducer,
    [iconApi.reducerPath]: iconApi.reducer,
    [roleApi.reducerPath]: roleApi.reducer,
    [adminUserApi.reducerPath]: adminUserApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [rollToolsApi.reducerPath]: rollToolsApi.reducer,
    operateSlice: operateSlice.reducer,
    authSlice: authSlice.reducer,
    themeSlice: themeSlice.reducer,
    currentRouteSlice: currentRouteSlice.reducer,
    localeSlice: localeSlice.reducer,
  },
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware().concat(
      authApi.middleware,
      menuApi.middleware,
      iconApi.middleware,
      roleApi.middleware,
      adminUserApi.middleware,
      userApi.middleware,
      rollToolsApi.middleware
    );
  },
});

setupListeners(store.dispatch);

export default store;
