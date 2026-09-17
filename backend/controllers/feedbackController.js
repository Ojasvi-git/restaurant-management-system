const Feedback = require("../models/Feedback");
const Order = require("../models/Order");

// SUBMIT FEEDBACK
const submitFeedback = async (req, res) => {
  try {
    const { orderId, rating, comment } = req.body;

    // CHECK REQUIRED FIELDS
    if (!orderId || rating === undefined) {
      return res.status(400).json({
        message: "Order ID and rating are required",
      });
    }

    // VALIDATE RATING
    if (Number(rating) < 1 || Number(rating) > 5) {
      return res.status(400).json({
        message: "Rating must be between 1 and 5",
      });
    }

    // FIND ORDER USING PUBLIC ORDER ID
    const order = await Order.findOne({
      orderId: orderId.trim(),
    });

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    // CHECK ORDER OWNERSHIP
    if (
      !order.user ||
      String(order.user) !== String(req.user.id)
    ) {
      return res.status(403).json({
        message: "You can only rate your own order",
      });
    }

    // CHECK ORDER STATUS
    if (order.status !== "served") {
      return res.status(400).json({
        message:
          "You can submit feedback only after the order is served",
      });
    }

    // CHECK DUPLICATE FEEDBACK
    const existingFeedback = await Feedback.findOne({
      user: req.user.id,
      order: order._id,
    });

    if (existingFeedback) {
      return res.status(400).json({
        message:
          "You have already submitted feedback for this order",
      });
    }

    // CREATE FEEDBACK
    const feedback = await Feedback.create({
      user: req.user.id,
      order: order._id,
      rating: Number(rating),
      comment: comment?.trim() || "",
    });

    // POPULATE USER + ORDER
    await feedback.populate([
      {
        path: "user",
        select: "name email mobile",
      },
      {
        path: "order",
        select:
          "orderId customerName customerMobile totalAmount status",
      },
    ]);

    res.status(201).json({
      message:
        "Thank you! Your feedback has been submitted successfully",
      feedback,
    });
  } catch (error) {
    console.error("Submit Feedback Error:", error);

    res.status(500).json({
      message: "Server error while submitting feedback",
      error: error.message,
    });
  }
};
// GET MY FEEDBACK
const getMyFeedback = async (req, res) => {
  try {
    const feedbacks = await Feedback.find({
      user: req.user.id,
    })
      .populate("order", "orderId customerName totalAmount status createdAt")
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "Your feedback fetched successfully",
      feedbacks,
    });
  } catch (error) {
    console.error("Get My Feedback Error:", error);

    res.status(500).json({
      message: "Server error while fetching your feedback",
    });
  }
};

// GET ALL FEEDBACK - ADMIN
const getAllFeedback = async (req, res) => {
  try {
    const feedbacks = await Feedback.find()
      .populate("user", "name email mobile")
      .populate(
        "order",
        "orderId customerName customerMobile totalAmount status createdAt"
      )
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "All feedback fetched successfully",
      feedbacks,
    });
  } catch (error) {
    console.error("Get All Feedback Error:", error);

    res.status(500).json({
      message: "Server error while fetching feedback",
    });
  }
};

const deleteFeedback = async (req, res) => {
  try {
    const { id } = req.params;

    const feedback = await Feedback.findById(id);

    if (!feedback) {
      return res.status(404).json({
        message: "Feedback not found",
      });
    }

    await Feedback.findByIdAndDelete(id);

    res.status(200).json({
      message: "Feedback deleted successfully",
    });
  } catch (error) {
    console.error("Delete Feedback Error:", error);

    res.status(500).json({
      message: "Server error while deleting feedback",
    });
  }
};

module.exports = {
  submitFeedback,
   getMyFeedback,
   getAllFeedback,
   deleteFeedback,
};