import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import * as UserService from "../../Service/UserService";
import * as OrderService from "../../Service/OrderService";
import * as ProductService from "../../Service/ProductService";
import { converPrice, truncateDescription } from "../../utils";
import TableAdminComponent from "../TableComponent/TableAdminComponent";
import { Card, Col, Layout, Radio, Row, Typography } from "antd";
import {
  UserOutlined,
  ShoppingCartOutlined,
  DollarOutlined,
  CoffeeOutlined,
  BookOutlined,
} from "@ant-design/icons";
import Chart from "react-apexcharts";
import PieChartComponent from "../PieChartComponent/PieChartComponent";

const { Content } = Layout;
const { Title, Text } = Typography;

const AdminDashBoard = () => {
  const user = useSelector((state) => state?.user);
  const [filter, setFilter] = useState("day"); // Lựa chọn mặc định: "day"

  //days
  const calculateDailyRevenue = (orders) => {
    if (!orders?.data) return {};

    // Group by date and calculate revenue
    return orders.data
      .filter((order) => order.isPaid) // Lọc đơn hàng đã thanh toán
      .reduce((acc, order) => {
        const date = new Date(order.createdAt).toISOString().split("T")[0]; // Lấy ngày theo định dạng YYYY-MM-DD
        acc[date] = (acc[date] || 0) + order.totalPrice; // Cộng dồn doanh thu dạng số
        return acc;
      }, {});

    // Format revenue values using converPrice
  };

  //months
  const calculateMonthlyRevenue = (orders) => {
    if (!orders?.data) return {};

    return orders.data
      .filter((order) => order.isPaid)
      .reduce((acc, order) => {
        const date = new Date(order.createdAt);
        const month = `${date.getFullYear()}-${String(
          date.getMonth() + 1
        ).padStart(2, "0")}`; // Lấy tháng theo định dạng YYYY-MM
        acc[month] = (acc[month] || 0) + order.totalPrice;
        return acc;
      }, {});
  };

  //years
  const calculateYearlyRevenue = (orders) => {
    if (!orders?.data) return {};

    return orders.data
      .filter((order) => order.isPaid)
      .reduce((acc, order) => {
        const year = new Date(order.createdAt).getFullYear(); // Lấy năm
        acc[year] = (acc[year] || 0) + order.totalPrice;
        return acc;
      }, {});
  };

  // Fetch data
  const { isLoading: isLoadingUser, data: users } = useQuery({
    queryKey: ["users"],
    queryFn: UserService.getAllUSer,
  });

  const { data: orders } = useQuery({
    queryKey: ["orders"],
    queryFn: OrderService.getAllOrder,
  });

  const { data: products } = useQuery({
    queryKey: ["products"],
    queryFn: ProductService.getAllProductAdmin,
  });

  const dailyRevenue = calculateDailyRevenue(orders);
  const dailyCategories = Object.keys(dailyRevenue); // Danh sách các ngày
  const dailyData = Object.values(dailyRevenue); // Danh sách doanh thu theo ngày

  const monthlyRevenue = calculateMonthlyRevenue(orders);
  const monthlyCategories = Object.keys(monthlyRevenue); // Danh sách các tháng
  const monthlyData = Object.values(monthlyRevenue); // Danh sách doanh thu theo tháng

  const yearlyRevenue = calculateYearlyRevenue(orders);
  const yearlyCategories = Object.keys(yearlyRevenue); // Danh sách các năm
  const yearlyData = Object.values(yearlyRevenue); // Danh sách doanh thu theo năm

  const getChartData = () => {
    switch (filter) {
      case "day":
        return { series: dailyChartSeries, options: dailyChartOptions }; // Biểu đồ theo ngày
      case "month":
        return { series: monthlyChartSeries, options: monthlyChartOptions }; // Biểu đồ theo tháng
      case "year":
        return { series: yearlyChartSeries, options: yearlyChartOptions }; // Biểu đồ theo năm
      default:
        return { series: [], options: {} }; // Mặc định (trường hợp lỗi)
    }
  };

  // Tổng doanh thu
  const totalRevenue = orders?.data
    ?.filter((order) => order.isPaid)
    ?.reduce((total, order) => total + order.totalPrice, 0);

  // Biểu đồ
  //   const chartOptions = {
  //     chart: { type: "bar", height: 350, toolbar: { show: false } },
  //     xaxis: {
  //       categories: [
  //         "Jan",
  //         "Feb",
  //         "Mar",
  //         "Apr",
  //         "May",
  //         "Jun",
  //         "Jul",
  //         "Aug",
  //         "Sep",
  //         "Oct",
  //         "Nov",
  //         "Dec",
  //       ],
  //     },
  //     title: { text: "Doanh thu theo tháng", align: "left" },
  //     responsive: [
  //       {
  //         breakpoint: 768,
  //         options: {
  //           chart: { height: 300 },
  //           xaxis: { labels: { style: { fontSize: "16px" } } },
  //           title: { style: { fontSize: "14px" } },
  //         },
  //       },
  //       {
  //         breakpoint: 576,
  //         options: {
  //           chart: { height: 250 },
  //           xaxis: { labels: { style: { fontSize: "10px" } } },
  //           title: { style: { fontSize: "12px" } },
  //         },
  //       },
  //     ],
  //   };

  // const getChartOptions = (categories, titleText) => ({
  //   chart: {
  //     type: "bar",
  //     toolbar: { show: false },
  //     animations: {
  //       enabled: true,
  //       easing: "easeinout",
  //       speed: 800,
  //     },
  //   },
  //   plotOptions: {
  //     bar: {
  //       borderRadius: 8,
  //       horizontal: false,
  //       distributed: true,
  //     },
  //   },
  //   colors: ["#007bff", "#28a745", "#ffc107", "#dc3545", "#6f42c1"],
  //   dataLabels: {
  //     enabled: true,
  //     style: {
  //       colors: ["#fff"],
  //       fontSize: "12px",
  //     },
  //   },
  //   xaxis: {
  //     categories: categories,
  //     labels: {
  //       style: {
  //         colors: ["#333"],
  //         fontSize: "14px",
  //         fontWeight: "500",
  //       },
  //     },
  //   },
  //   yaxis: {
  //     title: {
  //       text: "Doanh thu (triệu đồng)",
  //       style: {
  //         color: "#666",
  //         fontSize: "16px",
  //         fontWeight: "600",
  //       },
  //     },
  //     labels: {
  //       formatter: (value) => `${value}M`,
  //     },
  //   },
  //   grid: {
  //     borderColor: "#e0e0e0",
  //     strokeDashArray: 5,
  //   },
  //   tooltip: {
  //     theme: "dark",
  //     y: {
  //       formatter: (value) => `${value} triệu đồng`,
  //     },
  //   },
  //   title: {
  //     text: titleText,
  //     align: "center",
  //     style: {
  //       fontSize: "20px",
  //       fontWeight: "bold",
  //       color: "#333",
  //     },
  //   },
  //   responsive: [
  //     {
  //       breakpoint: 768,
  //       options: {
  //         chart: { height: 300 },
  //         xaxis: { labels: { style: { fontSize: "12px" } } },
  //         title: { style: { fontSize: "16px" } },
  //       },
  //     },
  //     {
  //       breakpoint: 576,
  //       options: {
  //         chart: { height: 250 },
  //         xaxis: { labels: { style: { fontSize: "10px" } } },
  //         title: { style: { fontSize: "14px" } },
  //       },
  //     },
  //   ],
  // });
  const getChartOptions = {
    chart: {
      type: "bar",
      height: 350,
      toolbar: { show: true },
      dropShadow: {
        enabled: true,
        top: 2,
        left: 2,
        blur: 4,
        opacity: 0.2,
      },
    },
    colors: ["#007bff", "#28a745", "#ffc107", "#dc3545", "#6f42c1"],
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "50%",
        borderRadius: 5, // Bo góc cho cột
      },
    },
    dataLabels: {
      enabled: true, // Hiển thị giá trị trên cột
      formatter: function (value) {
        return value.toLocaleString("vi-VN");
      },
      style: {
        fontSize: "10px",
        colors: ["#fff"],
      },
    },
    xaxis: {
      categories: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
      labels: {
        style: {
          colors: "#9C9C9C",
          fontSize: "14px",
          fontWeight: "bold",
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: "#9C9C9C",
          fontSize: "14px",
        },
        formatter: function (value) {
          return value.toLocaleString("vi-VN");
        },
      },
    },

    tooltip: {
      theme: "dark", // Giao diện tối
      y: {
        formatter: function (value) {
          return value.toLocaleString("vi-VN") + " VNĐ"; // Hiển thị tiền tệ
        },
      },
    },
    grid: {
      borderColor: "#e7e7e7",
      strokeDashArray: 4,
    },
    responsive: [
      {
        breakpoint: 768,
        options: {
          chart: { height: 300 },
          xaxis: { labels: { style: { fontSize: "12px" } } },
          title: { style: { fontSize: "14px" } },
        },
      },
      {
        breakpoint: 576,
        options: {
          chart: { height: 250 },
          xaxis: { labels: { style: { fontSize: "10px" } } },
          title: { style: { fontSize: "12px" } },
        },
      },
    ],
  };

  //days
  const dailyChartSeries = [{ name: "Doanh thu", data: dailyData }];

  const dailyChartOptions = {
    ...getChartOptions,
    xaxis: { categories: dailyCategories }, // Gán danh sách ngày làm nhãn trục X
    title: { text: "Doanh thu theo ngày", align: "left" },
  };

  //months
  const monthlyChartSeries = [{ name: "Doanh thu", data: monthlyData }];

  const monthlyChartOptions = {
    ...getChartOptions,
    xaxis: { categories: monthlyCategories }, // Gán danh sách tháng làm nhãn trục X
    title: { text: "Doanh thu theo tháng", align: "left" },
  };

  //year
  const yearlyChartSeries = [{ name: "Doanh thu", data: yearlyData }];

  const yearlyChartOptions = {
    ...getChartOptions,
    xaxis: { categories: yearlyCategories }, // Gán danh sách năm làm nhãn trục X
    title: { text: "Doanh thu theo năm", align: "left" },
  };

  const columns = [
    {
      title: <div style={{ textAlign: "center" }}>Họ và tên</div>,
      dataIndex: "name",
      width: "30%",
      responsive: ["lg"],
      sorter: (a, b) => a.name.length - b.name.length,
    },
    {
      title: <div style={{ textAlign: "center" }}>Email</div>,
      dataIndex: "email",
      width: "30%",
      responsive: ["md"],
    },

    {
      title: <div style={{ textAlign: "center" }}>Quyền</div>,
      dataIndex: "isAdmin",
      width: "30%",
      align: "center",
      responsive: ["md"],
    },

    {
      title: <div style={{ textAlign: "center" }}>Điện thoại</div>,
      dataIndex: "phone",
      align: "center",
      width: "30%",
      responsive: ["lg"],
      // sorter: (a, b) => a.LoaiMonAn - b.LoaiMonAn,
    },
  ];

  const dataTable =
    users?.data?.length &&
    users?.data?.map((user) => {
      return {
        ...user,
        key: user._id,
        isAdmin: user.isAdmin ? "Admin" : "User",
        password: truncateDescription(user.password, 100),
      };
    });

  return (
    // <div>
    //   <Content style={{ margin: "24px 16px", padding: 24 }}>
    //     <Row gutter={[16, 16]}>
    //       {/* Card: Số lượng người dùng */}
    //       <Col xs={24} sm={12} md={6}>
    //         <Card
    //           hoverable
    //           style={{
    //             textAlign: "center",
    //             borderRadius: 10,
    //             boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    //             backgroundColor: "#ffffff",
    //           }}
    //         >
    //           <Title level={4} style={{ color: "#007bff" }}>
    //             {users?.data?.length || 0}
    //           </Title>
    //           <Text>Số lượng người dùng</Text>
    //         </Card>
    //       </Col>

    //       {/* Card: Số lượng đơn hàng */}
    //       <Col xs={24} sm={12} md={6}>
    //         <Card
    //           hoverable
    //           style={{
    //             textAlign: "center",
    //             borderRadius: 10,
    //             boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    //             backgroundColor: "#ffffff",
    //           }}
    //         >
    //           <Title level={4} style={{ color: "#28a745" }}>
    //             {orders?.data?.length || 0}
    //           </Title>
    //           <Text>Số lượng đơn hàng</Text>
    //         </Card>
    //       </Col>

    //       {/* Card: Doanh thu */}
    //       <Col xs={24} sm={12} md={6}>
    //         <Card
    //           hoverable
    //           style={{
    //             textAlign: "center",
    //             borderRadius: 10,
    //             boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    //             backgroundColor: "#ffffff",
    //           }}
    //         >
    //           <Title level={4} style={{ color: "#ff6347" }}>
    //             {converPrice(totalRevenue || 0)}
    //           </Title>
    //           <Text>Doanh thu</Text>
    //         </Card>
    //       </Col>

    //       {/* Card: Số lượng món ăn */}
    //       <Col xs={24} sm={12} md={6}>
    //         <Card
    //           hoverable
    //           style={{
    //             textAlign: "center",
    //             borderRadius: 10,
    //             boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    //             backgroundColor: "#ffffff",
    //           }}
    //         >
    //           <Title level={4} style={{ color: "#6f42c1" }}>
    //             {products?.data?.length || 0}
    //           </Title>
    //           <Text>Số lượng món ăn</Text>
    //         </Card>
    //       </Col>
    //     </Row>

    //     {/* Row: Biểu đồ và bảng */}
    //     <Row gutter={[16, 16]} style={{ marginTop: 20 }}>
    //       <Col xs={24} md={12}>
    //         <Card
    //           title="Biểu đồ doanh thu"
    //           hoverable
    //           style={{
    //             borderRadius: 10,
    //             boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    //             backgroundColor: "#ffffff",
    //           }}
    //         >
    //           <Radio.Group
    //             value={filter}
    //             onChange={(e) => setFilter(e.target.value)} // Cập nhật trạng thái khi người dùng chọn
    //             style={{ marginBottom: 16 }} // Khoảng cách bên dưới Radio Button
    //           >
    //             <Radio.Button value="day">Theo ngày</Radio.Button>
    //             <Radio.Button value="month">Theo tháng</Radio.Button>
    //             <Radio.Button value="year">Theo năm</Radio.Button>
    //           </Radio.Group>
    //           <Chart
    //             options={getChartData().options} // Lấy cấu hình từ lựa chọn hiện tại
    //             series={getChartData().series} // Lấy dữ liệu từ lựa chọn hiện tại
    //             type="bar" // Loại biểu đồ (cột)
    //             height={400} // Chiều cao của biểu đồ
    //           />
    //         </Card>
    //       </Col>
    //       <Col xs={24} md={12}>
    //         <Card
    //           title="Bảng người dùng"
    //           hoverable
    //           style={{
    //             borderRadius: 10,
    //             boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    //             backgroundColor: "#ffffff",
    //           }}
    //         >
    //           <TableAdminComponent
    //             columns={columns}
    //             isLoading={isLoadingUser}
    //             pagination={{
    //               position: ["bottomCenter"],
    //               pageSize: 6,
    //             }}
    //             data={dataTable}
    //           />
    //         </Card>
    //       </Col>
    //     </Row>
    //   </Content>
    // </div>
    <div>
      
      <Content style={{ margin: "0px 5px" }}>
        <Title
          level={4}
          style={{ color: "#000", fontWeight: "bold", marginBottom: "20px", }}
        >
          Trang Chủ Tổng Quan Hệ Thống
        </Title>
        {/* Card Section */}
        <Row gutter={[24, 24]}>
          {/* Card: User Count */}
          <Col xs={24} sm={12} md={6}>
            <Card
              hoverable
              style={{
                background: "linear-gradient(135deg, #007bff, #67d6ff)",
                borderRadius: "15px",
                color: "#fff",
                textAlign: "center",
              }}
            >
              <UserOutlined
                style={{ fontSize: "2.5rem", marginBottom: "10px" }}
              />
              <Title level={3}>{users?.data?.length || 0}</Title>
              <Text>Số lượng người dùng</Text>
            </Card>
          </Col>

          {/* Card: Order Count */}
          <Col xs={24} sm={12} md={6}>
            <Card
              hoverable
              style={{
                background: "linear-gradient(135deg, #28a745, #85e095)",
                borderRadius: "15px",
                color: "#fff",
                textAlign: "center",
              }}
            >
              <ShoppingCartOutlined
                style={{ fontSize: "2.5rem", marginBottom: "10px" }}
              />
              <Title level={3}>{orders?.data?.length || 0}</Title>
              <Text>Số lượng đơn hàng</Text>
            </Card>
          </Col>

          {/* Card: Revenue */}
          <Col xs={24} sm={12} md={6}>
            <Card
              hoverable
              style={{
                background: "linear-gradient(135deg, #6f42c1, #a982e3)",
                borderRadius: "15px",
                color: "#fff",
                textAlign: "center",
              }}
            >
              <BookOutlined
                style={{ fontSize: "2.5rem", marginBottom: "10px" }}
              />
              <Title level={3}>{products?.data?.length || 0}</Title>
              <Text>Số lượng sản phẩm</Text>
            </Card>
          </Col>

          {/* Card: Product Count */}
          <Col xs={24} sm={12} md={6}>
            <Card
              hoverable
              style={{
                background: "linear-gradient(135deg, #ff6347, #ff8b66)",
                borderRadius: "15px",
                color: "#fff",
                textAlign: "center",
              }}
            >
              <DollarOutlined
                style={{ fontSize: "2.5rem", marginBottom: "10px" }}
              />
              <Title level={3}>{converPrice(totalRevenue || 0)}</Title>
              <Text>Doanh thu</Text>
            </Card>
          </Col>
        </Row>

        {/* Chart and Table Section */}
        <Row gutter={[24, 24]} style={{ marginTop: "30px" }}>
          <Col xs={24} md={12}>
            <Card
              title="Thống kế doanh thu"
              hoverable
              style={{
                borderRadius: "15px",
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
                backgroundColor: "#fff",
              }}
            >
              <Radio.Group
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                style={{
                  marginBottom: "20px",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <Radio.Button value="day">Theo ngày</Radio.Button>
                <Radio.Button value="month">Theo tháng</Radio.Button>
                <Radio.Button value="year">Theo năm</Radio.Button>
              </Radio.Group>
              <Chart
                options={getChartData().options}
                series={getChartData().series}
                type="bar"
                height={400}
              />
            </Card>
          </Col>

          {/* User Table */}
          <Col xs={24} md={12}>
            <Card
              title="Thống kế sản phẩm tồn kho"
              hoverable
              style={{
                borderRadius: "15px",
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
                backgroundColor: "#fff",
              }}
            >
              <PieChartComponent data={products?.data} />
            </Card>
          </Col>
        </Row>
      </Content>
      {/* </div> */}
    </div>
  );
};

export default AdminDashBoard;
