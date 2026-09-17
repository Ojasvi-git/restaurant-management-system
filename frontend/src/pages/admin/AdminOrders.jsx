import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../../services/api";
import Loader from "../../components/Loader";
import socket from "../../services/socket";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");

  const fetchOrders = async (showLoader = true) => {
    try {
      if (showLoader) {
        setLoading(true);
      }

      const response = await api.get("/orders");

      setOrders(response.data.orders || []);
    } catch (error) {
      console.error("Fetch Admin Orders Error:", error);

      toast.error(
        error.response?.data?.message ||
          "Orders fetch karne me problem hui"
      );
    } finally {
      if (showLoader) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchOrders();

    const handleNewOrder = () => {
      toast.success("New order received!");
      fetchOrders(false);
    };

    const handleOrderStatusChanged = () => {
      fetchOrders(false);
    };

    socket.on("newOrderCreated", handleNewOrder);
    socket.on("orderStatusChanged", handleOrderStatusChanged);

    return () => {
      socket.off("newOrderCreated", handleNewOrder);
      socket.off("orderStatusChanged", handleOrderStatusChanged);
    };
  }, []);

  const updateStatus = async (orderId, newStatus) => {
    try {
      setUpdatingId(orderId);

      await api.put(`/orders/${orderId}/status`, {
        status: newStatus,
      });

      toast.success(`Order status updated to ${newStatus}`);

      await fetchOrders(false);
    } catch (error) {
      console.error("Update Status Error:", error);

      toast.error(
        error.response?.data?.message ||
          "Order status update nahi ho paya"
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const updatePayment = async (orderId, paymentStatus) => {
    try {
      setUpdatingId(orderId);

      await api.put(`/orders/${orderId}/payment`, {
        paymentStatus,
      });

      toast.success(
        paymentStatus === "paid"
          ? "Payment marked as paid"
          : "Payment marked as pending"
      );

      await fetchOrders(false);
    } catch (error) {
      console.error("Update Payment Error:", error);

      toast.error(
        error.response?.data?.message ||
          "Payment status update nahi ho paya"
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredOrders = orders.filter((order) => {
    const statusMatch =
      statusFilter === "all" || order.status === statusFilter;

    const paymentMatch =
      paymentFilter === "all" ||
      order.paymentStatus === paymentFilter;

    return statusMatch && paymentMatch;
  });

  const getStatusClass = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";

      case "preparing":
        return "bg-blue-100 text-blue-800";

      case "ready":
        return "bg-green-100 text-green-800";

      case "served":
        return "bg-emerald-100 text-emerald-800";

      case "cancelled":
        return "bg-red-100 text-red-800";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getPaymentClass = (paymentStatus) => {
    return paymentStatus === "paid"
      ? "bg-green-100 text-green-800"
      : "bg-red-100 text-red-800";
  };

  const formatStatus = (status) => {
    if (!status) return "";

    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  const totalOrders = orders.length;

  const pendingOrders = orders.filter(
    (order) => order.status === "pending"
  ).length;

  const preparingOrders = orders.filter(
    (order) => order.status === "preparing"
  ).length;

  const readyOrders = orders.filter(
    (order) => order.status === "ready"
  ).length;

  const paidOrders = orders.filter(
    (order) => order.paymentStatus === "paid"
  ).length;

  if (loading) {
    return <Loader text="Loading orders..." />;
  }

  return (
    <div className="min-h-screen bg-[#fffaf3] px-4 py-8 md:px-8">
      <div className="mx-auto max-w-7xl">

        {/* HEADER */}
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-orange-600">
              Admin Panel
            </p>

            <h1 className="text-3xl font-extrabold text-[#4b270b] md:text-4xl">
              Order Management
            </h1>

            <p className="mt-2 text-sm text-[#80664f] md:text-base">
              Monitor restaurant orders, status and payments.
            </p>
          </div>

          <button
            onClick={() => fetchOrders()}
            disabled={loading}
            className="rounded-xl bg-[#8b4513] px-5 py-3 font-semibold text-white shadow-md transition hover:bg-[#6f350f] disabled:cursor-not-allowed disabled:opacity-60"
          >
            🔄 Refresh Orders
          </button>
        </div>

        {/* LIVE INDICATOR */}
        <div className="mb-6 flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
          <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-green-500"></span>
          Live order updates enabled
        </div>

        {/* STATS */}
        <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-5">

          <div className="rounded-2xl border border-orange-100 bg-white p-5 shadow-sm">
            <p className="text-sm text-[#80664f]">
              Total Orders
            </p>

            <h2 className="mt-2 text-3xl font-extrabold text-[#4b270b]">
              {totalOrders}
            </h2>
          </div>

          <div className="rounded-2xl border border-yellow-100 bg-white p-5 shadow-sm">
            <p className="text-sm text-[#80664f]">
              Pending
            </p>

            <h2 className="mt-2 text-3xl font-extrabold text-yellow-600">
              {pendingOrders}
            </h2>
          </div>

          <div className="rounded-2xl border border-blue-100 bg-white p-5 shadow-sm">
            <p className="text-sm text-[#80664f]">
              Preparing
            </p>

            <h2 className="mt-2 text-3xl font-extrabold text-blue-600">
              {preparingOrders}
            </h2>
          </div>

          <div className="rounded-2xl border border-green-100 bg-white p-5 shadow-sm">
            <p className="text-sm text-[#80664f]">
              Ready
            </p>

            <h2 className="mt-2 text-3xl font-extrabold text-green-600">
              {readyOrders}
            </h2>
          </div>

          <div className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm">
            <p className="text-sm text-[#80664f]">
              Paid
            </p>

            <h2 className="mt-2 text-3xl font-extrabold text-emerald-600">
              {paidOrders}
            </h2>
          </div>

        </div>

        {/* FILTERS */}
        <div className="mb-8 rounded-2xl border border-orange-100 bg-white p-5 shadow-sm">
          <div className="grid gap-4 md:grid-cols-2">

            <div>
              <label className="mb-2 block text-sm font-semibold text-[#4b270b]">
                Filter by Order Status
              </label>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full rounded-xl border border-orange-200 bg-[#fffaf3] px-4 py-3 text-sm outline-none focus:border-orange-500"
              >
                <option value="all">All Orders</option>
                <option value="pending">Pending</option>
                <option value="preparing">Preparing</option>
                <option value="ready">Ready</option>
                <option value="served">Served</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-[#4b270b]">
                Filter by Payment
              </label>

              <select
                value={paymentFilter}
                onChange={(e) => setPaymentFilter(e.target.value)}
                className="w-full rounded-xl border border-orange-200 bg-[#fffaf3] px-4 py-3 text-sm outline-none focus:border-orange-500"
              >
                <option value="all">All Payments</option>
                <option value="pending">Payment Pending</option>
                <option value="paid">Paid</option>
              </select>
            </div>

          </div>
        </div>

        {/* ORDER COUNT */}
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-bold text-[#4b270b]">
            Orders
          </h2>

          <span className="rounded-full bg-orange-100 px-4 py-2 text-sm font-semibold text-orange-700">
            {filteredOrders.length} Orders
          </span>
        </div>

        {/* NO ORDERS */}
        {filteredOrders.length === 0 ? (
          <div className="rounded-3xl border border-orange-100 bg-white px-6 py-16 text-center shadow-sm">
            <div className="text-5xl">📋</div>

            <h3 className="mt-4 text-xl font-bold text-[#4b270b]">
              No Orders Found
            </h3>

            <p className="mt-2 text-sm text-[#80664f]">
              No orders match your selected filters.
            </p>
          </div>
        ) : (
          <div className="space-y-6">

            {filteredOrders.map((order) => (
              <div
                key={order._id}
                className="overflow-hidden rounded-3xl border border-orange-100 bg-white shadow-sm transition hover:shadow-lg"
              >

                {/* ORDER HEADER */}
                <div className="border-b border-orange-100 bg-[#fffaf3] p-5">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-orange-600">
                        Order ID
                      </p>

                      <h3 className="mt-1 text-lg font-extrabold text-[#4b270b]">
                        {order.orderId}
                      </h3>

                      <p className="mt-1 text-xs text-[#80664f]">
                        {formatDate(order.createdAt)}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">

                      <span
                        className={`rounded-full px-4 py-2 text-xs font-bold ${getStatusClass(
                          order.status
                        )}`}
                      >
                        {formatStatus(order.status)}
                      </span>

                      <span
                        className={`rounded-full px-4 py-2 text-xs font-bold ${getPaymentClass(
                          order.paymentStatus
                        )}`}
                      >
                        {formatStatus(order.paymentStatus)}
                      </span>

                    </div>

                  </div>
                </div>

                {/* ORDER BODY */}
                <div className="p-5">

                  <div className="grid gap-6 lg:grid-cols-3">

                    {/* CUSTOMER */}
                    <div>
                      <h4 className="mb-3 font-bold text-[#4b270b]">
                        Customer Details
                      </h4>

                      <div className="space-y-2 text-sm text-[#80664f]">
                        <p>
                          <span className="font-semibold text-[#4b270b]">
                            Name:
                          </span>{" "}
                          {order.customerName}
                        </p>

                        <p>
                          <span className="font-semibold text-[#4b270b]">
                            Mobile:
                          </span>{" "}
                          {order.customerMobile}
                        </p>

                        <p>
                          <span className="font-semibold text-[#4b270b]">
                            Payment:
                          </span>{" "}
                          {formatStatus(order.paymentMethod)}
                        </p>
                      </div>
                    </div>

                    {/* ITEMS */}
                    <div className="lg:col-span-2">
                      <h4 className="mb-3 font-bold text-[#4b270b]">
                        Ordered Items
                      </h4>

                      <div className="space-y-3">

                        {order.items?.map((item, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between rounded-xl border border-orange-100 bg-[#fffaf3] p-3"
                          >
                            <div>
                              <p className="font-semibold text-[#4b270b]">
                                {item.name}
                              </p>

                              <p className="text-xs text-[#80664f]">
                                ₹{item.price} × {item.quantity}
                              </p>
                            </div>

                            <p className="font-bold text-orange-600">
                              ₹{item.subtotal}
                            </p>
                          </div>
                        ))}

                      </div>
                    </div>

                  </div>

                  {/* TOTAL */}
                  <div className="mt-6 flex items-center justify-between rounded-2xl bg-[#4b270b] px-5 py-4 text-white">
                    <span className="font-semibold">
                      Total Amount
                    </span>

                    <span className="text-2xl font-extrabold text-orange-300">
                      ₹{order.totalAmount}
                    </span>
                  </div>

                  {/* CONTROLS */}
                  <div className="mt-6 grid gap-4 md:grid-cols-2">

                    {/* STATUS */}
                    <div>
                      <label className="mb-2 block text-sm font-bold text-[#4b270b]">
                        Update Order Status
                      </label>

                      <select
                        value={order.status}
                        onChange={(e) =>
                          updateStatus(
                            order._id,
                            e.target.value
                          )
                        }
                        disabled={updatingId === order._id}
                        className="w-full rounded-xl border border-orange-200 bg-[#fffaf3] px-4 py-3 text-sm font-medium text-[#4b270b] outline-none focus:border-orange-500 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        <option value="pending">
                          Pending
                        </option>

                        <option value="preparing">
                          Preparing
                        </option>

                        <option value="ready">
                          Ready
                        </option>

                        <option value="served">
                          Served
                        </option>

                        <option value="cancelled">
                          Cancelled
                        </option>
                      </select>
                    </div>

                    {/* PAYMENT */}
                    <div>
                      <label className="mb-2 block text-sm font-bold text-[#4b270b]">
                        Update Payment Status
                      </label>

                      <select
                        value={order.paymentStatus}
                        onChange={(e) =>
                          updatePayment(
                            order._id,
                            e.target.value
                          )
                        }
                        disabled={updatingId === order._id}
                        className="w-full rounded-xl border border-orange-200 bg-[#fffaf3] px-4 py-3 text-sm font-medium text-[#4b270b] outline-none focus:border-orange-500 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        <option value="pending">
                          Payment Pending
                        </option>

                        <option value="paid">
                          Paid
                        </option>
                      </select>
                    </div>

                  </div>

                  {/* UPDATING */}
                  {updatingId === order._id && (
                    <div className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-orange-50 px-4 py-3 text-sm font-semibold text-orange-700">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-orange-200 border-t-orange-600"></div>
                      Updating order...
                    </div>
                  )}

                </div>
              </div>
            ))}

          </div>
        )}

      </div>
    </div>
  );
};

export default AdminOrders;