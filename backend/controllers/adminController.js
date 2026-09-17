const Order = require("../models/Order");
const User = require("../models/User");
const Feedback = require("../models/Feedback");

// GET ADMIN DASHBOARD STATS
const getDashboardStats = async (req, res) => {
  try {
    // TOTAL ORDERS
    const totalOrders = await Order.countDocuments();

    // TOTAL USERS
    const totalUsers = await User.countDocuments({
      role: "user",
    });

    // TOTAL FEEDBACK
    const totalReviews = await Feedback.countDocuments();

    // TOTAL REVENUE
    const revenueResult = await Order.aggregate([
      {
        $match: {
          paymentStatus: "paid",
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: {
            $sum: "$totalAmount",
          },
        },
      },
    ]);

    const totalRevenue =
      revenueResult.length > 0
        ? revenueResult[0].totalRevenue
        : 0;

    // TODAY'S DATE RANGE
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    // TODAY'S ORDERS
    const todayOrders = await Order.countDocuments({
      createdAt: {
        $gte: startOfToday,
        $lte: endOfToday,
      },
    });

    // TODAY'S SALES
    const todayRevenueResult = await Order.aggregate([
      {
        $match: {
          paymentStatus: "paid",
          createdAt: {
            $gte: startOfToday,
            $lte: endOfToday,
          },
        },
      },
      {
        $group: {
          _id: null,
          todayRevenue: {
            $sum: "$totalAmount",
          },
        },
      },
    ]);

    const todayRevenue =
      todayRevenueResult.length > 0
        ? todayRevenueResult[0].todayRevenue
        : 0;

    // AVERAGE RATING
    const ratingResult = await Feedback.aggregate([
      {
        $group: {
          _id: null,
          averageRating: {
            $avg: "$rating",
          },
        },
      },
    ]);

    const averageRating =
      ratingResult.length > 0
        ? Number(ratingResult[0].averageRating.toFixed(1))
        : 0;

    // MOST SOLD ITEMS
    const mostSoldItems = await Order.aggregate([
      {
        $unwind: "$items",
      },
      {
        $group: {
          _id: "$items.name",
          totalQuantity: {
            $sum: "$items.quantity",
          },
          totalSales: {
            $sum: "$items.subtotal",
          },
        },
      },
      {
        $sort: {
          totalQuantity: -1,
        },
      },
      {
        $limit: 5,
      },
    ]);

    res.status(200).json({
      message: "Dashboard statistics fetched successfully",

      stats: {
        totalOrders,
        totalUsers,
        totalReviews,
        totalRevenue,
        todayOrders,
        todayRevenue,
        averageRating,
        mostSoldItems,
      },
    });
  } catch (error) {
    console.error(
      "Get Dashboard Stats Error:",
      error
    );

    res.status(500).json({
      message:
        "Server error while fetching dashboard statistics",
    });
  }
};

const getSalesAnalytics = async (req, res) => {
  try {
    const Order = require("../models/Order");

    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .lean();

    // Only paid orders are counted as revenue
    const paidOrders = orders.filter(
      (order) => order.paymentStatus === "paid"
    );

    const totalRevenue = paidOrders.reduce(
      (sum, order) => sum + order.totalAmount,
      0
    );

    // Today's date
    const today = new Date();

    const todayStart = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );

    const todayEnd = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + 1
    );

    const todayOrders = orders.filter(
      (order) =>
        new Date(order.createdAt) >= todayStart &&
        new Date(order.createdAt) < todayEnd
    );

    const todayPaidOrders = todayOrders.filter(
      (order) => order.paymentStatus === "paid"
    );

    const todayRevenue = todayPaidOrders.reduce(
      (sum, order) => sum + order.totalAmount,
      0
    );

    // Payment method analysis
    const paymentMethods = {
      cash: 0,
      upi: 0,
      card: 0,
      other: 0,
    };

    paidOrders.forEach((order) => {
      const method = order.paymentMethod || "other";

      if (paymentMethods[method] !== undefined) {
        paymentMethods[method] += order.totalAmount;
      } else {
        paymentMethods.other += order.totalAmount;
      }
    });

    // Order status analysis
    const orderStatus = {
      pending: 0,
      preparing: 0,
      ready: 0,
      served: 0,
      cancelled: 0,
    };

    orders.forEach((order) => {
      if (orderStatus[order.status] !== undefined) {
        orderStatus[order.status]++;
      }
    });

    // Most sold items
    const itemMap = {};

    paidOrders.forEach((order) => {
      order.items?.forEach((item) => {
        if (!itemMap[item.name]) {
          itemMap[item.name] = {
            name: item.name,
            quantity: 0,
            sales: 0,
          };
        }

        itemMap[item.name].quantity += item.quantity;
        itemMap[item.name].sales += item.subtotal;
      });
    });

    const mostSoldItems = Object.values(itemMap)
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 10);

    // Last 7 days sales
    const last7Days = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date();

      date.setHours(0, 0, 0, 0);
      date.setDate(date.getDate() - i);

      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);

      const dayOrders = paidOrders.filter(
        (order) =>
          new Date(order.createdAt) >= date &&
          new Date(order.createdAt) < nextDate
      );

      const revenue = dayOrders.reduce(
        (sum, order) => sum + order.totalAmount,
        0
      );

      last7Days.push({
        date: date.toISOString().split("T")[0],
        revenue,
        orders: dayOrders.length,
      });
    }

    res.status(200).json({
      message: "Sales analytics fetched successfully",

      analytics: {
        totalOrders: orders.length,
        paidOrders: paidOrders.length,
        pendingPayments: orders.filter(
          (order) => order.paymentStatus === "pending"
        ).length,

        totalRevenue,
        todayOrders: todayOrders.length,
        todayRevenue,

        paymentMethods,
        orderStatus,
        mostSoldItems,
        last7Days,
      },
    });
  } catch (error) {
    console.error("Sales Analytics Error:", error);

    res.status(500).json({
      message: "Server error while fetching sales analytics",
    });
  }
};

const getDetailedAnalytics = async (req, res) => {
  try {
    const Order = require("../models/Order");
    const Feedback = require("../models/Feedback");

    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .lean();

    const feedbacks = await Feedback.find().lean();

    const paidOrders = orders.filter(
      (order) => order.paymentStatus === "paid"
    );

    // -----------------------------
    // TOTAL REVENUE
    // -----------------------------

    const totalRevenue = paidOrders.reduce(
      (sum, order) => sum + order.totalAmount,
      0
    );

    // -----------------------------
    // TODAY
    // -----------------------------

    const now = new Date();

    const todayStart = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );

    const todayEnd = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + 1
    );

    const todayOrders = orders.filter(
      (order) =>
        new Date(order.createdAt) >= todayStart &&
        new Date(order.createdAt) < todayEnd
    );

    const todayPaidOrders = todayOrders.filter(
      (order) => order.paymentStatus === "paid"
    );

    const todayRevenue = todayPaidOrders.reduce(
      (sum, order) => sum + order.totalAmount,
      0
    );

    // -----------------------------
    // LAST 30 DAYS
    // -----------------------------

    const last30Days = [];

    for (let i = 29; i >= 0; i--) {
      const date = new Date();

      date.setHours(0, 0, 0, 0);
      date.setDate(date.getDate() - i);

      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);

      const dayOrders = paidOrders.filter(
        (order) =>
          new Date(order.createdAt) >= date &&
          new Date(order.createdAt) < nextDate
      );

      const revenue = dayOrders.reduce(
        (sum, order) => sum + order.totalAmount,
        0
      );

      last30Days.push({
        date: date.toISOString().split("T")[0],
        orders: dayOrders.length,
        revenue,
      });
    }

    // -----------------------------
    // ITEMS ANALYTICS
    // -----------------------------

    const itemMap = {};

    paidOrders.forEach((order) => {
      order.items?.forEach((item) => {
        if (!itemMap[item.name]) {
          itemMap[item.name] = {
            name: item.name,
            quantity: 0,
            revenue: 0,
          };
        }

        itemMap[item.name].quantity += item.quantity;
        itemMap[item.name].revenue += item.subtotal;
      });
    });

    const itemAnalytics = Object.values(itemMap).sort(
      (a, b) => b.revenue - a.revenue
    );

    const totalItemsSold = itemAnalytics.reduce(
      (sum, item) => sum + item.quantity,
      0
    );

    // -----------------------------
    // PAYMENT ANALYTICS
    // -----------------------------

    const paymentAnalytics = {
      cash: {
        orders: 0,
        revenue: 0,
      },
      upi: {
        orders: 0,
        revenue: 0,
      },
      card: {
        orders: 0,
        revenue: 0,
      },
      other: {
        orders: 0,
        revenue: 0,
      },
    };

    paidOrders.forEach((order) => {
      const method = order.paymentMethod || "other";

      if (!paymentAnalytics[method]) {
        paymentAnalytics.other.orders += 1;
        paymentAnalytics.other.revenue += order.totalAmount;
        return;
      }

      paymentAnalytics[method].orders += 1;
      paymentAnalytics[method].revenue += order.totalAmount;
    });

    // -----------------------------
    // ORDER STATUS
    // -----------------------------

    const statusAnalytics = {
      pending: 0,
      preparing: 0,
      ready: 0,
      served: 0,
      cancelled: 0,
    };

    orders.forEach((order) => {
      if (statusAnalytics[order.status] !== undefined) {
        statusAnalytics[order.status]++;
      }
    });

    // -----------------------------
    // AVERAGE ORDER VALUE
    // -----------------------------

    const averageOrderValue =
      paidOrders.length > 0
        ? totalRevenue / paidOrders.length
        : 0;

    // -----------------------------
    // FEEDBACK
    // -----------------------------

    const totalReviews = feedbacks.length;

    const averageRating =
      totalReviews > 0
        ? feedbacks.reduce(
            (sum, feedback) => sum + feedback.rating,
            0
          ) / totalReviews
        : 0;

    const ratingDistribution = {
      5: 0,
      4: 0,
      3: 0,
      2: 0,
      1: 0,
    };

    feedbacks.forEach((feedback) => {
      if (ratingDistribution[feedback.rating] !== undefined) {
        ratingDistribution[feedback.rating]++;
      }
    });

    // -----------------------------
    // PEAK BUSINESS DAY
    // -----------------------------

    let peakDay = null;

    if (last30Days.length > 0) {
      peakDay = last30Days.reduce((max, current) =>
        current.revenue > max.revenue ? current : max
      );
    }

    // -----------------------------
    // RESPONSE
    // -----------------------------

    res.status(200).json({
      message: "Detailed analytics fetched successfully",

      analytics: {
        totalOrders: orders.length,
        paidOrders: paidOrders.length,
        pendingPayments: orders.filter(
          (order) => order.paymentStatus === "pending"
        ).length,

        totalRevenue,
        todayOrders: todayOrders.length,
        todayRevenue,

        totalItemsSold,
        averageOrderValue,

        totalReviews,
        averageRating,

        itemAnalytics,
        paymentAnalytics,
        statusAnalytics,
        ratingDistribution,

        last30Days,
        peakDay,
      },
    });
  } catch (error) {
    console.error("Detailed Analytics Error:", error);

    res.status(500).json({
      message:
        "Server error while fetching detailed analytics",
    });
  }
};
module.exports = {
  getDashboardStats,
  getSalesAnalytics,
  getDetailedAnalytics,
};