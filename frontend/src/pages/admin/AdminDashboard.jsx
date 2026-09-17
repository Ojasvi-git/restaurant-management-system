
import { Link } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import api from "../../services/api";
import Loader from "../../components/Loader";

const AdminDashboard = () => {
  const { user } = useAuth();

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // FETCH DASHBOARD STATS
  const fetchDashboardStats = async () => {
    try {
      setLoading(true);

      const response = await api.get("/admin/dashboard");

      setStats(response.data.stats);
    } catch (error) {
      console.error(
        "Fetch Dashboard Stats Error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Unable to load dashboard statistics"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  // INITIAL LOADING
  if (loading && !stats) {
    return (
      <Loader text="Loading admin dashboard..." />
    );
  }

  return (
    <main className="min-h-screen bg-[#fffaf3] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* =====================================================
            ADMIN HEADER
        ====================================================== */}
        <section className="overflow-hidden rounded-3xl bg-[#4b270b] p-6 shadow-xl sm:p-8 md:p-10">
          <div className="flex flex-col gap-7 md:flex-row md:items-center md:justify-between">

            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-orange-300">
                Administration
              </p>

              <h1 className="mt-3 text-3xl font-extrabold text-white sm:text-4xl">
                Admin Dashboard 👑
              </h1>

              <p className="mt-3 max-w-2xl text-orange-100">
                Welcome back, {user?.name || "Admin"}.
                Manage your entire restaurant from one place.
              </p>
            </div>

            <div className="flex h-24 w-24 shrink-0 items-center justify-center self-start rounded-full bg-orange-500/20 text-5xl md:self-auto">
              👑
            </div>

          </div>

          {/* REFRESH BUTTON */}
          <div className="mt-7">
            <button
              onClick={fetchDashboardStats}
              disabled={loading}
              className="rounded-xl bg-orange-500 px-5 py-3 font-bold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? "Refreshing..."
                : "Refresh Dashboard"}
            </button>
          </div>
        </section>


        {/* =====================================================
            BUSINESS STATS
        ====================================================== */}
        <section className="mt-8">
          <div>
            <p className="font-semibold uppercase tracking-widest text-orange-600">
              Business Overview
            </p>

            <h2 className="mt-2 text-2xl font-extrabold text-[#4b270b]">
              Restaurant Statistics
            </h2>

            <p className="mt-1 text-sm text-[#80664f]">
              Overview of your restaurant's overall performance.
            </p>
          </div>

          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

            {/* TOTAL ORDERS */}
            <div className="rounded-2xl border border-orange-100 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">

              <div className="flex items-center justify-between">
                <span className="text-3xl">
                  📦
                </span>

                <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-bold text-orange-700">
                  Orders
                </span>
              </div>

              <p className="mt-5 text-sm font-semibold text-[#80664f]">
                Total Orders
              </p>

              <p className="mt-2 text-4xl font-extrabold text-[#8b4513]">
                {stats?.totalOrders || 0}
              </p>

              <p className="mt-2 text-sm text-[#80664f]">
                All restaurant orders
              </p>

            </div>


            {/* TOTAL REVENUE */}
            <div className="rounded-2xl border border-orange-100 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">

              <div className="flex items-center justify-between">
                <span className="text-3xl">
                  💰
                </span>

                <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
                  Revenue
                </span>
              </div>

              <p className="mt-5 text-sm font-semibold text-[#80664f]">
                Total Revenue
              </p>

              <p className="mt-2 text-4xl font-extrabold text-green-600">
                ₹{stats?.totalRevenue || 0}
              </p>

              <p className="mt-2 text-sm text-[#80664f]">
                From paid orders
              </p>

            </div>


            {/* TOTAL USERS */}
            <div className="rounded-2xl border border-orange-100 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">

              <div className="flex items-center justify-between">
                <span className="text-3xl">
                  👥
                </span>

                <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700">
                  Customers
                </span>
              </div>

              <p className="mt-5 text-sm font-semibold text-[#80664f]">
                Total Customers
              </p>

              <p className="mt-2 text-4xl font-extrabold text-orange-600">
                {stats?.totalUsers || 0}
              </p>

              <p className="mt-2 text-sm text-[#80664f]">
                Registered customers
              </p>

            </div>


            {/* TOTAL REVIEWS */}
            <div className="rounded-2xl border border-orange-100 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">

              <div className="flex items-center justify-between">
                <span className="text-3xl">
                  ⭐
                </span>

                <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-bold text-yellow-700">
                  Reviews
                </span>
              </div>

              <p className="mt-5 text-sm font-semibold text-[#80664f]">
                Customer Reviews
              </p>

              <p className="mt-2 text-4xl font-extrabold text-yellow-600">
                {stats?.totalReviews || 0}
              </p>

              <p className="mt-2 text-sm text-[#80664f]">
                Reviews received
              </p>

            </div>

          </div>
        </section>


        {/* =====================================================
            TODAY'S PERFORMANCE
        ====================================================== */}
        <section className="mt-8">

          <div>
            <p className="font-semibold uppercase tracking-widest text-orange-600">
              Today's Performance
            </p>

            <h2 className="mt-2 text-2xl font-extrabold text-[#4b270b]">
              Today's Restaurant Activity
            </h2>
          </div>

          <div className="mt-6 grid gap-5 md:grid-cols-3">

            {/* TODAY ORDERS */}
            <div className="rounded-3xl bg-white p-6 shadow-lg transition duration-300 hover:-translate-y-1 hover:shadow-xl">

              <div className="flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-2xl">
                  📦
                </div>

                <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-bold text-orange-700">
                  Today
                </span>
              </div>

              <p className="mt-5 text-sm font-semibold text-[#80664f]">
                Today's Orders
              </p>

              <p className="mt-2 text-4xl font-extrabold text-[#8b4513]">
                {stats?.todayOrders || 0}
              </p>

              <p className="mt-2 text-sm text-[#80664f]">
                Orders received today
              </p>

            </div>


            {/* TODAY SALES */}
            <div className="rounded-3xl bg-white p-6 shadow-lg transition duration-300 hover:-translate-y-1 hover:shadow-xl">

              <div className="flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-100 text-2xl">
                  💰
                </div>

                <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
                  Paid
                </span>
              </div>

              <p className="mt-5 text-sm font-semibold text-[#80664f]">
                Today's Sales
              </p>

              <p className="mt-2 text-4xl font-extrabold text-green-600">
                ₹{stats?.todayRevenue || 0}
              </p>

              <p className="mt-2 text-sm text-[#80664f]">
                Paid orders today
              </p>

            </div>


            {/* AVERAGE RATING */}
            <div className="rounded-3xl bg-white p-6 shadow-lg transition duration-300 hover:-translate-y-1 hover:shadow-xl">

              <div className="flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-yellow-100 text-2xl">
                  ⭐
                </div>

                <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-bold text-yellow-700">
                  Rating
                </span>
              </div>

              <p className="mt-5 text-sm font-semibold text-[#80664f]">
                Average Rating
              </p>

              <div className="mt-2 flex items-center gap-3">

                <p className="text-4xl font-extrabold text-yellow-600">
                  {stats?.averageRating || "0.0"}
                </p>

                <span className="text-2xl">
                  ⭐
                </span>

              </div>

              <p className="mt-2 text-sm text-[#80664f]">
                Customer satisfaction
              </p>

            </div>

          </div>
        </section>


        {/* =====================================================
            MOST SOLD ITEMS
        ====================================================== */}
        <section className="mt-8 rounded-3xl bg-white p-6 shadow-lg sm:p-8">

          <div>
            <p className="font-semibold uppercase tracking-widest text-orange-600">
              Sales Overview
            </p>

            <h2 className="mt-2 text-2xl font-extrabold text-[#4b270b]">
              Most Sold Items
            </h2>

            <p className="mt-1 text-sm text-[#80664f]">
              Top 5 dishes based on quantity sold.
            </p>
          </div>


          {!stats?.mostSoldItems ||
          stats.mostSoldItems.length === 0 ? (

            <div className="mt-6 rounded-2xl bg-[#fffaf3] p-8 text-center">

              <div className="text-5xl">
                🍽️
              </div>

              <p className="mt-3 font-semibold text-[#4b270b]">
                No sales data available yet.
              </p>

              <p className="mt-1 text-sm text-[#80664f]">
                Sold dishes will appear here once orders are placed.
              </p>

            </div>

          ) : (

            <div className="mt-6 space-y-4">

              {stats.mostSoldItems.map((item, index) => (

                <div
                  key={item._id}
                  className="flex flex-col gap-4 rounded-2xl bg-[#fffaf3] p-4 sm:flex-row sm:items-center sm:justify-between"
                >

                  <div className="flex items-center gap-4">

                    {/* RANK */}
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-100 font-extrabold text-[#8b4513]">
                      {index + 1}
                    </div>

                    <div>
                      <h3 className="font-bold text-[#4b270b]">
                        {item._id}
                      </h3>

                      <p className="text-sm text-[#80664f]">
                        {item.totalQuantity} items sold
                      </p>
                    </div>

                  </div>

                  <div className="sm:text-right">

                    <p className="text-xs font-semibold uppercase tracking-wide text-[#80664f]">
                      Sales
                    </p>

                    <p className="font-extrabold text-orange-600">
                      ₹{item.totalSales}
                    </p>

                  </div>

                </div>

              ))}

            </div>

          )}

        </section>


        {/* =====================================================
            MANAGEMENT
        ====================================================== */}
        <section className="mt-10">

          <p className="font-semibold uppercase tracking-widest text-orange-600">
            Management
          </p>

          <h2 className="mt-2 text-2xl font-extrabold text-[#4b270b]">
            Manage Your Restaurant
          </h2>

          <p className="mt-1 text-sm text-[#80664f]">
            Access all important restaurant management features.
          </p>


          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

            {/* MENU MANAGEMENT */}
            <Link
              to="/admin/menu"
              className="group rounded-3xl border border-orange-100 bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl"
            >

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-100 text-3xl transition duration-300 group-hover:scale-110">
                🍴
              </div>

              <h3 className="mt-5 text-xl font-bold text-[#4b270b]">
                Menu Management
              </h3>

              <p className="mt-2 text-sm leading-6 text-[#80664f]">
                Add, edit, delete dishes, prices, categories and images.
              </p>

              <span className="mt-5 inline-block font-bold text-orange-600">
                Manage Menu →
              </span>

            </Link>


            {/* ORDER MANAGEMENT */}
            <Link
              to="/admin/orders"
              className="group rounded-3xl border border-orange-100 bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl"
            >

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-100 text-3xl transition duration-300 group-hover:scale-110">
                📋
              </div>

              <h3 className="mt-5 text-xl font-bold text-[#4b270b]">
                Order Management
              </h3>

              <p className="mt-2 text-sm leading-6 text-[#80664f]">
                Monitor all restaurant orders and their current status.
              </p>

              <span className="mt-5 inline-block font-bold text-orange-600">
                View Orders →
              </span>

            </Link>


            {/* USER MANAGEMENT */}
            <Link
              to="/admin/users"
              className="group rounded-3xl border border-orange-100 bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl"
            >

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-100 text-3xl transition duration-300 group-hover:scale-110">
                👥
              </div>

              <h3 className="mt-5 text-xl font-bold text-[#4b270b]">
                User Management
              </h3>

              <p className="mt-2 text-sm leading-6 text-[#80664f]">
                Manage customers, chefs, counter staff and administrators.
              </p>

              <span className="mt-5 inline-block font-bold text-orange-600">
                Manage Users →
              </span>

            </Link>


            {/* FEEDBACK */}
            <Link
              to="/admin/feedback"
              className="group rounded-3xl border border-orange-100 bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl"
            >

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-100 text-3xl transition duration-300 group-hover:scale-110">
                ⭐
              </div>

              <h3 className="mt-5 text-xl font-bold text-[#4b270b]">
                Feedback
              </h3>

              <p className="mt-2 text-sm leading-6 text-[#80664f]">
                Read customer ratings and feedback about the restaurant.
              </p>

              <span className="mt-5 inline-block font-bold text-orange-600">
                View Feedback →
              </span>

            </Link>


            {/* SALES & ANALYTICS */}
            <Link
              to="/admin/sales"
              className="group rounded-3xl border border-orange-100 bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl"
            >

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-100 text-3xl transition duration-300 group-hover:scale-110">
                📊
              </div>

              <h3 className="mt-5 text-xl font-bold text-[#4b270b]">
                Sales & Analytics
              </h3>

              <p className="mt-2 text-sm leading-6 text-[#80664f]">
                Analyze sales, orders, popular dishes and restaurant growth.
              </p>

              <span className="mt-5 inline-block font-bold text-orange-600">
                View Analytics →
              </span>

            </Link>

             <Link
  to="/admin/staff"
  className="group rounded-3xl border border-orange-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
>
  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-100 text-[#8b4513] transition group-hover:bg-[#8b4513] group-hover:text-white">
    <span className="text-2xl">👤</span>
  </div>

  <h3 className="text-xl font-bold text-[#4b2e1f]">
    Staff Management
  </h3>

  <p className="mt-2 text-sm leading-6 text-[#80664f]">
    Create and manage Counter and Chef accounts.
  </p>

  <span className="mt-4 inline-block font-semibold text-[#8b4513]">
    Manage Staff →
  </span>
             </Link>

             <Link
              to="/admin/analytics"
              className="group rounded-3xl border border-orange-100 bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl"
               >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-100 text-3xl transition group-hover:scale-110">
               📊
              </div>

                <h3 className="mt-5 text-xl font-bold text-[#4b270b]">
                  Detailed Analytics
                </h3>

               <p className="mt-2 text-sm leading-6 text-[#80664f]">
               Analyze revenue, orders, payments, ratings and best-selling dishes.
                </p>

              <span className="mt-5 inline-block font-bold text-orange-600">
               View Analytics →
              </span>
              </Link>

               


            {/* SYSTEM STATUS */}
            <div className="rounded-3xl border border-orange-100 bg-[#8b4513] p-7 text-white shadow-lg">

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 text-3xl">
                ⚡
              </div>

              <h3 className="mt-5 text-xl font-bold">
                System Status
              </h3>

              <p className="mt-2 text-sm leading-6 text-orange-100">
                All major restaurant services are ready to operate.
              </p>

              <div className="mt-5 flex items-center gap-2 text-sm font-bold text-orange-100">

                <span className="h-2.5 w-2.5 rounded-full bg-green-400" />

                System Operational

              </div>

            </div>

          </div>

        </section>


        {/* =====================================================
            BUSINESS PERFORMANCE
        ====================================================== */}
        <section className="mt-10 rounded-3xl border border-orange-100 bg-white p-7 shadow-sm md:p-8">

          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

            <div>
              <p className="font-semibold uppercase tracking-widest text-orange-600">
                Business Performance
              </p>

              <h2 className="mt-2 text-2xl font-extrabold text-[#4b270b]">
                Restaurant Performance
              </h2>

              <p className="mt-1 text-sm text-[#80664f]">
                Your sales analytics section is ready for detailed charts.
              </p>
            </div>

            <Link
              to="/admin/sales"
              className="w-fit rounded-xl bg-[#8b4513] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#6f350d]"
            >
              Open Analytics →
            </Link>

          </div>


          <div className="mt-8 grid gap-5 sm:grid-cols-3">

            {/* TOTAL REVENUE */}
            <div className="rounded-2xl bg-[#fffaf3] p-5">

              <p className="text-sm font-semibold text-[#80664f]">
                Total Revenue
              </p>

              <p className="mt-2 text-2xl font-extrabold text-green-600">
                ₹{stats?.totalRevenue || 0}
              </p>

            </div>


            {/* TOTAL ORDERS */}
            <div className="rounded-2xl bg-[#fffaf3] p-5">

              <p className="text-sm font-semibold text-[#80664f]">
                Total Orders
              </p>

              <p className="mt-2 text-2xl font-extrabold text-[#8b4513]">
                {stats?.totalOrders || 0}
              </p>

            </div>


            {/* AVERAGE RATING */}
            <div className="rounded-2xl bg-[#fffaf3] p-5">

              <p className="text-sm font-semibold text-[#80664f]">
                Average Rating
              </p>

              <p className="mt-2 text-2xl font-extrabold text-yellow-600">
                {stats?.averageRating || "0.0"} ⭐
              </p>

            </div>

          </div>

          <div className="mt-5 rounded-2xl border border-dashed border-orange-200 bg-[#fffaf3] p-6 text-center">

            <div className="text-4xl">
              📈
            </div>

            <p className="mt-3 font-bold text-[#4b270b]">
              Detailed Analytics
            </p>

            <p className="mt-2 text-sm text-[#80664f]">
              Daily sales trends, order statistics and charts will be available in Sales & Analytics.
            </p>

            <Link
              to="/admin/sales"
              className="mt-4 inline-block font-bold text-orange-600"
            >
              View Sales Analytics →
            </Link>

          </div>

        </section>


        {/* =====================================================
            FOOTER SPACE
        ====================================================== */}
        <div className="h-8" />

      </div>
    </main>
  );
};

export default AdminDashboard;

