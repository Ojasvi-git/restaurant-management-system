const express = require("express");

const {
  getDashboardStats,
  getSalesAnalytics,
  getDetailedAnalytics,
} = require("../controllers/adminController");

const protect = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

router.get(
  "/dashboard",
  protect,
  roleMiddleware("admin"),
  getDashboardStats
);

router.get(
  "/sales",
  protect,
  roleMiddleware("admin"),
  getSalesAnalytics
);

router.get(
  "/analytics",
  protect,
  roleMiddleware("admin"),
  getDetailedAnalytics
);
module.exports = router;