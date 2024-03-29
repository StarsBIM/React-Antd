import { Button, Modal, Space, Switch, Table, Tooltip, message } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useDeleteAdminUserMutation, useGetAdminUsersQuery, useEnabledAdminUserMutation } from "../../../store/api/adminUserApi";
import { setOperateItem, setOperateType } from "../../../store/reducer/operateSlice";
import { icons } from "../../../assets/icons/icons";
import { ExclamationCircleFilled } from "@ant-design/icons";
import AdminUserForm from "./AdminUserForm/AdminUserForm";
import useMessage from "../../../hooks/useMessage";
import useLocale from "../../../hooks/useLocale";

const AdminUserTable = () => {
  const dispatch = useDispatch();
  const { myLocale } = useLocale();
  const [modal, confiirmHolder] = Modal.useModal();
  const { success, error, warning, messageHolder } = useMessage();

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
        title: myLocale.index,
        dataIndex: "index",
        key: "index",
        width: "5%",
      },
      {
        title: myLocale.nickName,
        dataIndex: "nickName",
        key: "nickName",
      },
      {
        title: myLocale.name,
        dataIndex: "name",
        key: "name",
      },
      {
        title: myLocale.email,
        dataIndex: "email",
        key: "email",
      },
      {
        title: myLocale.phoneNumber,
        dataIndex: "phoneNumber",
        key: "phoneNumber",
      },
      {
        title: myLocale.gender,
        dataIndex: "gender",
        key: "gender",
      },
      {
        title: myLocale.age,
        dataIndex: "age",
        key: "age",
      },
      {
        title: myLocale.address,
        dataIndex: "address",
        key: "address",
      },
      {
        title: myLocale.description,
        dataIndex: "description",
        key: "description",
      },
      {
        title: myLocale.loginDateTime,
        dataIndex: "lastLoginDateTime",
        key: "lastLoginrDateTime",
      },
      {
        title: myLocale.createDataTime,
        dataIndex: "createDataTime",
        key: "createDataTime",
      },
      {
        title: myLocale.updateDateTime,
        dataIndex: "lastUpdateDateTime",
        key: "lastUpdateDateTime",
      },
      {
        title: myLocale.isEnabled,
        dataIndex: "isEnabled",
        key: "isEnabled",
        render: (_, record) => (
          <Switch
            checkedChildren={myLocale.enabled}
            unCheckedChildren={myLocale.close}
            checked={record.isEnabled ? "checked" : ""}
            onChange={() => {
              enabledHandler(record);
            }}
          />
        ),
      },
      {
        title: myLocale.action,
        dataIndex: "action",
        key: "action",
        width: 120,
        render: (_, record) => (
          <Space size="large">
            <Tooltip title={myLocale.delete}>
              <Button onClick={() => deleteHandler(record)} icon={icons["icon-delete"]} type="primary" danger shape="circle" />
            </Tooltip>
            <Tooltip title={myLocale.update}>
              <Button onClick={() => updateHandler(record)} icon={icons["icon-edit"]} type="primary" shape="circle" />
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
  }, [data, myLocale]);

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
      title: myLocale.tip,
      icon: <ExclamationCircleFilled />,
      content: myLocale.deleteContent,
      okText: myLocale.ok,
      okType: "danger",
      cancelText: myLocale.cancel,
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
