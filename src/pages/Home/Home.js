import { Image } from "antd";
import React from "react";

const Home = () => {
  return (
    <div
      style={{
        backgroundImage: `url(${process.env.PUBLIC_URL + "/assets/images/loginbox.png"})`,
        backgroundSize: "cover",
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: 100,
      }}
    >
      <span>这是首页</span>
    </div>
  );
};

export default Home;
