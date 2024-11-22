import React, { useState } from "react";
import { Radio, Card, Button } from "antd";
import { useNavigate } from "react-router-dom";

const CheckoutPage = () => {
  const [deliveryMethod, setDeliveryMethod] = useState("FAST");
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const navigate = useNavigate();
  const handleDeliveryChange = (e) => {
    setDeliveryMethod(e.target.value);
  };

  const handlePaymentChange = (e) => {
    setPaymentMethod(e.target.value);
  };

  return (
    <div style={{ padding: 20 }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <h2>Thanh toán</h2>
      </div>

      {/* Main Content */}
      <div style={{ display: "flex", gap: 20 }}>
        {/* Left Section */}
        <div style={{ flex: 1 }}>
          {/* Delivery Method */}
          <Card title="Chọn phương thức giao hàng" style={{ marginBottom: 20 }}>
            <Radio.Group
              onChange={handleDeliveryChange}
              value={deliveryMethod}
              style={{ display: "flex", flexDirection: "column", gap: 10 }}
            >
              <Radio value="FAST">FAST Giao hàng tiết kiệm</Radio>
              <Radio value="GO_JEK">GO_JEK Giao hàng tiết kiệm</Radio>
            </Radio.Group>
          </Card>

          {/* Payment Method */}
          <Card title="Chọn phương thức thanh toán">
            <Radio.Group
              onChange={handlePaymentChange}
              value={paymentMethod}
              style={{ display: "flex", flexDirection: "column", gap: 10 }}
            >
              <Radio value="COD">Thanh toán tiền mặt khi nhận hàng</Radio>
            </Radio.Group>
          </Card>
        </div>

        {/* Right Section */}
        <div style={{ width: 300 }}>
          <Card
            title="Địa chỉ: HCM HCM"
            extra={<a href="#">Thay đổi</a>}
            style={{ marginBottom: 20 }}
          >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Tạm tính</span>
              <span>200,000 VND</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Giảm giá</span>
              <span>10,000 VND</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Phí giao hàng</span>
              <span>20,000 VND</span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontWeight: "bold",
                fontSize: 16,
                marginTop: 10,
              }}
            >
              <span>Tổng tiền</span>
              <span>210,000 VND</span>
            </div>
            <p style={{ marginTop: 10, fontSize: 12 }}>
              (Đã bao gồm VAT nếu có)
            </p>
          </Card>

          <Button
            type="primary"
            onClick={()=> navigate("/order-success")}
            style={{ width: "100%", height: 50, fontSize: 16 }}
          >
            Đặt hàng
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
