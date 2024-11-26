export const Contant = () => {
    return {
      delivery: {
        fast: "FAST",
        gojek: "GO_JEK",
      },
      payment: {
        paymentincash: 'Thanh toán bằng tiền mặt',
        momo: '',
        zalopay: '',
        paypal: '',
      },
      status: {
        1: {
          label: 'Chờ xác nhận',
          color: "#00796b",
          backgroundColor: "#e0f7fa",
        },
        2: {
          label: 'Đã xác nhận',
          color: "#303f9f",
          backgroundColor: "#e8eaf6",
        },
        3: {
          label: 'Chờ giao hàng',
          color: "#f57c00",
          backgroundColor: "#fff3e0",
        },
        4: {
          label: 'Đã giao hàng',
          color: "#388e3c",
          backgroundColor: "#e8f5e9",
        },
        5: {
          label: 'Đã hủy',
          color: "#d32f2f",
          backgroundColor: "#ffebee",
        },
      },
    };
  };
  