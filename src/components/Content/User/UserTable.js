import { Button, Modal, Space, Switch, Table, Tooltip } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useDeleteUserMutation, useGetUsersQuery, useEnabledUserMutation } from "../../../store/api/userApi";
import { setOperateItem, setOperateType } from "../../../store/reducer/operateSlice";
import { icons } from "../../../assets/icons/icons";

const UserTable = () => {
  const [modal, confiirmHolder] = Modal.useModal();
  const dispatch = useDispatch();
  const { operateItem, operateType } = useSelector((state) => state.operateSlice);
  const [dataSource, setDataSource] = useState([]);
  const [columns, setColumns] = useState([]);

  const { data, isSuccess: isGetSuccess, refetch } = useGetUsersQuery();
  const [deleteUser, { isSuccess: isDeleteSuccess }] = useDeleteUserMutation();
  const [enabledUser, { isSuccess: isEnableSuccess }] = useEnabledUserMutation();

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
        width: 70,
      },
      {
        title: "姓名",
        dataIndex: "name",
        key: "name",
        width: 100,
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
        width: 120,
      },
      {
        title: "城市",
        dataIndex: "city",
        key: "city",
      },
      {
        title: "描述",
        dataIndex: "description",
        key: "description",
      },
      {
        title: "登录错误次数",
        dataIndex: "loginErrorTimes",
        key: "loginErrorTimes",
        width: 100,
      },
      {
        title: "最后登录错误时间",
        dataIndex: "lastLoginErrorDateTime",
        key: "lastLoginErrorDateTime",
      },
      {
        title: "创建时间",
        dataIndex: "createDataTime",
        key: "createDataTime",
        width: "200px",
      },
      {
        title: "是否启用",
        dataIndex: "isEnabled",
        key: "isEnabled",
        width: 100,
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
        width: 200,
        render: (_, record) => (
          <Space size="large">
            <Tooltip title="删除">
              <Button onClick={() => deleteHandler(record)} icon={icons["icon-delete"]} type="primary" danger shape="circle" />
            </Tooltip>
            <Tooltip title="编辑">
              <Button onClick={() => updateHandler(record)} icon={icons["icon-edit"]} type="primary" shape="circle" />
            </Tooltip>
          </Space>
        ),
      },
    ];
    setColumns(columns);
    if (isGetSuccess && data !== null) {
      const newDataSource = [];
      data.forEach((item, index) => {
        newDataSource.push({
          key: item.id,
          index: index + 1,
          ...item,
          city: `${item.city[0]}/${item.city[1]}/${item.city[2]}`,
          createDataTime: item.createDataTime,
        });
      });
      setDataSource(newDataSource);
    }
  }, [data]);

  //启用
  const enabledHandler = (e) => {
    enabledUser({ id: e.id, isEnabled: !e.isEnabled });
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
      content: `确认要删除【${e.name}】这个菜单吗?`,
      okText: "确认",
      okType: "danger",
      cancelText: "取消",
      onOk() {
        deleteUser(e.id);
      },
      onCancel() {
        // console.log("Cancel");
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
      {/* {(operateType === "add" || operateType === "update")  && <UserForm />} */}
      {isGetSuccess && dataSource.length !== 0 ? (
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
      ) : null}
    </React.Fragment>
  );
};

export default UserTable;
