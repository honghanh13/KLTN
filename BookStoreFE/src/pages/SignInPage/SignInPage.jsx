import React, { useEffect, useState } from "react";
import {
  WapperContainerLeft,
  WapperContainerRight,
  WapperTextLight,
} from "./style";
import InputForm from "../../components/InputForm/InputForm";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import imageLogo from "../../assets/images/logo_log_in.png";
import { Image, message } from "antd";
import { EyeFilled, EyeInvisibleFilled } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useMutationHooks } from "../../hooks/useMutationHook";
import * as UserService from "../../Service/UserService";
import { useDispatch } from "react-redux";
import { updateUser } from "../../redux/slides/userSlide";

const SignInPage = () => {
  const [isShowPassword, setIsShowPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState(null);
  const mutation = useMutationHooks((data) => UserService.loginUser(data));
  const { data, isSuccess, isError, error } = mutation;
console.log('data',data)
  useEffect(() => {
    if (isSuccess && data?.status === "OK") {
      message.destroy();
      message.loading("Loading...", 0.75).then(() => {
        message.success("Đăng nhập thành công", 1.5);
        const redirectURL = localStorage.getItem("redirectURL");
        if (redirectURL) {
          localStorage.removeItem("redirectURL");
          navigate(redirectURL);
        } else {
          navigate("/");
        }
      });
      localStorage.setItem("access_token", JSON.stringify(data?.access_token));
      if (data?.access_token) {
        const decoded = jwtDecode(data?.access_token);

        if (decoded?.id) {
          handleGetDetailUser(decoded?.id, data?.access_token, data?.refresh_token);
        }
      }
    } else if (isError || (isSuccess && data?.status === "ERR")) {
      setLoginError(data?.message || error?.message || "Có lỗi khi đăng nhập");
    }
  }, [isSuccess, isError, error, data, navigate]);

  const handleGetDetailUser = async (id, token,refresh_token) => {
    const res = await UserService.getDetailsUser(id, token);
    dispatch(updateUser({ ...res?.data, access_token: token ,refreshToken: refresh_token  }));
  };

  const handleSignIn = (e) => {
    e.preventDefault();
    setLoginError(null);
    mutation.mutate({ email, password });
  };

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
          <p style={{ paddingTop: "10px" }}>Đăng nhập vào tạo tài khoản </p>
          <InputForm
            style={{ marginBottom: "10px" }}
            placeholder="abc@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <div style={{ position: "relative" }}>
            <span
              style={{
                zIndex: 10,
                position: "absolute",
                top: "4px",
                right: "8px",
              }}
            >
              {isShowPassword ? <EyeFilled /> : <EyeInvisibleFilled />}
            </span>
            <InputForm
              placeholder="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type={isShowPassword ? "text" : "password"}
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
            onClick={handleSignIn}
            textButton={"Đăng nhập "}
            styleTextButton={{
              color: "#fff",
              fontSize: "15px",
              fontweight: "700",
            }}
          ></ButtonComponent>
          <p>
            <WapperTextLight>Quên mật khẩu</WapperTextLight>
          </p>
          <p>
            Chưa có tài khoản?{" "}
            <span>
              <WapperTextLight onClick={() => navigate("/sign-up")}>
                Tạo tài khoản
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
          <h4>Mua văn phòng phẩm</h4>
        </WapperContainerRight>
      </div>
    </div>
  );
};
export default SignInPage;
