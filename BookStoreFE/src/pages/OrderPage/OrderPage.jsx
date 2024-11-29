import React, { useEffect, useMemo, useState } from "react";
import { Table, Checkbox, InputNumber, Button, Card, message } from "antd";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  decreaseAmount,
  increaseAmount,
  removeOrderProduct,
  selectedOrder,
} from "../../redux/slides/orderSlide";
const OrderPage = () => {
  const order = useSelector((state) => state.order);
  console.log("order",order)
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [listChecked, setListChecked] = useState([]);
  const onChange = (e) => {
    if (listChecked.includes(e.target.value)) {
      const newListChecked = listChecked.filter(
        (item) => item !== e.target.value
      );
      setListChecked(newListChecked);
    } else {
      setListChecked([...listChecked, e.target.value]);
    }
  };

  const handleOnchangeCheckAll = (e) => {
    if (e.target.checked) {
      const newListChecked = [];
      order?.orderItems?.forEach((item) => {
        newListChecked.push(item?.product);
      });
      setListChecked(newListChecked);
    } else {
      setListChecked([]);
    }
  };

  useEffect(() => {
    dispatch(selectedOrder({ listChecked }));
  }, [listChecked]);

  const handleDeleteOrder = (idProduct) => {
    dispatch(removeOrderProduct({ idProduct }));
  };

  const handleChangeAmount = (type, idProduct, limited) => {
    if (type === "increase") {
      if (!limited) {
        dispatch(increaseAmount({ idProduct }));
      }
    } else {
      if (!limited) {
        dispatch(decreaseAmount({ idProduct }));
      }
    }
  };

  const totalProduct = (price, amount) => price * amount;

  const priceMemo = useMemo(() => {
    const result = order?.orderItemsSelected?.reduce((total, cur) => {
      return total + cur.price * cur.amount;
    }, 0);
    return result;
  }, [order]);

  const priceDiscountMemo = useMemo(() => {
    if (priceMemo > 1000000 && priceMemo < 2000000) {
      return 100000;
    } else if (priceMemo > 2000000 && priceMemo < 3000000) {
      return 250000;
    } else if (priceMemo >= 3000000) {
      return 350000;
    } else {
      return 0;
    }
  }, [priceMemo]);

  const totalPriceMemo = useMemo(() => {
    const totalPrice = priceMemo - priceDiscountMemo;
    return isNaN(Number(totalPrice)) ? 0 : Number(totalPrice);
  }, [priceMemo, priceDiscountMemo]);

  const columns = [
    {
      title: (
        <Checkbox
          checked={listChecked?.length === order?.orderItems?.length}
          onChange={handleOnchangeCheckAll}
        >
          Tất cả
        </Checkbox>
      ),
      dataIndex: "product",
      key: "product",
      render: (text, record) => (
        <Checkbox
          value={record.idProduct}
          checked={listChecked.includes(record.idProduct)}
          onChange={onChange}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <img
            width={60}
              src={record?.image || "https://via.placeholder.com/50"} // Gắn hình ảnh nếu có
              alt="product"
              style={{ marginRight: 10 }}
            />
            <span>{text}</span>
          </div>
        </Checkbox>
      ),
    },
    {
      title: "Đơn giá",
      dataIndex: "price",
      key: "price",
      render: (text) => <span>{text.toLocaleString()} VND</span>,
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
      render: (_, record) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          <Button
            onClick={() =>
              handleChangeAmount(
                "decrease",
                record.idProduct,
                record.quantity <= 1
              )
            }
            disabled={record.quantity <= 1}
          >
            -
          </Button>
          <InputNumber
            min={1}
            value={record.quantity}
            onChange={(value) =>
              dispatch(
                increaseAmount({ idProduct: record.idProduct, amount: value })
              )
            }
            style={{ margin: "0 8px", width: 60 }}
          />
          <Button
            onClick={() =>
              handleChangeAmount("increase", record.idProduct, false)
            }
          >
            +
          </Button>
        </div>
      ),
    },
    {
      title: "Thành tiền",
      dataIndex: "total",
      key: "total",
      render: (text) => <span>{text.toLocaleString()} VND</span>,
    },
    {
      title: "",
      dataIndex: "action",
      key: "action",
      render: (_, record) => (
        <Button danger onClick={() => handleDeleteOrder(record.idProduct)}>
          Xóa
        </Button>
      ),
    },
  ];

  const dataSource = order?.orderItems?.map((item, index) => ({
    key: item._id || index, // Sử dụng ID hoặc index làm khóa
    product: item.name, // Tên sản phẩm
    price: item.price, // Giá sản phẩm
    quantity: item.amount, // Số lượng sản phẩm
    image:item.image,
    total: item.price * item.amount, // Thành tiền
    idProduct: item.product, // ID sản phẩm để xử lý
  }));

  const handleClickCheckOut = () => {
    if (!user?.id) {
      message.destroy()
      message.info('Vui lòng đăng nhập');
    } else if (order?.orderItemsSelected?.length === 0) {
      message.destroy()
      message.info('Vui lòng chọn sản phẩm');
    } 
     else {
      navigate(`/Checkout`);
    }
  };


  return (
    <div style={{ padding: 20 }}>
      <Card title="Giỏ hàng" style={{ marginBottom: 20 }}>
        <Table
          dataSource={dataSource}
          columns={columns}
          pagination={false}
          rowKey="key"
        />
      </Card>
    <Button size="large" onClick={() => navigate("/")}>Tiếp tục mua hàng</Button>
      <Card style={{ maxWidth: 300, marginLeft: "auto" }}>
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>Tạm tính</span>
            <span>{priceMemo.toLocaleString()} VND</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>Giảm giá</span>
            <span>{priceDiscountMemo.toLocaleString()} VND</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>Phí giao hàng</span>
            <span>0 VND</span>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontWeight: "bold",
            fontSize: 16,
          }}
        >
          <span>Tổng tiền</span>
          <span>{totalPriceMemo.toLocaleString()} VND</span>
        </div>
        <Button
          type="primary"
          onClick={handleClickCheckOut}
          style={{ marginTop: 20, width: "100%", height: 40 }}
        >
          Mua hàng
        </Button>
      </Card>
    </div>
  );
};

export default OrderPage;
