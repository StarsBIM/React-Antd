import { Button, Divider, Flex, Form, Input, InputNumber, Modal, Radio, Select, Space, Switch, TreeSelect } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAddMenuMutation, useGetMenuByIdQuery, useGetMenusQuery, useUpdateMenuMutation } from "../../../../store/api/menuApi";
import { setOperateItem, setOperateType } from "../../../../store/reducer/operateSlice";
import { icons } from "../../../../assets/icons/antdIcons";
import useLocale from "../../../../hooks/useLocale";
const options = [
  { label: "icon-home", value: "icon-home", icon: icons["icon-home"], key: "icon-home" },
  {
    label: "icon-setting",
    value: "icon-setting",
    icon: icons["icon-setting"],
    key: "icon-setting",
  },
  {
    label: "icon-company",
    value: "icon-company",
    icon: icons["icon-company"],
    key: "icon-company",
  },
  {
    label: "icon-admin-user",
    value: "icon-admin-user",
    icon: icons["icon-admin-user"],
    key: "icon-admin-user",
  },
  { label: "icon-user", value: "icon-user", icon: icons["icon-user"], key: "icon-user" },
  { label: "icon-lock", value: "icon-lock", icon: icons["icon-lock"], key: "icon-lock" },
  { label: "icon-role", value: "icon-role", icon: icons["icon-role"], key: "icon-role" },
  { label: "icon-menu", value: "icon-menu", icon: icons["icon-menu"], key: "icon-menu" },
  { label: "icon-stat", value: "icon-stat", icon: icons["icon-stat"], key: "icon-stat" },
  { label: "icon-3d", value: "icon-3d", icon: icons["icon-3d"], key: "icon-3d" },
  { label: "icon-family", value: "icon-family", icon: icons["icon-family"], key: "icon-family" },
  { label: "icon-member", value: "icon-member", icon: icons["icon-member"], key: "icon-member" },
  { label: "icon-common", value: "icon-common", icon: icons["icon-common"], key: "icon-common" },
  {
    label: "icon-enterprise",
    value: "icon-enterprise",
    icon: icons["icon-enterprise"],
    key: "icon-enterprise",
  },
  { label: "icon-add", value: "icon-add", icon: icons["icon-add"], key: "icon-add" },
  { label: "icon-edit", value: "icon-edit", icon: icons["icon-edit"], key: "icon-edit" },
  { label: "icon-delete", value: "icon-delete", icon: icons["icon-delete"], key: "icon-delete" },
  { label: "icon-import", value: "icon-import", icon: icons["icon-import"], key: "icon-import" },
  { label: "icon-export", value: "icon-export", icon: icons["icon-export"], key: "icon-export" },
  {
    label: "icon-refresh",
    value: "icon-refresh",
    icon: icons["icon-refresh"],
    key: "icon-refresh",
  },
];

const MenuForm = () => {
  const dispatch = useDispatch();
  const { myLocale } = useLocale();
  const [form] = Form.useForm();
  const [treeData, setTreeData] = useState([]);
  const [treeSelectValues, setTreeSelectValues] = useState([]);

  const { operateItem, operateType } = useSelector((state) => state.operateSlice);

  const [addMenu, { isSuccess: isAddMenuSuccess }] = useAddMenuMutation();
  const [updateMenu, { isSuccess: isEditMenuSuccess }] = useUpdateMenuMutation();
  const { data: menus, isSuccess: isGetMenusSuccess } = useGetMenusQuery();
  const { data: menuData, isSuccess: isGetByIdSuccess } = useGetMenuByIdQuery(operateItem !== null ? operateItem.id : "", {
    skip: operateType !== "update",
    refetchOnMountOrArgChange: true,
  });
  // 处理数据
  useEffect(() => {
    if (isGetMenusSuccess && menus !== null) {
      const newTreeData = menus.map((item) => {
        if (item.children === null) {
          return {
            value: item.id,
            title: item.name,
          };
        } else if (item.children.length !== 0) {
          return {
            value: item.id,
            title: item.name,
            children: getChildren(item.children),
          };
        }
      });
      setTreeData(newTreeData);
    }
  }, [menus]);

  // 获得子项
  const getChildren = (item) => {
    const newChildren = item.map((child) => {
      if (child.children === null) {
        return {
          value: child.id,
          title: child.name,
        };
      } else if (child.children.length !== 0) {
        return {
          value: child.id,
          title: child.name,
          children: getChildren(child.children),
        };
      }
    });
    return newChildren;
  };

  // 设置默认值
  useEffect(() => {
    if (isGetByIdSuccess && operateType === "update") {
      form.setFieldsValue(menuData);
    }
  }, [menuData]);

  // 取消事件
  const cancelHandler = () => {
    dispatch(setOperateType());
  };

  // 选择树选择改变事件
  const onChange = (values) => {
    setTreeSelectValues(values);
  };

  // 提交表单事件
  const onFinish = (values) => {
    if (operateType === "update") {
      updateMenu({ ...values, id: operateItem.id });
    } else {
      addMenu({ ...values });
    }
    dispatch(setOperateType());
  };
  return (
    <Modal
      open={true}
      title={operateType === "update" ? myLocale.update : myLocale.add}
      destroyOnClose
      footer={null}
      maskClosable={false}
      keyboard={false}
      width={700}
      onCancel={cancelHandler}
    >
      <Divider />
      <Form
        form={form}
        onFinish={onFinish}
        labelCol={{
          span: 5,
        }}
        wrapperCol={{
          span: 18,
        }}
      >
        <Form.Item label={myLocale.name} name="name" rules={[{ required: true, message: myLocale.nameRulesMessage }]}>
          <Input placeholder={myLocale.namePlaceholder} />
        </Form.Item>
        <Form.Item label={myLocale.url} name="url">
          <Input placeholder={myLocale.urlPlaceholder} />
        </Form.Item>
        <Form.Item label={myLocale.paterName} name="paterId">
          <TreeSelect
            showSearch
            allowClear
            placeholder={myLocale.paterPlaceholder}
            treeDefaultExpandAll
            showCheckedStrategy={TreeSelect}
            treeData={treeData}
            value={treeSelectValues}
            onChange={onChange}
          />
        </Form.Item>
        <Form.Item label={myLocale.icon} name="icon" rules={[{ required: true, message: myLocale.iconRulesMessage }]}>
          <Select
            showSearch
            allowClear
            placeholder={myLocale.iconPlaceholder}
            options={options}
            optionRender={(option) => (
              <Space>
                <div>{option.data.icon}</div>
                <span>{option.data.label}</span>
              </Space>
            )}
          />
        </Form.Item>
        <Form.Item label={myLocale.type} name="type" rules={[{ required: true, message: myLocale.typeRulesMessage }]}>
          <Radio.Group>
            <Radio value={0}>{myLocale.dir}</Radio>
            <Radio value={1}>{myLocale.menu}</Radio>
            <Radio value={2}>{myLocale.button}</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item label={myLocale.description} name="description">
          <Input.TextArea placeholder={myLocale.descriptionPlaceholder} />
        </Form.Item>
        <Form.Item label={myLocale.sort} name="sort" rules={[{ required: true, message: myLocale.sortRulesMessage }]}>
          <InputNumber style={{ width: "100%" }} placeholder={myLocale.sortPlaceholder} />
        </Form.Item>
        <Form.Item name="isEnabled" label={myLocale.isEnabled} valuePropName="checked">
          <Switch />
        </Form.Item>
        <Flex justify={"flex-end"} align={"center"}>
          <Form.Item>
            <Space size="small">
              <Button onClick={cancelHandler}>{myLocale.cancel}</Button>
              <Button type="primary" htmlType="submit">
                {myLocale.ok}
              </Button>
            </Space>
          </Form.Item>
        </Flex>
      </Form>
    </Modal>
  );
};

export default MenuForm;
