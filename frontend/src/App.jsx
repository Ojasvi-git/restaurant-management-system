import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import RoleRoute from "./components/RoleRoute";

import Home from "./pages/Home";
import Menu from "./pages/Menu";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Register from "./pages/Register";
import OrderStatus from "./pages/user/OrderStatus";
import MyOrders from "./pages/user/MyOrders";
import Feedback from "./pages/user/Feedback";
import CounterOrders from "./pages/counter/Orders";
import Bills from "./pages/counter/Bills";
import BillDetails from "./pages/counter/BillDetails";

import UserDashboard from "./pages/user/UserDashboard";
import CounterDashboard from "./pages/counter/CounterDashboard";
import ChefDashboard from "./pages/chef/ChefDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import MenuManagement from "./pages/admin/MenuManagement";
import AdminFeedback from "./pages/admin/AdminFeedback";
import CreateOrder from "./pages/counter/CreateOrder";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminUsers from "./pages/admin/Users";
import AdminSales from "./pages/admin/Sales";
import AdminAnalytics from "./pages/admin/Analytics";
import Profile from "./pages/user/Profile";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Terms from "./pages/Terms";
import CookiePolicy from "./pages/CookiePolicy";
import StaffManagement from "./pages/admin/StaffManagement";

function App() {
  return (
    <BrowserRouter>

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
        }}
      />

      <Navbar />

      <ScrollToTop />

      <Routes>

        {/* ================= PUBLIC ROUTES ================= */}

        <Route path="/" element={<Home />} />

        <Route path="/menu" element={<Menu />} />

        <Route path="/about" element={<About />} />

        <Route path="/contact" element={<Contact />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />


         {/* Legal Pages */}
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />

        <Route path="/terms" element={<Terms />} />

        <Route path="/cookie-policy" element={<CookiePolicy />} />


        {/* ================= PROTECTED ROUTES ================= */}

        <Route element={<ProtectedRoute />}>

          {/* USER */}
          <Route element={<RoleRoute allowedRoles={["user"]} />}>

            <Route
              path="/user/dashboard"
              element={<UserDashboard />}
            />

            <Route
             path="/user/orders"
             element={<MyOrders />}
           />
            <Route
             path="/user/orders/:id"
             element={<OrderStatus />}
            />

            <Route
            path="/user/profile"
            element={<Profile />}
            />

            <Route path="/user/feedback" element={<Feedback />} />

          </Route>


          {/* COUNTER */}
          <Route element={<RoleRoute allowedRoles={["counter"]} />}>

            <Route
              path="/counter/dashboard"
              element={<CounterDashboard />}
            />

            <Route
             path="/counter/create-order"
             element={<CreateOrder />}
            />

            <Route
             path="/counter/orders"
             element={<CounterOrders />}
           />

           <Route
           path="/counter/bills"
           element={<Bills />}
          />

           <Route
            path="/counter/bills/:id"
            element={<BillDetails />}
          />

          </Route>


          {/* CHEF */}
          <Route element={<RoleRoute allowedRoles={["chef"]} />}>

            <Route
              path="/chef/dashboard"
              element={<ChefDashboard />}
            />

          </Route>


          {/* ADMIN */}
          <Route element={<RoleRoute allowedRoles={["admin"]} />}>

            <Route
              path="/admin/dashboard"
              element={<AdminDashboard />}
            />

             <Route
              path="/admin/orders"
              element={<AdminOrders />}
             />

             <Route
             path="/admin/menu"
             element={<MenuManagement />}
           />

           <Route
            path="/admin/feedback"
            element={<AdminFeedback />}
           />

          <Route
           path="/admin/users"
           element={<AdminUsers />}
          />

          <Route
            path="/admin/sales"
            element={<AdminSales />}
          />

          <Route
          path="/admin/analytics"
          element={<AdminAnalytics />}
          />
          
           <Route
           path="/admin/staff"
            element={<StaffManagement />}
           />

          
          </Route>

        </Route>

      </Routes>


      
      <Footer />

    </BrowserRouter>
  );
}

export default App;