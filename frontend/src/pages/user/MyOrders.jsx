import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import api from "../../services/api";
import Loader from "../../components/Loader";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMyOrders = async () => {
    try {
      setLoading(true);

      const response = await api.get("/orders/my-orders");

      setOrders(response.data.orders || []);
    } catch (error) {
      console.error("Fetch My Orders Error:", error);

      toast.error(
        error.response?.data?.message ||
          "Unable to load your orders"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyOrders();
  }, []);

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
    return <Loader text="Loading your orders..." />;
  }

  return (
    <main className="min-h-screen bg-[#fffaf3] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">

        {/* HEADER */}
        <div className="mb-8">
          <p className="font-semibold uppercase tracking-widest text-orange-600">
            User Portal
          </p>

          <h1 className="mt-2 text-3xl font-extrabold text-[#4b270b] sm:text-4xl">
            My Orders
          </h1>

          <p className="mt-2 text-[#80664f]">
            View your previous orders and track active orders.
          </p>
        </div>

        {/* REFRESH */}
        <div className="mb-6 flex justify-end">
          <button
            onClick={fetchMyOrders}
            className="rounded-xl bg-[#8b4513] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#6f350d]"
          >
            Refresh Orders
          </button>
        </div>

        {/* EMPTY STATE */}
        {orders.length === 0 ? (
          <div className="rounded-3xl bg-white px-6 py-16 text-center shadow-lg">

            <div className="text-6xl">
              🍽️
            </div>

            <h2 className="mt-5 text-2xl font-bold text-[#4b270b]">
              No Orders Yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-[#80664f]">
              You haven't placed any orders yet.
              Explore our menu and enjoy delicious food.
            </p>

            <Link
              to="/menu"
              className="mt-6 inline-block rounded-xl bg-orange-500 px-6 py-3 font-bold text-white transition hover:bg-orange-600"
            >
              Explore Menu
            </Link>
          </div>
        ) : (
          <div className="space-y-6">

            {orders.map((order) => (
              <div
                key={order._id}
                className="overflow-hidden rounded-3xl bg-white shadow-lg transition hover:shadow-xl"
              >

                {/* ORDER HEADER */}
                <div className="flex flex-col gap-4 border-b border-orange-100 bg-[#fffaf3] p-5 sm:flex-row sm:items-center sm:justify-between">

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-orange-600">
                      Order
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

                  <div className="flex flex-wrap gap-2">

                    <span
                      className={`rounded-full px-4 py-2 text-xs font-bold capitalize ${getStatusClasses(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>

                    <span
                      className={`rounded-full px-4 py-2 text-xs font-bold capitalize ${
                        order.paymentStatus === "paid"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {order.paymentStatus}
                    </span>

                  </div>
                </div>

                {/* ORDER BODY */}
                <div className="p-5">

                  {/* ITEMS */}
                  <div>
                    <h3 className="text-lg font-bold text-[#4b270b]">
                      Ordered Items
                    </h3>

                    <div className="mt-4 space-y-3">

                      {order.items?.map((item, index) => (
                        <div
                          key={`${order._id}-${index}`}
                          className="flex items-center justify-between gap-4 rounded-2xl bg-[#fffaf3] p-4"
                        >

                          <div>
                            <p className="font-semibold text-[#4b270b]">
                              {item.name}
                            </p>

                            <p className="mt-1 text-sm text-[#80664f]">
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

                  {/* ORDER FOOTER */}
                  <div className="mt-6 flex flex-col gap-5 border-t border-orange-100 pt-6 sm:flex-row sm:items-center sm:justify-between">

                    <div>
                      <p className="text-sm text-[#80664f]">
                        Total Amount
                      </p>

                      <p className="text-2xl font-extrabold text-[#8b4513]">
                        ₹{order.totalAmount}
                      </p>
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row">

                      {order.status !== "served" &&
                        order.status !== "cancelled" && (
                          <Link
                            to={`/user/orders/${order._id}`}
                            className="rounded-xl bg-orange-500 px-5 py-3 text-center text-sm font-bold text-white transition hover:bg-orange-600"
                          >
                            Track Order
                          </Link>
                        )}

                      {order.status === "served" && (
                        <Link
                          to={`/user/orders/${order._id}`}
                          className="rounded-xl bg-[#8b4513] px-5 py-3 text-center text-sm font-bold text-white transition hover:bg-[#6f350d]"
                        >
                          View Order
                        </Link>
                      )}

                    </div>

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

export default MyOrders;