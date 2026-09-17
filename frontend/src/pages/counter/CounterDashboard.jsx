import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";
import socket from "../../services/socket";
import Loader from "../../components/Loader";

const CounterDashboard = () => {
  const { user } = useAuth();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchOrders = useCallback(
    async (showRefreshLoader = false) => {
      try {
        if (showRefreshLoader) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        const response = await api.get("/orders");

        setOrders(response.data.orders || []);
      } catch (error) {
        console.error("Counter Dashboard Error:", error);

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

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  /* --------------------------------
     REAL-TIME ORDER UPDATES
  -------------------------------- */
  useEffect(() => {
    const handleNewOrder = () => {
      fetchOrders(true);
    };

    const handleOrderStatusChanged = () => {
      fetchOrders(true);
    };

    socket.on("newOrderCreated", handleNewOrder);
    socket.on("orderStatusChanged", handleOrderStatusChanged);

    return () => {
      socket.off("newOrderCreated", handleNewOrder);
      socket.off(
        "orderStatusChanged",
        handleOrderStatusChanged
      );
    };
  }, [fetchOrders]);

  if (loading) {
    return <Loader text="Loading counter dashboard..." />;
  }

  /* --------------------------------
     TODAY DATE RANGE
  -------------------------------- */

  const now = new Date();

  const todayStart = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );

  const tomorrowStart = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + 1
  );

  /* --------------------------------
     TODAY'S ORDERS
  -------------------------------- */

  const todayOrders = orders.filter((order) => {
    const orderDate = new Date(order.createdAt);

    return (
      orderDate >= todayStart &&
      orderDate < tomorrowStart
    );
  });

  /* --------------------------------
     PENDING ORDERS
  -------------------------------- */

  const pendingOrders = orders.filter(
    (order) => order.status === "pending"
  );

  /* --------------------------------
     TODAY'S SALES
     ONLY PAID ORDERS
  -------------------------------- */

  const todayPaidOrders = todayOrders.filter(
    (order) => order.paymentStatus === "paid"
  );

  const todaySales = todayPaidOrders.reduce(
    (total, order) => total + Number(order.totalAmount || 0),
    0
  );

  /* --------------------------------
     PENDING SALES
     ALL UNPAID ORDERS
  -------------------------------- */

  const pendingPaymentOrders = orders.filter(
    (order) => order.paymentStatus === "pending"
  );

  const pendingSales = pendingPaymentOrders.reduce(
    (total, order) => total + Number(order.totalAmount || 0),
    0
  );

  /* --------------------------------
     RECENT ORDERS
  -------------------------------- */

  const recentOrders = [...orders]
    .sort(
      (a, b) =>
        new Date(b.createdAt) -
        new Date(a.createdAt)
    )
    .slice(0, 5);

  return (
    <main className="min-h-screen bg-[#fffaf3] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <section className="overflow-hidden rounded-3xl bg-[#4b270b] p-8 shadow-xl md:p-10">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">

            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-orange-300">
                Counter Portal
              </p>

              <h1 className="mt-3 text-3xl font-extrabold text-white md:text-4xl">
                Welcome, {user?.name || "Staff"} 👋
              </h1>

              <p className="mt-3 text-orange-100">
                Manage customer orders, payments and billing from one place.
              </p>
            </div>

            <div className="rounded-2xl bg-white/10 px-6 py-5 text-center backdrop-blur">
              <p className="text-4xl">🧾</p>

              <p className="mt-2 font-bold text-white">
                Counter Desk
              </p>

              <p className="text-xs text-orange-200">
                Ready for Orders
              </p>
            </div>

          </div>
        </section>

        {/* Stats */}
        <section className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

          {/* Today's Orders */}
          <div className="rounded-2xl border border-orange-100 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">
            <p className="text-3xl">📦</p>

            <p className="mt-4 text-3xl font-extrabold text-[#4b270b]">
              {todayOrders.length}
            </p>

            <p className="text-sm text-[#80664f]">
              Today's Orders
            </p>
          </div>

          {/* Pending Orders */}
          <div className="rounded-2xl border border-orange-100 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">
            <p className="text-3xl">⏳</p>

            <p className="mt-4 text-3xl font-extrabold text-[#4b270b]">
              {pendingOrders.length}
            </p>

            <p className="text-sm text-[#80664f]">
              Pending Orders
            </p>
          </div>

          {/* Today's Sales */}
          <div className="rounded-2xl border border-orange-100 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">
            <p className="text-3xl">💵</p>

            <p className="mt-4 text-3xl font-extrabold text-[#4b270b]">
              ₹{todaySales.toLocaleString("en-IN")}
            </p>

            <p className="text-sm text-[#80664f]">
              Today's Sales
            </p>
          </div>

          {/* Pending Payments */}
          <div className="rounded-2xl border border-orange-100 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">
            <p className="text-3xl">💳</p>

            <p className="mt-4 text-3xl font-extrabold text-[#4b270b]">
              ₹{pendingSales.toLocaleString("en-IN")}
            </p>

            <p className="text-sm text-[#80664f]">
              Pending Payments
            </p>
          </div>

        </section>

        {/* Dashboard Controls */}
        <section className="mt-6 flex justify-end">
          <button
            onClick={() => fetchOrders(true)}
            disabled={refreshing}
            className="rounded-xl bg-[#8b4513] px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-[#6f350f] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {refreshing
              ? "Refreshing..."
              : "Refresh Dashboard"}
          </button>
        </section>

        {/* Main Actions */}
        <section className="mt-10">
          <p className="font-semibold uppercase tracking-widest text-orange-600">
            Counter Operations
          </p>

          <h2 className="mt-2 text-2xl font-extrabold text-[#4b270b]">
            Manage Restaurant Orders
          </h2>

          <div className="mt-6 grid gap-6 md:grid-cols-3">

            {/* Create Order */}
            <Link
              to="/counter/create-order"
              className="group rounded-3xl bg-[#8b4513] p-8 text-white shadow-lg transition duration-300 hover:-translate-y-2 hover:shadow-2xl"
            >
              <div className="text-5xl transition duration-300 group-hover:scale-110">
                ➕
              </div>

              <h3 className="mt-6 text-2xl font-extrabold">
                Create Order
              </h3>

              <p className="mt-3 text-orange-100">
                Create a new customer order and send it directly to the kitchen.
              </p>

              <span className="mt-6 inline-block rounded-full bg-white px-5 py-2 font-bold text-[#8b4513]">
                Create Order →
              </span>
            </Link>

            {/* Orders */}
            <Link
              to="/counter/orders"
              className="group rounded-3xl border border-orange-100 bg-white p-8 shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl"
            >
              <div className="text-5xl transition duration-300 group-hover:scale-110">
                📋
              </div>

              <h3 className="mt-6 text-2xl font-extrabold text-[#4b270b]">
                Orders
              </h3>

              <p className="mt-3 text-[#80664f]">
                View today's orders and check their current status.
              </p>

              <span className="mt-6 inline-block font-bold text-orange-600">
                View Orders →
              </span>
            </Link>

            {/* Bills */}
            <Link
              to="/counter/bills"
              className="group rounded-3xl border border-orange-100 bg-white p-8 shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl"
            >
              <div className="text-5xl transition duration-300 group-hover:scale-110">
                🧾
              </div>

              <h3 className="mt-6 text-2xl font-extrabold text-[#4b270b]">
                Bills & Payments
              </h3>

              <p className="mt-3 text-[#80664f]">
                Manage bills, payments and customer receipts.
              </p>

              <span className="mt-6 inline-block font-bold text-orange-600">
                Manage Bills →
              </span>
            </Link>

          </div>
        </section>

        {/* Recent Orders */}
        <section className="mt-10 rounded-3xl border border-orange-100 bg-white p-7 shadow-sm">

          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

            <div>
              <p className="font-semibold uppercase tracking-widest text-orange-600">
                Recent Activity
              </p>

              <h2 className="mt-2 text-2xl font-extrabold text-[#4b270b]">
                Recent Orders
              </h2>
            </div>

            <span className="rounded-full bg-orange-100 px-4 py-2 text-center text-sm font-bold text-orange-700">
              {todayOrders.length} Today
            </span>

          </div>

          {recentOrders.length === 0 ? (
            <div className="mt-8 rounded-2xl bg-[#fffaf3] p-8 text-center">
              <p className="text-5xl">📭</p>

              <h3 className="mt-4 text-lg font-bold text-[#4b270b]">
                No orders yet
              </h3>

              <p className="mt-2 text-sm text-[#80664f]">
                New customer orders will appear here.
              </p>
            </div>
          ) : (
            <div className="mt-8 space-y-4">

              {recentOrders.map((order) => (
                <div
                  key={order._id}
                  className="rounded-2xl border border-orange-100 bg-[#fffaf3] p-5 transition hover:shadow-md"
                >
                  <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">

                    <div>
                      <p className="font-bold text-[#4b270b]">
                        {order.orderId}
                      </p>

                      <p className="mt-1 text-sm text-[#80664f]">
                        {order.customerName}
                      </p>

                      <p className="mt-1 text-xs text-[#9a8067]">
                        {formatDateTime(order.createdAt)}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ${getStatusClass(
                          order.status
                        )}`}
                      >
                        {formatStatus(order.status)}
                      </span>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ${getPaymentClass(
                          order.paymentStatus
                        )}`}
                      >
                        {order.paymentStatus === "paid"
                          ? "Paid"
                          : "Payment Pending"}
                      </span>

                      <span className="font-extrabold text-[#8b4513]">
                        ₹
                        {Number(
                          order.totalAmount || 0
                        ).toLocaleString("en-IN")}
                      </span>

                    </div>

                  </div>
                </div>
              ))}

            </div>
          )}

        </section>

      </div>
    </main>
  );
};

/* --------------------------------
   HELPER FUNCTIONS
-------------------------------- */

const formatStatus = (status) => {
  if (!status) return "Unknown";

  return (
    status.charAt(0).toUpperCase() +
    status.slice(1)
  );
};

const getStatusClass = (status) => {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-700";

    case "preparing":
      return "bg-blue-100 text-blue-700";

    case "ready":
      return "bg-green-100 text-green-700";

    case "served":
      return "bg-orange-100 text-orange-700";

    case "cancelled":
      return "bg-red-100 text-red-700";

    default:
      return "bg-gray-100 text-gray-700";
  }
};

const getPaymentClass = (paymentStatus) => {
  if (paymentStatus === "paid") {
    return "bg-green-100 text-green-700";
  }

  return "bg-red-100 text-red-700";
};

const formatDateTime = (dateString) => {
  if (!dateString) return "";

  return new Date(dateString).toLocaleString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
  );
};

export default CounterDashboard;