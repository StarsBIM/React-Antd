import React from "react";
import "./Icon.scss";

const Icon = (props) => {
  return (
    <svg
      viewBox="0 0 1024 1024"
      className="icon"
    >
      <path d={props.svgPath} />
    </svg>
  );
};

export default Icon;
