import { FloatButton, Layout, theme } from "antd";
import Sider from "antd/es/layout/Sider";
import React, { useState } from "react";
import LeftNav from "../../components/LeftNav/LeftNav";
import { Content } from "antd/es/layout/layout";
import { Route, Routes } from "react-router-dom";
import RolePage from "../Role/RolePage";
import Home from "../Home/Home";
import MenuPage from "../Menu/MenuPage";
import UserPage from "../User/UserPage";
import AdminUserPage from "../AdminUser/AdminUserPage";
import MyHeader from "../../components/Header/MyHeader";
import { SettingOutlined } from "@ant-design/icons";
import ThemeForm from "../ThemeForm/ThemeForm";
import Draggable from "react-draggable";
import useDraggable from "../../hooks/useDraggable";

const Admin = () => {
  const { useToken } = theme;
  const { token } = useToken();
  const [isSetTheme, setIsSetTheme] = useState(false);
  const { draggleRef, bounds, isDraggable, onStart, onStop } = useDraggable("upDown");
  const onSetTheme = () => {
    if (!isDraggable) {
      setIsSetTheme(!isSetTheme);
    }
  };
  return (
    <Layout>
      <Draggable
        bounds={bounds}
        onStart={onStart}
        onStop={onStop}
      >
        <FloatButton
          style={{ right: 0 }}
          ref={draggleRef}
          shape="square"
          type="primary"
          icon={<SettingOutlined />}
          onClick={onSetTheme}
        />
      </Draggable>

      <ThemeForm
        open={isSetTheme}
        onCancel={onSetTheme}
      />

      <Sider theme="light">
        <LeftNav />
      </Sider>
      <Layout style={{ margin: "0 30px" }}>
        <MyHeader />
        <Content style={{ margin: "30px 0", background: token.colorBorderBg, borderRadius: token.borderRadius }}>
          <Routes>
            <Route
              path="home"
              element={<Home />}
            />
            <Route
              path="role"
              element={<RolePage />}
            />
            <Route
              path="menu"
              element={<MenuPage />}
            />
            <Route
              path="adminUser"
              element={<AdminUserPage />}
            />
            <Route
              path="user"
              element={<UserPage />}
            />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  );
};

export default Admin;
