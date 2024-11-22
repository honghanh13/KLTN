import React, { useEffect, useState } from "react";
import { Layout, Menu, Card, Form, Input, Button, message } from "antd";
import { useNavigate } from "react-router-dom";
import { UserOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import * as UserService from "../../Service/UserService";
import { useMutationHooks } from "../../hooks/useMutationHook";
import { updateUser } from "../../redux/slides/userSlide";

const { Sider, Content } = Layout;

const UserInfoUpdate = () => {
  const user = useSelector((state) => state?.user);
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false); // Trạng thái chỉnh sửa
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const dispatch = useDispatch();

  console.log("user",user?.name)

  useEffect(() => {
    setEmail(user?.email || "");
    setName(user?.name || "");
    setPhone(user?.phone || "");
    setAddress(user?.address || "");
  }, [user]);
  const handleOnchangeName = (e) => {
    setName(e.target.value);
  };
  const handleOnchangePhone = (e) => {
    setPhone(e.target.value);
  };
  const handleOnchangeAddress = (e) => {
    setAddress(e.target.value);
  };

  const mutation = useMutationHooks((data) => {
    const { id, access_token, ...rests } = data;
    UserService.UpdateUser(id, rests, access_token);
  });

  const { data, isSuccess, isError } = mutation;

  const handleGetDetailUser = async (id, token) => {
    const res = await UserService.getDetailsUser(id, token);
    dispatch(updateUser({ ...res?.data, access_token: token }));
  };

  useEffect(() => {
    if (isSuccess) {
      message.destroy();
      message.success("Cập nhật thành công");
      handleGetDetailUser(user?.id, user?.access_token);
    } else if (isError) {
      message.destroy();
      message.error("Có lỗi xảy ra!");
    }
  }, [isSuccess, isError]);
  const handleSaveClick = () => {
    mutation.mutate({
      id: user?.id,
      name,
      phone,
      address,
      access_token: user?.access_token,
    });
    setIsEditing(false);
  };

  const handleEditClick = () => {
    setIsEditing(true);
    message.destroy();
  };

  return (
    <Layout
      style={{
        height: "100vh",
        backgroundColor: "#f0f2f5",
      }}
    >
      {/* Sidebar */}
      <Sider
        style={{
          background: "#fff",
          borderRight: "1px solid #f0f0f0",
        }}
        width={220}
      >
        <Menu mode="inline" selectedKeys={"1"} defaultSelectedKeys={"1"}>
          <Menu.Item key="1" icon={<UserOutlined />}>
            Thông Tin Tài Khoản
          </Menu.Item>
          <Menu.Item
            key="2"
            onClick={() => navigate("/my-order")}
            icon={<ShoppingCartOutlined />}
          >
            Đơn Mua
          </Menu.Item>
        </Menu>
      </Sider>

      {/* Content */}
      <Layout
        style={{
          padding: "24px",
          backgroundColor: "#f0f2f5",
        }}
      >
        <Card
          style={{
            borderRadius: 10,
            boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
          }}
        >
          <h2
            style={{
              textAlign: "center",
              fontWeight: "bold",
              marginBottom: 20,
            }}
          >
            Cập Nhật Thông Tin Người Dùng
          </h2>
          <Form action="" layout="vertical">
            <Form.Item
              label="Email"
              rules={[{ type: "email", message: "Email không hợp lệ!" }]}
            >
              <Input
                disabled
                onChange={handleOnchangeName}
                placeholder="Nhập Email của bạn"
                value={email}
              />
            </Form.Item>

            <Form.Item
              label="Họ và Tên"
              rules={[{ required: true, message: "Vui lòng nhập họ và tên!" }]}
            >
              <Input
                placeholder="Nhập họ và tên"
                value={name}
                onChange={handleOnchangeName}
                disabled={!isEditing} // Vô hiệu hóa khi không chỉnh sửa
              />
            </Form.Item>

            <Form.Item
              label="Số Điện Thoại"
              rules={[
                { required: true, message: "Vui lòng nhập số điện thoại!" },
                {
                  pattern: /^[0-9]{10,11}$/,
                  message: "Số điện thoại không hợp lệ!",
                },
              ]}
            >
              <Input
                placeholder="Nhập số điện thoại"
                value={phone}
                onChange={handleOnchangePhone}
                disabled={!isEditing}
              />
            </Form.Item>

            <Form.Item
              label="Địa Chỉ"
              rules={[{ required: true, message: "Vui lòng nhập địa chỉ!" }]}
            >
              <Input.TextArea
                placeholder="Nhập địa chỉ"
                rows={3}
                value={address}
                onChange={handleOnchangeAddress}
                disabled={!isEditing} // Vô hiệu hóa khi không chỉnh sửa
              />
            </Form.Item>

            {/* Nút hành động */}
            <Form.Item>
              <div
                style={{
                  display: "flex",
                  justifyContent: isEditing ? "space-between" : "center",
                }}
              >
                {isEditing ? (
                  <>
                    <Button type="primary" onClick={handleSaveClick}>
                      Lưu Thông Tin
                    </Button>
                    <Button
                      onClick={() => setIsEditing(false)}
                    >
                      Hủy
                    </Button>
                  </>
                ) : (
                  <Button type="primary" onClick={handleEditClick}>
                    Cập Nhật
                  </Button>
                )}
              </div>
            </Form.Item>
          </Form>
        </Card>
      </Layout>
    </Layout>
  );
};

export default UserInfoUpdate;
