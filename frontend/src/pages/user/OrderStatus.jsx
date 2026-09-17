import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";

import api from "../../services/api";
import socket from "../../services/socket";
import Loader from "../../components/Loader";

const OrderStatus = () => {
  const { id } = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchOrder = async () => {
    try {
      setLoading(true);

      const response = await api.get(`/orders/${id}`);

      setOrder(response.data.order);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unable to load order"
      );
    } finally {
      setLoading(false);
    }
  };

 useEffect(() => {
  fetchOrder();

  const joinOrderRoom = () => {
    console.log("Joining order room:", id);

    socket.emit("joinOrderRoom", id);
  };

  const handleStatusUpdate = (data) => {
    console.log("Live status update received:", data);

    if (String(data.orderId) === String(id)) {
      setOrder((previousOrder) => ({
        ...previousOrder,
        status: data.status,
        updatedAt: data.updatedAt,
      }));

      toast.success(
        `Order status updated: ${data.status}`
      );
    }
  };

  // Listen for socket connection
  socket.on("connect", joinOrderRoom);

  // If socket is already connected
  if (socket.connected) {
    joinOrderRoom();
  }

  // Listen for order status updates
  socket.on(
    "orderStatusUpdated",
    handleStatusUpdate
  );

  return () => {
    socket.off("connect", joinOrderRoom);

    socket.off(
      "orderStatusUpdated",
      handleStatusUpdate
    );
  };
}, [id]);

  if (loading) {
    return <Loader text="Loading order status..." />;
  }

  if (!order) {
    return (
      <main className="min-h-screen bg-[#fffaf3] px-6 py-16">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-3xl font-bold text-[#4b270b]">
            Order not found
          </h1>
        </div>
      </main>
    );
  }

  const statuses = [
    "pending",
    "preparing",
    "ready",
    "served",
  ];

  const currentIndex = statuses.indexOf(order.status);

  return (
    <main className="min-h-screen bg-[#fffaf3] px-6 py-16">
      <div className="mx-auto max-w-4xl">
        <div className="text-center">
          <p className="font-semibold uppercase tracking-widest text-orange-600">
            Order Tracking
          </p>

          <h1 className="mt-3 text-4xl font-extrabold text-[#4b270b]">
            #{order.orderId}
          </h1>

          <p className="mt-3 text-[#80664f]">
            Your order status will update automatically.
          </p>
        </div>

        <div className="mt-12 rounded-3xl bg-white p-8 shadow-xl">
          <div className="space-y-6">
            {statuses.map((status, index) => {
              const completed = index <= currentIndex;
              const active = status === order.status;

              return (
                <div
                  key={status}
                  className="flex items-center gap-5"
                >
                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full font-bold ${
                      completed
                        ? "bg-[#8b4513] text-white"
                        : "bg-orange-100 text-orange-400"
                    }`}
                  >
                    {completed ? "✓" : index + 1}
                  </div>

                  <div>
                    <h3
                      className={`text-lg font-bold capitalize ${
                        active
                          ? "text-orange-600"
                          : "text-[#4b270b]"
                      }`}
                    >
                      {status}
                    </h3>

                    {active && (
                      <p className="text-sm text-[#80664f]">
                        Current order status
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-10 border-t border-orange-100 pt-6">
            <div className="flex items-center justify-between">
              <span className="text-[#80664f]">
                Customer
              </span>

              <span className="font-semibold text-[#4b270b]">
                {order.customerName}
              </span>
            </div>

            <div className="mt-3 flex items-center justify-between">
              <span className="text-[#80664f]">
                Total
              </span>

              <span className="font-extrabold text-orange-600">
                ₹{order.totalAmount}
              </span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default OrderStatus;