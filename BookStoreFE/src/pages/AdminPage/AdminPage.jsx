import { Menu } from "antd";
import React, { useEffect, useState } from "react";
import { getItem } from "../../utils";
import {
  AppstoreOutlined,
  AreaChartOutlined,
  ShoppingCartOutlined,
  UserOutlined,
} from "@ant-design/icons";
import HeaderComponent from "../../components/HeaderComponent/HeaderComponet";
import AdminUser from "../../components/AdminUser/AdminUser";
import AdminProduct from "../../components/AdminProduct/AdminProduct";
import AdminOrder from "../../components/AdminOrder/AdminOrder";
import AdminDashBoard from "../../components/AdminDashBoard/AdminDashBoard";
const AdminPage = () => {
  const items = [
    getItem("Trang chủ", "dashboard", <AreaChartOutlined />),
    getItem("Người dùng", "user", <UserOutlined />),
    getItem("Sản phẩm", "product", <AppstoreOutlined />),
    getItem("Đơn hàng", "order", <ShoppingCartOutlined />),
  ];
  // const rootSubmenuKeys = ['user', 'product'];
  // const [openKeys, setOpenKeys] = useState(['user']);
  const [keySelected, setKeySelected] = useState("dashboard");
  const renderPage = (key) => {
    switch (key) {
      case "dashboard":
        return <AdminDashBoard />;
      case "user":
        return <AdminUser />;
      case "product":
        return <AdminProduct />;
      case "order":
        return <AdminOrder />;
      default:
        return <></>;
    }
  };
  // const onOpenChange = (keys) => {
  //     console.log('keys', keys)
  //     const latestOpenKeys = keys.find((key) => openKeys.indexOf(key) === -1);
  //     if (rootSubmenuKeys.indexOf(latestOpenKeys) === -1) {
  //         setOpenKeys(keys);
  //     } else {
  //         setOpenKeys(latestOpenKeys ? [latestOpenKeys] :[]);
  //     }
  // };

  const handleOnClick = ({ key }) => {
    setKeySelected(key);
  };
  console.log("keySelected", keySelected);

  useEffect(() => {
    // Set the default page to "user" if none is selected
    if (!keySelected) {
      setKeySelected("dashboard");
    }
  }, [keySelected]);

  return (
    <>
      <HeaderComponent isHiddenSearch isHiddenCart />
      <div style={{ display: "flex" }}>
        <Menu
          mode="inline"
          // openKeys={openKeys}
          // onOpenChange={onOpenChange}
          style={{
            width: 256,
            boxShadow: "1px 1px 2px #ccc",
            height: "100vh",
          }}
          items={items}
          onClick={handleOnClick}
        />
        <div style={{ flex: 1, padding: "15px" }}>
          {renderPage(keySelected)}
        </div>
      </div>
    </>
  );
};
export default AdminPage;
