import React from "react";
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

const NeedAuth = (props) => {
  const auth = useSelector((state) => state.authSlice);
  const location = useLocation();
  return auth.isLogged ? props.children : <Navigate to="/login" state={{ prevLocation: location }} replace />;
};

export default NeedAuth;
