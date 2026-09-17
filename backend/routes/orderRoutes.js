const express = require("express");

const {
  createOrder,
  getAllOrders,
  getOrderById,
  getMyOrders,
  updateOrderStatus,
  updatePaymentStatus,
} = require("../controllers/orderController");

const protect = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

router.post(
  "/",
  protect,
  roleMiddleware("counter", "admin"),
  createOrder
);

router.get(
  "/",
  protect,
  roleMiddleware("counter", "chef", "admin"),
  getAllOrders
);

router.get(
  "/my-orders",
  protect,
  roleMiddleware("user"),
  getMyOrders
);

router.get(
  "/:id",
  protect,
  getOrderById
);

router.put(
  "/:id/status",
  protect,
  roleMiddleware("chef", "admin"),
  updateOrderStatus
);

router.put(
  "/:id/payment",
  protect,
  roleMiddleware("counter", "admin"),
  updatePaymentStatus
);

module.exports = router;