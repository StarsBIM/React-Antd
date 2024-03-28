import React, { useEffect, useState } from "react";
import { useDeleteMenuMutation, useEnabledMenuMutation, useGetAllMenusQuery } from "../../../store/api/menuApi";
import { useDispatch, useSelector } from "react-redux";
import { setOperateItem, setOperateType } from "../../../store/reducer/operateSlice";
import { Button, Space, Switch, Table, Modal, Tag, Tooltip } from "antd";
import { ExclamationCircleFilled } from "@ant-design/icons";
import MenuForm from "./MenuForm/MenuForm";
import { icons } from "../../../assets/icons/antdIcons";

const MenuTable = () => {
  const [modal, confiirmHolder] = Modal.useModal();
  const dispatch = useDispatch();
  const { operateItem, operateType } = useSelector((state) => state.operateSlice);
  const [dataSource, setDataSource] = useState([]);
  const [columns, setColumns] = useState([]);

  const { data, isSuccess: isGetSuccess, refetch } = useGetAllMenusQuery();
  const [deleteMenu, { isSuccess: isDeleteSuccess }] = useDeleteMenuMutation();
  const [enabledMenu, { isSuccess: isEnableSuccess }] = useEnabledMenuMutation();

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
        width: "6%",
      },
      {
        title: "姓名",
        dataIndex: "name",
        key: "name",
      },
      {
        title: "URL",
        dataIndex: "url",
        key: "url",
      },
      {
        title: "父节点",
        dataIndex: "paterName",
        key: "paterName",
      },
      {
        title: "图标",
        dataIndex: "icon",
        key: "icon",
        render: (item, record) => icons[item],
      },
      {
        title: "类型",
        dataIndex: "type",
        key: "type",
        render: (item, record) => {
          switch (item) {
            case "目录":
              return <Tag color="green">{item}</Tag>;
            case "菜单":
              return <Tag color="orange">{item}</Tag>;
            case "按钮":
              return <Tag color="red">{item}</Tag>;
          }
        },
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
        title: "排序",
        dataIndex: "sort",
        key: "sort",
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
        if (item.children === null) {
          return {
            ...item,
            key: item.id,
            index: index + 1,
            type: typeConvert(item.type),
          };
        } else if (item.children.length !== 0) {
          return {
            ...item,
            key: item.id,
            index: index + 1,
            type: typeConvert(item.type),
            children: getChildren(item.children),
          };
        }
      });
      setDataSource(newDataSource);
    }
  }, [data]);

  // 获得子项
  const getChildren = (item) => {
    return item.map((child, index) => {
      if (child.children === null) {
        return {
          ...child,
          key: child.id,
          index: index + 1,
          type: typeConvert(child.type),
        };
      } else if (item.children.length !== 0) {
        return {
          ...child,
          key: child.id,
          index: index + 1,
          type: typeConvert(child.type),
          children: getChildren(child),
        };
      }
    });
  };

  //转换菜单类型
  function typeConvert(type) {
    switch (type) {
      case 0:
        return "目录";
      case 1:
        return "菜单";
      case 2:
        return "按钮";
    }
  }

  //启用
  const enabledHandler = (e) => {
    enabledMenu({ id: e.id, isEnabled: !e.isEnabled });
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
        deleteMenu(e.id);
      },
      onCancel() {
        // console.log("Cancel");
      },
    });
  };

  //选择
  const selectedHandler = (selectedRowKeys, selectedRows) => {
    console.log(selectedRowKeys, selectedRows);
  };

  return (
    <React.Fragment>
      {confiirmHolder}
      {(operateType === "add" || operateType === "update") && <MenuForm />}
      {isGetSuccess && (
        <Table
          scroll={{ y: 580 }}
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
        />
      )}
    </React.Fragment>
  );
};

export default MenuTable;
