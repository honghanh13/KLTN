import React, { useState } from "react";
import { Card, Button, Row, Col, Divider, Tag, Layout, Menu } from "antd";
import { UserOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Sider, Content } = Layout;

const OrderDetails = () => {
  const navigate = useNavigate();

  const orderData = {
    orderId: "DH123456",
    orderDate: "22/11/2024",
    status: "Đang xử lý", // Trạng thái đơn hàng
    products: [
      {
        id: 1,
        image: "https://via.placeholder.com/80", // Link ảnh
        name: "Sản phẩm A",
        price: 150000,
        quantity: 2,
      },
      {
        id: 2,
        image: "https://via.placeholder.com/80", // Link ảnh
        name: "Sản phẩm B",
        price: 200000,
        quantity: 1,
      },
      {
        id: 3,
        image: "https://via.placeholder.com/80", // Link ảnh
        name: "Sản phẩm C",
        price: 100000,
        quantity: 3,
      },
    ],
  };

  // Hàm format giá tiền
  const formatCurrency = (value) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
      value
    );

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Sidebar */}
      <Sider
        style={{
          background: "#fff",
          borderRight: "1px solid #f0f0f0",
        }}
        width={220}
      >
        <Menu
          mode="inline"
          selectedKeys={"2"}
          defaultSelectedKeys={"2"}
        >
          <Menu.Item key="1" onClick={()=> navigate("/profile")} icon={<UserOutlined />}>
            Thông Tin Tài Khoản
          </Menu.Item>
          <Menu.Item key="2" icon={<ShoppingCartOutlined />}>
            Đơn Mua
          </Menu.Item>
        </Menu>
      </Sider>

      {/* Content */}
      <Content style={{ padding: 20 }}>
        <Card
          style={{
          
            margin: "0 auto",
            borderRadius: 10,
            boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
          }}
        >
          {/* Header */}
          <Row style={{ marginBottom: 20 }}>
            <Col span={16}>
              <h3>Mã đơn hàng: {orderData.orderId}</h3>
              <p>Ngày đặt: {orderData.orderDate}</p>
            </Col>
            <Col span={8} style={{ textAlign: "right" }}>
              <Tag color="blue">{orderData.status}</Tag>
            </Col>
          </Row>
          <Divider />

          {/* Body: Danh sách sản phẩm */}
          {orderData.products.map((product) => (
            <Row
              key={product.id}
              style={{
                marginBottom: 15,
                paddingBottom: 10,
                borderBottom: "1px solid #f0f0f0",
              }}
            >
              {/* Hình ảnh sản phẩm */}
              <Col span={4}>
                <img
                  src={product.image}
                  alt={product.name}
                  style={{
                    width: "80px",
                    height: "80px",
                    objectFit: "cover",
                    borderRadius: 5,
                  }}
                />
              </Col>

              {/* Tên và thông tin sản phẩm */}
              <Col span={16}>
                <h4>{product.name}</h4>
                <p>
                  Giá: <strong>{formatCurrency(product.price)}</strong>
                </p>
              </Col>

              {/* Số lượng */}
              <Col span={4} style={{ textAlign: "right" }}>
                <p>Số lượng: {product.quantity}</p>
              </Col>
            </Row>
          ))}

          {/* Footer */}
          <Divider />
          <Row justify="space-between">
            <Button type="danger">Hủy Đơn Hàng</Button>
            <Button type="primary">Xem Chi Tiết</Button>
          </Row>
        </Card>
      </Content>
    </Layout>
  );
};

export default OrderDetails;
