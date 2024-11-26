import React, { useState, useEffect } from "react";
import {
  Card,
  Button,
  Row,
  Col,
  Divider,
  Tag,
  Layout,
  Menu,
  Modal,
  notification,
} from "antd";
import { UserOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import * as OrderService from "../../Service/OrderService";
import { useSelector } from "react-redux";
import { converPrice } from "../../utils";
import { Contant } from "../../contant";

const { Sider, Content } = Layout;

const OrderDetails = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const [open, setOpen] = useState(false);
  const orderContant = Contant();
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Gọi API để lấy dữ liệu đơn hàng
  const fetchOrderData = async () => {
    try {
      setLoading(true);
      // Lấy token từ localStorage
      const response = await OrderService.getOrderByUserId(
        user?.id,
        user?.access_token,
        0,
        10,
        "-1"
      );
      setOrderData(response.data);
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderData();
  }, [user]);

  // Fetch detailed order data when a specific order is clicked
  const fetchOrderDetails = async (orderId) => {
    try {
      const response = await OrderService.getDetailsOrder(
        orderId,
        user?.access_token
      );
      setSelectedOrder(response.data);
    } catch (err) {
      setError(err.message || "Failed to fetch order details.");
    }
  };

  const handleOpenModal = (orderId) => {
    fetchOrderDetails(orderId); // Fetch order details when modal opens
    setOpen(true);
  };
  const handleCancelOrder = async (orderId) => {
    try {
      const response = await OrderService.cancelOrder(
        orderId,
        user?.access_token,
        selectedOrder?.orderItems
      );
      if (response.status === "OK") {
        // Update the local state to reflect the cancellation
        setOrderData((prevOrderData) =>
          prevOrderData.filter((order) => order._id !== orderId)
        );
        notification.success({
          message: "Hủy Đơn Hàng Thành Công",
          description: response.message,
        });
      } else {
        notification.error({
          message: "Lỗi",
          description: response.message,
        });
      }
    } catch (error) {
      notification.error({
        message: "Lỗi",
        description: "Đã có lỗi xảy ra khi hủy đơn hàng.",
      });
    }
  };

  if (error) {
    return (
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <h3>Đã xảy ra lỗi: {error}</h3>
        <Button type="primary" onClick={fetchOrderData}>
          Thử lại
        </Button>
      </div>
    );
  }
  console.log("selectedOrder", selectedOrder);

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
        <Menu mode="inline" selectedKeys={"2"} defaultSelectedKeys={"2"}>
          <Menu.Item
            key="1"
            onClick={() => navigate("/profile")}
            icon={<UserOutlined />}
          >
            Thông Tin Tài Khoản
          </Menu.Item>
          <Menu.Item key="2" icon={<ShoppingCartOutlined />}>
            Đơn Mua
          </Menu.Item>
        </Menu>
      </Sider>

      {/* Content */}
      <Content style={{ padding: 20 }}>
        {orderData?.map((order) => (
          <Card
            key={order._id}
            style={{
              margin: "0 auto",
              borderRadius: 10,
              boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
            }}
          >
            {/* Header */}
            <Row style={{ marginBottom: 20 }}>
              <Col span={16}>
                <h3>Mã đơn hàng: {order._id}</h3>
                <p>
                  Ngày đặt: {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </Col>
              <Col span={8} style={{ textAlign: "right" }}>
                <Tag color={orderContant.status[order?.orderStatus]?.color}>
                  {" "}
                  {orderContant.status[order?.orderStatus]?.label}
                </Tag>
              </Col>
            </Row>
            <Divider />

            {/* Body: Danh sách sản phẩm */}
            {order.orderItems.map((product) => (
              <Row
                key={product._id}
                style={{
                  marginBottom: 15,
                  paddingBottom: 10,
                  borderBottom: "1px solid #f0f0f0",
                }}
              >
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

                <Col span={16}>
                  <h4>{product.name}</h4>
                  <p>
                    Giá: <strong>{converPrice(product.price)}</strong>
                  </p>
                </Col>

                <Col span={4} style={{ textAlign: "right" }}>
                  <p>Số lượng: {product.amount}</p>
                </Col>
              </Row>
            ))}
            <p style={{ float: "right", fontWeight: "500" }}>
              Tổng giá trị đơn hàng: {converPrice(order.totalPrice)}
            </p>

            {/* Footer */}
            <Divider />
            <Row justify="space-between">
              <Button
                type="dashed"
                danger
                onClick={() => handleCancelOrder(order._id)} // Call cancel API
              >
                Hủy Đơn Hàng
              </Button>
              <Button onClick={() => handleOpenModal(order._id)} type="primary">
                Xem Chi Tiết
              </Button>
            </Row>
          </Card>
        ))}
        <Modal
          title="Chi Tiết Đơn Hàng"
          open={open}
          onOk={() => setOpen(false)}
          onCancel={() => setOpen(false)}
          width={1000}
        >
          {selectedOrder ? (
            <>
              <p>Địa chỉ giao hàng: {selectedOrder.shippingAddress?.address}</p>
              <p>Tên người nhận: {selectedOrder.shippingAddress?.fullName}</p>
              <p>Số điện thoại: {selectedOrder.shippingAddress?.phone}</p>
              <Divider />
              <h4>Thông tin sản phẩm:</h4>
              {selectedOrder?.orderItems?.map((product) => (
                <Row key={product?._id}>
                  <Col span={6}>
                    <img
                      src={product?.image}
                      alt={product?.name}
                      style={{
                        width: "80px",
                        height: "80px",
                        objectFit: "cover",
                        borderRadius: 5,
                      }}
                    />
                  </Col>
                  <Col span={18}>
                    <h4>{product.name}</h4>
                    <p>
                      Giá: <strong>{converPrice(product?.price)}</strong>
                    </p>
                    <p>Số lượng: {product?.amount}</p>
                  </Col>
                </Row>
              ))}
            </>
          ) : (
            <p>Loading details...</p>
          )}
        </Modal>
      </Content>
    </Layout>
  );
};

export default OrderDetails;
