const express = require("express");

const {
  getMenuItems,
  getMenuItemById,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
} = require("../controllers/menuController");

const protect = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

// PUBLIC
router.get("/", getMenuItems);

router.get("/:id", getMenuItemById);

// ADMIN ONLY
router.post(
  "/",
  protect,
  roleMiddleware("admin"),
  upload.single("image"),
  createMenuItem
);

router.put(
  "/:id",
  protect,
  roleMiddleware("admin"),
  upload.single("image"),
  updateMenuItem
);

router.delete(
  "/:id",
  protect,
  roleMiddleware("admin"),
  deleteMenuItem
);

module.exports = router;