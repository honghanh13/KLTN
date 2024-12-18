import React, { useEffect, useState } from "react";
import {
  WapperContainerLeft,
  WapperContainerRight,
  WapperTextLight,
} from "./style";
import InputForm from "../../components/InputForm/InputForm";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import imageLogo from "../../assets/images/logo_log_in.png";
import { updateUser } from "../../redux/slides/userSlide";
import * as UserService from "../../Service/UserService";
import { useMutationHooks } from "../../hooks/useMutationHook";

import { Image, Input, message } from "antd";
import {
  EyeFilled,
  EyeInvisibleFilled,
  EyeInvisibleOutlined,
  EyeTwoTone,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
const SignUpPage = () => {
 
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  const navigate = useNavigate();
  const handleOnchangeEmail = (e) => setEmail(e.target.value);
  const handleOnchangeUsername = (e) => setName(e.target.value);
  const handleOnchangePassword = (e) => setPassword(e.target.value);
  const handleOnchangeConfirmPassword = (e) =>
    setConfirmPassword(e.target.value);
  const handleOnchangePhone = (e) => setPhone(e.target.value);

  const mutation = useMutationHooks((data) => UserService.signupUser(data));

  const handleSignUp = (e) => {
    e.preventDefault();
    mutation.mutate({ email, name, password, confirmPassword, phone });
  };
  const { data, isSuccess, isError, error } = mutation;

  useEffect(() => {
    if (isSuccess && data?.status === "OK") {
      message.destroy();
      message
        .open({ type: "loading", content: "Loading...", duration: 1 })
        .then(() => {
          setTimeout(() => {
            message.success("Đăng ký thành công", 1.5);
            message.info("Vui lòng đăng nhập", 1.5);
            navigate("/sign-in");
          }, 1000);
        });
    } else if (isError || (data && data.status === "ERR")) {
      message.destroy();
      message.error(data?.message || error?.message || "Có lỗi khi đăng ký");
    }
  }, [isSuccess, isError, data, error, navigate]);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgb(0,0,0,0.53)",
        height: "100vh",
      }}
    >
      <div
        style={{
          width: "800px",
          height: "445px",
          borderRadius: "6px",
          background: "#fff",
          display: "flex",
        }}
      >
        <WapperContainerLeft>
          <h1>Xin chào </h1>
          <p style={{ paddingTop: "10px", fontSize: 14 }}>
            Đăng ký tài khoản{" "}
          </p>
          <Input
            value={name}
            onChange={handleOnchangeUsername}
            style={{ marginBottom: "10px" }}
            placeholder="Full name"
          />
          <Input
            value={phone}
            onChange={handleOnchangePhone}
            style={{ marginBottom: "10px" }}
            placeholder="Phone number"
          />

          <Input
            style={{ marginBottom: "10px" }}
            placeholder="abc@gmail.com"
            value={email}
            onChange={handleOnchangeEmail}
          />

          <div style={{ position: "relative" }}>
              <Input.Password
              placeholder="Password"
              value={password}
              onChange={handleOnchangePassword}
              style={{ marginBottom: "10px" }}
            />
          </div>
          <div style={{ position: "relative" }}>
        
            <Input.Password
              value={confirmPassword}
              onChange={handleOnchangeConfirmPassword}
              placeholder="Confirm Password"
            />
          </div>

          <ButtonComponent
            bordered={false}
            size={40}
            styleButton={{
              background: "rgb(255, 57, 69",
              height: "48px",
              width: "100%",
              border: "none",
              borderRadius: "4px",
              margin: "26px 0 10px",
            }}
            onClick={handleSignUp}
            textButton={"Đăng ký "}
            styleTextButton={{
              color: "#fff",
              fontSize: "15px",
              fontweight: "700",
            }}
          ></ButtonComponent>

          <p style={{ fontSize: 12 }}>
            Bạn có tài khoản?{" "}
            <span style={{ cursor: "pointer" }}>
              <WapperTextLight onClick={() => navigate("/sign-in")}>
                Đăng nhập
              </WapperTextLight>
            </span>
          </p>
        </WapperContainerLeft>
        <WapperContainerRight>
          <Image
            src={imageLogo}
            preview={false}
            alt="iamge-logo"
            height="203px"
            width="203px"
          />
          <h1>Văn phòng phẩm DoLy</h1>
        </WapperContainerRight>
      </div>
    </div>
  );
};
export default SignUpPage;
