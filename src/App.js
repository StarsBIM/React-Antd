import React, { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { Layout, ConfigProvider, theme } from "antd";
import Login from "./components/Login/Login";
import Admin from "./pages/Admin/Admin";
import useAutoLogout from "./hooks/useAutoLogout";
import NeedAuth from "./components/NeedAuth/NeedAuth";
import useTheme from "./hooks/useTheme";
import useLocale from "./hooks/useLocale";

const App = () => {
  useAutoLogout();
  const { locale, large } = useLocale();
  const { algorithm, myToken } = useTheme();

  return (
    <ConfigProvider theme={{ token: myToken, algorithm }} locale={locale}>
      <Layout style={{ position: "fixed", top: "0", left: "0", right: "0", bottom: "0" }}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/admin/*"
            element={
              <NeedAuth>
                <Admin />
              </NeedAuth>
            }
          />
        </Routes>
      </Layout>
    </ConfigProvider>
  );
};

export default App;
