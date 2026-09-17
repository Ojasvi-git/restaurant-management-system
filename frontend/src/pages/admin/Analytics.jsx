import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

import api from "../../services/api";
import Loader from "../../components/Loader";

const Analytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAnalytics = async (showRefreshLoader = false) => {
    try {
      if (showRefreshLoader) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const response = await api.get("/admin/analytics");

      setAnalytics(response.data.analytics);
    } catch (error) {
      console.error("Analytics Error:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to load analytics"
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (loading) {
    return <Loader text="Loading detailed analytics..." />;
  }

  if (!analytics) {
    return (
      <div className="min-h-screen bg-[#fffaf3] px-4 py-10">
        <div className="mx-auto max-w-7xl rounded-3xl border border-orange-100 bg-white p-10 text-center shadow-sm">
          <h2 className="text-2xl font-bold text-[#4b270b]">
            Analytics unavailable
          </h2>

          <p className="mt-2 text-[#80664f]">
            We could not load the analytics data.
          </p>

          <button
            onClick={() => fetchAnalytics()}
            className="mt-6 rounded-xl bg-[#8b4513] px-6 py-3 font-semibold text-white transition hover:bg-[#6f350f]"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const {
    totalOrders,
    paidOrders,
    pendingPayments,
    totalRevenue,
    todayOrders,
    todayRevenue,
    totalItemsSold,
    averageOrderValue,
    totalReviews,
    averageRating,
    itemAnalytics,
    paymentAnalytics,
    statusAnalytics,
    ratingDistribution,
    last30Days,
    peakDay,
  } = analytics;

  const paymentChartData = Object.entries(paymentAnalytics).map(
    ([method, data]) => ({
      name: method.toUpperCase(),
      revenue: data.revenue,
      orders: data.orders,
    })
  );

  const statusChartData = Object.entries(statusAnalytics).map(
    ([status, count]) => ({
      name: status.charAt(0).toUpperCase() + status.slice(1),
      orders: count,
    })
  );

  const ratingChartData = Object.entries(ratingDistribution)
    .sort((a, b) => Number(b[0]) - Number(a[0]))
    .map(([rating, count]) => ({
      rating: `${rating} Star`,
      reviews: count,
    }));

  const topItems = itemAnalytics.slice(0, 10);

  return (
    <div className="min-h-screen bg-[#fffaf3] px-4 py-8 md:px-8">
      <div className="mx-auto max-w-7xl">

        {/* HEADER */}
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-orange-600">
              Admin Analytics
            </p>

            <h1 className="mt-2 text-3xl font-bold text-[#4b270b] md:text-4xl">
              Detailed Business Analytics
            </h1>

            <p className="mt-2 max-w-2xl text-[#80664f]">
              Analyze restaurant revenue, orders, payments,
              customer ratings and best-selling dishes.
            </p>
          </div>

          <button
            onClick={() => fetchAnalytics(true)}
            disabled={refreshing}
            className="rounded-xl bg-[#8b4513] px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-[#6f350f] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {refreshing ? "Refreshing..." : "Refresh Analytics"}
          </button>
        </div>

        {/* KPI CARDS */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

          <StatCard
            icon="💰"
            title="Total Revenue"
            value={`₹${totalRevenue.toLocaleString()}`}
            description="Revenue from paid orders"
          />

          <StatCard
            icon="📅"
            title="Today's Revenue"
            value={`₹${todayRevenue.toLocaleString()}`}
            description={`${todayOrders} orders today`}
          />

          <StatCard
            icon="📦"
            title="Total Orders"
            value={totalOrders}
            description={`${paidOrders} paid orders`}
          />

          <StatCard
            icon="💳"
            title="Pending Payments"
            value={pendingPayments}
            description="Orders awaiting payment"
          />

          <StatCard
            icon="🧾"
            title="Average Order Value"
            value={`₹${Math.round(
              averageOrderValue
            ).toLocaleString()}`}
            description="Average paid order"
          />

          <StatCard
            icon="🍽️"
            title="Items Sold"
            value={totalItemsSold}
            description="Total food items sold"
          />

          <StatCard
            icon="⭐"
            title="Average Rating"
            value={`${averageRating.toFixed(1)} / 5`}
            description={`${totalReviews} customer reviews`}
          />

          <StatCard
            icon="🔥"
            title="Peak Revenue Day"
            value={
              peakDay
                ? `₹${peakDay.revenue.toLocaleString()}`
                : "₹0"
            }
            description={
              peakDay
                ? formatDate(peakDay.date)
                : "No data available"
            }
          />

        </div>

        {/* REVENUE TREND */}
        <div className="mt-8 rounded-3xl border border-orange-100 bg-white p-5 shadow-sm md:p-7">

          <div className="mb-6">
            <h2 className="text-2xl font-bold text-[#4b270b]">
              Revenue Trend
            </h2>

            <p className="mt-1 text-sm text-[#80664f]">
              Paid-order revenue for the last 30 days.
            </p>
          </div>

          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={last30Days}>
                <CartesianGrid strokeDasharray="3 3" />

                <XAxis
                  dataKey="date"
                  tickFormatter={formatShortDate}
                />

                <YAxis />

                <Tooltip
                  formatter={(value) => [
                    `₹${Number(value).toLocaleString()}`,
                    "Revenue",
                  ]}
                  labelFormatter={(label) =>
                    formatDate(label)
                  }
                />

                <Legend />

                <Line
                  type="monotone"
                  dataKey="revenue"
                  name="Revenue"
                  stroke="#8b4513"
                  strokeWidth={3}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ORDERS TREND */}
        <div className="mt-8 rounded-3xl border border-orange-100 bg-white p-5 shadow-sm md:p-7">

          <div className="mb-6">
            <h2 className="text-2xl font-bold text-[#4b270b]">
              Orders Trend
            </h2>

            <p className="mt-1 text-sm text-[#80664f]">
              Number of paid orders over the last 30 days.
            </p>
          </div>

          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={last30Days}>
                <CartesianGrid strokeDasharray="3 3" />

                <XAxis
                  dataKey="date"
                  tickFormatter={formatShortDate}
                />

                <YAxis allowDecimals={false} />

                <Tooltip
                  formatter={(value) => [
                    value,
                    "Orders",
                  ]}
                  labelFormatter={(label) =>
                    formatDate(label)
                  }
                />

                <Legend />

                <Bar
                  dataKey="orders"
                  name="Orders"
                  fill="#d97706"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* PAYMENT + STATUS */}
        <div className="mt-8 grid gap-8 lg:grid-cols-2">

          {/* PAYMENT */}
          <div className="rounded-3xl border border-orange-100 bg-white p-5 shadow-sm md:p-7">

            <h2 className="text-2xl font-bold text-[#4b270b]">
              Payment Analysis
            </h2>

            <p className="mt-1 text-sm text-[#80664f]">
              Revenue and orders grouped by payment method.
            </p>

            <div className="mt-6 h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>

                  <Pie
                    data={paymentChartData}
                    dataKey="revenue"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                  >
                    {paymentChartData.map(
                      (entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={
                            [
                              "#8b4513",
                              "#d97706",
                              "#b45309",
                              "#92400e",
                            ][index % 4]
                          }
                        />
                      )
                    )}
                  </Pie>

                  <Tooltip
                    formatter={(value) => [
                      `₹${Number(value).toLocaleString()}`,
                      "Revenue",
                    ]}
                  />

                  <Legend />

                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-4 space-y-3">
              {paymentChartData.map((payment) => (
                <div
                  key={payment.name}
                  className="flex items-center justify-between rounded-xl bg-orange-50 px-4 py-3"
                >
                  <span className="font-semibold text-[#5c3419]">
                    {payment.name}
                  </span>

                  <div className="text-right">
                    <p className="font-bold text-[#4b270b]">
                      ₹{payment.revenue.toLocaleString()}
                    </p>

                    <p className="text-xs text-[#80664f]">
                      {payment.orders} orders
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ORDER STATUS */}
          <div className="rounded-3xl border border-orange-100 bg-white p-5 shadow-sm md:p-7">

            <h2 className="text-2xl font-bold text-[#4b270b]">
              Order Status Analysis
            </h2>

            <p className="mt-1 text-sm text-[#80664f]">
              Current status distribution of all orders.
            </p>

            <div className="mt-6 h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={statusChartData}>
                  <CartesianGrid strokeDasharray="3 3" />

                  <XAxis dataKey="name" />

                  <YAxis allowDecimals={false} />

                  <Tooltip />

                  <Legend />

                  <Bar
                    dataKey="orders"
                    name="Orders"
                    fill="#8b4513"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              {statusChartData.map((status) => (
                <div
                  key={status.name}
                  className="rounded-xl border border-orange-100 bg-[#fffaf3] p-4"
                >
                  <p className="text-sm text-[#80664f]">
                    {status.name}
                  </p>

                  <p className="mt-1 text-xl font-bold text-[#4b270b]">
                    {status.orders}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* BEST SELLING ITEMS */}
        <div className="mt-8 rounded-3xl border border-orange-100 bg-white p-5 shadow-sm md:p-7">

          <div className="mb-6">
            <h2 className="text-2xl font-bold text-[#4b270b]">
              Best-Selling Dishes
            </h2>

            <p className="mt-1 text-sm text-[#80664f]">
              Top dishes based on revenue generated from paid orders.
            </p>
          </div>

          {topItems.length === 0 ? (
            <div className="rounded-2xl bg-orange-50 p-8 text-center">
              <p className="font-medium text-[#80664f]">
                No paid-order item data available yet.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-150">
                <thead>
                  <tr className="border-b border-orange-100 text-left">
                    <th className="px-4 py-4 text-sm font-bold text-[#80664f]">
                      Rank
                    </th>

                    <th className="px-4 py-4 text-sm font-bold text-[#80664f]">
                      Dish
                    </th>

                    <th className="px-4 py-4 text-sm font-bold text-[#80664f]">
                      Quantity Sold
                    </th>

                    <th className="px-4 py-4 text-sm font-bold text-[#80664f]">
                      Revenue
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {topItems.map((item, index) => (
                    <tr
                      key={item.name}
                      className="border-b border-orange-50 last:border-0"
                    >
                      <td className="px-4 py-4">
                        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-100 font-bold text-[#8b4513]">
                          {index + 1}
                        </span>
                      </td>

                      <td className="px-4 py-4 font-semibold text-[#4b270b]">
                        {item.name}
                      </td>

                      <td className="px-4 py-4 text-[#5c3419]">
                        {item.quantity}
                      </td>

                      <td className="px-4 py-4 font-bold text-[#8b4513]">
                        ₹{item.revenue.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* RATING ANALYSIS */}
        <div className="mt-8 rounded-3xl border border-orange-100 bg-white p-5 shadow-sm md:p-7">

          <div className="mb-6">
            <h2 className="text-2xl font-bold text-[#4b270b]">
              Customer Rating Analysis
            </h2>

            <p className="mt-1 text-sm text-[#80664f]">
              Distribution of customer ratings.
            </p>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ratingChartData}>

                <CartesianGrid strokeDasharray="3 3" />

                <XAxis dataKey="rating" />

                <YAxis allowDecimals={false} />

                <Tooltip />

                <Legend />

                <Bar
                  dataKey="reviews"
                  name="Reviews"
                  fill="#d97706"
                  radius={[6, 6, 0, 0]}
                />

              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* BUSINESS SUMMARY */}
        <div className="mt-8 rounded-3xl border border-orange-100 bg-[#4b270b] p-6 text-white shadow-sm md:p-8">

          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">

            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-orange-300">
                Business Summary
              </p>

              <h2 className="mt-2 text-2xl font-bold">
                Restaurant Performance Overview
              </h2>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-orange-100">
                Your restaurant generated{" "}
                <span className="font-bold">
                  ₹{totalRevenue.toLocaleString()}
                </span>{" "}
                from paid orders with an average order value
                of{" "}
                <span className="font-bold">
                  ₹{Math.round(
                    averageOrderValue
                  ).toLocaleString()}
                </span>
                .
              </p>
            </div>

            <div className="rounded-2xl bg-white/10 px-6 py-5 text-center">
              <p className="text-sm text-orange-100">
                Customer Rating
              </p>

              <p className="mt-1 text-3xl font-bold">
                ⭐ {averageRating.toFixed(1)}
              </p>

              <p className="mt-1 text-xs text-orange-200">
                Based on {totalReviews} reviews
              </p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

const StatCard = ({
  icon,
  title,
  value,
  description,
}) => {
  return (
    <div className="group rounded-3xl border border-orange-100 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">

      <div className="flex items-start justify-between gap-4">

        <div>
          <p className="text-sm font-medium text-[#80664f]">
            {title}
          </p>

          <h3 className="mt-2 text-2xl font-bold text-[#4b270b]">
            {value}
          </h3>

          <p className="mt-2 text-xs text-[#9a8067]">
            {description}
          </p>
        </div>

        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-orange-100 text-2xl transition duration-300 group-hover:scale-110">
          {icon}
        </div>

      </div>
    </div>
  );
};

const formatDate = (dateString) => {
  const date = new Date(`${dateString}T00:00:00`);

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatShortDate = (dateString) => {
  const date = new Date(`${dateString}T00:00:00`);

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
  });
};

export default Analytics;