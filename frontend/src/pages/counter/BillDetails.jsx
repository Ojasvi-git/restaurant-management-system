import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import toast from "react-hot-toast";

import api from "../../services/api";
import Loader from "../../components/Loader";

const BillDetails = () => {
  const { id } = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState(false);

  const fetchOrder = async () => {
    try {
      setLoading(true);

      const response = await api.get(`/orders/${id}`);

      setOrder(response.data.order);
    } catch (error) {
      console.error("Fetch Bill Error:", error);

      toast.error(
        error.response?.data?.message ||
          "Unable to load bill"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const markAsPaid = async () => {
    try {
      setPaymentLoading(true);

      const response = await api.put(
        `/orders/${id}/payment`,
        {
          paymentStatus: "paid",
          paymentMethod: order.paymentMethod,
        }
      );

      setOrder(response.data.order);

      toast.success(
        response.data.message ||
          "Payment marked as paid"
      );
    } catch (error) {
      console.error("Payment Error:", error);

      toast.error(
        error.response?.data?.message ||
          "Unable to update payment"
      );
    } finally {
      setPaymentLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return <Loader text="Loading bill..." />;
  }

  if (!order) {
    return (
      <main className="min-h-screen bg-[#fffaf3] px-6 py-16">
        <div className="mx-auto max-w-3xl rounded-3xl bg-white p-10 text-center shadow-lg">
          <div className="text-6xl">🧾</div>

          <h1 className="mt-5 text-3xl font-extrabold text-[#4b270b]">
            Bill Not Found
          </h1>

          <p className="mt-3 text-[#80664f]">
            We could not find this order.
          </p>

          <Link
            to="/counter/orders"
            className="mt-6 inline-block rounded-xl bg-[#8b4513] px-6 py-3 font-semibold text-white"
          >
            Back to Orders
          </Link>
        </div>
      </main>
    );
  }

  return (
    <>
      <main className="min-h-screen bg-[#fffaf3] px-4 py-10 sm:px-6 lg:px-8 print:bg-white print:px-0 print:py-0">
        <div className="mx-auto max-w-3xl">

          {/* TOP ACTIONS */}
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between print:hidden">

            <Link
              to="/counter/orders"
              className="text-sm font-semibold text-[#8b4513] hover:text-orange-600"
            >
              ← Back to Orders
            </Link>

            <button
              onClick={handlePrint}
              className="rounded-xl bg-[#8b4513] px-6 py-3 font-bold text-white transition hover:bg-[#6f350d]"
            >
              🖨️ Print Bill
            </button>
          </div>

          {/* BILL */}
          <div
            id="print-bill"
            className="rounded-3xl bg-white p-6 shadow-xl sm:p-10 print:rounded-none print:p-6 print:shadow-none"
          >

            {/* RESTAURANT HEADER */}
            <div className="border-b-2 border-orange-100 pb-6 text-center">

              <div className="text-4xl">
                🍽️
              </div>

              <h1 className="mt-2 text-3xl font-extrabold text-[#4b270b]">
                Restaurant Management
              </h1>

              <p className="mt-1 text-sm text-[#80664f]">
                Delicious Food • Beautiful Moments
              </p>

              <p className="mt-2 text-xs text-[#80664f]">
                Thank you for dining with us!
              </p>
            </div>

            {/* BILL INFO */}
            <div className="mt-6 grid gap-5 border-b border-orange-100 pb-6 sm:grid-cols-2">

              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-orange-600">
                  Order ID
                </p>

                <p className="mt-1 font-bold text-[#4b270b]">
                  {order.orderId}
                </p>
              </div>

              <div className="sm:text-right">
                <p className="text-xs font-semibold uppercase tracking-wider text-orange-600">
                  Date & Time
                </p>

                <p className="mt-1 font-semibold text-[#4b270b]">
                  {new Date(
                    order.createdAt
                  ).toLocaleString("en-IN")}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-orange-600">
                  Customer
                </p>

                <p className="mt-1 font-bold text-[#4b270b]">
                  {order.customerName}
                </p>

                <p className="text-sm text-[#80664f]">
                  {order.customerMobile}
                </p>
              </div>

              <div className="sm:text-right">
                <p className="text-xs font-semibold uppercase tracking-wider text-orange-600">
                  Order Status
                </p>

                <p className="mt-1 font-bold capitalize text-[#4b270b]">
                  {order.status}
                </p>
              </div>
            </div>

            {/* ITEMS */}
            <div className="mt-8">

              <h2 className="mb-4 text-xl font-extrabold text-[#4b270b]">
                Order Items
              </h2>

              <div className="overflow-hidden rounded-2xl border border-orange-100">
                <div className="grid grid-cols-12 bg-[#fffaf3] px-4 py-3 text-xs font-bold uppercase text-[#80664f]">

                  <div className="col-span-5">
                    Item
                  </div>

                  <div className="col-span-2 text-center">
                    Qty
                  </div>

                  <div className="col-span-2 text-right">
                    Price
                  </div>

                  <div className="col-span-3 text-right">
                    Amount
                  </div>
                </div>

                {order.items?.map((item, index) => (
                  <div
                    key={`${item.name}-${index}`}
                    className="grid grid-cols-12 border-t border-orange-100 px-4 py-4 text-sm"
                  >
                    <div className="col-span-5 font-semibold text-[#4b270b]">
                      {item.name}
                    </div>

                    <div className="col-span-2 text-center text-[#80664f]">
                      {item.quantity}
                    </div>

                    <div className="col-span-2 text-right text-[#80664f]">
                      ₹{item.price}
                    </div>

                    <div className="col-span-3 text-right font-semibold text-[#4b270b]">
                      ₹{item.subtotal}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* TOTAL */}
            <div className="mt-8 border-t-2 border-orange-100 pt-6">

              <div className="flex items-center justify-between text-sm text-[#80664f]">
                <span>
                  Total Items
                </span>

                <span className="font-semibold text-[#4b270b]">
                  {order.items?.reduce(
                    (total, item) =>
                      total + item.quantity,
                    0
                  )}
                </span>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <span className="text-lg font-bold text-[#4b270b]">
                  Grand Total
                </span>

                <span className="text-3xl font-extrabold text-orange-600">
                  ₹{order.totalAmount}
                </span>
              </div>
            </div>

            {/* PAYMENT */}
            <div className="mt-8 rounded-2xl bg-[#fffaf3] p-5">

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-orange-600">
                    Payment Method
                  </p>

                  <p className="mt-1 font-bold capitalize text-[#4b270b]">
                    {order.paymentMethod}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-orange-600">
                    Payment Status
                  </p>

                  <span
                    className={`mt-1 inline-block rounded-full px-4 py-2 text-sm font-bold capitalize ${
                      order.paymentStatus === "paid"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {order.paymentStatus}
                  </span>
                </div>

              </div>
            </div>

            {/* MARK PAID */}
            {order.paymentStatus !== "paid" && (
              <div className="mt-6 print:hidden">
                <button
                  onClick={markAsPaid}
                  disabled={paymentLoading}
                  className="w-full rounded-xl bg-green-600 px-6 py-4 font-bold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {paymentLoading
                    ? "Updating Payment..."
                    : "✓ Mark Payment as Paid"}
                </button>
              </div>
            )}

            {/* FOOTER */}
            <div className="mt-10 border-t border-orange-100 pt-6 text-center">

              <p className="font-semibold text-[#4b270b]">
                Thank you for visiting us! ❤️
              </p>

              <p className="mt-1 text-sm text-[#80664f]">
                We hope to see you again.
              </p>

            </div>
          </div>
        </div>
      </main>

      {/* PRINT CSS */}
      <style>
        {`
          @media print {
            body {
              background: white !important;
            }

            body * {
              visibility: hidden;
            }

            #print-bill,
            #print-bill * {
              visibility: visible;
            }

            #print-bill {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
            }
          }
        `}
      </style>
    </>
  );
};

export default BillDetails;