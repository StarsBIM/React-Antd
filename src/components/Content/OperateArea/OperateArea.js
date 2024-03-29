import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setOperateType } from "../../../store/reducer/operateSlice";
import { Button, Flex, Space, Input, Tooltip } from "antd";
import { icons } from "../../../assets/icons/antdIcons";
import useLocale from "../../../hooks/useLocale";

const { Search } = Input;

const OperateArea = () => {
  const dispatch = useDispatch();
  const { myLocale } = useLocale();

  const { operateItem, operateType } = useSelector((state) => state.operateSlice);
  //添加
  const addHandler = () => {
    dispatch(setOperateType("add"));
  };
  //刷新
  const refreshHandler = () => {
    dispatch(setOperateType("refetch"));
  };
  //导出
  const exportHandler = () => {};
  //导入
  const importHandler = () => {};
  //搜索
  const searchHandler = () => {};

  return (
    <Flex justify={"space-between"} align={"center"} style={{ marginBottom: "10px", height: "40px" }}>
      <Space size="large">
        <Tooltip title={myLocale.add}>
          <Button size="large" shape="circle" onClick={addHandler} icon={icons["icon-add"]} />
        </Tooltip>
        <Tooltip title={myLocale.refresh}>
          <Button size="large" shape="circle" onClick={refreshHandler} icon={icons["icon-refresh"]} />
        </Tooltip>
        <Tooltip title={myLocale.import}>
          <Button size="large" shape="circle" onClick={importHandler} icon={icons["icon-import"]} />
        </Tooltip>
        <Tooltip title={myLocale.export}>
          <Button size="large" shape="circle" onClick={exportHandler} icon={icons["icon-export"]} />
        </Tooltip>
      </Space>

      <Search placeholder={myLocale.searchPlaceholder} allowClear enterButton={myLocale.search} style={{ width: 350 }} onSearch={searchHandler} />
    </Flex>
  );
};

export default OperateArea;
