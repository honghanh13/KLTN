import React from "react";
import { Spin } from "antd";

const Loading = ({ isLoading, children }) => {
  return isLoading ? (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <Spin size="large" />
    </div>
  ) : (
    children
  );
};

export default Loading;