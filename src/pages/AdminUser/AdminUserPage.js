import React from "react";
import OperateArea from "../../components/Content/OperateArea/OperateArea";
import { Layout } from "antd";
import AdminUserTable from "../../components/Content/AdminUser/AdminUserTable";

const AdminUserPage = () => {
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
      <AdminUserTable />
    </Layout>
  );
};

export default AdminUserPage;
