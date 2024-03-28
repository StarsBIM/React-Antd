import { Layout, Menu } from "antd";
import React, { useEffect, useState } from "react";
import Logo from "../UI/Logo/Logo";
import { useGetNavMenuByRoleIdsQuery } from "../../store/api/menuApi";
import { useNavigate } from "react-router-dom";
import { icons } from "../../assets/icons/antdIcons";
import { setCurrentRoute } from "../../store/reducer/currentRouteSlice";
import { useDispatch } from "react-redux";

const LeftNav = () => {
  const dispatch = useDispatch();
  const [menuArr, setMenuArr] = useState([]);
  const [roleIdArr, setRoleIdArr] = useState([]);
  const { data, isSuccess } = useGetNavMenuByRoleIdsQuery(roleIdArr.length === 0 ? "" : roleIdArr, {
    skip: roleIdArr.length === 0,
    refetchOnMountOrArgChange: false,
  });

  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (currentUser && currentUser.roles.length !== 0) {
      const roleIds = currentUser.roles.map((item) => item.id);
      setRoleIdArr(roleIds);
    }
  }, [localStorage]);

  useEffect(() => {
    if (isSuccess && data !== null) {
      const newArr = data.map((item) => {
        if (item.children === null) {
          return {
            key: item.id,
            label: item.name,
            name: item.name,
            pater: item.paterName,
            url: item.url,
            icon: icons[item.icon],
          };
        } else if (item.children.length !== 0) {
          const newChildren = item.children.map((child) => {
            return {
              key: child.id,
              label: child.name,
              name: child.name,
              pater: child.paterName,
              url: child.url,
              icon: icons[child.icon],
            };
          });
          return {
            key: item.id,
            label: item.name,
            name: item.name,
            pater: item.paterName,
            url: item.url,
            icon: icons[item.icon],
            children: newChildren,
          };
        }
      });
      setMenuArr(newArr);
    }
  }, [data]);

  const onClick = (e) => {
    dispatch(
      setCurrentRoute({
        name: e.item.props.name,
        pater: e.item.props.pater,
        url: e.item.props.url,
      })
    );
    navigate(`${e.item.props.url}`, { replace: false });
  };

  return (
    <Layout>
      <Logo />
      <Menu
        items={menuArr}
        mode="inline"
        onSelect={onClick}
      />
    </Layout>
  );
};

export default LeftNav;
