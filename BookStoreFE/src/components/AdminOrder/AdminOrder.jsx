import React, { useState } from "react";
import TableComponent from "../TableComponent/TableComponent";
import { WrapperHeader } from "../AdminProduct/style";
import { useSelector } from "react-redux";
import * as OrderService from "../../Service/OrderService";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Button } from "antd";
import { Contant } from "../../contant";
import { converPrice } from "../../utils";

const AdminOrder = () => {
  const user = useSelector((state) => state?.user);
  const [rowSelected, setRowSelected] = useState(false);
  const orderContant = Contant();
  const navigate = useNavigate();

  const getAllOrder = async () => {
    const res = await OrderService.getAllOrder();
    return res;
  };

  const queryOrder = useQuery({
    queryKey: ["orders"],
    queryFn: getAllOrder,
  });

  const { isLoading: isLoadingOrder, data: orders } = queryOrder;

  const handleClickNavigate = (id) => {
    navigate(`/system/admin/OrderDetails/${id}`);
  };

  const renderAction = (id) => {
    return (
      <Button onClick={() => handleClickNavigate(id)}>Xem chi tiết</Button>
    );
  };

  const columns = [
    {
      title: "Tên Khách Hàng",
      dataIndex: "fullName",
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
    },

    {
      title: "Trạng Thái Thanh Toán",
      dataIndex: "isPaid",
    },
    {
      title: "Trạng Thái Giao Hàng",
      dataIndex: "isDelivered",
    },
    {
      title: "Phương Thức Thanh Toán",
      dataIndex: "paymentMethod",
    },
    {
      title: "Tổng tiền",
      dataIndex: "totalPrice",
    },
    {
      title: "Chức năng",
      dataIndex: "Action",
      render: (_, record) => renderAction(record.key),
    },
  ];

  const dataTable = orders?.data?.map(
    (order) => ({
      key: order._id,
      fullName: order?.shippingAddress?.fullName,
      phone: order?.shippingAddress?.phone,
      address: `${order.shippingAddress.address}`,
      isPaid: order?.isPaid ? "Đã thanh toán" : "Chưa Thanh toán",
      isDelivered: order?.isDelivered ? "Đã Giao" : "Chưa giao",
      paymentMethod: orderContant.payment[order?.paymentMethod],

      totalPrice: converPrice(order?.totalPrice),
    }),
    console.log("object", orders)
  );

  return (
    <div>
      <WrapperHeader>Quản lý đơn hàng</WrapperHeader>

      <div style={{ marginTop: "20px" }}>
        {/* <Loading isLoading={isLoadingUser}> */}
        <TableComponent
          columns={columns}
          isLoading={isLoadingOrder}
          data={dataTable}
          pagination={{
            pageSize: 8,
            position: ["bottomCenter"], // Đặt nút phân trang ở giữa
          }}
          onRow={(record, rowIndex) => {
            return {
              onClick: (event) => {
                setRowSelected(record._id);
              },
            };
          }}
        />
        {/* </Loading> */}

        {/* <Drawer
      forceRender
      title="Cập nhật người dùng"
      onClose={onClose}
      open={isOpenDrawer}
      loading={loadingDrawer}
      width="40%"
    >
      <Loading isLoading={isLoadingUser}>
        <Form
          form={form}
          name="updateUser"
          labelCol={{
            span: 6,
          }}
          wrapperCol={{
            span: 18,
          }}
          style={{
            maxWidth: 600,
          }}
          onFinish={onUpdateUser}
          autoComplete="on"
        >
          <Form.Item
            label="Họ tên"
            name="name"
            rules={[
              {
                required: true,
                message: "Hãy nhập họ tên!",
              },
            ]}
          >
            <InputComponent
              value={stateUserDetails.name}
              onChange={handleOnchangeDetails}
              name="name"
            />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              {
                required: true,
                message: "Hãy nhập Email!",
              },
            ]}
          >
            <InputComponent
              rows={4}
              value={stateUserDetails.email}
              onChange={handleOnchangeDetails}
              name="email"
            />
          </Form.Item>

          <Form.Item
            label="Điện thoại"
            name="phone"
            rules={[
              {
                required: true,
                message: "Hãy nhập số điện thoại!",
              },
            ]}
          >
            <InputComponent
              value={stateUserDetails.phone}
              onChange={handleOnchangeDetails}
              name="phone"
            />
          </Form.Item>

          <Form.Item
            label="Địa chỉ"
            name="address"
            rules={[
              {
                required: true,
                message: "Hãy nhập địa chỉ!",
              },
            ]}
          >
            <InputComponent
              value={stateUserDetails.address}
              onChange={handleOnchangeDetails}
              name="address"
            />
          </Form.Item>

          <Form.Item label="Quyền">
            <Switch checked={isAdmin} onChange={handleSwitchChange} />
            <Typography.Text style={{ marginLeft: 8 }}>
              {stateUserDetails.isAdmin ? "Admin" : "User "}
            </Typography.Text>
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 20, span: 20 }}>
            <Button
              type="primary"
              htmlType="submit"
              style={{ width: "90%" }}
            >
              Cập nhật
            </Button>
          </Form.Item>
        </Form>
      </Loading>
    </Drawer> */}
      </div>
    </div>
  );
};

export default AdminOrder;
