import { Flex, Button, Space, Avatar, theme, Dropdown, Tooltip } from "antd";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { icons } from "../../assets/icons/antdIcons";
import { Header } from "antd/es/layout/layout";
import { setLogout } from "../../store/reducer/authSlice";
import useLocale from "../../hooks/useLocale";

const MyHeader = () => {
  const dispatch = useDispatch();
  const { useToken } = theme;
  const { token } = useToken();
  const { getLarge } = useLocale();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const { currentRoute } = useSelector((state) => state.currentRouteSlice);

  //全屏显示document
  const toggleFullScreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
      setIsFullscreen(false);
    } else {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
      } else if (document.documentElement.webkitRequestFullscreen) {
        document.documentElement.webkitRequestFullscreen();
      } else if (document.documentElement.msRequestFullscreen) {
        document.documentElement.msRequestFullscreen();
      }
      setIsFullscreen(true);
    }
  };

  //我的设置
  const userItems = [
    {
      key: "1",
      label: (
        <Space
          onClick={() => {
            console.log("简体中文切换成功");
          }}
        >
          {icons["icon-user"]}
          <span> 个人中心</span>
        </Space>
      ),
    },
    {
      key: "2",
      label: (
        <Space
          onClick={() => {
            console.log("简体中文切换成功");
          }}
        >
          {icons["icon-edit"]}
          <span> 修改密码</span>
        </Space>
      ),
    },
    {
      key: "3",
      label: (
        <Space
          onClick={() => {
            dispatch(setLogout());
          }}
        >
          {icons["icon-logout"]}
          <span>退出登录</span>
        </Space>
      ),
    },
  ];

  //多语言设置
  const globalItems = [
    {
      key: "1",
      label: (
        <Space
          onClick={(e) => {
            getLarge(e.target.id);
          }}
        >
          <span id="zh-cn">CN</span>
          <span id="zh-cn">简体中文</span>
        </Space>
      ),
    },
    {
      key: "2",
      label: (
        <Space
          onClick={(e) => {
            getLarge(e.target.id);
          }}
        >
          <span id="zh-hk">HK</span>
          <span id="zh-hk">繁体中文</span>
        </Space>
      ),
    },
    {
      key: "3",
      label: (
        <Space
          onClick={(e) => {
            getLarge(e.target.id);
          }}
        >
          <span id="en">US</span>
          <span id="en">English</span>
        </Space>
      ),
    },
  ];

  return (
    <Header
      style={{
        background: token.colorBorderBg,
        borderBottomLeftRadius: token.borderRadius,
        borderBottomRightRadius: token.borderRadius,
      }}
    >
      <Flex justify="space-between" align="center">
        <Space>
          {icons["icon-folderOpen"]}
          {currentRoute.pater && (
            <>
              <span>{currentRoute.pater}</span>
              <span style={{ fontWeight: "bold" }}>/</span>
            </>
          )}
          <span style={{ fontWeight: "bold" }}>{currentRoute.name}</span>
        </Space>
        <Flex align="center" justify="center" gap={10}>
          <Tooltip title={isFullscreen ? "退出全屏" : "全屏"}>
            <Button
              type="text"
              shape="circle"
              onClick={toggleFullScreen}
              icon={isFullscreen ? icons["icon-fullscreenExit"] : icons["icon-fullscreen"]}
            />
          </Tooltip>

          <Button type="link" shape="circle" target="_blank" href="https://space.bilibili.com/381958472" icon={icons["icon-bilibili"]} />
          <Button type="link" shape="circle" target="_blank" href="https://github.com/StarsBIM/UMSAdmin" icon={icons["icon-github"]} />

          <Dropdown
            menu={{
              items: globalItems,
            }}
            placement="bottom"
          >
            <Button type="text" shape="circle" icon={icons["icon-global"]} />
          </Dropdown>
          <Dropdown
            menu={{
              items: userItems,
            }}
            placement="bottom"
          >
            <Avatar icon={icons["icon-user"]} />
          </Dropdown>
        </Flex>
      </Flex>
    </Header>
  );
};

export default MyHeader;
