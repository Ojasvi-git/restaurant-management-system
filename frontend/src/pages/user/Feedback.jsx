import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import api from "../../services/api";
import Loader from "../../components/Loader";

const Feedback = () => {
  const [orders, setOrders] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);

  const [loading, setLoading] = useState(true);
  const [submittingOrderId, setSubmittingOrderId] = useState(null);

  const [ratings, setRatings] = useState({});
  const [comments, setComments] = useState({});

  const fetchData = async () => {
    try {
      setLoading(true);

      const [ordersResponse, feedbackResponse] = await Promise.all([
        api.get("/orders/my-orders"),
        api.get("/feedback/my-feedback"),
      ]);

      setOrders(ordersResponse.data.orders || []);
      setFeedbacks(feedbackResponse.data.feedbacks || []);
    } catch (error) {
      console.error("Fetch Feedback Data Error:", error);

      toast.error(
        error.response?.data?.message ||
          "Unable to load feedback page"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const hasFeedback = (orderId) => {
    return feedbacks.some(
      (feedback) =>
        String(feedback.order?._id || feedback.order) ===
        String(orderId)
    );
  };

  const handleRating = (orderId, rating) => {
    setRatings((previous) => ({
      ...previous,
      [orderId]: rating,
    }));
  };

  const handleComment = (orderId, comment) => {
    setComments((previous) => ({
      ...previous,
      [orderId]: comment,
    }));
  };

  const submitFeedback = async (order) => {
    const rating = ratings[order._id];
    const comment = comments[order._id] || "";

    if (!rating) {
      toast.error("Please select a rating");
      return;
    }

    try {
      setSubmittingOrderId(order._id);

      const response = await api.post("/feedback", {
        orderId: order.orderId,
        rating,
        comment,
      });

      toast.success(
        response.data.message ||
          "Feedback submitted successfully"
      );

      setRatings((previous) => {
        const updated = { ...previous };
        delete updated[order._id];
        return updated;
      });

      setComments((previous) => {
        const updated = { ...previous };
        delete updated[order._id];
        return updated;
      });

      fetchData();
    } catch (error) {
      console.error("Submit Feedback Error:", error);

      toast.error(
        error.response?.data?.message ||
          "Unable to submit feedback"
      );
    } finally {
      setSubmittingOrderId(null);
    }
  };

  if (loading) {
    return <Loader text="Loading your feedback..." />;
  }

  const servedOrders = orders.filter(
    (order) => order.status === "served"
  );

  return (
    <main className="min-h-screen bg-[#fffaf3] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">

        {/* HEADER */}
        <div className="mb-10 text-center">
          <p className="font-semibold uppercase tracking-widest text-orange-600">
            Customer Feedback
          </p>

          <h1 className="mt-2 text-3xl font-extrabold text-[#4b270b] sm:text-4xl">
            Share Your Experience ⭐
          </h1>

          <p className="mx-auto mt-3 max-w-2xl text-[#80664f]">
            Your feedback helps us improve our food and service.
            Please rate your completed orders.
          </p>
        </div>

        {/* NO SERVED ORDERS */}
        {servedOrders.length === 0 ? (
          <div className="rounded-3xl bg-white px-6 py-16 text-center shadow-lg">
            <div className="text-6xl">🍽️</div>

            <h2 className="mt-5 text-2xl font-bold text-[#4b270b]">
              No Completed Orders Yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-[#80664f]">
              Once one of your orders is served, you will be
              able to rate your experience here.
            </p>

            <Link
              to="/menu"
              className="mt-6 inline-block rounded-xl bg-[#8b4513] px-6 py-3 font-bold text-white transition hover:bg-[#6f350d]"
            >
              Explore Menu
            </Link>
          </div>
        ) : (
          <div className="space-y-6">

            {servedOrders.map((order) => {
              const alreadySubmitted = hasFeedback(order._id);
              const selectedRating = ratings[order._id] || 0;
              const submitting =
                submittingOrderId === order._id;

              const submittedFeedback = feedbacks.find(
                (feedback) =>
                  String(
                    feedback.order?._id || feedback.order
                  ) === String(order._id)
              );

              return (
                <div
                  key={order._id}
                  className="overflow-hidden rounded-3xl bg-white shadow-lg"
                >
                  {/* ORDER HEADER */}
                  <div className="border-b border-orange-100 bg-[#fffaf3] p-5 sm:p-6">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-orange-600">
                          Completed Order
                        </p>

                        <h2 className="mt-1 text-xl font-extrabold text-[#4b270b]">
                          #{order.orderId}
                        </h2>

                        <p className="mt-1 text-sm text-[#80664f]">
                          {new Date(
                            order.createdAt
                          ).toLocaleString("en-IN")}
                        </p>
                      </div>

                      <span className="w-fit rounded-full bg-green-100 px-4 py-2 text-xs font-bold capitalize text-green-700">
                        ✓ Served
                      </span>
                    </div>
                  </div>

                  <div className="p-5 sm:p-6">

                    {/* ITEMS */}
                    <div>
                      <h3 className="font-bold text-[#4b270b]">
                        Your Order
                      </h3>

                      <div className="mt-3 space-y-2">
                        {order.items?.map((item, index) => (
                          <div
                            key={`${order._id}-${index}`}
                            className="flex items-center justify-between border-b border-orange-100 pb-2"
                          >
                            <div>
                              <p className="font-medium text-[#4b270b]">
                                {item.name}
                              </p>

                              <p className="text-sm text-[#80664f]">
                                ₹{item.price} × {item.quantity}
                              </p>
                            </div>

                            <p className="font-bold text-orange-600">
                              ₹{item.subtotal}
                            </p>
                          </div>
                        ))}
                      </div>

                      <div className="mt-4 flex justify-between border-t border-orange-100 pt-4">
                        <span className="font-semibold text-[#80664f]">
                          Total
                        </span>

                        <span className="text-xl font-extrabold text-[#8b4513]">
                          ₹{order.totalAmount}
                        </span>
                      </div>
                    </div>

                    {/* ALREADY SUBMITTED */}
                    {alreadySubmitted ? (
                      <div className="mt-6 rounded-2xl border border-green-200 bg-green-50 p-5">

                        <div className="flex items-center justify-between gap-4">
                          <div>
                            <p className="font-bold text-green-700">
                              ✓ Feedback Submitted
                            </p>

                            <p className="mt-1 text-sm text-green-600">
                              Thank you for sharing your experience!
                            </p>
                          </div>

                          <div className="text-2xl">
                            {"⭐".repeat(
                              submittedFeedback?.rating || 0
                            )}
                          </div>
                        </div>

                        {submittedFeedback?.comment && (
                          <p className="mt-4 rounded-xl bg-white p-4 text-sm italic text-[#80664f]">
                            "{submittedFeedback.comment}"
                          </p>
                        )}
                      </div>
                    ) : (
                      /* FEEDBACK FORM */
                      <div className="mt-6 rounded-2xl border border-orange-100 bg-[#fffaf3] p-5">

                        <h3 className="text-lg font-extrabold text-[#4b270b]">
                          How was your experience?
                        </h3>

                        {/* STARS */}
                        <div className="mt-4">
                          <p className="text-sm font-semibold text-[#80664f]">
                            Select your rating
                          </p>

                          <div className="mt-3 flex gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                type="button"
                                onClick={() =>
                                  handleRating(
                                    order._id,
                                    star
                                  )
                                }
                                className={`text-4xl transition hover:scale-110 ${
                                  star <= selectedRating
                                    ? "opacity-100"
                                    : "opacity-30"
                                }`}
                                aria-label={`${star} star`}
                              >
                                ⭐
                              </button>
                            ))}
                          </div>

                          {selectedRating > 0 && (
                            <p className="mt-2 text-sm font-semibold text-orange-600">
                              {selectedRating === 5 &&
                                "Excellent! ❤️"}

                              {selectedRating === 4 &&
                                "Great! 👍"}

                              {selectedRating === 3 &&
                                "Good 🙂"}

                              {selectedRating === 2 &&
                                "Could be better 😐"}

                              {selectedRating === 1 &&
                                "We'll try to improve 🙏"}
                            </p>
                          )}
                        </div>

                        {/* COMMENT */}
                        <div className="mt-5">
                          <label className="text-sm font-semibold text-[#4b270b]">
                            Your Feedback
                          </label>

                          <textarea
                            value={comments[order._id] || ""}
                            onChange={(e) =>
                              handleComment(
                                order._id,
                                e.target.value
                              )
                            }
                            placeholder="Tell us about your food and service..."
                            maxLength={500}
                            rows={4}
                            className="mt-2 w-full rounded-xl border border-orange-200 bg-white px-4 py-3 text-[#4b270b] outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                          />

                          <p className="mt-1 text-right text-xs text-[#80664f]">
                            {(comments[order._id] || "").length}/500
                          </p>
                        </div>

                        {/* SUBMIT */}
                        <button
                          type="button"
                          onClick={() =>
                            submitFeedback(order)
                          }
                          disabled={submitting}
                          className="mt-4 w-full rounded-xl bg-[#8b4513] px-5 py-3 font-bold text-white transition hover:bg-[#6f350d] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {submitting
                            ? "Submitting Feedback..."
                            : "Submit Feedback ⭐"}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
};

export default Feedback;