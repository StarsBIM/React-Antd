import React, { useEffect, useState } from "react";
import { useDeleteMenuMutation, useEnabledMenuMutation, useGetAllMenusQuery } from "../../../store/api/menuApi";
import { useDispatch, useSelector } from "react-redux";
import { setOperateItem, setOperateType } from "../../../store/reducer/operateSlice";
import { Button, Space, Switch, Table, Modal, Tag, Tooltip } from "antd";
import { ExclamationCircleFilled } from "@ant-design/icons";
import MenuForm from "./MenuForm/MenuForm";
import { icons } from "../../../assets/icons/antdIcons";
import useLocale from "../../../hooks/useLocale";

const MenuTable = () => {
  const { myLocale } = useLocale();
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

  //处理columns数据
  useEffect(() => {
    const columns = [
      {
        title: myLocale.index,
        dataIndex: "index",
        key: "index",
      },
      {
        title: myLocale.name,
        dataIndex: "name",
        key: "name",
      },
      {
        title: myLocale.url,
        dataIndex: "url",
        key: "url",
      },
      {
        title: myLocale.paterName,
        dataIndex: "paterName",
        key: "paterName",
      },
      {
        title: myLocale.icon,
        dataIndex: "icon",
        key: "icon",
        render: (item, record) => icons[item],
      },
      {
        title: myLocale.type,
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
        title: myLocale.sort,
        dataIndex: "sort",
        key: "sort",
      },
      {
        title: myLocale.action,
        dataIndex: "action",
        key: "action",
        width: 150,
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
  }, [myLocale]);

  //处理dataSource数据
  useEffect(() => {
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
      title: myLocale.tip,
      icon: <ExclamationCircleFilled />,
      content: myLocale.deleteContent,
      okText: myLocale.ok,
      okType: "danger",
      cancelText: myLocale.cancel,
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
