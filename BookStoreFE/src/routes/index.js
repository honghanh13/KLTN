import HomePage from "../pages/HomePage/HomePage";
import OrderPage from "../pages/OrderPage/OrderPage";
import ProductsPage from "../pages/ProductsPage/ProductsPage";
import NotFoundPage from "../pages/NotFoundPage/NotFoundPage";
import TypeProductPage from "../pages/TypeProductPage/TypeProductPage";
import SignInPage from "../pages/SignInPage/SignInPage";
import ProductDetailsPage from "../pages/ProductDetailsPage/ProductDetailsPage";
import SignUpPage from "../pages/SignUpPage/SignUpPage";
import orderPage from "../pages/OrderPage/OrderPage";
import CheckoutPage from "../pages/CheckoutPage/CheckoutPage";
import orderSuccess from "../pages/OrderSuccess/OrderSucces";
import UserInfoUpdate from "../pages/ProfilePage/UserInfoUpdate";
import OrderDetails from "../pages/ProfilePage/MyOrderPage";
import AdminPage from "../pages/AdminPage/AdminPage";
import AdminOrderDetails from "../components/AdminOrder/AdminOrderDetails";

export const routes = [
  {
    path: "/",
    page: HomePage,
    isShowHeader: true,
  },
  {
    path: "/order",
    page: OrderPage,
    isShowHeader: true,
  },
  {
    path: "/products",
    page: ProductsPage,
    isShowHeader: true,
  },

  {
    path: "/:type",
    page: TypeProductPage,
    isShowHeader: true,
  },
  {
    path: "/sign-in",
    page: SignInPage,
    isShowHeader: false,
  },
  {
    path: "/sign-up",
    page: SignUpPage,
    isShowHeader: false,
  },
  {
    path: "/product-details/:id",
    page: ProductDetailsPage,
    isShowHeader: true,
  },
  {
    path: "/orders",
    page: orderPage,
    isShowHeader: true,
  },
  {
    path: "/checkout",
    page: CheckoutPage,
    isShowHeader: true,
  },
  {
    path: "/order-success",
    page: orderSuccess,
    isShowHeader: true,
  },
  {
    path: "/profile",
    page: UserInfoUpdate,
    isShowHeader: true,
  },
  {
    path: "/my-order",
    page: OrderDetails,
    isShowHeader: true,
  },
  {
    path: "/system/admin",
    page: AdminPage,
    isShowHeader: false,
    isPrivate: true,
  },

  {
    path: "/system/admin/OrderDetails/:id",
    page: AdminOrderDetails,
    isShowHeader: false,
    isPrivate: true,
  },

  {
    path: "*",
    page: NotFoundPage,
  },
];
