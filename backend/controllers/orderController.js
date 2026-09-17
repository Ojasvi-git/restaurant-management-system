const Order = require("../models/Order");
const User = require("../models/User");
const generateOrderId = require("../utils/generateOrderId");
const { getIO } = require("../utils/socket");

// CREATE ORDER
const createOrder = async (req, res) => {
  try {
    const {
      customerName,
      customerMobile,
      items,
      totalAmount,
      paymentMethod,
      
    } = req.body;

    if (
      !customerName ||
      !customerMobile ||
      !items ||
      items.length === 0 ||
      totalAmount === undefined
    ) {
      return res.status(400).json({
        message: "Please provide all required order details",
      });
    }

    let linkedUser = null;

const existingUser = await User.findOne({
  mobile: customerMobile,
});

if (existingUser) {
  linkedUser = existingUser._id;
}

const order = await Order.create({
  orderId: generateOrderId(),
  customerName,
  customerMobile,
  user: linkedUser,
  items,
  totalAmount,
  paymentMethod: paymentMethod || "cash",
  paymentStatus: "pending",
  status: "pending",
});

    const io = getIO();

io.emit("newOrderCreated", {
  orderId: order._id,
  publicOrderId: order.orderId,
  customerName: order.customerName,
  customerMobile: order.customerMobile,
  totalAmount: order.totalAmount,
  items: order.items,
  status: order.status,
  paymentStatus: order.paymentStatus,
  createdAt: order.createdAt,
});

    res.status(201).json({
      message: "Order created successfully",
      order,
    });
  } catch (error) {
    console.error("Create Order Error:", error);

    res.status(500).json({
      message: "Server error while creating order",
    });
  }
};

// GET ALL ORDERS
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email mobile")
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "Orders fetched successfully",
      orders,
    });
  } catch (error) {
    console.error("Get Orders Error:", error);

    res.status(500).json({
      message: "Server error while fetching orders",
    });
  }
};

// GET SINGLE ORDER
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "user",
      "name email mobile"
    );

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    res.status(200).json({
      message: "Order fetched successfully",
      order,
    });
  } catch (error) {
    console.error("Get Order Error:", error);

    res.status(500).json({
      message: "Server error while fetching order",
    });
  }
};


// UPDATE ORDER STATUS
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatuses = [
      "pending",
      "preparing",
      "ready",
      "served",
      "cancelled",
    ];

    if (!status) {
      return res.status(400).json({
        message: "Order status is required",
      });
    }

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid order status",
      });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      {
        status,
      },
      {
        new: true,
        runValidators: true,
      }
    ).populate("user", "name email mobile");

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    // REAL-TIME STATUS UPDATE
    const io = getIO();

    io.to(`order_${order._id}`).emit("orderStatusUpdated", {
      orderId: order._id,
      publicOrderId: order.orderId,
      customerName: order.customerName,
      status: order.status,
      paymentStatus: order.paymentStatus,
      updatedAt: order.updatedAt,
    });

    // ALSO NOTIFY CHEF / ADMIN DASHBOARDS
    io.emit("orderStatusChanged", {
      orderId: order._id,
      publicOrderId: order.orderId,
      customerName: order.customerName,
      status: order.status,
      updatedAt: order.updatedAt,
    });

    res.status(200).json({
      message: `Order marked as ${status}`,
      order,
    });
  } catch (error) {
    console.error("Update Order Status Error:", error);

    res.status(500).json({
      message: "Server error while updating order status",
    });
  }
};

// UPDATE PAYMENT
const updatePaymentStatus = async (req, res) => {
  try {
    const { paymentStatus, paymentMethod } = req.body;

    if (!["pending", "paid"].includes(paymentStatus)) {
      return res.status(400).json({
        message: "Invalid payment status",
      });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      {
        paymentStatus,
        paymentMethod,
      },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    res.status(200).json({
      message: "Payment updated successfully",
      order,
    });
  } catch (error) {
    console.error("Payment Update Error:", error);

    res.status(500).json({
      message: "Server error while updating payment",
    });
  }
};

// GET LOGGED-IN USER'S ORDERS
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      user: req.user.id,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      message: "Your orders fetched successfully",
      orders,
    });
  } catch (error) {
    console.error("Get My Orders Error:", error);

    res.status(500).json({
      message: "Server error while fetching your orders",
    });
  }
};

module.exports = {
  createOrder,
  getAllOrders,
  getOrderById,
  getMyOrders,
  updateOrderStatus,
  updatePaymentStatus,
};