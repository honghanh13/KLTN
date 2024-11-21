import React, { useState } from "react";
import { Table, Checkbox, InputNumber, Button, Card } from "antd";

const OrderPage = () => {
  const [quantity, setQuantity] = useState(3); // Số lượng sản phẩm

  const columns = [
    {
      title: <Checkbox checked>Tất cả (1 sản phẩm)</Checkbox>,
      dataIndex: "product",
      key: "product",
      render: (text, record) => (
        <Checkbox checked>
          <div style={{ display: "flex", alignItems: "center" }}>
            <img
              src="https://via.placeholder.com/50"
              alt="product"
              style={{ marginRight: 10 }}
            />
            <span>{text}</span>
          </div>
        </Checkbox>
      ),
    },
    {
      title: "Đơn giá",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
      render: (_, record) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          <Button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            disabled={quantity <= 1}
          >
            -
          </Button>
          <InputNumber
            min={1}
            value={quantity}
            onChange={(value) => setQuantity(value)}
            style={{ margin: "0 8px", width: 60 }}
          />
          <Button onClick={() => setQuantity(quantity + 1)}>+</Button>
        </div>
      ),
    },
    {
      title: "Thành tiền",
      dataIndex: "total",
      key: "total",
      render: (_, record) => <span>{record.price * quantity} VND</span>,
    },
    {
      title: "",
      dataIndex: "action",
      key: "action",
      render: () => <Button danger>Xóa</Button>,
    },
  ];

  const dataSource = [
    {
      key: "1",
      product: "Ipad",
      price: 200000,
      quantity: 3,
      total: 600000,
    },
  ];

  return (
    <div style={{ padding: 20 }}>
      <Card title="Giỏ hàng" style={{ marginBottom: 20 }}>
        <Table
          dataSource={dataSource}
          columns={columns}
          pagination={false}
          rowKey="key"
        />
      </Card>

      <Card style={{ maxWidth: 300, marginLeft: "auto" }}>
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>Tạm tính</span>
            <span>600,000 VND</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>Giảm giá</span>
            <span>90,000 VND</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>Phí giao hàng</span>
            <span>0 VND</span>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontWeight: "bold",
            fontSize: 16,
          }}
        >
          <span>Tổng tiền</span>
          <span>510,000 VND</span>
        </div>
        <Button
          type="primary"
          style={{ marginTop: 20, width: "100%", height: 40 }}
        >
          Mua hàng
        </Button>
      </Card>
    </div>
  );
};

export default OrderPage;
