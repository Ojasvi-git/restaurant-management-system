const express = require("express");

const {
  searchUserByMobile,
  getMyProfile,
  updateMyProfile,
  getAllUsers,
  deleteUser,
  createStaffAccount,
} = require("../controllers/userController");

const protect = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();


// Counter/Admin - Search customer
router.get(
  "/search",
  protect,
  roleMiddleware("counter", "admin"),
  searchUserByMobile
);


// Logged-in user - Get own profile
router.get(
  "/profile",
  protect,
  getMyProfile
);


// Logged-in user - Update own profile
router.put(
  "/profile",
  protect,
  upload.single("profileImage"),
  updateMyProfile
);


router.post(
  "/staff",
  protect,
  roleMiddleware("admin"),
  createStaffAccount
);

// Admin - Get all users
router.get(
  "/",
  protect,
  roleMiddleware("admin"),
  getAllUsers
);


// Admin - Delete user
router.delete(
  "/:id",
  protect,
  roleMiddleware("admin"),
  deleteUser
);


module.exports = router;