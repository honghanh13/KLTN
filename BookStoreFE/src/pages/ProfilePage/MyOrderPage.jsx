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
import { UserOutlined, ShoppingCartOutlined, CloseOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import * as OrderService from "../../Service/OrderService";
import { useSelector } from "react-redux";
import { converPrice } from "../../utils";
import { Contant } from "../../contant";
import { useQueryClient } from "@tanstack/react-query";

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
  const [openUpdate, setOpenUpdate] = useState(false);
  const [confirmLoadingUpdate, setConfirmLoadingUpdate] = useState(false);
  const [currentOrderUpdate, setCurrentOrderUpdate] = useState(null);
  const [modalTextUpdate, setModalTextUpdate] = useState(
    "Vui lòng xác nhận đã nhận được hàng"
  );
  const queryClient = useQueryClient();

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
  const handleCancelOrder = async (orderId, orderItems) => {
    try {
      const response = await OrderService.cancelOrder(
        orderId,
        user?.access_token,
        orderItems
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

  const showModalUpdate = (order) => {
    setOpenUpdate(true);
    setCurrentOrderUpdate(order);
  };
  const handleOkUpdate = async (orderID) => {
    setConfirmLoadingUpdate(true);
    try {
      await OrderService.markOrderAsReceived(
        { orderId: orderID, isPaid: true, isDelivered: true },
        user?.access_token
      );

      // Cập nhật state cục bộ ngay lập tức
      setOrderData((prevOrderData) =>
        prevOrderData.map((order) =>
          order._id === orderID
            ? { ...order, isPaid: true, isDelivered: true } // Cập nhật trạng thái
            : order
        )
      );

      // Làm mới dữ liệu từ server (nếu cần)
      queryClient.invalidateQueries(["order", user?.id]);

      setOpenUpdate(false);
    } catch (error) {
      console.error(error);
    } finally {
      setConfirmLoadingUpdate(false);
    }
  };

  const handleCancelUpdate = () => {
    setOpenUpdate(false);
  };

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
              margin: "10px auto",
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
              <div>
                {order?.orderStatus === "1" && (
                  <Button
                    type="dashed"
                    danger
                    onClick={() =>
                      handleCancelOrder(order._id, order.orderItems)
                    } // Call cancel API
                  >
                    Hủy Đơn Hàng
                  </Button>
                )}
              </div>

              <div>
                <span>
                  {order?.orderStatus === "4" && (
                    <>
                      {" "}
                      <Button
                        type="default"
                        onClick={() => showModalUpdate(order)}
                        style={{ float: "right", marginRight: "16px" }}
                        disabled={order?.isPaid && order?.isDelivered}
                      >
                        Đã nhận được hàng
                      </Button>{" "}
                      {/* {order?.isPaid === true &&
                      order?.isDelivered === true &&
                      order?.orderItems.some((item) => !item.isRating) ? (
                        <Button
                          type="primary"
                          onClick={() =>
                            showModalRate(
                              order._id,
                              order.orderItems.filter((item) => !item.isRating)
                            )
                          }
                          style={{ float: "right", marginRight: "16px" }}
                        >
                          Đánh giá
                        </Button>
                      ) : null} */}
                    </>
                  )}
                </span>

                <Button
                  style={{ marginRight: "10px" }}
                  onClick={() => handleOpenModal(order._id)}
                  type="primary"
                >
                  Xem Chi Tiết
                </Button>
              </div>
              <Modal
                title="Xác nhận đơn hàng"
                mask ={false}
                open={openUpdate}
                onOk={() => handleOkUpdate(currentOrderUpdate._id)}
                confirmLoading={confirmLoadingUpdate}
                onCancel={handleCancelUpdate}
              >
                <p>{modalTextUpdate}</p>
              </Modal>
            </Row>
          </Card>
        ))}
        <Modal
          title={
            <h2 style={{ textAlign: "center", marginBottom: 0 }}>
              Chi Tiết Đơn Hàng
            </h2>
          }
          open={open}
          footer={null}
          closeIcon={<CloseOutlined onClick={() => setOpen(false)} />}
          width={1000}
        >
          {selectedOrder ? (
            <>
              <div style={{ marginBottom: "20px" }}>
                <h3>Thông Tin Giao Hàng</h3>
                <Row gutter={16}>
                  <Col span={12}>
                    <p>
                      <strong>Người nhận:</strong>{" "}
                      {selectedOrder.shippingAddress?.fullName}
                    </p>
                    <p>
                      <strong>Địa chỉ:</strong>{" "}
                      {selectedOrder.shippingAddress?.address}
                    </p>
                  </Col>
                  <Col span={12}>
                    <p>
                      <strong>Số điện thoại:</strong>{" "}
                      {selectedOrder.shippingAddress?.phone}
                    </p>
                    <p>
                      <strong>Phương thức thanh toán:</strong>{" "}
                      {selectedOrder.paymentMethod === "paymentincash"
                        ? "Thanh toán tiền mặt"
                        : selectedOrder.paymentMethod}
                    </p>
                  </Col>
                </Row>
              </div>
              <Divider />
              <div style={{ marginBottom: "20px" }}>
                <h3>Danh Sách Sản Phẩm</h3>
                {selectedOrder.orderItems.map((product) => (
                  <Row
                    key={product?._id}
                    style={{
                      marginBottom: "10px",
                      border: "1px solid #e8e8e8",
                      borderRadius: "5px",
                      padding: "10px",
                    }}
                    align="middle"
                  >
                    <Col span={6}>
                      <img
                        src={product?.image || "https://via.placeholder.com/80"}
                        alt={product?.name}
                        style={{
                          width: "100%",
                          maxWidth: "80px",
                          height: "80px",
                          objectFit: "cover",
                          borderRadius: "5px",
                          border: "1px solid #ddd",
                        }}
                      />
                    </Col>
                    <Col span={18}>
                      <h4 style={{ margin: "0 0 5px 0" }}>{product.name}</h4>
                      <p style={{ margin: "0" }}>
                        Giá: <strong>{converPrice(product?.price)} đ</strong>
                      </p>
                      <p style={{ margin: "0" }}>Số lượng: {product?.amount}</p>
                    </Col>
                  </Row>
                ))}
              </div>
              <Divider />
              <div style={{ marginBottom: "10px" }}>
                <h3>Thông Tin Đơn Hàng</h3>
                <Row gutter={16}>
                  <Col span={8}>
                    <p>
                      <strong>Ngày đặt hàng:</strong>{" "}
                      {new Date(selectedOrder.createdAt).toLocaleString()}
                    </p>
                  </Col>
                  <Col span={8}>
                    <p>
                      <strong>Ngày cập nhật:</strong>{" "}
                      {new Date(selectedOrder.updatedAt).toLocaleString()}
                    </p>
                  </Col>
                  <Col span={8}>
                    <p>
                      <strong>Trạng thái:</strong>{" "}
                      {selectedOrder.isDelivered ? "Đã giao" : "Chưa giao"}
                    </p>
                  </Col>
                </Row>
                <Row gutter={16}>
                  <Col span={8}>
                    <p>
                      <strong>Tổng giá sản phẩm:</strong>{" "}
                      {converPrice(selectedOrder.itemsPrice)} đ
                    </p>
                  </Col>
                  <Col span={8}>
                    <p>
                      <strong>Phí vận chuyển:</strong>{" "}
                      {converPrice(selectedOrder.shippingPrice)} đ
                    </p>
                  </Col>
                  <Col span={8}>
                    <p>
                      <strong>Tổng thanh toán:</strong>{" "}
                      {converPrice(selectedOrder.totalPrice)} đ
                    </p>
                  </Col>
                </Row>
              </div>
            </>
          ) : (
            <p>Đang tải thông tin...</p>
          )}
        </Modal>
      </Content>
    </Layout>
  );
};

export default OrderDetails;
