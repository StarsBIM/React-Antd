import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGetRolesQuery, useDeleteRoleMutation, useEnabledRoleMutation } from "../../../store/api/roleApi";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { setOperateItem, setOperateType } from "../../../store/reducer/operateSlice";
import RoleForm from "./RoleForm/RoleForm";
import { Button, Table, Space, Switch, Modal, Tag, Tooltip } from "antd";
import { icons } from "../../../assets/icons/icons";

const RoleTable = () => {
  const [modal, confiirmHolder] = Modal.useModal();
  const dispatch = useDispatch();
  const { operateItem, operateType } = useSelector((state) => state.operateSlice);
  const [dataSource, setDataSource] = useState([]);
  const [columns, setColumns] = useState([]);

  const { data, isSuccess: isGetSuccess, refetch } = useGetRolesQuery();
  const [deleteRole, { isSuccess: isDeleteSuccess }] = useDeleteRoleMutation();
  const [enabledRole, { isSuccess: isEnableSuccess }] = useEnabledRoleMutation();

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
        title: "名称",
        dataIndex: "name",
        key: "name",
      },
      {
        title: "权限标识",
        dataIndex: "identifying",
        key: "identifying",
        render: (item, record) => <Tag color="green">{item}</Tag>,
      },
      {
        title: "描述",
        dataIndex: "description",
        key: "description",
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
        };
      });
      setDataSource(newDataSource);
    }
  }, [data]);

  //启用
  const enabledHandler = (e) => {
    enabledRole({ id: e.id, isEnabled: !e.isEnabled });
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
      content: `确认要删除【${e.name}】这个角色吗?`,
      okText: "确认",
      okType: "danger",
      cancelText: "取消",
      onOk() {
        deleteRole(e.id);
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
      {(operateType === "add" || operateType === "update") && <RoleForm />}
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
          scroll={{ y: 590 }}
        />
      )}
    </React.Fragment>
  );
};

export default RoleTable;
