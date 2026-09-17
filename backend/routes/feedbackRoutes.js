const express = require("express");

const {
  submitFeedback,
  getMyFeedback,
  getAllFeedback,
  deleteFeedback,
} = require("../controllers/feedbackController");

const protect = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

// GET MY FEEDBACK - USER
router.get(
  "/my-feedback",
  protect,
  roleMiddleware("user"),
  getMyFeedback
);

// GET ALL FEEDBACK - ADMIN
router.get(
  "/",
  protect,
  roleMiddleware("admin"),
  getAllFeedback
);

// SUBMIT FEEDBACK - USER
router.post(
  "/",
  protect,
  roleMiddleware("user"),
  submitFeedback
);

router.delete(
  "/:id",
  protect,
  roleMiddleware("admin"),
  deleteFeedback
);

module.exports = router;