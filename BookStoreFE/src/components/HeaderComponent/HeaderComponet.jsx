import { Badge, Button, Col, Dropdown, Space } from "antd";
import React from "react";
import {
  WrapperHeader,
  WrapperHeaderAccout,
  WrappertextHeader,
  WrappertextHeaderSmall,
} from "./Style";
import {
  UserOutlined,
  CaretDownOutlined,
  ShoppingCartOutlined,
  DownOutlined,
} from "@ant-design/icons";
import ButtonInputSeach from "../ButtonInputSeach/ButtonInputSeach";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import * as UserService from "../../Service/UserService";
import { resetUser } from "../../redux/slides/userSlide";

const HeaderComponent = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const order = useSelector((state) => state.order.orderItems);
  const handleLogout = async () => {
    await UserService.logoutUser();
    dispatch(resetUser());
    handleNavigatelogin();
  };
  const handleNavigatelogin = () => {
    navigate("/sign-in");
  };
  const items = [
    {
      key: "1",
      label: (
        <Link
          to={'/profile'}
        >
          Thông tin cá nhân
        </Link>
      ),
    },
    {
      key: "2",
      label: (
        <Link
          
          href="#"
        >
          Quản trị hệ thống
        </Link>
      ),
    },
    {
      key: "3",
      label: <Link onClick={handleLogout}>Đăng xuất</Link>,
    },
  ];
  const user = useSelector((state) => state?.user);
  return (
    <div
      style={{
        width: "100%",
        background: "rgb(26, 148,255)",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <WrapperHeader>
        <Col span={5}>
          
          <WrappertextHeader style={{ cursor: "pointer" }}  onClick={() => navigate("/")}>
            Văn phòng phẩm
          </WrappertextHeader>
        </Col>
        <Col span={13}>
          <ButtonInputSeach
            size="large"
            bordered={false}
            textButton="Tìm kiếm"
            placeholder="Tìm kiếm"

            // onSearch={onSearch}
          />
        </Col>
        <Col
          span={6}
          style={{ display: "flex", gap: "20px", alignItems: "center" }}
        >
          <WrapperHeaderAccout>
            <UserOutlined style={{ fontSize: "30px" }} />
            <div>
              {user?.name !== "" ? (
                <>{user?.name}</>
              ) : (
                <WrappertextHeaderSmall
                  style={{ cursor: "pointer" }}
                  onClick={() => navigate("/sign-in")}
                >
                  Đăng kí/Đăng nhập
                </WrappertextHeaderSmall>
              )}
              {user?.name !== "" ? (
                <div>
                  <Dropdown
                    menu={{
                      items,
                    }}
                  >
                    <a onClick={(e) => e.preventDefault()}>
                      <Space style={{ color: "#fff" }}>
                        Tài khoản
                        <DownOutlined />
                      </Space>
                    </a>
                  </Dropdown>
                </div>
              ) : (
                <></>
              )}
            </div>
          </WrapperHeaderAccout>
          <div>
            <Badge count={order?.length} size={"smaill"}>
              <ShoppingCartOutlined
                onClick={() => navigate("/orders")}
                style={{ fontSize: "30px", color: "#fff", cursor: "pointer" }}
              />
            </Badge>
            <WrappertextHeaderSmall
              style={{ cursor: "pointer" }}
              onClick={() => navigate("/orders")}
            >
              Giỏ hàng
            </WrappertextHeaderSmall>
          </div>
        </Col>
      </WrapperHeader>
    </div>
  );
};
export default HeaderComponent;
