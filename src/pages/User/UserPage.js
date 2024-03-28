import React from "react";
import UserTable from "../../components/Content/User/UserTable";
import OperateArea from "../../components/Content/OperateArea/OperateArea";
import { Layout } from "antd";

const UserPage = () => {
  return (
    <Layout
      style={{
        padding: "10px",
        display: "Flex",
        flexFlow: "column",
        borderRadius: "10px",
        overflow: "hidden",
        background: "none",
      }}
    >
      <OperateArea />
      <UserTable />
    </Layout>
  );
};

export default UserPage;
