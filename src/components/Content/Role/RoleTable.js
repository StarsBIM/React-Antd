import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGetRolesQuery, useDeleteRoleMutation, useEnabledRoleMutation } from "../../../store/api/roleApi";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { setOperateItem, setOperateType } from "../../../store/reducer/operateSlice";
import RoleForm from "./RoleForm/RoleForm";
import { Button, Table, Space, Switch, Modal, Tag, Tooltip } from "antd";
import { icons } from "../../../assets/icons/icons";
import useLocale from "../../../hooks/useLocale";

const RoleTable = () => {
  const { myLocale } = useLocale();

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
        title: myLocale.index,
        dataIndex: "index",
        key: "index",
        width: "5%",
      },
      {
        title: myLocale.name,
        dataIndex: "name",
        key: "name",
      },
      {
        title: myLocale.identifying,
        dataIndex: "identifying",
        key: "identifying",
        render: (item, record) => <Tag color="green">{item}</Tag>,
      },
      {
        title: myLocale.description,
        dataIndex: "description",
        key: "description",
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
        };
      });
      setDataSource(newDataSource);
    }
  }, [data, myLocale]);

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
      title: myLocale.tip,
      icon: <ExclamationCircleFilled />,
      content: myLocale.deleteContent,
      okText: myLocale.ok,
      okType: "danger",
      cancelText: myLocale.cancel,
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
