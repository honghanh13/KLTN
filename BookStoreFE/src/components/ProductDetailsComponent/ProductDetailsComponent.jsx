import { Col, Image, InputNumber, message, Rate, Row } from "antd";
import React, { useEffect, useState } from "react";

import {
  WrapperAddressProduct,
  WrapperInputNumber,
  WrapperPriceProduct,
  WrapperPriceTextProduct,
  WrapperQualityProduct,
  WrapperStyleColImage,
  WrapperStyleImageSmall,
  WrapperStyleNameProduct,
  WrapperStyleTextSell,
} from "./style";
import { StarFilled, PlusOutlined, MinusOutlined } from "@ant-design/icons";
import ButtonComponent from "../ButtonComponent/ButtonComponent";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import * as ProductService from "../../Service/ProductService";
import { useQuery } from "@tanstack/react-query";
import { converPrice } from "../../utils";
import { addOrderProduct } from "../../redux/slides/orderSlide";
const ProductDetailsComponent = ({ id }) => {
  const navigate = useNavigate();
  const [numProduct, setNumProduct] = useState(1);
  const user = useSelector((state) => state?.user);
  const order = useSelector((state) => state.order);
  const [errorLimitOrder, setErrorLimitOrder] = useState(false);
  const location = useLocation();
  const dispatch = useDispatch();

  const onChange = (value) => {
    setNumProduct(Number(value));
  };

  useEffect(() => {
    const redirectURL = localStorage.getItem("redirectURL");
    if (redirectURL) {
      localStorage.removeItem("redirectURL");
      navigate(redirectURL);
    }
  }, []);

  const fetchGetDetailsProduct = async () => {
    const res = await ProductService.getDetailsProduct(id);
    return res?.data;
  };
  const { isLoading, data: productDetails } = useQuery({
    queryKey: ["product-details", id],
    queryFn: fetchGetDetailsProduct,
    enabled: !!id,
  });

  useEffect(() => {
    const orderRedux = order?.orderItems?.find(
      (item) => item.product === productDetails?._id
    );
    if (
      orderRedux?.amount + numProduct <= orderRedux?.countInstock ||
      (!orderRedux && productDetails?.countInStock > 0)
    ) {
      setErrorLimitOrder(false);
    } else if (productDetails?.countInStock === 0) {
      setErrorLimitOrder(true);
    }
  }, [numProduct]);

  const handleAddOrderProduct = () => {
    if (!user?.id) {
      localStorage.setItem("redirectURL", location.pathname);
      navigate("/sign-in", { state: location?.pathname });
    } else {
      const orderRedux = order?.orderItems?.find(
        (item) => item.product === productDetails?._id
      );
      if (
        orderRedux?.amount + numProduct <= orderRedux?.countInstock ||
        (!orderRedux && productDetails?.countInStock > 0)
      ) {
        dispatch(
          addOrderProduct({
            orderItem: {
              name: productDetails?.name,
              amount: numProduct,
              image: productDetails?.image,
              price: productDetails?.price,
              product: productDetails?._id,
              discount: productDetails?.discount,
              countInstock: productDetails?.countInStock,
            },
          })
        );
        message.destroy();
        message
          .open({
            type: "loading",
            content: "Loading...",
            duration: 0.75,
          })
          .then(() => message.success("Thêm giỏ hàng thành công", 1.5));
      } else {
        message.destroy();
        message.error("Có lỗi khi thêm vào giỏ hàng", 1.5);
      }
    }
  };

  console.log("productDetails", productDetails);

  const discountedPrice =
    productDetails?.price * (1 - productDetails?.discount / 100);

  return (
    <Row style={{ padding: "16px", background: " #fff", borderRadius: "4px" }}>
      <Col
        span={10}
        style={{ borderRight: "1px solid #e5e5e5", paddingRight: "8px" }}
      >
        <Image src={productDetails?.image} alt="image product" preview={true} />
        <Row style={{ paddingTop: "10px", justifyContent: "space-between" }}>
          <WrapperStyleColImage span={4}>
            <WrapperStyleImageSmall
              src={productDetails?.image}
              alt="image small"
              preview={false}
            />
          </WrapperStyleColImage>
          <WrapperStyleColImage span={4}>
            <WrapperStyleImageSmall
              src={productDetails?.image}
              alt="image small"
              preview={false}
            />
          </WrapperStyleColImage>
          <WrapperStyleColImage span={4}>
            <WrapperStyleImageSmall
              src={productDetails?.image}
              alt="image small"
              preview={false}
            />
          </WrapperStyleColImage>
          <WrapperStyleColImage span={4}>
            <WrapperStyleImageSmall
              src={productDetails?.image}
              alt="image small"
              preview={false}
            />
          </WrapperStyleColImage>
          <WrapperStyleColImage span={4}>
            <WrapperStyleImageSmall
              src={productDetails?.image}
              alt="image small"
              preview={false}
            />
          </WrapperStyleColImage>
          <WrapperStyleColImage span={4}>
            <WrapperStyleImageSmall
              src={productDetails?.image}
              alt="image small"
              preview={false}
            />
          </WrapperStyleColImage>
        </Row>
      </Col>
      <Col span={14} style={{ paddingLeft: "10px" }}>
        <WrapperStyleNameProduct>
          {productDetails?.name}
        </WrapperStyleNameProduct>
        <div>
          <Rate disabled value={productDetails?.rating} />
          <WrapperStyleTextSell>
            {" "}
            | Đã bán {productDetails?.selled}+
          </WrapperStyleTextSell>
        </div>
        <WrapperPriceProduct>
          <WrapperPriceTextProduct>
            {converPrice(discountedPrice)}{" "}
            <span style={{ color: "#ccc", textDecorationLine: "line-through" }}>
              {converPrice(productDetails?.price)}
            </span>{" "}
            <span style={{ fontSize: "16px" }}>
              Đã giảm {productDetails?.discount}%
            </span>
          </WrapperPriceTextProduct>
        </WrapperPriceProduct>
        {user?.address ? (
          <WrapperAddressProduct>
            <span> Giao đến </span>
            <span className="address"> {user?.address}</span>
            <span
              className="change-address"
              style={{ cursor: "pointer" }}
              onClick={() => navigate("/profile")}
            >
              {" "}
              - Đổi địa chỉ
            </span>
          </WrapperAddressProduct>
        ) : (
          <></>
        )}

        <div
          style={{
            margin: "10px 0 20px",
            padding: "10px 0",
            borderTop: "1px solid #e5e5e5",
            borderBottom: "1px solid #e5e5e55",
          }}
        >
          <p>Mô tả: {productDetails?.description}</p>
        </div>
        <div
          style={{
            margin: "10px 0 20px",
            padding: "10px 0",
            borderTop: "1px solid #e5e5e5",
            borderBottom: "1px solid #e5e5e55",
          }}
        >
          <div style={{ marginBottom: "10px" }}>Số lượng</div>
          <WrapperQualityProduct>
            <button
              style={{ border: "none", background: "#fff", cursor: "pointer" }}
              onClick={() => {
                if (numProduct > 1) {
                  setNumProduct((prev) => prev - 1);
                }
              }}
            >
              <MinusOutlined
                style={{ color: "#000", fontSize: "20px", background: "#fff" }}
                size="10"
              />
            </button>
            <WrapperInputNumber
              min={1}
              max={productDetails?.countInStock}
              value={numProduct}
              onChange={onChange}
            />
            <button
              style={{ border: "none", background: "#fff", cursor: "pointer" }}
              onClick={() => {
                if (numProduct < productDetails?.countInStock) {
                  setNumProduct((prev) => prev + 1);
                }
              }}
            >
              <PlusOutlined
                style={{ color: "#000", fontSize: "20px" }}
                size="10"
              />
            </button>
          </WrapperQualityProduct>

          <div style={{ marginTop: "10px" }}>
            Còn lại {productDetails?.countInStock} sản phẩm
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <ButtonComponent
            bordered={false}
            size={40}
            onClick={handleAddOrderProduct}
            styleButton={{
              background: "rgb(255, 57, 69",
              height: "48px",
              width: "220px",
              border: "none",
              borderRadius: "4px",
            }}
            textButton={"Chọn mua"}
            styleTextButton={{
              color: "#fff",
              fontSize: "15px",
              fontweight: "700",
            }}
          ></ButtonComponent>
          {/* <ButtonComponent
            bordered={false}
            size={40}
            styleButton={{
              background: "#fff",
              height: "48px",
              width: "220px",
              border: "1px solid rgb(13, 92, 182)",
              borderRadius: "4px",
            }}
            textButton={"Mua trả sau"}
            styleTextButton={{ color: "rgb(13, 92, 182", fontSize: "15px" }}
          ></ButtonComponent> */}
        </div>
      </Col>
    </Row>
  );
};
export default ProductDetailsComponent;
