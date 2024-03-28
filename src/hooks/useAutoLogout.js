import { useEffect } from "react";
import { setLogout } from "../store/reducer/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const useAutoLogout = () => {
  const auth = useSelector((state) => state.authSlice);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  //创建一个useEffect,用来处理登录状态
  useEffect(() => {
    const timeout = auth.expirationTime - Date.now();
    if (currentUser === null) {
      //本地数据丢失跳转到登录页面
      navigate("/login", { replace: true });
    }
    //判断timeout的值，小于这个值就直接登出
    if (timeout < 60000) {
      dispatch(setLogout());
      return;
    }
    const timer = setTimeout(() => {
      dispatch(setLogout());
    }, timeout);
    // 在下次执行之前，把定时器给关了，避免同时开启对个定时器的情况
    return () => {
      clearTimeout(timer);
    };
  }, [auth, currentUser]);
};

export default useAutoLogout;
