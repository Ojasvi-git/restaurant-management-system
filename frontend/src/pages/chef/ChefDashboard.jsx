import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

import api from "../../services/api";
import socket from "../../services/socket";
import Loader from "../../components/Loader";
import { useAuth } from "../../context/AuthContext";

const ChefDashboard = () => {
  const { user } = useAuth();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingOrderId, setUpdatingOrderId] = useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);

      const response = await api.get("/orders");

      setOrders(response.data.orders || []);
    } catch (error) {
      console.error("Fetch Chef Orders Error:", error);

      toast.error(
        error.response?.data?.message ||
          "Unable to load kitchen orders"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();

    const handleNewOrder = (newOrder) => {
      setOrders((previousOrders) => {
        const alreadyExists = previousOrders.some(
          (order) => order._id === newOrder.orderId
        );

        if (alreadyExists) {
          return previousOrders;
        }

        return [
          {
            _id: newOrder.orderId,
            orderId: newOrder.publicOrderId,
            customerName: newOrder.customerName,
            customerMobile: newOrder.customerMobile,
            items: newOrder.items || [],
            totalAmount: newOrder.totalAmount,
            status: newOrder.status,
            paymentStatus: newOrder.paymentStatus,
            createdAt: newOrder.createdAt,
          },
          ...previousOrders,
        ];
      });

      toast.success(
        `🔔 New Order: #${newOrder.publicOrderId}`
      );
    };

    const handleStatusChanged = (updatedOrder) => {
      setOrders((previousOrders) =>
        previousOrders.map((order) =>
          order._id === updatedOrder.orderId
            ? {
                ...order,
                status: updatedOrder.status,
                updatedAt: updatedOrder.updatedAt,
              }
            : order
        )
      );
    };

    socket.on("newOrderCreated", handleNewOrder);
    socket.on("orderStatusChanged", handleStatusChanged);

    return () => {
      socket.off("newOrderCreated", handleNewOrder);
      socket.off("orderStatusChanged", handleStatusChanged);
    };
  }, []);

  const getNextStatus = (status) => {
    switch (status) {
      case "pending":
        return "preparing";

      case "preparing":
        return "ready";

      case "ready":
        return "served";

      default:
        return null;
    }
  };

  const getNextButtonText = (status) => {
    switch (status) {
      case "pending":
        return "Start Preparing";

      case "preparing":
        return "Mark Ready";

      case "ready":
        return "Mark Served";

      default:
        return null;
    }
  };

  const updateStatus = async (orderId, currentStatus) => {
    const nextStatus = getNextStatus(currentStatus);

    if (!nextStatus) {
      return;
    }

    try {
      setUpdatingOrderId(orderId);

      const response = await api.put(
        `/orders/${orderId}/status`,
        {
          status: nextStatus,
        }
      );

      setOrders((previousOrders) =>
        previousOrders.map((order) =>
          order._id === orderId
            ? {
                ...order,
                status: response.data.order.status,
                updatedAt: response.data.order.updatedAt,
              }
            : order
        )
      );

      toast.success(
        response.data.message ||
          `Order marked as ${nextStatus}`
      );
    } catch (error) {
      console.error("Update Order Status Error:", error);

      toast.error(
        error.response?.data?.message ||
          "Unable to update order status"
      );
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const stats = useMemo(() => {
    return {
      pending: orders.filter(
        (order) => order.status === "pending"
      ).length,

      preparing: orders.filter(
        (order) => order.status === "preparing"
      ).length,

      ready: orders.filter(
        (order) => order.status === "ready"
      ).length,

      served: orders.filter(
        (order) => order.status === "served"
      ).length,
    };
  }, [orders]);

  const activeOrders = useMemo(() => {
    return orders.filter(
      (order) =>
        order.status !== "served" &&
        order.status !== "cancelled"
    );
  }, [orders]);

  const getStatusClasses = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-700";

      case "preparing":
        return "bg-orange-100 text-orange-700";

      case "ready":
        return "bg-green-100 text-green-700";

      case "served":
        return "bg-blue-100 text-blue-700";

      case "cancelled":
        return "bg-red-100 text-red-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  if (loading) {
    return <Loader text="Loading kitchen orders..." />;
  }

  return (
    <main className="min-h-screen bg-[#fffaf3] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* HEADER */}
        <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-semibold uppercase tracking-widest text-orange-600">
              Chef Portal
            </p>

            <h1 className="mt-2 text-3xl font-extrabold text-[#4b270b] sm:text-4xl">
              Kitchen Dashboard
            </h1>

            <p className="mt-2 text-[#80664f]">
              Welcome, {user?.name || "Chef"}. Manage incoming orders
              and update their kitchen status.
            </p>
          </div>

          <button
            onClick={fetchOrders}
            disabled={loading}
            className="rounded-xl bg-[#8b4513] px-5 py-3 font-bold text-white transition hover:bg-[#6f350d] disabled:cursor-not-allowed disabled:opacity-60"
          >
            Refresh Orders
          </button>
        </div>

        {/* LIVE INDICATOR */}
        <div className="mb-8 flex items-center gap-3 rounded-2xl border border-green-200 bg-green-50 px-5 py-4">
          <span className="h-3 w-3 animate-pulse rounded-full bg-green-500" />

          <div>
            <p className="font-bold text-green-700">
              Live Kitchen Updates Active
            </p>

            <p className="text-sm text-green-600">
              New orders and status changes appear automatically.
            </p>
          </div>
        </div>

        {/* STATS */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

          <div className="rounded-3xl bg-white p-6 shadow-lg">
            <p className="text-sm font-semibold text-[#80664f]">
              Pending
            </p>

            <p className="mt-2 text-4xl font-extrabold text-yellow-600">
              {stats.pending}
            </p>

            <p className="mt-2 text-sm text-[#80664f]">
              Waiting to prepare
            </p>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-lg">
            <p className="text-sm font-semibold text-[#80664f]">
              Preparing
            </p>

            <p className="mt-2 text-4xl font-extrabold text-orange-600">
              {stats.preparing}
            </p>

            <p className="mt-2 text-sm text-[#80664f]">
              Currently cooking
            </p>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-lg">
            <p className="text-sm font-semibold text-[#80664f]">
              Ready
            </p>

            <p className="mt-2 text-4xl font-extrabold text-green-600">
              {stats.ready}
            </p>

            <p className="mt-2 text-sm text-[#80664f]">
              Ready to serve
            </p>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-lg">
            <p className="text-sm font-semibold text-[#80664f]">
              Served
            </p>

            <p className="mt-2 text-4xl font-extrabold text-blue-600">
              {stats.served}
            </p>

            <p className="mt-2 text-sm text-[#80664f]">
              Completed orders
            </p>
          </div>

        </div>

        {/* ACTIVE ORDERS */}
        <div className="mt-10">

          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-extrabold text-[#4b270b]">
                Active Kitchen Orders
              </h2>

              <p className="mt-1 text-sm text-[#80664f]">
                {activeOrders.length} active order
                {activeOrders.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>

          {activeOrders.length === 0 ? (
            <div className="rounded-3xl bg-white px-6 py-16 text-center shadow-lg">
              <div className="text-6xl">👨‍🍳</div>

              <h2 className="mt-5 text-2xl font-bold text-[#4b270b]">
                Kitchen Is Clear
              </h2>

              <p className="mt-2 text-[#80664f]">
                No active orders right now. New orders will appear
                automatically.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 lg:grid-cols-2">

              {activeOrders.map((order) => {
                const nextStatus = getNextStatus(order.status);

                const buttonText = getNextButtonText(
                  order.status
                );

                const isUpdating =
                  updatingOrderId === order._id;

                return (
                  <div
                    key={order._id}
                    className="overflow-hidden rounded-3xl bg-white shadow-lg transition hover:shadow-xl"
                  >

                    {/* ORDER HEADER */}
                    <div className="border-b border-orange-100 bg-[#fffaf3] p-5">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

                        <div>
                          <p className="text-xs font-bold uppercase tracking-widest text-orange-600">
                            Order
                          </p>

                          <h3 className="mt-1 text-xl font-extrabold text-[#4b270b]">
                            #{order.orderId}
                          </h3>

                          <p className="mt-1 text-sm text-[#80664f]">
                            {new Date(
                              order.createdAt
                            ).toLocaleString("en-IN")}
                          </p>
                        </div>

                        <span
                          className={`w-fit rounded-full px-4 py-2 text-xs font-bold capitalize ${getStatusClasses(
                            order.status
                          )}`}
                        >
                          {order.status}
                        </span>

                      </div>
                    </div>

                    {/* CUSTOMER */}
                    <div className="p-5">

                      <div className="rounded-2xl bg-[#fffaf3] p-4">
                        <p className="text-xs font-bold uppercase tracking-wider text-orange-600">
                          Customer
                        </p>

                        <h4 className="mt-1 text-lg font-extrabold text-[#4b270b]">
                          {order.customerName}
                        </h4>

                        <p className="mt-1 text-sm text-[#80664f]">
                          {order.customerMobile}
                        </p>
                      </div>

                      {/* ITEMS */}
                      <div className="mt-5">
                        <h4 className="font-bold text-[#4b270b]">
                          Ordered Items
                        </h4>

                        <div className="mt-3 space-y-3">
                          {order.items?.map((item, index) => (
                            <div
                              key={`${order._id}-${index}`}
                              className="flex items-center justify-between gap-4 border-b border-orange-100 pb-3"
                            >
                              <div>
                                <p className="font-semibold text-[#4b270b]">
                                  {item.name}
                                </p>

                                <p className="text-sm text-[#80664f]">
                                  ₹{item.price} ×{" "}
                                  {item.quantity}
                                </p>
                              </div>

                              <p className="font-bold text-orange-600">
                                ₹{item.subtotal}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* TOTAL */}
                      <div className="mt-5 flex items-center justify-between border-t border-orange-100 pt-5">
                        <span className="font-semibold text-[#80664f]">
                          Total
                        </span>

                        <span className="text-2xl font-extrabold text-[#8b4513]">
                          ₹{order.totalAmount}
                        </span>
                      </div>

                      {/* ACTION */}
                      <div className="mt-5">

                        {nextStatus && buttonText ? (
                          <button
                            onClick={() =>
                              updateStatus(
                                order._id,
                                order.status
                              )
                            }
                            disabled={isUpdating}
                            className="w-full rounded-xl bg-[#8b4513] px-5 py-3 font-bold text-white transition hover:bg-[#6f350d] disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {isUpdating
                              ? "Updating..."
                              : buttonText}
                          </button>
                        ) : (
                          <div className="rounded-xl bg-green-50 px-5 py-3 text-center font-bold text-green-700">
                            ✓ Order Served
                          </div>
                        )}

                      </div>
                    </div>
                  </div>
                );
              })}

            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default ChefDashboard;