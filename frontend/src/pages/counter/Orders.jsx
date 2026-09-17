import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import api from "../../services/api";
import Loader from "../../components/Loader";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");

  const fetchOrders = async () => {
    try {
      setLoading(true);

      const response = await api.get("/orders");

      setOrders(response.data.orders || []);
    } catch (error) {
      console.error("Fetch Orders Error:", error);

      toast.error(
        error.response?.data?.message ||
          "Unable to load orders"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const statusMatch =
        statusFilter === "all" ||
        order.status === statusFilter;

      const paymentMatch =
        paymentFilter === "all" ||
        order.paymentStatus === paymentFilter;

      return statusMatch && paymentMatch;
    });
  }, [orders, statusFilter, paymentFilter]);

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

  const getPaymentClasses = (status) => {
    if (status === "paid") {
      return "bg-green-100 text-green-700";
    }

    return "bg-red-100 text-red-700";
  };

  if (loading) {
    return <Loader text="Loading counter orders..." />;
  }

  return (
    <main className="min-h-screen bg-[#fffaf3] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* HEADER */}
        <div className="mb-8">
          <p className="font-semibold uppercase tracking-widest text-orange-600">
            Counter Portal
          </p>

          <h1 className="mt-2 text-3xl font-extrabold text-[#4b270b] sm:text-4xl">
            All Orders
          </h1>

          <p className="mt-2 text-[#80664f]">
            Manage customer orders, payments and bills.
          </p>
        </div>

        {/* FILTERS */}
        <div className="mb-8 rounded-3xl bg-white p-5 shadow-lg">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">

            {/* STATUS FILTER */}
            <div className="w-full md:max-w-xs">
              <label className="mb-2 block text-sm font-semibold text-[#4b270b]">
                Order Status
              </label>

              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value)
                }
                className="w-full rounded-xl border border-orange-200 bg-[#fffaf3] px-4 py-3 text-[#4b270b] outline-none focus:border-orange-500"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="preparing">Preparing</option>
                <option value="ready">Ready</option>
                <option value="served">Served</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            {/* PAYMENT FILTER */}
            <div className="w-full md:max-w-xs">
              <label className="mb-2 block text-sm font-semibold text-[#4b270b]">
                Payment Status
              </label>

              <select
                value={paymentFilter}
                onChange={(e) =>
                  setPaymentFilter(e.target.value)
                }
                className="w-full rounded-xl border border-orange-200 bg-[#fffaf3] px-4 py-3 text-[#4b270b] outline-none focus:border-orange-500"
              >
                <option value="all">All Payments</option>
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
              </select>
            </div>

            {/* REFRESH */}
            <button
              onClick={fetchOrders}
              className="rounded-xl bg-[#8b4513] px-6 py-3 font-semibold text-white transition hover:bg-[#6f350d]"
            >
              Refresh Orders
            </button>
          </div>
        </div>

        {/* ORDER COUNT */}
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-bold text-[#4b270b]">
            Orders ({filteredOrders.length})
          </h2>
        </div>

        {/* EMPTY STATE */}
        {filteredOrders.length === 0 ? (
          <div className="rounded-3xl bg-white px-6 py-16 text-center shadow-lg">
            <div className="text-6xl">🍽️</div>

            <h2 className="mt-5 text-2xl font-bold text-[#4b270b]">
              No Orders Found
            </h2>

            <p className="mt-2 text-[#80664f]">
              There are no orders matching the selected filters.
            </p>

            <Link
              to="/counter/create-order"
              className="mt-6 inline-block rounded-xl bg-orange-500 px-6 py-3 font-semibold text-white transition hover:bg-orange-600"
            >
              Create New Order
            </Link>
          </div>
        ) : (
          <div className="space-y-5">

            {filteredOrders.map((order) => (
              <div
                key={order._id}
                className="overflow-hidden rounded-3xl bg-white shadow-lg transition hover:shadow-xl"
              >
                {/* ORDER HEADER */}
                <div className="flex flex-col gap-4 border-b border-orange-100 bg-[#fffaf3] p-5 sm:flex-row sm:items-center sm:justify-between">

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-orange-600">
                      Order ID
                    </p>

                    <h3 className="mt-1 text-lg font-extrabold text-[#4b270b]">
                      {order.orderId}
                    </h3>
                  </div>

                  <div className="flex flex-wrap gap-2">

                    <span
                      className={`rounded-full px-4 py-2 text-xs font-bold capitalize ${getStatusClasses(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>

                    <span
                      className={`rounded-full px-4 py-2 text-xs font-bold capitalize ${getPaymentClasses(
                        order.paymentStatus
                      )}`}
                    >
                      Payment: {order.paymentStatus}
                    </span>
                  </div>
                </div>

                {/* ORDER BODY */}
                <div className="p-5">

                  <div className="grid gap-6 lg:grid-cols-3">

                    {/* CUSTOMER */}
                    <div>
                      <p className="text-sm font-semibold text-orange-600">
                        Customer
                      </p>

                      <h4 className="mt-1 font-bold text-[#4b270b]">
                        {order.customerName}
                      </h4>

                      <p className="mt-1 text-sm text-[#80664f]">
                        {order.customerMobile}
                      </p>
                    </div>

                    {/* ITEMS */}
                    <div className="lg:col-span-1">
                      <p className="text-sm font-semibold text-orange-600">
                        Items
                      </p>

                      <div className="mt-2 space-y-1">
                        {order.items?.map((item, index) => (
                          <div
                            key={`${order._id}-${index}`}
                            className="flex justify-between gap-4 text-sm"
                          >
                            <span className="text-[#4b270b]">
                              {item.name} × {item.quantity}
                            </span>

                            <span className="font-semibold text-[#80664f]">
                              ₹{item.subtotal}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* TOTAL */}
                    <div className="lg:text-right">
                      <p className="text-sm font-semibold text-orange-600">
                        Total Amount
                      </p>

                      <p className="mt-1 text-2xl font-extrabold text-[#8b4513]">
                        ₹{order.totalAmount}
                      </p>

                      <p className="mt-1 text-sm capitalize text-[#80664f]">
                        {order.paymentMethod}
                      </p>
                    </div>
                  </div>

                  {/* FOOTER */}
                  <div className="mt-6 flex flex-col gap-3 border-t border-orange-100 pt-5 sm:flex-row sm:items-center sm:justify-between">

                    <p className="text-sm text-[#80664f]">
                      Created:{" "}
                      {new Date(
                        order.createdAt
                      ).toLocaleString("en-IN")}
                    </p>

                    <Link
                      to={`/counter/bills/${order._id}`}
                      className="rounded-xl bg-[#8b4513] px-5 py-3 text-center text-sm font-bold text-white transition hover:bg-[#6f350d]"
                    >
                      View Bill
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default Orders;