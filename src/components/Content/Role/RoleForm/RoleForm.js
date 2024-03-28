import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setOperateItem, setOperateType } from "../../../../store/reducer/operateSlice";
import { useGetAllMenusQuery } from "../../../../store/api/menuApi";
import { Button, Space, Switch, Modal, Form, Input, Flex, TreeSelect, Divider } from "antd";
import { useAddRoleMutation, useGetRoleByIdQuery, useUpdateRoleMutation } from "../../../../store/api/roleApi";

const RoleForm = () => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [treeData, setTreeData] = useState([]);
  const [treeSelectValues, setTreeSelectValues] = useState([]);

  const { operateItem, operateType } = useSelector((state) => state.operateSlice);

  const [addRole, { isSuccess: isAddSuccess }] = useAddRoleMutation();
  const [updateRole, { isSuccess: isUpdateSuccess }] = useUpdateRoleMutation();
  const { data: menuArr, isSuccess: isGetAllSuccess } = useGetAllMenusQuery();
  const { data: roleData, isSuccess: isGetByIdSuccess } = useGetRoleByIdQuery(
    operateItem !== null ? operateItem.id : null,
    {
      skip: operateType !== "update",
      refetchOnMountOrArgChange: true,
    }
  );

  // 处理数据
  useEffect(() => {
    if (isGetAllSuccess && menuArr !== null) {
      const newTreeData = menuArr.map((item) => {
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
  }, [menuArr]);

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
      const newRoleData = { ...roleData, treeData: roleData.menuIds };
      form.setFieldsValue(newRoleData);
    }
  }, [roleData]);

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
      updateRole({ ...values, id: updateItem.id });
    } else {
      addRole({ ...values });
    }
    dispatch(setOperateType());
  };

  return (
    <Modal
      open={true}
      title={operateType === "update" ? "修改" : "添加"}
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
        <Form.Item
          label="名称"
          name="name"
          rules={[{ required: true, message: "名称不能为空！" }]}
        >
          <Input placeholder="请输入名称" />
        </Form.Item>
        <Form.Item
          label="权限标识"
          name="identifying"
          rules={[{ required: true, message: "权限标识不能为空！" }]}
        >
          <Input placeholder="请输入权限标识" />
        </Form.Item>
        <Form.Item
          label="描述"
          name="description"
        >
          <Input.TextArea placeholder="请输入描述" />
        </Form.Item>
        <Form.Item
          label="权限"
          name="menuIds"
        >
          <TreeSelect
            showSearch
            multiple
            allowClear
            treeDefaultExpandAll={true}
            showCheckedStrategy={TreeSelect}
            treeData={treeData}
            value={treeSelectValues}
            onChange={onChange}
            treeCheckable={true}
            placeholder="请勾选需要的权限"
          />
        </Form.Item>
        <Form.Item
          name="isEnabled"
          label="是否启用"
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>

        <Flex
          justify={"flex-end"}
          align={"center"}
        >
          <Form.Item>
            <Space size="small">
              <Button onClick={cancelHandler}>取消</Button>
              <Button
                type="primary"
                htmlType="submit"
              >
                确认
              </Button>
            </Space>
          </Form.Item>
        </Flex>
      </Form>
    </Modal>
  );
};

export default RoleForm;
