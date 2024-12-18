const Order = require("../models/OrderProduct");
const Product = require("../models/ProductModel");
// const EmailService = require("../services/EmailService");
 
const createOrder = (newOrder) => {
  return new Promise(async (resolve, reject) => {
    const {
      orderItems,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      totalPrice,
      fullName,
      address,
      phone,
      user,
      isPaid,
      paidAt,
      discountPrice,
      email,
    } = newOrder;

    try {
      // Sử dụng bulkWrite để cập nhật sản phẩm
      const bulkOperations = orderItems.map((order) => ({
        updateOne: {
          filter: {
            _id: order.product,
            countInStock: { $gte: order.amount }, // Chỉ cập nhật nếu đủ số lượng
          },
          update: {
            $inc: {
              countInStock: -order.amount,
              selled: order.amount,
            },
          },
        },
      }));

      // Thực hiện bulkWrite
      const bulkResult = await Product.bulkWrite(bulkOperations);

      // Kiểm tra sản phẩm nào không cập nhật thành công
      if (bulkResult.modifiedCount < orderItems.length) {
        const insufficientStock = orderItems.filter((item, index) => !bulkResult.modifiedCount[index]);
        const arrId = insufficientStock.map((item) => item.product);
        return resolve({
          status: "ERR",
          message: `Sản phẩm với id: ${arrId.join(", ")} không đủ hàng`,
        });
      }

      // Tạo đơn hàng
      const createdOrder = await Order.create({
        orderItems,
        shippingAddress: {
          fullName,
          address,
          phone,
        },
        paymentMethod,
        itemsPrice,
        shippingPrice,
        totalPrice,
        user,
        email,
        isPaid,
        paidAt,
        discountPrice,
      });

      // Thực hiện gửi email không đồng bộ
    //   const orderDetails = {
    //     fullName,
    //     email,
    //     phone,
    //     address,
    //     orderNumber: createdOrder._id,
    //     orderDate: createdOrder.createdAt,
    //     totalPrice: createdOrder.totalPrice,
    //   };

      // Gửi email sau khi API phản hồi
    //   setImmediate(async () => {
    //     try {
    //       await EmailService.sendEmailCreateOrder(email, fullName, orderItems, orderDetails);
    //     } catch (error) {
    //       console.error(`Error sending email: ${error.message}`);
    //     }
    //   });

      // Phản hồi ngay lập tức mà không đợi email hoàn thành
      return resolve({
        status: "OK",
        message: "success",
        orderId: createdOrder._id,
      });

    } catch (error) {
      return reject(error);
    }
  });
};
const getAllOrderDetails = (id, page, limit, status) => {
  return new Promise(async (resolve, reject) => {
    try {
      const skip = page * limit;
      const query = { user: id };

      // Chỉ thêm điều kiện status nếu status != -1
      if (status !== "-1") {
        query.orderStatus = status; // Trạng thái đơn hàng cụ thể
      }

      const totalOrders = await Order.countDocuments(query); // Tổng số đơn hàng
      const orders = await Order.find(query)
        .sort({ createdAt: -1, updatedAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)); // Lấy dữ liệu phân trang

      if (orders.length === 0) {
        resolve({
          status: "ERR",
          message: "No orders found",
        });
      } else {
        resolve({
          status: "OK",
          message: "SUCCESS",
          total: totalOrders,
          data: orders,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};


const getOrderDetails = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const order = await Order.findById({
        _id: id,
      });
      if (order === null) {
        resolve({
          status: "ERR",
          message: "The order is not defined",
        });
      }

      resolve({
        status: "OK",
        message: "SUCESSS",
        data: order,
      });
    } catch (e) {
      reject(e);
    }
  });
};
const cancelOrderDetails = (id, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      let order = null;

      // Start updating product stock and selled count
      const promises = data.map(async (orderItem) => {
        console.log("orderItem",orderItem);
        const productData = await Product.findOneAndUpdate(
          {
            _id: orderItem.product,
            selled: { $gte: orderItem.amount }, // Ensure product is sold at least the amount
          },
          {
            $inc: {
              countInStock: +orderItem.amount, // Increase countInStock
              selled: -orderItem.amount, // Decrease selled
            },
          },
          { new: true }
        );

        if (!productData) {
          return {
            status: "ERR",
            message: `Sản phẩm với ID ${orderItem.product} không tồn tại hoặc số tồn không đủ`,
            id: orderItem.product,
          };
        }
      });

      const results = await Promise.all(promises);
      const failedProduct = results.find((result) => result && result.status === "ERR");

      if (failedProduct) {
        return resolve({
          status: "ERR",
          message: failedProduct.message, // Return the error message for failed product
        });
      }

      // Now, find the order by ID and delete it
      order = await Order.findByIdAndDelete(id);  // Delete the order after updating products

      if (!order) {
        return resolve({
          status: "ERR",
          message: "Không tìm thấy đơn hàng để xóa",
        });
      }

      resolve({
        status: "OK",
        message: "Hủy đơn hàng thành công !",
        data: order,
      });
    } catch (e) {
      reject(e);
    }
  });
};


const getAllOrder = (page, limit) => {
  return new Promise(async (resolve, reject) => {
    try {
      const skip = (page - 1) * limit;

      // Fetch orders for the current page
      const allOrder = await Order.find()
        .sort({
          createdAt: -1,
          updatedAt: -1,
        })
        .skip(skip)
        .limit(limit);

      // Get total count for pagination info
      const totalOrders = await Order.countDocuments();

      // Calculate total revenue (sum of totalPrice for all paid orders)
      const totalRevenue = await Order.aggregate([
        { $match: { isPaid: true } }, // Only paid orders
        { $group: { _id: null, total: { $sum: "$totalPrice" } } }, // Sum totalPrice
      ]);

      // If totalRevenue is empty, set it to 0
      const revenue = totalRevenue.length > 0 ? totalRevenue[0].total : 0;

      resolve({
        status: "OK",
        message: "Success",
        data: allOrder,
        total: totalOrders,
        page,
        limit,
        totalRevenue: revenue, // Include total revenue in the response
      });
    } catch (e) {
      reject(e);
    }
  });
};

const updateOrderStatus = (orderId, status) => {
  return new Promise(async (resolve, reject) => {
    try {
      const order = await Order.findByIdAndUpdate(
        orderId,
        { orderStatus: status },
        { new: true }
      );
      if (!order) {
        return resolve({
          status: "ERR",
          message: "Order not found",
        });
      }
      resolve({
        status: "OK",
        message: "Success",
        data: order,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const markOrderAsReceived = async (orderId, isPaid, isDelivered) => {
  try {
    const order = await Order.findByIdAndUpdate(
      orderId,
      { isPaid, isDelivered },
      { new: true }
    );
    return order
      ? { status: "OK", message: "Success", data: order }
      : { status: "ERR", message: "Order not found" };
  } catch (e) {
    throw new Error(e.message);
  }
};




module.exports = {
  createOrder,
  getAllOrderDetails,
  getOrderDetails,
  cancelOrderDetails,
  getAllOrder,
  updateOrderStatus,
  markOrderAsReceived,
};
