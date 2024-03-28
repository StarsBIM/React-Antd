import { Button, Cascader, Divider, Flex, Form, Input, InputNumber, Modal, Radio, Select, Space, Switch } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  useAddAdminUserMutation,
  useGetAdminUserByIdQuery,
  useUpdateAdminUserMutation,
} from "../../../../store/api/adminUserApi";
import { useGetRolesQuery } from "../../../../store/api/roleApi";
import { useGetAddressQuery } from "../../../../store/api/rollToolsApi";
import { setOperateItem, setOperateType } from "../../../../store/reducer/operateSlice";

const AdminUserForm = () => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [roleOptions, setRoleOptions] = useState([]);
  const [addressOptions, setAddressOptions] = useState([]);

  const { operateItem, operateType } = useSelector((state) => state.operateSlice);

  const [addAdminUser, { isSuccess: isAddSuccess }] = useAddAdminUserMutation();
  const [updateAdminUser, { isSuccess: isUpdateSuccess }] = useUpdateAdminUserMutation();
  const { data: address, isSuccess: isGetAddressSuccess } = useGetAddressQuery();
  const { data: role, isSuccess: isGetRoleSuccess } = useGetRolesQuery();
  const { data: userData, isSuccess: isGetByIdSuccess } = useGetAdminUserByIdQuery(
    operateItem !== null ? operateItem.id : "",
    {
      skip: operateType !== "update",
      refetchOnMountOrArgChange: true,
    }
  );
  //处理角色数据
  useEffect(() => {
    if (isGetRoleSuccess && role !== null) {
      const newRoles = [];
      role.forEach((item) => {
        newRoles.push({
          value: item.id,
          label: item.name,
        });
      });
      setRoleOptions(newRoles);
    }
  }, [role]);

  // 处理城市数据
  useEffect(() => {
    if (isGetAddressSuccess && address !== null) {
      const newAddress = [];
      address.forEach((item) => {
        newAddress.push({
          value: item.name,
          label: item.name,
          children: getChildren(item.pchilds),
        });
      });
      setAddressOptions(newAddress);
    }
  }, [address]);

  // 获得城市子项
  const getChildren = (item) => {
    const newChildren = [];
    item.forEach((child) => {
      if (child.cchilds === undefined) {
        newChildren.push({
          value: child.name,
          label: child.name,
        });
      } else {
        newChildren.push({
          value: child.name,
          label: child.name,
          children: getChildren(child.cchilds),
        });
      }
    });

    return newChildren;
  };

  //设置默认值
  useEffect(() => {
    if (isGetByIdSuccess && operateType === "update") {
      form.setFieldsValue(userData);
    }
  }, [userData]);

  // 取消事件
  const cancelHandler = () => {
    dispatch(setOperateType());
  };

  // 提交表单事件
  const onFinish = (values) => {
    if (operateType === "update") {
      updateAdminUser({ ...values, id: operateItem.id });
    } else {
      addAdminUser({ ...values });
    }
    dispatch(setOperateType());
  };

  return (
    <Modal
      open={true}
      title={operateItem === "update" ? "修改" : "添加"}
      destroyOnClose
      centered
      width={700}
      footer={null}
      maskClosable={false}
      keyboard={false}
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
          label="昵称"
          name="nickName"
          rules={[{ required: true, message: "昵称不能为空！" }]}
        >
          <Input placeholder="请输入昵称" />
        </Form.Item>
        <Form.Item
          label="姓名"
          name="name"
          rules={[{ required: true, message: "姓名不能为空！" }]}
        >
          <Input placeholder="请输入姓名" />
        </Form.Item>
        <Form.Item
          label="性别"
          name="gender"
        >
          <Radio.Group>
            <Radio value={0}>男</Radio>
            <Radio value={1}>女</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item
          label="年龄"
          name="age"
        >
          <InputNumber
            placeholder="请输入年龄"
            style={{ width: "100%" }}
          />
        </Form.Item>
        <Form.Item
          label="地址"
          name="address"
        >
          <Cascader
            options={addressOptions}
            placeholder="请选择你的地址"
          />
        </Form.Item>
        <Form.Item
          label="邮箱"
          name="email"
          rules={[
            { type: "email", message: "输入的电子邮件无效！" },
            { required: true, message: "邮箱不能为空！" },
          ]}
        >
          <Input placeholder="请输入邮箱" />
        </Form.Item>
        <Form.Item
          label="电话"
          name="phoneNumber"
          rules={[
            { min: 11, max: 11, message: "输入的电话号码无效！" },
            { required: true, message: "电话不能为空！" },
          ]}
        >
          <Input placeholder="请输入电话" />
        </Form.Item>
        <Form.Item
          label="密码"
          name="password"
          rules={[
            { min: 6, max: 12, message: "输入的密码无效！" },
            { required: operateType === "add", message: "密码不能为空！" },
          ]}
        >
          <Input.Password placeholder={operateType === "update" ? "不修改请留空" : "请输入密码"} />
        </Form.Item>
        <Form.Item
          label="确认密码"
          name="confirmPassword"
          dependencies={["password"]}
          hasFeedback
          rules={[
            { required: operateType === "add", message: "确认密码不能为空！" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error("输入的确认密码不匹配!"));
              },
            }),
          ]}
        >
          <Input.Password placeholder={operateType === "update" ? "不修改请留空" : "请确认密码"} />
        </Form.Item>
        <Form.Item
          label="角色"
          name="roleIds"
          rules={[{ required: true, message: "角色不能为空！" }]}
        >
          <Select
            mode="multiple"
            showSearch
            allowClear
            placeholder="请选择角色"
            options={roleOptions}
          />
        </Form.Item>
        <Form.Item
          label="描述"
          name="description"
        >
          <Input.TextArea placeholder="请输入描述" />
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

export default AdminUserForm;
