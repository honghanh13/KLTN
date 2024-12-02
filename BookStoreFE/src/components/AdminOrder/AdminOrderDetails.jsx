import React, { useEffect } from "react";
import { WrapperHeader } from "../AdminProduct/style";
import TableComponent from "../TableComponent/TableComponent";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import HeaderComponent from "../HeaderComponent/HeaderComponet";
import * as OrderService from "../../Service/OrderService";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { converPrice, formatDate } from "../../utils";
import { Button, Col, Image, Row, Select, Table } from "antd";
import { useMutationHooks } from "../../hooks/useMutationHook";
import * as message from "../../components/Message/Message";
import { Contant } from "../../contant";

const AdminOrderDetails = () => {
  const user = useSelector((state) => state?.user);
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const orderContant = Contant();

  const fetchGetDetailsOrder = async () => {
    const res = await OrderService.getDetailsOrder(id);
    return res.data;
  };

  const queryOrder = useQuery({
    queryKey: ["order-details", id],
    queryFn: fetchGetDetailsOrder,
    enabled: !!id,
  });

  const { isLoading, data: orderDetails } = queryOrder;
  console.log("data", orderDetails);

  const dataSource = orderDetails?.orderItems.map((item, index) => ({
    key: index + 1,
    image: item.image,
    name: item.name,
    price: item.price,
    amount: item.amount,
    totalPrice: converPrice(item.price * item.amount),
  }));

  const columns = [
    {
      title: "Hình Ảnh",
      dataIndex: "image",
      key: "image",
      render: (text) => <Image width={60} src={text} />,
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Giá sản phẩm",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "Số Lượng",
      dataIndex: "amount",
      key: "amount",
    },
    {
      title: "Thành Tiền",
      dataIndex: "totalPrice",
      key: "totalPrice",
    },
  ];

  const mutationUpdate = useMutationHooks(({ orderId, status }) => {
    const res = OrderService.updateOrderStatus(
      { orderId, status },
      user.access_token
    );
    return res;
  });

  const { isSuccess: isSuccessUpdated, isError: isErrorUpdated } =
    mutationUpdate;

  useEffect(() => {
    if (isSuccessUpdated) {
      message.success("Cập nhật thành công trạng thái đơn hàng!");
      queryClient.invalidateQueries(["order-details", id]);
    } else if (isErrorUpdated) {
      message.error("Cập nhật thất bại trạng thái đơn hàng!");
    }
  }, [isSuccessUpdated, isErrorUpdated, queryClient, id]);

  const handleStatusChange = (value) => {
    mutationUpdate.mutate({ orderId: id, status: value });
  };

  const Delivery = () => {
    if (orderDetails?.shippingPrice === 10000) {
      return (
        <>
          <span style={{ fontWeight: 700, color: "#ff7b02" }}>FAST</span> Giao
          hàng tiết kiệm
        </>
      );
    } else if (orderDetails?.shippingPrice === 20000) {
      return (
        <>
          {" "}
          <span style={{ fontWeight: 700, color: "#ff7b02" }}>
            JT Express
          </span>{" "}
          Giao hàng tiết kiệm
        </>
      );
    } else {
      return (
        <>
          {" "}
          <span style={{ fontWeight: 700, color: "#ff7b02" }}>Shopee</span> Giao
          hàng tiết kiệm
        </>
      );
    }
  };

  // return (
  //   <div>
  //     <HeaderComponent isHiddenSearch isHiddenCart />
  //     <button onClick={() => navigate("/system/admin")}>Quay về</button>
  //     <WrapperHeader>Quản lý đơn hàng</WrapperHeader>

  //     <div style={{ margin: "20px 16px" }}>
  //       <div
  //         style={{
  //           padding: "24px",
  //           minHeight: "280px",
  //           background: "#fff",
  //           borderRadius: "8px",
  //         }}
  //       >
  //         <Row>
  //           <Col span={8}>
  //             <h3>Thông tin đơn hàng</h3>
  //           </Col>
  //           <Col span={8} offset={8} style={{ textAlign: "right" }}>
  //             <span style={{ fontSize: "18px" }}>{orderDetails?._id}</span>{" "}
  //             <span
  //               style={{
  //                 fontSize: "18px",
  //                 color: "red",
  //                 borderRadius: "5px",
  //                 padding: "5px",
  //                 backgroundColor: "#feeeea",
  //               }}
  //             >
  //               {orderContant.status[orderDetails?.isDelivered]}
  //             </span>
  //           </Col>
  //         </Row>

  //         <Row>
  //           <Col span={24}>
  //             <hr />
  //           </Col>
  //         </Row>

  //         <Row>
  //           <Col span={12}>
  //             <h5>Thông tin khách hàng</h5>
  //             <h5 className="mt-3" style={{ textTransform: "capitalize" }}>
  //               Họ và tên: {orderDetails?.shippingAddress?.fullName}
  //             </h5>
  //             <div className="mt-3">
  //               Địa chỉ: {`${orderDetails?.shippingAddress.address}`}
  //             </div>
  //             <div className="mt-3">
  //               Số điện thoại: 0{orderDetails?.shippingAddress?.phone}
  //             </div>
  //           </Col>
  //           <Col span={12} style={{ textAlign: "right" }}>
  //             <h5>Phương thức thanh toán</h5>
  //             <div className="mt-3">
  //               {orderContant.payment[orderDetails?.paymentMethod]}
  //             </div>
  //             <h5 className="mt-3">Phương thức vận chuyển</h5>
  //             <div className="mt-3"> {Delivery()}</div>
  //             <h5 className="mt-3">Ngày đặt hàng</h5>
  //             <div className="mt-3">{formatDate(orderDetails?.createdAt)}</div>
  //           </Col>
  //         </Row>

  //         <Row>
  //           <Col span={12}>
  //             <h4>Thay đổi trạng thái đơn hàng</h4>
  //             <Select
  //               className="mt-3"
  //               defaultValue={orderDetails?.isDelivered || "1"}
  //               style={{ width: 306 }}
  //               options={[
  //                 { value: "1", label: "Chờ xác nhận" },
  //                 { value: "2", label: "Đã xác nhận" },
  //                 { value: "3", label: "Đang vận chuyển" },
  //                 { value: "4", label: "Đã giao hàng" },
  //               ]}
  //               onChange={handleStatusChange}
  //             />
  //           </Col>
  //         </Row>

  //         <Row>
  //           <Col className="mt-3" span={24}>
  //             <span style={{ fontSize: "18px", fontWeight: "400" }}>
  //               Thông tin sản phẩm
  //             </span>
  //             <span style={{ float: "right" }}>
  //               {orderDetails?.orderItems?.length} sản phẩm
  //             </span>
  //           </Col>
  //           <Col span={24}>
  //             <Table
  //               style={{
  //                 border: "1px solid #ddd",
  //                 borderRadius: "8px",
  //                 overflow: "hidden",
  //               }}
  //               className="mt-3"
  //               bordered
  //               dataSource={dataSource}
  //               columns={columns}
  //               pagination={false}
  //             />
  //             <Col className="mt-3" span={12} offset={18}>
  //               <span style={{ fontSize: "16px", color: "#111111" }}>
  //                 Tổng tiền:{" "}
  //                 <span
  //                   style={{
  //                     color: "#e53637",
  //                     fontWeight: "700",
  //                   }}
  //                 >
  //                   {converPrice(orderDetails?.totalPrice)}
  //                 </span>
  //               </span>
  //             </Col>
  //             <hr />
  //           </Col>
  //         </Row>
  //       </div>
  //     </div>
  //   </div>
  // );

  return (
    <div style={{ backgroundColor: "#f8f9fa", padding: "20px 0" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <header
          style={{
            background: "#1A94FF",
            padding: "16px",
            borderRadius: "12px",
            color: "#fff",
            marginBottom: "20px",
            boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
          }}
        >
          <h1 style={{ textAlign: "center", margin: 0, fontSize: "24px" }}>
            Quản lý đơn hàng
          </h1>
        </header>

        <Button
          type="primary"
          onClick={() => navigate("/system/admin")}
          style={{
            marginBottom: "20px",
            background: "#1A94FF",
            border: "none",
            borderRadius: "8px",
          }}
        >
          Quay về
        </Button>

        <div
          style={{
            background: "#ffffff",
            padding: "24px",
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          }}
        >
          <Row>
            <Col span={12}>
              <h2 style={{ color: "#ff7e5f" }}>Thông tin đơn hàng</h2>
              <p style={{ fontSize: "16px", margin: 0 }}>
                Mã đơn:{" "}
                <strong style={{ color: "#ff7e5f" }}>
                  {orderDetails?._id}
                </strong>
              </p>
            </Col>
            <Col span={12} style={{ textAlign: "right" }}>
              <span
                style={{
                  fontSize: "18px",
                  color: orderContant.status[orderDetails?.orderStatus]?.color,
                  backgroundColor:
                    orderContant.status[orderDetails?.orderStatus]
                      ?.backgroundColor,
                  borderRadius: "5px",
                  padding: "5px",
                }}
              >
                {orderContant.status[orderDetails?.orderStatus]?.label}
              </span>
            </Col>
          </Row>

          <hr style={{ margin: "20px 0", borderColor: "#dee2e6" }} />

          <Row gutter={[16, 16]}>
            <Col span={12}>
              <h3 style={{ color: "#495057" }}>Thông tin khách hàng</h3>
              <p>
                <strong>Họ và tên:</strong>{" "}
                {orderDetails?.shippingAddress?.fullName}
              </p>
              <p>
                <strong>Địa chỉ:</strong>{" "}
                {orderDetails?.shippingAddress?.address}
              </p>
              <p>
                <strong>Số điện thoại:</strong> 0
                {orderDetails?.shippingAddress?.phone}
              </p>
            </Col>
            <Col span={12}>
              <h3 style={{ color: "#495057", textAlign: "right" }}>
                Phương thức thanh toán
              </h3>
              <p style={{ textAlign: "right" }}>
                {orderContant.payment[orderDetails?.paymentMethod]}
              </p>
              <h3 style={{ color: "#495057", textAlign: "right" }}>
                Ngày đặt hàng
              </h3>
              <p style={{ textAlign: "right" }}>
                {formatDate(orderDetails?.createdAt)}
              </p>
            </Col>
          </Row>

          <hr style={{ margin: "20px 0", borderColor: "#dee2e6" }} />

          <Row>
            <Col span={12}>
              <h3 style={{ color: "#495057" }}>Thay đổi trạng thái đơn hàng</h3>
              <Select
                defaultValue={orderDetails?.isDelivered || "1"}
                style={{
                  width: "100%",
                  marginTop: "10px",
                  borderRadius: "8px",
                }}
                options={[
                  { value: "1", label: "Chờ xác nhận" },
                  { value: "2", label: "Đã xác nhận" },
                  { value: "3", label: "Đang vận chuyển" },
                  { value: "4", label: "Đã giao hàng" },
                ]}
                onChange={handleStatusChange}
              />
            </Col>
          </Row>

          <hr style={{ margin: "20px 0", borderColor: "#dee2e6" }} />

          <h3 style={{ color: "#495057" }}>Thông tin sản phẩm</h3>
          <Table
            style={{
              marginTop: "20px",
              background: "#fff",
              borderRadius: "12px",
              overflow: "hidden",
            }}
            bordered
            dataSource={dataSource}
            columns={columns}
            pagination={false}
          />
          <div style={{ textAlign: "right", marginTop: "20px" }}>
            <strong style={{ color: "#6c757d" }}>Tổng tiền:</strong>{" "}
            <span
              style={{
                fontSize: "20px",
                fontWeight: "bold",
                color: "#ff7e5f",
              }}
            >
              {converPrice(orderDetails?.totalPrice)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOrderDetails;
