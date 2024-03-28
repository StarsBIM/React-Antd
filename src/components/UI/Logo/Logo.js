import React from "react";
import "./Logo.scss";
import Icon from "../Icon/Icon";
import { theme } from "antd";

const Logo = () => {
  const { useToken } = theme;

  const { token } = useToken();
  return (
    <div
      className="logo"
      style={{ backgroundColor: token.colorBgContainer, color: token.colorPrimary }}
    >
      <Icon
        svgPath={
          "M716.8 2.048q67.584 27.648 124.416 74.24t97.28 106.496 63.488 131.072 23.04 148.992q0 68.608-17.92 132.096t-50.176 118.784-77.824 100.864-100.864 77.824-119.296 50.176-132.608 17.92q-77.824 0-148.992-22.528t-131.072-63.488-106.496-97.792-74.24-124.416q64.512 73.728 153.6 115.712t194.56 41.984q95.232 0 179.2-36.352t146.432-98.816 98.816-146.432 36.352-179.2q0-104.448-42.496-194.048t-115.2-153.088zM220.16 289.792l-89.088-86.016 122.88-18.432 54.272-110.592 55.296 110.592 122.88 18.432-89.088 86.016 21.504 122.88-110.592-58.368-109.568 58.368z"
        }
      />
      <span>ReactUMS</span>
    </div>
  );
};

export default Logo;
