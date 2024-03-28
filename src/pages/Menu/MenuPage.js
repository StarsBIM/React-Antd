import React from "react";
import MenuTable from "../../components/Content/Menu/MenuTable";
import OperateArea from "../../components/Content/OperateArea/OperateArea";
import { Flex, Layout } from "antd";

const MenuPage = () => {
  return (
    <Flex
      vertical
      style={{
        padding: "10px",
        background: "none",
      }}
    >
      <OperateArea />
      <MenuTable />
    </Flex>
  );
};

export default MenuPage;
