import { Badge, Col } from "antd";
import React from "react";
import { WrapperHeader, WrapperHeaderAccout, WrappertextHeader, WrappertextHeaderSmall } from "./Style";
import { UserOutlined, CaretDownOutlined,ShoppingCartOutlined } from "@ant-design/icons";
import ButtonInputSeach from "../ButtonInputSeach/ButtonInputSeach";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import * as UserService from "../../Service/UserService";
import { resetUser } from "../../redux/slides/userSlide";

const HeaderComponent = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    await UserService.logoutUser();
    dispatch(resetUser());
    handleNavigatelogin();
  };
  const handleNavigatelogin = () => {
    navigate("/sign-in");
  };
  const user = useSelector((state) => state?.user)
  return (
    <div style={{width: '100%', background: 'rgb(26, 148,255)', display:'flex', justifyContent:'center'}}>
      <WrapperHeader>
        <Col span={5}>
          <WrappertextHeader onClick={() => navigate('/')}>Văn phòng phẩm</WrappertextHeader>
        </Col>
        <Col span={13}>
          <ButtonInputSeach
            size="large"
            bordered={false}
            textButton ="Tìm kiếm"
            placeholder="input search text"
            
            // onSearch={onSearch}
          />
        </Col>
        <Col span={6} style={{display:'flex', gap:'20px', alignItems:'center'}}>
          <WrapperHeaderAccout>
            <UserOutlined style={{ fontSize: "30px" }} />
            <div>
              {user?.name != '' ? (<>{user?.name}</>) : ( <WrappertextHeaderSmall onClick={() => navigate("/sign-in")}>Đăng kí/Đăng nhập</WrappertextHeaderSmall>) }
             
              <div>
                <WrappertextHeaderSmall>Tài khoản</WrappertextHeaderSmall>
                <CaretDownOutlined />
                <WrappertextHeaderSmall onClick={handleLogout}>Đăng xuất</WrappertextHeaderSmall>

              </div>
            </div>
          </WrapperHeaderAccout>
          <div>
            <Badge count={5} size={"smaill"}> 
              <ShoppingCartOutlined style={{ fontSize: "30px", color:'#fff' }}/>
            </Badge>
            <WrappertextHeaderSmall>Giỏ hàng</WrappertextHeaderSmall>
          </div>
        </Col>
      </WrapperHeader>
    </div>
  );
};
export default HeaderComponent;
