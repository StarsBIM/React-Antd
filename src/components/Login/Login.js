import { Button, Checkbox, Flex, Form, Input, Layout, Space } from "antd";
import React, { useState } from "react";
import "./Login.scss";
import { icons } from "../../assets/icons/icons";
import { useLocation, useNavigate } from "react-router-dom";
import { useRegisterMutation, useLoginMutation } from "../../store/api/authApi";
import { useDispatch } from "react-redux";
import { setLogin } from "../../store/reducer/authSlice";

const Login = () => {
  const dispatch = useDispatch();
  // 引入注册的api
  const [regFn, { error: regError }] = useRegisterMutation();
  const [loginFn, { error: loginError }] = useLoginMutation();

  const navigate = useNavigate();
  const location = useLocation();

  // 跳转到哪里
  const from = location.state?.prevLocation?.pathname || "/admin/home";

  const onFinish = (values) => {
    // 获取用户输入的内容
    const username = values.nickName;
    const password = values.password;
    // 处理登录功能
    loginFn({
      name: username,
      password,
    }).then((res) => {
      if (!res.error) {
        // 登录成功后，需要向系统中添加一个标识，标记用户的登录状态
        // 登录状态 (布尔值，token(jwt),用户信息)
        dispatch(
          setLogin({
            token: res.data.data.accessToken,
            refreshToken: res.data.data.refreshToken,
            user: res.data.data,
          })
        );
        // 跳转页面到之前的目录
        navigate(from, { replace: true });
      }
    });
  };
  return (
    <Layout className="loginBox">
      <Form
        className="loginForm"
        onFinish={onFinish}
        initialValues={{
          remember: true,
        }}
      >
        <Form.Item name="nickName" rules={[{ required: true, message: "用户名不能为空！" }]}>
          <Input prefix={icons["icon-user"]} placeholder="用户名" />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[
            { min: 6, max: 12, message: "输入的密码无效！" },
            { required: true, message: "密码不能为空！" },
          ]}
        >
          <Input.Password autoComplete="autoComplete" prefix={icons["icon-lock"]} placeholder="请输入密码" />
        </Form.Item>
        <Form.Item>
          <Flex justify="space-between">
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>保持会话</Checkbox>
            </Form.Item>
            <a href="">忘记密码？</a>
          </Flex>
        </Form.Item>
        <Form.Item>
          <Flex vertical="vertical">
            <Button type="primary" htmlType="submit">
              登录
            </Button>
            <a style={{ fontSize: "12px", marginTop: "5px", textAlign: "center" }} href="">
              没有账号，立即注册!
            </a>
          </Flex>
        </Form.Item>
      </Form>
    </Layout>
  );
};

export default Login;
