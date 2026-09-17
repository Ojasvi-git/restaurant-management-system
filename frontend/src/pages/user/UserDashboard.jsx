import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";
import socket from "../../services/socket";
import Loader from "../../components/Loader";

const UserDashboard = () => {
  const { user } = useAuth();

  const [orders, setOrders] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch user dashboard data
  const fetchDashboardData = useCallback(
    async (showRefreshLoader = false) => {
      try {
        if (showRefreshLoader) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        const [ordersResponse, feedbackResponse] =
          await Promise.all([
            api.get("/orders/my-orders"),
            api.get("/feedback/my-feedback"),
          ]);

        setOrders(ordersResponse.data.orders || []);
        setFeedbacks(feedbackResponse.data.feedbacks || []);
      } catch (error) {
        console.error("User Dashboard Error:", error);

        toast.error(
          error.response?.data?.message ||
            "Failed to load dashboard data"
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    []
  );

  // Initial dashboard load
  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Live order updates
  useEffect(() => {
    const handleNewOrder = () => {
      fetchDashboardData(true);
    };

    const handleOrderStatusChanged = () => {
      fetchDashboardData(true);
    };

    socket.on("newOrderCreated", handleNewOrder);
    socket.on(
      "orderStatusChanged",
      handleOrderStatusChanged
    );

    return () => {
      socket.off("newOrderCreated", handleNewOrder);
      socket.off(
        "orderStatusChanged",
        handleOrderStatusChanged
      );
    };
  }, [fetchDashboardData]);

  if (loading) {
    return <Loader text="Loading your dashboard..." />;
  }

  // Active orders
  const activeOrders = orders.filter((order) =>
    ["pending", "preparing", "ready"].includes(
      order.status
    )
  );

  // Total spend = only paid orders
  const totalSpend = orders
    .filter((order) => order.paymentStatus === "paid")
    .reduce(
      (total, order) =>
        total + Number(order.totalAmount || 0),
      0
    );

  // Latest active order
  const activeOrder = [...activeOrders].sort(
    (a, b) =>
      new Date(b.createdAt) -
      new Date(a.createdAt)
  )[0];

  return (
    <main className="min-h-screen bg-[#fffaf3] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* Welcome */}
        <section className="overflow-hidden rounded-3xl bg-[#8b4513] p-8 shadow-xl md:p-10">
          <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-orange-200">
                Welcome Back
              </p>

              <h1 className="mt-3 text-3xl font-extrabold text-white md:text-4xl">
                Hello, {user?.name || "Guest"} 👋
              </h1>

              <p className="mt-3 max-w-xl text-orange-100">
                Track your orders, check your order history
                and share your experience with Flavor House.
              </p>
            </div>

            <div className="flex h-18 w-18 items-center justify-center overflow-hidden rounded-full bg-orange-100">
            {user?.profileImage ? (
             <img
             src={user.profileImage}
             alt={user.name || "Profile"}
             className="h-full w-full object-cover"
             />
          ) : (
           <span className="text-xl">👤</span>
            )}
          </div>
          </div>
        </section>

        {/* Stats */}
        <section className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

          {/* Total Orders */}
          <div className="rounded-2xl border border-orange-100 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-3xl">🛍️</span>

              <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-bold text-orange-700">
                Orders
              </span>
            </div>

            <p className="mt-5 text-3xl font-extrabold text-[#4b270b]">
              {orders.length}
            </p>

            <p className="mt-1 text-sm text-[#80664f]">
              Total Orders
            </p>
          </div>

          {/* Active Orders */}
          <div className="rounded-2xl border border-orange-100 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-3xl">🍽️</span>

              <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-bold text-orange-700">
                Active
              </span>
            </div>

            <p className="mt-5 text-3xl font-extrabold text-[#4b270b]">
              {activeOrders.length}
            </p>

            <p className="mt-1 text-sm text-[#80664f]">
              Active Orders
            </p>
          </div>

          {/* Total Spend */}
          <div className="rounded-2xl border border-orange-100 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-3xl">💰</span>

              <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-bold text-orange-700">
                Spent
              </span>
            </div>

            <p className="mt-5 text-3xl font-extrabold text-[#4b270b]">
              ₹{totalSpend.toLocaleString("en-IN")}
            </p>

            <p className="mt-1 text-sm text-[#80664f]">
              Total Spent
            </p>
          </div>

          {/* Reviews */}
          <div className="rounded-2xl border border-orange-100 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-3xl">⭐</span>

              <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-bold text-orange-700">
                Feedback
              </span>
            </div>

            <p className="mt-5 text-3xl font-extrabold text-[#4b270b]">
              {feedbacks.length}
            </p>

            <p className="mt-1 text-sm text-[#80664f]">
              Reviews Given
            </p>
          </div>

        </section>

        {/* Refresh */}
        <section className="mt-6 flex justify-end">
          <button
            onClick={() => fetchDashboardData(true)}
            disabled={refreshing}
            className="rounded-xl bg-[#8b4513] px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-[#6f350f] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {refreshing
              ? "Refreshing..."
              : "Refresh Dashboard"}
          </button>
        </section>

        {/* Quick Actions */}
        <section className="mt-10">
          <div className="mb-5">
            <p className="font-semibold uppercase tracking-widest text-orange-600">
              Quick Access
            </p>

            <h2 className="mt-2 text-2xl font-extrabold text-[#4b270b]">
              What would you like to do?
            </h2>
          </div>

          <div className="grid gap-5 md:grid-cols-3">

            {/* Menu */}
            <Link
              to="/menu"
              className="group rounded-3xl border border-orange-100 bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-100 text-3xl transition duration-300 group-hover:scale-110">
                🍴
              </div>

              <h3 className="mt-5 text-xl font-bold text-[#4b270b]">
                Explore Menu
              </h3>

              <p className="mt-2 text-sm leading-6 text-[#80664f]">
                Discover delicious dishes and explore our complete menu.
              </p>

              <span className="mt-5 inline-block font-bold text-orange-600">
                View Menu →
              </span>
            </Link>

            {/* Orders */}
            <Link
              to="/user/orders"
              className="group rounded-3xl border border-orange-100 bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-100 text-3xl transition duration-300 group-hover:scale-110">
                📦
              </div>

              <h3 className="mt-5 text-xl font-bold text-[#4b270b]">
                My Orders
              </h3>

              <p className="mt-2 text-sm leading-6 text-[#80664f]">
                Check your previous orders and track your current order.
              </p>

              <span className="mt-5 inline-block font-bold text-orange-600">
                View Orders →
              </span>
            </Link>

            {/* Profile */}
            <Link
              to="/user/profile"
              className="group rounded-3xl border border-orange-100 bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-100 text-3xl transition duration-300 group-hover:scale-110">
                ⚙️
              </div>

              <h3 className="mt-5 text-xl font-bold text-[#4b270b]">
                My Profile
              </h3>

              <p className="mt-2 text-sm leading-6 text-[#80664f]">
                Manage your personal information and account settings.
              </p>

              <span className="mt-5 inline-block font-bold text-orange-600">
                Manage Profile →
              </span>
            </Link>

          </div>
        </section>

        {/* Live Order */}
        <section className="mt-10 rounded-3xl border border-orange-100 bg-white p-7 shadow-sm md:p-8">

          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">

            <div className="flex-1">

              <p className="font-semibold uppercase tracking-widest text-orange-600">
                Live Order
              </p>

              {activeOrder ? (
                <>
                  <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
                    <h2 className="text-2xl font-extrabold text-[#4b270b]">
                      {activeOrder.orderId}
                    </h2>

                    <span
                      className={`w-fit rounded-full px-4 py-1 text-sm font-bold ${getStatusClass(
                        activeOrder.status
                      )}`}
                    >
                      {formatStatus(activeOrder.status)}
                    </span>
                  </div>

                  <p className="mt-3 text-[#80664f]">
                    Your order for{" "}
                    <span className="font-bold text-[#4b270b]">
                      {activeOrder.customerName}
                    </span>{" "}
                    is currently{" "}
                    <span className="font-bold text-orange-600">
                      {formatStatus(activeOrder.status).toLowerCase()}
                    </span>
                    .
                  </p>

                  {/* Progress */}
                  <div className="mt-6">

                    <div className="flex items-center justify-between text-xs font-bold text-[#80664f]">
                      <span
                        className={
                          activeOrder.status === "pending"
                            ? "text-orange-600"
                            : ""
                        }
                      >
                        Pending
                      </span>

                      <span
                        className={
                          activeOrder.status === "preparing"
                            ? "text-orange-600"
                            : ""
                        }
                      >
                        Preparing
                      </span>

                      <span
                        className={
                          activeOrder.status === "ready"
                            ? "text-orange-600"
                            : ""
                        }
                      >
                        Ready
                      </span>
                    </div>

                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-orange-100">
                      <div
                        className={`h-full rounded-full bg-[#8b4513] transition-all duration-500 ${getProgressWidth(
                          activeOrder.status
                        )}`}
                      />
                    </div>

                  </div>

                  <Link
                    to="/user/orders"
                    className="mt-6 inline-block rounded-xl bg-[#8b4513] px-5 py-3 font-bold text-white transition hover:bg-[#6f350f]"
                  >
                    View Order Details →
                  </Link>
                </>
              ) : (
                <>
                  <h2 className="mt-2 text-2xl font-extrabold text-[#4b270b]">
                    No Active Order
                  </h2>

                  <p className="mt-2 text-[#80664f]">
                    Your active order and its live status will appear here.
                  </p>
                </>
              )}

            </div>

            <div className="rounded-2xl bg-orange-50 px-6 py-5 text-center">
              <span className="text-4xl">
                {activeOrder ? "🔥" : "🍽️"}
              </span>

              <p className="mt-2 text-sm font-semibold text-[#6b4423]">
                {activeOrder
                  ? "Order in Progress"
                  : "Ready when you are!"}
              </p>

              {activeOrder && (
                <p className="mt-1 text-xs text-orange-600">
                  Live Updates
                </p>
              )}
            </div>

          </div>

        </section>

      </div>
    </main>
  );
};

/* Status text */
const formatStatus = (status) => {
  if (!status) return "Unknown";

  return (
    status.charAt(0).toUpperCase() +
    status.slice(1)
  );
};

/* Status badge */
const getStatusClass = (status) => {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-700";

    case "preparing":
      return "bg-blue-100 text-blue-700";

    case "ready":
      return "bg-green-100 text-green-700";

    default:
      return "bg-gray-100 text-gray-700";
  }
};

/* Live order progress */
const getProgressWidth = (status) => {
  switch (status) {
    case "pending":
      return "w-1/3";

    case "preparing":
      return "w-2/3";

    case "ready":
      return "w-full";

    default:
      return "w-0";
  }
};

export default UserDashboard;