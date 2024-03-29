import { useDispatch, useSelector } from "react-redux";
import { setLarge, setMyLocale } from "../store/reducer/localeSlice";
import { useEffect, useState, useCallback } from "react";

import en from "../locales/en";
import zh_cn from "../locales/zh_cn";
import zh_hk from "../locales/zh_hk";

import enUS from "antd/locale/en_US";
import zhCN from "antd/locale/zh_CN";
import zhHK from "antd/locale/zh_HK";

import dayjs from "dayjs";
import "dayjs/locale/zh-cn";

dayjs.locale("zh-cn");

export default function useLocale() {
  const dispatch = useDispatch();
  const { large, myLocale } = useSelector((state) => state.localeSlice);
  const localLarge = localStorage.getItem("large");
  const [locale, setLocale] = useState(localLarge === "en" ? enUS : zhCN);

  //从本地获得large值
  useEffect(() => {
    dispatch(setLarge(localLarge));
  }, [localLarge]);

  //获得用户输入large值
  const getLarge = useCallback((value) => {
    dispatch(setLarge(value));
    localStorage.setItem("large", value);
  }, []);

  //修改语言
  useEffect(() => {
    switch (large) {
      case "en":
        dispatch(setMyLocale(en));
        setLocale(enUS);
        dayjs.locale("en");
        break;
      case "zh-cn":
        dispatch(setMyLocale(zh_cn));
        setLocale(zhCN);
        dayjs.locale("zh-cn");
        break;
      case "zh-hk":
        dispatch(setMyLocale(zh_hk));
        setLocale(zhHK);
        dayjs.locale("zh-hk");
        break;
      default:
        break;
    }
  }, [large]);

  return { large, locale, myLocale, getLarge };
}
