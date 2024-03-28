import { Layout } from "antd";
import React from "react";
import RoleTable from "../../components/Content/Role/RoleTable";
import OperateArea from "../../components/Content/OperateArea/OperateArea";

const RolePage = () => {
  return (
    <Layout
      style={{
        padding: "10px",
        display: "Flex",
        flexFlow: "column",
        borderRadius: "10px",
        background: "none",
        overflow: "hidden",
      }}
    >
      <OperateArea />
      <RoleTable />
    </Layout>
  );
};

export default RolePage;
