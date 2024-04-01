import { theme } from "antd";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setThemeType, setMyToken, setCompactType } from "../store/reducer/themeSlice";
import { generate, presetPalettes } from "@ant-design/colors";

//颜色预设
const presetColors = [
  "#1677ff",
  "#722ED1",
  "#13C2C2",
  "#52C41A",
  "#EB2F96",
  "#F5222D",
  "#FA8C16",
  "#FADB14",
  "#FA541C",
  "#2F54EB",
  "#FAAD14",
  "#A0D911",
  "#000000",
];

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

//自定义主题设置钩子
export default function useTheme() {
  const dispatch = useDispatch();
  const [algorithm, setAlgorithm] = useState([]);
  const { themeType, compactType, myToken } = useSelector((state) => state.themeSlice);

  //颜色选择器预设
  const presets = genPresets({
    主题色: generate(myToken.colorPrimary),
    预设颜色: presetColors,
  });

  //获得主题设置数据
  const getThemeData = useCallback((value) => {
    switch (value[0].name[0]) {
      case "themeType":
        dispatch(setThemeType(value[0].value));
        break;
      case "colorPrimary":
        dispatch(setMyToken({ ...myToken, colorPrimary: value[0].value }));
        break;
      case "borderRadius":
        dispatch(setMyToken({ ...myToken, borderRadius: value[0].value }));
        break;
      case "compactType":
        dispatch(setCompactType(value[0].value));
        break;
      default:
        break;
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
