import React from "react";
import { Card, Button } from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const OrderSuccess = () => {
  const order = useSelector((state) => state.order);
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = location;
  console.log("state", state);
  const handleGoBackHome = () => {
    // Điều hướng về trang chủ hoặc trang sản phẩm
    console.log("Go back to homepage");
  };

  const handleViewOrders = () => {
    // Điều hướng đến trang xem lịch sử đơn hàng
    console.log("View orders");
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#f0f2f5",
        padding: 20,
      }}
    >
      <Card
        style={{
          width: 500,
          textAlign: "center",
          borderRadius: 10,
          boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
        }}
      >
        {/* Biểu tượng thành công */}
        <CheckCircleOutlined
          style={{ fontSize: 80, color: "#52c41a", marginBottom: 20 }}
        />

        {/* Tiêu đề */}
        <h2 style={{ fontSize: 24, fontWeight: "bold", marginBottom: 10 }}>
          Đặt hàng thành công!
        </h2>

        {/* Mô tả */}
        <p style={{ fontSize: 16, color: "#595959", marginBottom: 20 }}>
          Cảm ơn bạn đã đặt hàng. Chúng tôi sẽ xử lý đơn hàng và giao đến bạn
          trong thời gian sớm nhất.
        </p>

        {/* Mã đơn hàng */}
        <p
          style={{
            fontSize: 16,
            fontWeight: "bold",
            color: "#1890ff",
            marginBottom: 30,
          }}
        >
          Mã đơn hàng: {state.orderId}
        </p>

        {/* Nút hành động */}
        <div style={{ display: "flex", justifyContent: "center", gap: 20 }}>
          <Button type="primary" size="large" onClick={() => navigate('/')}>
            Về trang chủ
          </Button>
          <Button type="default" size="large" onClick={() => navigate('/my-order')}>
            Xem đơn hàng
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default OrderSuccess;
