import { Button, Modal, Space, Switch, Table, Tooltip, message } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  useDeleteAdminUserMutation,
  useGetAdminUsersQuery,
  useEnabledAdminUserMutation,
} from "../../../store/api/adminUserApi";
import { setOperateItem, setOperateType } from "../../../store/reducer/operateSlice";
import { icons } from "../../../assets/icons/icons";
import { ExclamationCircleFilled } from "@ant-design/icons";
import AdminUserForm from "./AdminUserForm/AdminUserForm";
import useMessage from "../../../hooks/useMessage";

const AdminUserTable = () => {
  const [modal, confiirmHolder] = Modal.useModal();
  const { success, error, warning, messageHolder } = useMessage();

  const dispatch = useDispatch();

  const { operateItem, operateType } = useSelector((state) => state.operateSlice);
  const [dataSource, setDataSource] = useState([]);
  const [columns, setColumns] = useState([]);

  const { data, isSuccess: isGetSuccess, refetch } = useGetAdminUsersQuery();
  const [deleteAdminUser, { isSuccess: isDeleteSuccess }] = useDeleteAdminUserMutation();
  const [enabledAdminUser, { isSuccess: isEnableSuccess }] = useEnabledAdminUserMutation();

  //刷新数据
  useEffect(() => {
    if (operateType === "refetch") {
      refetch();
      dispatch(setOperateType());
    }
  }, [operateType]);

  //处理数据
  useEffect(() => {
    const columns = [
      {
        title: "序号",
        dataIndex: "index",
        key: "index",
        width: "5%",
      },
      {
        title: "昵称",
        dataIndex: "nickName",
        key: "nickName",
      },
      {
        title: "姓名",
        dataIndex: "name",
        key: "name",
      },
      {
        title: "邮箱",
        dataIndex: "email",
        key: "email",
      },
      {
        title: "电话",
        dataIndex: "phoneNumber",
        key: "phoneNumber",
      },
      {
        title: "性别",
        dataIndex: "gender",
        key: "gender",
      },
      {
        title: "年龄",
        dataIndex: "age",
        key: "age",
      },
      {
        title: "地址",
        dataIndex: "address",
        key: "address",
      },
      {
        title: "描述",
        dataIndex: "description",
        key: "description",
      },
      {
        title: "登录时间",
        dataIndex: "lastLoginDateTime",
        key: "lastLoginrDateTime",
      },
      {
        title: "创建时间",
        dataIndex: "createDataTime",
        key: "createDataTime",
      },
      {
        title: "更新时间",
        dataIndex: "lastUpdateDateTime",
        key: "lastUpdateDateTime",
      },
      {
        title: "是否启用",
        dataIndex: "isEnabled",
        key: "isEnabled",
        render: (_, record) => (
          <Switch
            checkedChildren="启用"
            unCheckedChildren="关闭"
            checked={record.isEnabled ? "checked" : ""}
            onChange={() => {
              enabledHandler(record);
            }}
          />
        ),
      },
      {
        title: "操作",
        dataIndex: "action",
        key: "action",
        width: 120,
        render: (_, record) => (
          <Space size="large">
            <Tooltip title="删除">
              <Button
                onClick={() => deleteHandler(record)}
                icon={icons["icon-delete"]}
                type="primary"
                danger
                shape="circle"
              />
            </Tooltip>
            <Tooltip title="编辑">
              <Button
                onClick={() => updateHandler(record)}
                icon={icons["icon-edit"]}
                type="primary"
                shape="circle"
              />
            </Tooltip>
          </Space>
        ),
      },
    ];
    setColumns(columns);
    if (isGetSuccess && data !== null) {
      const newDataSource = data.map((item, index) => {
        return {
          key: item.id,
          index: index + 1,
          ...item,
          gender: genderConvert(item.gender),
          address: `${item.address[0]}/${item.address[1]}/${item.address[2]}`,
        };
      });
      setDataSource(newDataSource);
    }
  }, [data]);

  //转换菜单类型
  function genderConvert(gender) {
    switch (gender) {
      case 0:
        return "男";
      case 1:
        return "女";
    }
  }

  //启用
  const enabledHandler = (e) => {
    const result = enabledAdminUser({ id: e.id, isEnabled: !e.isEnabled });
    result.then((data) => {
      if (!e.isEnabled && data.data.isSuccess) {
        success(data.data.message);
      } else if (!e.isEnabled && !data.data.isSuccess) {
        error(data.data.message);
      } else if (e.isEnabled && data.data.isSuccess) {
        success(data.data.message);
      } else if (e.isEnabled && !data.data.isSuccess) {
        error(data.data.message);
      }
    });
  };

  //更新
  const updateHandler = (e) => {
    dispatch(setOperateItem(e));
    dispatch(setOperateType("update"));
  };

  //删除
  const deleteHandler = (e) => {
    modal.confirm({
      title: "提示",
      icon: <ExclamationCircleFilled />,
      content: `确认要删除【${e.name}】这个管理员吗?`,
      okText: "确认",
      okType: "danger",
      cancelText: "取消",
      onOk() {
        const result = deleteAdminUser(e.id);
        result.then((data) => {
          if (!e.isEnabled && data.data.isSuccess) {
            success(data.data.message);
          } else if (!e.isEnabled && !data.data.isSuccess) {
            error(data.data.message);
          } else if (e.isEnabled && data.data.isSuccess) {
            success(data.data.message);
          } else if (e.isEnabled && !data.data.isSuccess) {
            error(data.data.message);
          }
        });
      },
      onCancel() {
        warning("已取消");
      },
    });
  };

  //勾选
  const selectedHandler = (selectedRowKeys, selectedRows) => {
    console.log(selectedRowKeys, selectedRows);
  };

  return (
    <React.Fragment>
      {confiirmHolder}
      {messageHolder}
      {(operateType === "add" || operateType === "update") && <AdminUserForm />}
      {isGetSuccess && (
        <Table
          rowSelection={{
            type: "checkbox",
            onChange: (selectedRowKeys, selectedRows) => {
              selectedHandler(selectedRowKeys, selectedRows);
            },
          }}
          bordered={true}
          dataSource={dataSource}
          columns={columns}
          pagination={{ showQuickJumper: true, position: ["bottomCenter"] }}
          scroll={{ y: 580 }}
        />
      )}
    </React.Fragment>
  );
};

export default AdminUserTable;
