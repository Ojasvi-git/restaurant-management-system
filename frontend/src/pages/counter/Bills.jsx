import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import api from "../../services/api";
import Loader from "../../components/Loader";

const Bills = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBills = async () => {
    try {
      setLoading(true);

      const response = await api.get("/orders");

      setOrders(response.data.orders || []);
    } catch (error) {
      console.error("Fetch Bills Error:", error);

      toast.error(
        error.response?.data?.message ||
          "Unable to load bills"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBills();
  }, []);

  if (loading) {
    return <Loader text="Loading bills..." />;
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
            Bills & Payments
          </h1>

          <p className="mt-2 text-[#80664f]">
            View customer bills and manage payment records.
          </p>
        </div>

        {/* SUMMARY */}
        <div className="mb-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

          {/* TOTAL BILLS */}
          <div className="rounded-3xl bg-white p-6 shadow-lg">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-2xl">
              🧾
            </div>

            <p className="mt-4 text-sm font-semibold text-[#80664f]">
              Total Bills
            </p>

            <p className="mt-1 text-3xl font-extrabold text-[#4b270b]">
              {orders.length}
            </p>
          </div>

          {/* PAID */}
          <div className="rounded-3xl bg-white p-6 shadow-lg">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-100 text-2xl">
              ✓
            </div>

            <p className="mt-4 text-sm font-semibold text-[#80664f]">
              Paid Bills
            </p>

            <p className="mt-1 text-3xl font-extrabold text-green-600">
              {
                orders.filter(
                  (order) =>
                    order.paymentStatus === "paid"
                ).length
              }
            </p>
          </div>

          {/* PENDING */}
          <div className="rounded-3xl bg-white p-6 shadow-lg">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100 text-2xl">
              ⏳
            </div>

            <p className="mt-4 text-sm font-semibold text-[#80664f]">
              Pending Payments
            </p>

            <p className="mt-1 text-3xl font-extrabold text-red-600">
              {
                orders.filter(
                  (order) =>
                    order.paymentStatus === "pending"
                ).length
              }
            </p>
          </div>
        </div>

        {/* BILL LIST */}
        {orders.length === 0 ? (
          <div className="rounded-3xl bg-white px-6 py-16 text-center shadow-lg">

            <div className="text-6xl">
              🧾
            </div>

            <h2 className="mt-5 text-2xl font-bold text-[#4b270b]">
              No Bills Found
            </h2>

            <p className="mt-2 text-[#80664f]">
              Bills will appear here after orders are created.
            </p>

            <Link
              to="/counter/create-order"
              className="mt-6 inline-block rounded-xl bg-[#8b4513] px-6 py-3 font-semibold text-white transition hover:bg-[#6f350d]"
            >
              Create New Order
            </Link>
          </div>
        ) : (
          <div className="overflow-hidden rounded-3xl bg-white shadow-lg">

            {/* TABLE HEADER */}
            <div className="hidden border-b border-orange-100 bg-[#fffaf3] px-6 py-4 md:grid md:grid-cols-6 md:gap-4">

              <p className="text-xs font-bold uppercase tracking-wider text-[#80664f]">
                Bill ID
              </p>

              <p className="text-xs font-bold uppercase tracking-wider text-[#80664f]">
                Customer
              </p>

              <p className="text-xs font-bold uppercase tracking-wider text-[#80664f]">
                Amount
              </p>

              <p className="text-xs font-bold uppercase tracking-wider text-[#80664f]">
                Payment
              </p>

              <p className="text-xs font-bold uppercase tracking-wider text-[#80664f]">
                Status
              </p>

              <p className="text-xs font-bold uppercase tracking-wider text-[#80664f]">
                Action
              </p>
            </div>

            {/* BILL ROWS */}
            <div className="divide-y divide-orange-100">

              {orders.map((order) => (
                <div
                  key={order._id}
                  className="p-5 transition hover:bg-[#fffaf3] md:grid md:grid-cols-6 md:items-center md:gap-4 md:px-6"
                >

                  {/* BILL ID */}
                  <div>
                    <p className="text-xs font-semibold text-orange-600 md:hidden">
                      Bill ID
                    </p>

                    <p className="mt-1 font-bold text-[#4b270b]">
                      {order.orderId}
                    </p>
                  </div>

                  {/* CUSTOMER */}
                  <div className="mt-4 md:mt-0">
                    <p className="text-xs font-semibold text-orange-600 md:hidden">
                      Customer
                    </p>

                    <p className="mt-1 font-semibold text-[#4b270b]">
                      {order.customerName}
                    </p>

                    <p className="text-sm text-[#80664f]">
                      {order.customerMobile}
                    </p>
                  </div>

                  {/* AMOUNT */}
                  <div className="mt-4 md:mt-0">
                    <p className="text-xs font-semibold text-orange-600 md:hidden">
                      Amount
                    </p>

                    <p className="mt-1 text-lg font-extrabold text-orange-600">
                      ₹{order.totalAmount}
                    </p>
                  </div>

                  {/* PAYMENT METHOD */}
                  <div className="mt-4 md:mt-0">
                    <p className="text-xs font-semibold text-orange-600 md:hidden">
                      Payment Method
                    </p>

                    <p className="mt-1 font-semibold capitalize text-[#4b270b]">
                      {order.paymentMethod}
                    </p>
                  </div>

                  {/* PAYMENT STATUS */}
                  <div className="mt-4 md:mt-0">
                    <p className="text-xs font-semibold text-orange-600 md:hidden">
                      Payment Status
                    </p>

                    <span
                      className={`mt-1 inline-block rounded-full px-3 py-1 text-xs font-bold capitalize ${
                        order.paymentStatus === "paid"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {order.paymentStatus}
                    </span>
                  </div>

                  {/* ACTION */}
                  <div className="mt-5 md:mt-0">
                    <Link
                      to={`/counter/bills/${order._id}`}
                      className="inline-block w-full rounded-xl bg-[#8b4513] px-4 py-3 text-center text-sm font-bold text-white transition hover:bg-[#6f350d] md:w-auto"
                    >
                      View Bill
                    </Link>
                  </div>

                </div>
              ))}

            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default Bills;