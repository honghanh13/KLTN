import React from "react";
import ReactApexChart from "react-apexcharts";
import { convertDataChart } from "../../utils";

const PieChartComponent = (props) => {
  // Thống kê theo tên sản phẩm
  const data = convertDataChart(props?.data, "name"); // [{ name: "Gundam", value: 70 }, ...]
  const chartLabels = data.map((item) => item.name); // Lấy danh sách tên sản phẩm
  const chartSeries = data.map((item) => item.value); // Lấy số liệu tương ứng (CountInStock)
  console.log("props?.data", props?.data);
  console.log("chartLabels", chartLabels);
  console.log("chartSeries", chartSeries);
  const chartOptions = {
    chart: {
      type: "donut",
    },
    labels: chartLabels, // Gắn nhãn cho các phần của biểu đồ
    legend: {
    show: true,
      position: "right", // Đặt chú thích ở phía dưới
      labels: {
        colors: "#000", // Đặt màu chữ cho các nhãn
      },
    },
    responsive: [
      {
        breakpoint: 1024, // Màn hình nhỏ hơn 1024px
        options: {
          chart: {
            width: 400, // Đặt chiều rộng nhỏ hơn
          },
          legend: {
            position: "bottom", // Đặt chú thích ở phía dưới
            labels: {
              colors: "#000", // Đặt màu chữ cho các nhãn
            },
          },
        },
      },
      {
        breakpoint: 480, // Màn hình nhỏ hơn 480px
        options: {
          chart: {
            width: 300,
          },
          legend: {
            fontSize: "12px", // Giảm kích thước chữ của chú thích
          },
        },
      },
    ],
  };

  return (
    <div>
      <ReactApexChart
        options={chartOptions} // Tùy chọn cấu hình biểu đồ
        series={chartSeries} // Dữ liệu hiển thị trên biểu đồ (mảng giá trị số)
        type="pie"
        height={460} // Chiều cao biểu đồ
      />
    </div>
  );
};

export default PieChartComponent;
