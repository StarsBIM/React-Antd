import { message } from "antd";

export default function useMessage() {
  const [messageApi, messageHolder] = message.useMessage();
  const success = (content) => {
    messageApi.open({
      type: "success",
      content: content,
    });
  };
  const error = (content) => {
    messageApi.open({
      type: "error",
      content: content,
    });
  };
  const warning = (content) => {
    messageApi.open({
      type: "warning",
      content: content,
    });
  };
  return { success, error, warning, messageHolder };
}
