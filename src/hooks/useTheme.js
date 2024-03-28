import { theme } from "antd";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setThemeType, setMyToken, setCompactType } from "../store/reducer/themeSlice";
import { generate, green, presetPalettes, red, yellow } from "@ant-design/colors";

//获取系统颜色预设
const genPresets = (presets = presetPalettes) =>
  Object.entries(presets).map(([label, colors]) => ({
    label,
    colors,
  }));

//主题算法配置
const themeConfig = {
  default: [theme.defaultAlgorithm],
  dark: [theme.darkAlgorithm],
  defaultCompact: [theme.defaultAlgorithm, theme.compactAlgorithm],
  darkCompact: [theme.darkAlgorithm, theme.compactAlgorithm],
};

const defaultTokenConfig = {
  colorPrimary: "#1677FF", //品牌色
  borderRadius: 6, //基础圆角
};

//读取本地的主题设置
const myTheme = JSON.parse(localStorage.getItem("myTheme"));

//自定义主题设置钩子
export default function useTheme() {
  const dispatch = useDispatch();
  const [algorithm, setAlgorithm] = useState(themeConfig.default);
  const { themeType, compactType, myToken } = useSelector((state) => state.themeSlice);

  //加载保存在本地的主题设置
  useEffect(() => {
    if (myTheme.themeType) {
      dispatch(setThemeType(myTheme.themeType));
    }
    if (myTheme.compactType) {
      dispatch(setCompactType(myTheme.compactType));
    }
    if (myTheme.myToken) {
      dispatch(setMyToken(myTheme.myToken));
    }
  }, [myTheme]);

  //自定义颜色选择器预设
  const presets = genPresets({
    primary: generate(myToken.colorPrimary),
    red,
    green,
    yellow,
  });

  //获得主题设置数据
  const getThemeData = useCallback((value) => {
    switch (value[0].name[0]) {
      case "themeType":
        dispatch(setThemeType(value[0].value));
        return;
      case "colorPrimary":
        dispatch(setMyToken({ ...myToken, colorPrimary: value[0].value }));
        return;
      case "borderRadius":
        dispatch(setMyToken({ ...myToken, borderRadius: value[0].value }));
        return;
      case "compactType":
        dispatch(setCompactType(value[0].value));
        return;
    }
  }, []);

  //重置主题设置
  const resetTheme = () => {
    dispatch(setMyToken(defaultTokenConfig));
    dispatch(setThemeType("default"));
    dispatch(setCompactType("default"));
  };

  // 设置themeAlgorithm
  useEffect(() => {
    if (themeType === "default" && compactType === "default") {
      setAlgorithm(themeConfig.default);
    } else if (themeType === "default" && compactType !== "default") {
      setAlgorithm(themeConfig.defaultCompact);
    } else if (themeType !== "default" && compactType === "default") {
      setAlgorithm(themeConfig.dark);
    } else if (themeType !== "default" && compactType !== "default") {
      setAlgorithm(themeConfig.darkCompact);
    }
  }, [themeType, compactType]);

  //将主题设置保存到本地
  useEffect(() => {
    localStorage.setItem("myTheme", JSON.stringify({ themeType, compactType, myToken }));
  }, [themeType, compactType, myToken]);

  return { algorithm, myToken, themeType, compactType, presets, getThemeData, resetTheme };
}
