import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../../services/api";
import Loader from "../../components/Loader";

const Sales = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);

      const response = await api.get("/admin/sales");

      setAnalytics(response.data.analytics);
    } catch (error) {
      console.error("Sales Analytics Error:", error);

      toast.error(
        error.response?.data?.message ||
          "Sales analytics load nahi ho payi"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const formatDate = (date) => {
    if (!date) return "";

    const formatted = new Date(`${date}T00:00:00`);

    return formatted.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
    });
  };

  const formatCurrency = (amount) => {
    return `₹${Number(amount || 0).toLocaleString("en-IN")}`;
  };

  if (loading) {
    return <Loader text="Loading sales analytics..." />;
  }

  if (!analytics) {
    return (
      <div className="min-h-screen bg-[#fffaf3] px-4 py-10">
        <div className="mx-auto max-w-7xl text-center">
          <h2 className="text-2xl font-bold text-[#4b270b]">
            Analytics not available
          </h2>
        </div>
      </div>
    );
  }

  const paymentEntries = Object.entries(
    analytics.paymentMethods || {}
  );

  const statusEntries = Object.entries(
    analytics.orderStatus || {}
  );

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
              Sales & Analytics
            </h1>

            <p className="mt-2 text-sm text-[#80664f] md:text-base">
              Track restaurant revenue, orders and business performance.
            </p>
          </div>

          <button
            onClick={fetchAnalytics}
            className="rounded-xl bg-[#8b4513] px-5 py-3 font-semibold text-white shadow-md transition hover:bg-[#6f350f]"
          >
            🔄 Refresh Analytics
          </button>
        </div>

        {/* REVENUE CARDS */}
        <div className="mb-8 grid gap-5 md:grid-cols-2 lg:grid-cols-4">

          <div className="rounded-3xl border border-orange-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[#80664f]">
                  Total Revenue
                </p>

                <h2 className="mt-3 text-3xl font-extrabold text-[#4b270b]">
                  {formatCurrency(analytics.totalRevenue)}
                </h2>
              </div>

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-100 text-2xl">
                💰
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-green-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[#80664f]">
                  Today's Revenue
                </p>

                <h2 className="mt-3 text-3xl font-extrabold text-green-700">
                  {formatCurrency(analytics.todayRevenue)}
                </h2>
              </div>

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-100 text-2xl">
                📅
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-blue-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[#80664f]">
                  Total Orders
                </p>

                <h2 className="mt-3 text-3xl font-extrabold text-blue-700">
                  {analytics.totalOrders}
                </h2>
              </div>

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-2xl">
                🧾
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-yellow-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[#80664f]">
                  Today's Orders
                </p>

                <h2 className="mt-3 text-3xl font-extrabold text-yellow-700">
                  {analytics.todayOrders}
                </h2>
              </div>

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-yellow-100 text-2xl">
                🍽️
              </div>
            </div>
          </div>

        </div>

        {/* PAYMENT SUMMARY */}
        <div className="mb-8 grid gap-6 lg:grid-cols-2">

          <div className="rounded-3xl border border-orange-100 bg-white p-6 shadow-sm">

            <h2 className="text-xl font-extrabold text-[#4b270b]">
              Payment Analysis
            </h2>

            <p className="mt-1 text-sm text-[#80664f]">
              Revenue generated through each payment method.
            </p>

            <div className="mt-6 space-y-5">

              {paymentEntries.map(([method, amount]) => {
                const percentage =
                  analytics.totalRevenue > 0
                    ? (amount / analytics.totalRevenue) * 100
                    : 0;

                return (
                  <div key={method}>

                    <div className="mb-2 flex items-center justify-between">
                      <span className="font-semibold capitalize text-[#4b270b]">
                        {method === "upi"
                          ? "UPI"
                          : method}
                      </span>

                      <span className="font-bold text-orange-600">
                        {formatCurrency(amount)}
                      </span>
                    </div>

                    <div className="h-3 overflow-hidden rounded-full bg-orange-100">
                      <div
                        className="h-full rounded-full bg-orange-500 transition-all duration-700"
                        style={{
                          width: `${percentage}%`,
                        }}
                      ></div>
                    </div>

                    <p className="mt-1 text-xs text-[#80664f]">
                      {percentage.toFixed(1)}% of total revenue
                    </p>

                  </div>
                );
              })}

            </div>
          </div>

          {/* ORDER STATUS */}
          <div className="rounded-3xl border border-orange-100 bg-white p-6 shadow-sm">

            <h2 className="text-xl font-extrabold text-[#4b270b]">
              Order Status Analysis
            </h2>

            <p className="mt-1 text-sm text-[#80664f]">
              Current distribution of restaurant orders.
            </p>

            <div className="mt-6 space-y-4">

              {statusEntries.map(([status, count]) => {
                const percentage =
                  analytics.totalOrders > 0
                    ? (count / analytics.totalOrders) * 100
                    : 0;

                return (
                  <div
                    key={status}
                    className="rounded-2xl border border-orange-100 bg-[#fffaf3] p-4"
                  >
                    <div className="flex items-center justify-between">

                      <div>
                        <p className="font-bold capitalize text-[#4b270b]">
                          {status}
                        </p>

                        <p className="mt-1 text-xs text-[#80664f]">
                          {percentage.toFixed(1)}% of orders
                        </p>
                      </div>

                      <span className="text-2xl font-extrabold text-orange-600">
                        {count}
                      </span>

                    </div>

                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-orange-100">
                      <div
                        className="h-full rounded-full bg-[#8b4513] transition-all duration-700"
                        style={{
                          width: `${percentage}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                );
              })}

            </div>
          </div>

        </div>

        {/* 7 DAYS SALES */}
        <div className="mb-8 rounded-3xl border border-orange-100 bg-white p-6 shadow-sm">

          <div className="mb-6">
            <h2 className="text-xl font-extrabold text-[#4b270b]">
              Last 7 Days Sales
            </h2>

            <p className="mt-1 text-sm text-[#80664f]">
              Daily paid-order revenue and order count.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-7">

            {analytics.last7Days?.map((day) => {
              const maxRevenue = Math.max(
                ...(analytics.last7Days || []).map(
                  (item) => item.revenue
                ),
                1
              );

              const heightPercentage =
                (day.revenue / maxRevenue) * 100;

              return (
                <div
                  key={day.date}
                  className="rounded-2xl border border-orange-100 bg-[#fffaf3] p-4"
                >
                  <div className="flex h-48 flex-col justify-end">

                    <div className="flex h-full items-end justify-center">
                      <div
                        className="w-10 rounded-t-xl bg-orange-500 transition-all duration-700"
                        style={{
                          height: `${Math.max(
                            heightPercentage,
                            5
                          )}%`,
                        }}
                        title={formatCurrency(day.revenue)}
                      ></div>
                    </div>

                  </div>

                  <div className="mt-4 text-center">
                    <p className="text-xs font-bold text-[#4b270b]">
                      {formatDate(day.date)}
                    </p>

                    <p className="mt-1 text-sm font-extrabold text-orange-600">
                      {formatCurrency(day.revenue)}
                    </p>

                    <p className="mt-1 text-xs text-[#80664f]">
                      {day.orders} orders
                    </p>
                  </div>
                </div>
              );
            })}

          </div>
        </div>

        {/* MOST SOLD ITEMS */}
        <div className="mb-8 rounded-3xl border border-orange-100 bg-white p-6 shadow-sm">

          <div className="mb-6">
            <h2 className="text-xl font-extrabold text-[#4b270b]">
              Most Sold Items
            </h2>

            <p className="mt-1 text-sm text-[#80664f]">
              Best performing menu items based on paid orders.
            </p>
          </div>

          {analytics.mostSoldItems?.length === 0 ? (
            <div className="rounded-2xl bg-[#fffaf3] p-8 text-center">
              <p className="text-[#80664f]">
                No sales data available yet.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">

              <table className="w-full">

                <thead>
                  <tr className="border-b border-orange-100">
                    <th className="px-4 py-4 text-left text-sm font-bold text-[#4b270b]">
                      #
                    </th>

                    <th className="px-4 py-4 text-left text-sm font-bold text-[#4b270b]">
                      Item
                    </th>

                    <th className="px-4 py-4 text-center text-sm font-bold text-[#4b270b]">
                      Quantity Sold
                    </th>

                    <th className="px-4 py-4 text-right text-sm font-bold text-[#4b270b]">
                      Sales
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {analytics.mostSoldItems.map(
                    (item, index) => (
                      <tr
                        key={item.name}
                        className="border-b border-orange-50 hover:bg-[#fffaf3]"
                      >
                        <td className="px-4 py-4">
                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-100 font-bold text-orange-700">
                            {index + 1}
                          </div>
                        </td>

                        <td className="px-4 py-4 font-bold text-[#4b270b]">
                          {item.name}
                        </td>

                        <td className="px-4 py-4 text-center font-semibold text-[#80664f]">
                          {item.quantity}
                        </td>

                        <td className="px-4 py-4 text-right font-extrabold text-orange-600">
                          {formatCurrency(item.sales)}
                        </td>
                      </tr>
                    )
                  )}
                </tbody>

              </table>

            </div>
          )}
        </div>

        {/* PAYMENT INFORMATION */}
        <div className="grid gap-6 md:grid-cols-3">

          <div className="rounded-3xl border border-green-100 bg-white p-6 shadow-sm">
            <p className="text-sm text-[#80664f]">
              Paid Orders
            </p>

            <h2 className="mt-2 text-3xl font-extrabold text-green-700">
              {analytics.paidOrders}
            </h2>

            <p className="mt-2 text-xs text-[#80664f]">
              Orders successfully paid
            </p>
          </div>

          <div className="rounded-3xl border border-yellow-100 bg-white p-6 shadow-sm">
            <p className="text-sm text-[#80664f]">
              Pending Payments
            </p>

            <h2 className="mt-2 text-3xl font-extrabold text-yellow-700">
              {analytics.pendingPayments}
            </h2>

            <p className="mt-2 text-xs text-[#80664f]">
              Payments still pending
            </p>
          </div>

          <div className="rounded-3xl border border-orange-100 bg-[#4b270b] p-6 text-white shadow-sm">
            <p className="text-sm text-orange-200">
              Average Order Value
            </p>

            <h2 className="mt-2 text-3xl font-extrabold text-orange-300">
              {formatCurrency(
                analytics.paidOrders > 0
                  ? analytics.totalRevenue /
                      analytics.paidOrders
                  : 0
              )}
            </h2>

            <p className="mt-2 text-xs text-orange-100">
              Revenue ÷ paid orders
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Sales;