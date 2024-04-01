import { Button, Cascader, Divider, Flex, Form, Input, InputNumber, Modal, Radio, Select, Space, Switch } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAddAdminUserMutation, useGetAdminUserByIdQuery, useUpdateAdminUserMutation } from "../../../../store/api/adminUserApi";
import { useGetRolesQuery } from "../../../../store/api/roleApi";
import { useGetAddressQuery } from "../../../../store/api/rollToolsApi";
import { setOperateItem, setOperateType } from "../../../../store/reducer/operateSlice";
import useLocale from "../../../../hooks/useLocale";

const AdminUserForm = () => {
  const dispatch = useDispatch();
  const { myLocale } = useLocale();
  const [form] = Form.useForm();
  const [roleOptions, setRoleOptions] = useState([]);
  const [addressOptions, setAddressOptions] = useState([]);

  const { operateItem, operateType } = useSelector((state) => state.operateSlice);

  const [addAdminUser, { isSuccess: isAddSuccess }] = useAddAdminUserMutation();
  const [updateAdminUser, { isSuccess: isUpdateSuccess }] = useUpdateAdminUserMutation();
  const { data: address, isSuccess: isGetAddressSuccess } = useGetAddressQuery();
  const { data: role, isSuccess: isGetRoleSuccess } = useGetRolesQuery();
  const { data: userData, isSuccess: isGetByIdSuccess } = useGetAdminUserByIdQuery(operateItem !== null ? operateItem.id : "", {
    skip: operateType !== "update",
    refetchOnMountOrArgChange: true,
  });
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
      title={operateItem === "update" ? myLocale.update : myLocale.add}
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
        <Form.Item label={myLocale.nickName} name="nickName" rules={[{ required: true, message: myLocale.nickNameRulesMessage }]}>
          <Input placeholder={myLocale.nickNamePlaceholder} />
        </Form.Item>
        <Form.Item label={myLocale.name} name="name" rules={[{ required: true, message: myLocale.nameRulesMessage }]}>
          <Input placeholder={myLocale.namePlaceholder} />
        </Form.Item>
        <Form.Item label={myLocale.gender} name="gender">
          <Radio.Group>
            <Radio value={0}>{myLocale.man}</Radio>
            <Radio value={1}>{myLocale.woMan}</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item label={myLocale.age} name="age">
          <InputNumber placeholder={myLocale.agePlaceholder} style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item label={myLocale.address} name="address">
          <Cascader options={addressOptions} placeholder={myLocale.addressPlaceholder} />
        </Form.Item>
        <Form.Item
          label={myLocale.email}
          name="email"
          rules={[
            { type: "email", message: myLocale.emailErrorMessage },
            { required: true, message: myLocale.emailRulesMessage },
          ]}
        >
          <Input placeholder={myLocale.emailPlaceholder} />
        </Form.Item>
        <Form.Item
          label={myLocale.phoneNumber}
          name="phoneNumber"
          rules={[
            { min: 11, max: 11, message: myLocale.phoneNumberErrorMessage },
            { required: true, message: myLocale.phoneNumberRulesMessage },
          ]}
        >
          <Input placeholder={myLocale.phoneNumberPlaceholder} />
        </Form.Item>
        <Form.Item
          label={myLocale.password}
          name="password"
          rules={[
            { min: 6, max: 12, message: myLocale.passwordErrorMessage },
            { required: operateType === "add", message: myLocale.passwordRulesMessage },
          ]}
        >
          <Input.Password placeholder={operateType === "update" ? myLocale.updatePasswordPlaceholder : myLocale.addPasswordPlaceholder} />
        </Form.Item>
        <Form.Item
          label={myLocale.confirmPassword}
          name="confirmPassword"
          dependencies={["password"]}
          hasFeedback
          rules={[
            { required: operateType === "add", message: myLocale.confirmPasswordRulesMessage },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error(myLocale.confirmPasswordErrorMessage));
              },
            }),
          ]}
        >
          <Input.Password
            placeholder={operateType === "update" ? myLocale.updateConfirmPasswordPlaceholder : myLocale.addConfirmPasswordPlaceholder}
          />
        </Form.Item>
        <Form.Item label={myLocale.role} name="roleIds" rules={[{ required: true, message: myLocale.roleRulesMessage }]}>
          <Select mode="multiple" showSearch allowClear placeholder={myLocale.rolePlaceholder} options={roleOptions} />
        </Form.Item>
        <Form.Item label={myLocale.description} name="description">
          <Input.TextArea placeholder={myLocale.descriptionPlaceholder} />
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

export default AdminUserForm;
