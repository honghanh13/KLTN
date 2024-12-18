import React, { useEffect, useMemo, useState } from "react";
import { Radio, Card, Button, message } from "antd";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useMutationHooks } from "../../hooks/useMutationHook";
import * as OrderService from "../../Service/OrderService";
import { converPrice } from "../../utils";
import { removeAllOrderProduct } from "../../redux/slides/orderSlide";
const CheckoutPage = () => {
  const order = useSelector((state) => state.order);
  const user = useSelector((state) => state.user);
  const { state } = useLocation(); // Lấy dữ liệu từ ProductDetail
  const selectedOrderItems =
    state?.orderItemsSelected || order?.orderItemsSelected;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [payment, setPayment] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);

  const [deliveryMethod, setDeliveryMethod] = useState("");

  const handleDeliveryCheckboxChange = (e) => {
    setDeliveryMethod(e.target.id);
  };

  const handleCheckboxChange = (e) => {
    setPayment(e.target.id);
  };

  const priceMemo = useMemo(() => {
    const result = order?.orderItemsSelected?.reduce((total, cur) => {
      return total + cur.price * cur.amount;
    }, 0);
    return result;
  }, [order]);
  const priceDiscountMemo = useMemo(() => {
    if (isNaN(priceMemo) || priceMemo === 0) return 0;
    if (priceMemo > 1000000 && priceMemo <= 2000000) {
      return 100000;
    } else if (priceMemo > 2000000 && priceMemo <= 3000000) {
      return 250000;
    } else if (priceMemo > 3000000) {
      return 350000;
    } else {
      return 0;
    }
  }, [priceMemo]);

  const diliveryPriceMemo = useMemo(() => {
    if (isNaN(priceMemo)) return 0;
    if (deliveryMethod === "fast") {
      return priceMemo > 100000 ? 10000 : 20000;
    } else if (deliveryMethod === "gojek") {
      return 15000;
    }
    return 0;
  }, [priceMemo, deliveryMethod]);

  const priceCoupon = useMemo(() => {
    if (discountAmount > 0) {
      return priceMemo * (discountAmount / 100);
    }
    return 0;
  }, [priceMemo, discountAmount]);

  const totalPriceMemo = useMemo(() => {
    const totalPrice =
      priceMemo - priceDiscountMemo + diliveryPriceMemo - priceCoupon;
    return isNaN(totalPrice) ? 0 : totalPrice;
  }, [priceMemo, priceDiscountMemo, diliveryPriceMemo, priceCoupon]);
  console.log("Order Items Selected:", order?.orderItemsSelected);
  const handleAddOrder = () => {
    if (!deliveryMethod) {
      message.destroy();
      message.info("Chưa chọn phương thức giao hàng");
      return;
    }
    if (!payment) {
      message.destroy();
      message.info("Chưa chọn phương thức thanh toán");
      return;
    }
    if (
      user?.access_token &&
      order &&
      user?.address &&
      priceMemo &&
      user?.id
    ) {

      mutationAddOrder.mutate({
        token: user?.access_token,
        orderItems: order?.orderItemsSelected,
        fullName: user?.name,
        address: user?.address,
        phone: user?.phone,
        user: user?.id,
        email: user?.email,
        paymentMethod: payment,
        itemsPrice: priceMemo,
        shippingPrice: diliveryPriceMemo,
        totalPrice: totalPriceMemo,
        discountPrice: Number(priceDiscountMemo),
      });
    }
  };

  const mutationAddOrder = useMutationHooks((data) => {
    const { token, ...rests } = data;
    const res = OrderService.createOrder({ ...rests }, token);
    return res;
  });

  const { data: dataAdd, isSuccess, isError } = mutationAddOrder;

  useEffect(() => {
    if (isSuccess && dataAdd?.status === "OK") {
      const arrayOrdered = [];
      order?.orderItemsSelected?.forEach((element) => {
        arrayOrdered.push(element.product);
      });

      dispatch(removeAllOrderProduct({ listChecked: arrayOrdered }));
      message.destroy();
      message.success("Đặt hàng thành công");
      navigate("/order-success", {
        state: {
          orderId: dataAdd?.orderId,
          deliveryMethod,
          payment,
          fullName: user?.name,
          address: user?.address,
          phone: user?.phone,
          email: user?.email,
          orders: order?.orderItemsSelected,
          totalPriceMemo,
        },
      });
    } else if (isError) {
      message.destroy();
      message.error("Có lỗi khi thêm xóa tất cả sản phẩm !");
    }
  }, [isSuccess, isError]);

  return (
    <div style={{ padding: 20 }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <h2>Thanh toán</h2>
      </div>

      {/* Main Content */}
      <div style={{ display: "flex", gap: 20 }}>
        {/* Left Section */}
        <div style={{ flex: 1 }}>
          {/* Delivery Method */}
          <Card title="Chọn phương thức giao hàng" style={{ marginBottom: 20 }}>
            <Radio.Group
              style={{ display: "flex", flexDirection: "column", gap: 10 }}
            >
              <Radio
                id="fast"
                onChange={handleDeliveryCheckboxChange}
                checked={deliveryMethod === "fast"}
                value="FAST"
              >
                J&T Express
              </Radio>
              <Radio
                onChange={handleDeliveryCheckboxChange}
                checked={deliveryMethod === "gojek"}
                value="GO_JEK"
                id="gojek"
              >
                Giao hàng tiết kiệm
              </Radio>
            </Radio.Group>
          </Card>

          {/* Payment Method */}
          <Card title="Chọn phương thức thanh toán">
            <Radio.Group
              style={{ display: "flex", flexDirection: "column", gap: 10 }}
            >
              <Radio
                onChange={handleCheckboxChange}
                checked={payment === "paymentincash"}
                id="paymentincash"
                value="COD"
              >
                Thanh toán tiền mặt khi nhận hàng
              </Radio>
            </Radio.Group>
          </Card>
        </div>

        {/* Right Section */}
        <div style={{ width: "50%" }}>
          <Card
            title={`Địa chỉ: ${user?.address}, Số điện thoại: ${user?.phone}`}
            extra={<Link to={"/profile"}>Thay đổi</Link>}
            style={{ marginBottom: 20 }}
          >
            <div style={{ borderBottom: "1px soild #ccc" }}>
              {order?.orderItemsSelected?.map((order, index) => {
                const formattedIndex = (index + 1).toString().padStart(2, "0");
                return (
                  <li key={index}>
                    <span
                      className="checkout__total__products-name"
                      style={{
                        whiteSpace: "nowrap",
                        display: "inline-block",
                        maxWidth: "600px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {`${formattedIndex}. ${order?.name}`}
                    </span>

                    <span style={{ float: "right" }}>
                      {converPrice(order?.price)}
                    </span>
                  </li>
                );
              })}
              <hr />{" "}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Tạm tính</span>
              <span>{converPrice(priceMemo)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Giảm giá</span>
              <span>{converPrice(priceDiscountMemo)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Phí giao hàng</span>
              <span>{converPrice(diliveryPriceMemo)}</span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontWeight: "bold",
                fontSize: 16,
                marginTop: 10,
              }}
            >
              <span>Tổng tiền</span>
              <span>{converPrice(totalPriceMemo)}</span>
            </div>
            <p style={{ marginTop: 10, fontSize: 12 }}>
              (Đã bao gồm VAT)
            </p>
          </Card>

          <Button
            type="primary"
            onClick={() => handleAddOrder()}
            style={{ width: "100%", height: 50, fontSize: 16 }}
          >
            Đặt hàng
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
