import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

import api from "../../services/api";
import Loader from "../../components/Loader";

const AdminFeedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  const [deletingId, setDeletingId] = useState(null);

  const fetchFeedbacks = async () => {
    try {
      setLoading(true);

      const response = await api.get("/feedback");

      setFeedbacks(response.data.feedbacks || []);
    } catch (error) {
      console.error("Fetch Admin Feedback Error:", error);

      toast.error(
        error.response?.data?.message ||
          "Unable to load feedback"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const stats = useMemo(() => {
    const totalReviews = feedbacks.length;

    const totalRating = feedbacks.reduce(
      (sum, feedback) => sum + Number(feedback.rating || 0),
      0
    );

    const averageRating =
      totalReviews > 0
        ? (totalRating / totalReviews).toFixed(1)
        : "0.0";

    return {
      totalReviews,
      averageRating,
      fiveStar: feedbacks.filter(
        (feedback) => feedback.rating === 5
      ).length,
      fourStar: feedbacks.filter(
        (feedback) => feedback.rating === 4
      ).length,
      threeStar: feedbacks.filter(
        (feedback) => feedback.rating === 3
      ).length,
      twoStar: feedbacks.filter(
        (feedback) => feedback.rating === 2
      ).length,
      oneStar: feedbacks.filter(
        (feedback) => feedback.rating === 1
      ).length,
    };
  }, [feedbacks]);

  const getPercentage = (count) => {
    if (stats.totalReviews === 0) {
      return 0;
    }

    return Math.round(
      (count / stats.totalReviews) * 100
    );
  };


  const deleteFeedback = async (feedbackId) => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this feedback?"
  );

  if (!confirmDelete) {
    return;
  }

  try {
    setDeletingId(feedbackId);

    await api.delete(`/feedback/${feedbackId}`);

    toast.success("Feedback deleted successfully");

    setFeedbacks((prev) =>
      prev.filter((feedback) => feedback._id !== feedbackId)
    );
  } catch (error) {
    console.error("Delete Feedback Error:", error);

    toast.error(
      error.response?.data?.message ||
        "Feedback delete nahi ho paya"
    );
  } finally {
    setDeletingId(null);
  }
}; 

  if (loading) {
    return <Loader text="Loading customer feedback..." />;
  }

  return (
    <main className="min-h-screen bg-[#fffaf3] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* HEADER */}
        <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-semibold uppercase tracking-widest text-orange-600">
              Admin Portal
            </p>

            <h1 className="mt-2 text-3xl font-extrabold text-[#4b270b] sm:text-4xl">
              Customer Feedback
            </h1>

            <p className="mt-2 text-[#80664f]">
              Monitor customer ratings and feedback about your
              restaurant.
            </p>
          </div>

          <button
            onClick={fetchFeedbacks}
            disabled={loading}
            className="rounded-xl bg-[#8b4513] px-5 py-3 font-bold text-white transition hover:bg-[#6f350d] disabled:cursor-not-allowed disabled:opacity-60"
          >
            Refresh Feedback
          </button>
        </div>

        {/* STATS */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

          {/* AVERAGE */}
          <div className="rounded-3xl bg-white p-6 shadow-lg">
            <p className="text-sm font-semibold text-[#80664f]">
              Average Rating
            </p>

            <div className="mt-3 flex items-center gap-3">
              <span className="text-4xl font-extrabold text-[#8b4513]">
                {stats.averageRating}
              </span>

              <div>
                <div className="text-xl">
                  {"⭐".repeat(
                    Math.round(Number(stats.averageRating))
                  )}
                </div>

                <p className="text-xs text-[#80664f]">
                  Out of 5
                </p>
              </div>
            </div>
          </div>

          {/* TOTAL */}
          <div className="rounded-3xl bg-white p-6 shadow-lg">
            <p className="text-sm font-semibold text-[#80664f]">
              Total Reviews
            </p>

            <p className="mt-3 text-4xl font-extrabold text-orange-600">
              {stats.totalReviews}
            </p>

            <p className="mt-2 text-sm text-[#80664f]">
              Customer reviews received
            </p>
          </div>

          {/* FIVE STAR */}
          <div className="rounded-3xl bg-white p-6 shadow-lg">
            <p className="text-sm font-semibold text-[#80664f]">
              5 Star Reviews
            </p>

            <p className="mt-3 text-4xl font-extrabold text-green-600">
              {stats.fiveStar}
            </p>

            <p className="mt-2 text-sm text-[#80664f]">
              {getPercentage(stats.fiveStar)}% of reviews
            </p>
          </div>

          {/* ONE STAR */}
          <div className="rounded-3xl bg-white p-6 shadow-lg">
            <p className="text-sm font-semibold text-[#80664f]">
              1 Star Reviews
            </p>

            <p className="mt-3 text-4xl font-extrabold text-red-600">
              {stats.oneStar}
            </p>

            <p className="mt-2 text-sm text-[#80664f]">
              {getPercentage(stats.oneStar)}% of reviews
            </p>
          </div>
        </div>

        {/* RATING DISTRIBUTION */}
        <div className="mt-8 rounded-3xl bg-white p-6 shadow-lg sm:p-8">
          <h2 className="text-2xl font-extrabold text-[#4b270b]">
            Rating Distribution
          </h2>

          <p className="mt-1 text-sm text-[#80664f]">
            See how customers are rating their experience.
          </p>

          <div className="mt-6 space-y-4">
            {[
              {
                stars: 5,
                count: stats.fiveStar,
              },
              {
                stars: 4,
                count: stats.fourStar,
              },
              {
                stars: 3,
                count: stats.threeStar,
              },
              {
                stars: 2,
                count: stats.twoStar,
              },
              {
                stars: 1,
                count: stats.oneStar,
              },
            ].map((item) => (
              <div
                key={item.stars}
                className="flex items-center gap-3"
              >
                <div className="flex w-20 shrink-0 items-center gap-1">
                  <span className="font-bold text-[#4b270b]">
                    {item.stars}
                  </span>
                  <span>⭐</span>
                </div>

                <div className="h-3 flex-1 overflow-hidden rounded-full bg-orange-100">
                  <div
                    className="h-full rounded-full bg-orange-500 transition-all"
                    style={{
                      width: `${getPercentage(item.count)}%`,
                    }}
                  />
                </div>

                <span className="w-12 text-right text-sm font-bold text-[#80664f]">
                  {item.count}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* REVIEWS */}
        <div className="mt-8">
          <div className="mb-5">
            <h2 className="text-2xl font-extrabold text-[#4b270b]">
              Customer Reviews
            </h2>

            <p className="mt-1 text-sm text-[#80664f]">
              Latest feedback from your customers.
            </p>
          </div>

          {feedbacks.length === 0 ? (
            <div className="rounded-3xl bg-white px-6 py-16 text-center shadow-lg">
              <div className="text-6xl">💬</div>

              <h2 className="mt-5 text-2xl font-bold text-[#4b270b]">
                No Feedback Yet
              </h2>

              <p className="mt-2 text-[#80664f]">
                Customer reviews will appear here once users
                submit their feedback.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 lg:grid-cols-2">
              {feedbacks.map((feedback) => (
                <div
                  key={feedback._id}
                  className="rounded-3xl bg-white p-6 shadow-lg transition hover:shadow-xl"
                >
                  {/* CUSTOMER */}
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 text-xl">
                        👤
                      </div>

                      <div>
                        <h3 className="font-extrabold text-[#4b270b]">
                          {feedback.user?.name ||
                            "Customer"}
                        </h3>

                        <p className="text-sm text-[#80664f]">
                          {feedback.user?.email || "No email"}
                        </p>

                        <p className="text-sm text-[#80664f]">
                          {feedback.user?.mobile || "No mobile"}
                        </p>
                      </div>
                    </div>

                    {/* RATING */}
                    <div className="text-right">
                      <div className="text-lg">
                        {"⭐".repeat(
                          feedback.rating
                        )}
                      </div>

                      <p className="mt-1 text-xs font-semibold text-[#80664f]">
                        {feedback.rating}/5
                      </p>
                    </div>
                  </div>

                  {/* ORDER */}
                  <div className="mt-5 rounded-2xl bg-[#fffaf3] p-4">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-orange-600">
                          Order
                        </p>

                        <p className="mt-1 font-extrabold text-[#4b270b]">
                          #{feedback.order?.orderId ||
                            "Unknown Order"}
                        </p>
                      </div>

                      <div className="text-left sm:text-right">
                        <p className="text-xs text-[#80664f]">
                          Order Total
                        </p>

                        <p className="font-bold text-[#8b4513]">
                          ₹
                          {feedback.order?.totalAmount ||
                            0}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* COMMENT */}
                  <div className="mt-5">
                    <p className="text-xs font-bold uppercase tracking-wider text-orange-600">
                      Customer Comment
                    </p>

                    {feedback.comment ? (
                      <p className="mt-2 rounded-2xl border border-orange-100 bg-[#fffaf3] p-4 leading-relaxed text-[#5f4937]">
                        "{feedback.comment}"
                      </p>
                    ) : (
                      <p className="mt-2 italic text-[#80664f]">
                        No written comment provided.
                      </p>
                    )}
                  </div>

                  {/* DATE */}
                  <div className="mt-5 border-t border-orange-100 pt-4">
                    <p className="text-xs text-[#80664f]">
                      Submitted on
                    </p>

                    <p className="mt-1 text-sm font-semibold text-[#4b270b]">
                      {new Date(
                        feedback.createdAt
                      ).toLocaleString("en-IN")}
                    </p>
                  </div>

               <div className="mt-5 flex justify-end">
              <button
               onClick={() => deleteFeedback(feedback._id)}
               disabled={deletingId === feedback._id}
               className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
               >
             {deletingId === feedback._id
              ? "Deleting..."
             : "🗑️ Delete Feedback"}
            </button>
            </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      
    </main>
  );
};

export default AdminFeedback;