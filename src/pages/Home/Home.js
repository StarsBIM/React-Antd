import { Calendar } from "antd";
import React from "react";
import Antd from "./Antd";

const Home = () => {
  return (
    <div
      style={{
        backgroundImage: `url(${process.env.PUBLIC_URL + "/assets/images/loginbox.png"})`,
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: 100,
      }}
    >
      <Calendar />
    </div>
  );
};

export default Home;
