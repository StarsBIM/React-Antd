import { ColorPicker, Form, InputNumber, Drawer, Radio, Space, Slider, Col, Row, Button, Flex } from "antd";
import React, { useEffect } from "react";
import useTheme from "../../hooks/useTheme";

const ThemeForm = (props) => {
  const [form] = Form.useForm();
  const { themeType, compactType, myToken, presets, getThemeData, resetTheme } = useTheme();

  // 设置默认值
  useEffect(() => {
    const newThemeData = {
      ...myToken,
      themeType,
      compactType,
    };
    form.setFieldsValue(newThemeData);
  }, [themeType, compactType, myToken]);

  //修改主题
  const onThemeChange = (value) => getThemeData(value);
  //恢复默认值
  const onResetHandle = () => resetTheme();
  //页脚
  const footer = (
    <Flex
      justify="center"
      align="center"
    >
      <Button onClick={onResetHandle}>恢复默认设置</Button>
    </Flex>
  );

  return (
    <Drawer
      forceRender //强制Modal渲染
      open={props.open}
      title="主题设置"
      destroyOnClose
      maskClosable={true}
      footer={footer}
      keyboard={true}
      onClose={props.onCancel}
    >
      <Form
        form={form}
        onFieldsChange={onThemeChange}
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 21 }}
      >
        <Form.Item
          name="themeType"
          label="主题"
        >
          <Radio.Group>
            <Radio.Button value="default">默认</Radio.Button>
            <Radio.Button value="dark">暗黑</Radio.Button>
          </Radio.Group>
        </Form.Item>

        <Form.Item label="主色">
          <Form.Item name="colorPrimary">
            <InputNumber />
          </Form.Item>
          <Radio.Group>
            <Space>
              <Form.Item name="colorPrimary">
                <Space>
                  <Radio.Button
                    value="#1677FF"
                    style={{ background: "#1677FF", width: 30, height: 30, borderRadius: 15 }}
                  />
                  <Radio.Button
                    value="#5A54F9"
                    style={{ background: "#5A54F9", borderLeft: "none", width: 30, height: 30, borderRadius: 15 }}
                  />
                  <Radio.Button
                    value="#945afd"
                    style={{ background: "#945afd", width: 30, height: 30, borderRadius: 15 }}
                  />
                  <Radio.Button
                    value="#E0282E"
                    style={{ background: "#E0282E", width: 30, height: 30, borderRadius: 15 }}
                  />
                  <Radio.Button
                    value="#ffa500"
                    style={{ background: "#ffa500", width: 30, height: 30, borderRadius: 15 }}
                  />
                </Space>
              </Form.Item>

              <Form.Item
                name="colorPrimary"
                getValueFromEvent={(color) => color.toHexString()}
              >
                <ColorPicker presets={presets}>
                  <Radio.Button
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: 15,
                      background: "conic-gradient(red, yellow, lime, aqua, blue, magenta, red)",
                    }}
                  />
                </ColorPicker>
              </Form.Item>
            </Space>
          </Radio.Group>
        </Form.Item>

        <Form.Item label="圆角">
          <Row>
            <Col span={9}>
              <Form.Item name="borderRadius">
                <InputNumber />
              </Form.Item>
            </Col>
            <Col span={10}>
              <Form.Item name="borderRadius">
                <Slider
                  keyboard
                  min={0}
                  max={30}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form.Item>
        <Form.Item
          name="compactType"
          label="宽松度"
        >
          <Radio.Group>
            <Radio.Button value="default">默认</Radio.Button>
            <Radio.Button value="compact">紧凑</Radio.Button>
          </Radio.Group>
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default ThemeForm;
