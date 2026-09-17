
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const { user, logout } = useAuth();

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const handleLogout = () => {
    closeMenu();
    logout();
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-orange-100 bg-[#fffaf3]">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

        {/* Logo */}
        <Link
          to="/"
          onClick={closeMenu}
          className="flex items-center gap-3"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#8b4513] text-2xl shadow-md">
            🍽️
          </div>

          <div>
            <h1 className="text-xl font-bold text-[#5c2e0b]">
              Flavor House
            </h1>

            <p className="text-xs tracking-widest text-orange-700">
              RESTAURANT
            </p>
          </div>
        </Link>

        {/* ================= DESKTOP NAV ================= */}

        <div className="hidden items-center gap-7 md:flex">

          {/* PUBLIC NAV */}
          {!user && (
            <>
              <Link
                to="/"
                className="font-medium text-[#4a3021] transition hover:text-orange-600"
              >
                Home
              </Link>

              <Link
                to="/menu"
                className="font-medium text-[#4a3021] transition hover:text-orange-600"
              >
                Menu
              </Link>

              <Link
                to="/about"
                className="font-medium text-[#4a3021] transition hover:text-orange-600"
              >
                About
              </Link>

              <Link
                to="/contact"
                className="font-medium text-[#4a3021] transition hover:text-orange-600"
              >
                Contact
              </Link>

              <Link
                to="/login"
                className="rounded-full bg-[#8b4513] px-6 py-2.5 font-semibold text-white shadow-md transition hover:bg-[#6f350f]"
              >
                Login
              </Link>
            </>
          )}

          {/* USER NAV */}
          {user?.role === "user" && (
            <>
              <Link
                to="/"
                className="font-medium text-[#4a3021] transition hover:text-orange-600"
              >
                Home
              </Link>

              <Link
                to="/menu"
                className="font-medium text-[#4a3021] transition hover:text-orange-600"
              >
                Menu
              </Link>

              <Link
                to="/user/dashboard"
                className="font-medium text-[#4a3021] transition hover:text-orange-600"
              >
                Dashboard
              </Link>

              <Link
                to="/user/feedback"
                className="font-medium text-[#4a3021] transition hover:text-orange-600"
              >
                Feedback
              </Link>

              {/* User Profile */}
              <Link
                to="/user/profile"
                className="group flex items-center gap-2 rounded-full border border-orange-200 bg-white py-1.5 pl-1.5 pr-4 shadow-sm transition hover:border-orange-400 hover:shadow-md"
              >
                <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-orange-100 text-lg">
                  {user?.profileImage ? (
                    <img
                      src={user.profileImage}
                      alt={user.name || "Profile"}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span>👤</span>
                  )}
                </div>

                <span className="max-w-28 truncate font-semibold text-[#4b270b] group-hover:text-orange-600">
                  {user?.name || "Profile"}
                </span>
              </Link>

              <button
                onClick={handleLogout}
                className="rounded-full bg-[#8b4513] px-6 py-2.5 font-semibold text-white transition hover:bg-[#6f350f]"
              >
                Logout
              </button>
            </>
          )}

          {/* COUNTER NAV */}
          {user?.role === "counter" && (
            <>
              <Link to="/" className="font-medium text-[#4a3021]">
                Home
              </Link>

              <Link to="/menu" className="font-medium text-[#4a3021]">
                Menu
              </Link>

              <Link
                to="/counter/dashboard"
                className="font-medium text-[#4a3021]"
              >
                Counter Dashboard
              </Link>

              <button
                onClick={handleLogout}
                className="rounded-full bg-[#8b4513] px-6 py-2.5 font-semibold text-white transition hover:bg-[#6f350f]"
              >
                Logout
              </button>
            </>
          )}

          {/* CHEF NAV */}
          {user?.role === "chef" && (
            <>
              <Link to="/" className="font-medium text-[#4a3021]">
                Home
              </Link>

              <Link to="/menu" className="font-medium text-[#4a3021]">
                Menu
              </Link>

              <Link
                to="/chef/dashboard"
                className="font-medium text-[#4a3021]"
              >
                Kitchen
              </Link>

              <button
                onClick={handleLogout}
                className="rounded-full bg-[#8b4513] px-6 py-2.5 font-semibold text-white transition hover:bg-[#6f350f]"
              >
                Logout
              </button>
            </>
          )}

          {/* ADMIN NAV */}
          {user?.role === "admin" && (
            <>
              <Link to="/" className="font-medium text-[#4a3021]">
                Home
              </Link>

              <Link to="/menu" className="font-medium text-[#4a3021]">
                Menu
              </Link>

              <Link
                to="/admin/dashboard"
                className="font-medium text-[#4a3021]"
              >
                Dashboard
              </Link>

              <Link
                to="/admin/feedback"
                className="font-medium text-[#4a3021]"
              >
                Feedback
              </Link>

              <button
                onClick={handleLogout}
                className="rounded-full bg-[#8b4513] px-6 py-2.5 font-semibold text-white transition hover:bg-[#6f350f]"
              >
                Logout
              </button>
            </>
          )}
        </div>

        {/* ================= HAMBURGER ================= */}

        <button
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex h-11 w-11 items-center justify-center rounded-lg border-2 border-[#8b4513] bg-white text-2xl font-bold text-[#8b4513] md:hidden"
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* ================= MOBILE MENU ================= */}

      {menuOpen && (
        <div className="border-t border-orange-100 bg-white px-6 py-5 shadow-lg md:hidden">

          <div className="flex flex-col gap-2">

            {/* PUBLIC MOBILE NAV */}
            {!user && (
              <>
                <Link
                  to="/"
                  onClick={closeMenu}
                  className="rounded-lg px-4 py-3 hover:bg-orange-50"
                >
                  Home
                </Link>

                <Link
                  to="/menu"
                  onClick={closeMenu}
                  className="rounded-lg px-4 py-3 hover:bg-orange-50"
                >
                  Menu
                </Link>

                <Link
                  to="/about"
                  onClick={closeMenu}
                  className="rounded-lg px-4 py-3 hover:bg-orange-50"
                >
                  About
                </Link>

                <Link
                  to="/contact"
                  onClick={closeMenu}
                  className="rounded-lg px-4 py-3 hover:bg-orange-50"
                >
                  Contact
                </Link>

                <Link
                  to="/login"
                  onClick={closeMenu}
                  className="mt-2 rounded-lg bg-[#8b4513] px-4 py-3 text-center font-bold text-white"
                >
                  Login
                </Link>
              </>
            )}

            {/* USER MOBILE NAV */}
            {user?.role === "user" && (
              <>
                {/* User Profile Header */}
                <Link
                  to="/user/profile"
                  onClick={closeMenu}
                  className="mb-2 flex items-center gap-3 rounded-2xl bg-orange-50 p-4"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-orange-100 text-xl">
                    {user?.profileImage ? (
                      <img
                        src={user.profileImage}
                        alt={user.name || "Profile"}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span>👤</span>
                    )}
                  </div>

                  <div className="min-w-0">
                    <p className="truncate font-bold text-[#4b270b]">
                      {user?.name || "User"}
                    </p>

                    <p className="text-xs text-[#80664f]">
                      View & Manage Profile
                    </p>
                  </div>
                </Link>

                <Link
                  to="/"
                  onClick={closeMenu}
                  className="rounded-lg px-4 py-3 hover:bg-orange-50"
                >
                  Home
                </Link>

                <Link
                  to="/menu"
                  onClick={closeMenu}
                  className="rounded-lg px-4 py-3 hover:bg-orange-50"
                >
                  Menu
                </Link>

                <Link
                  to="/user/dashboard"
                  onClick={closeMenu}
                  className="rounded-lg px-4 py-3 hover:bg-orange-50"
                >
                  Dashboard
                </Link>

                <Link
                  to="/user/feedback"
                  onClick={closeMenu}
                  className="rounded-lg px-4 py-3 hover:bg-orange-50"
                >
                  Feedback
                </Link>

                <button
                  onClick={handleLogout}
                  className="mt-2 rounded-lg bg-[#8b4513] px-4 py-3 font-bold text-white"
                >
                  Logout
                </button>
              </>
            )}

            {/* COUNTER MOBILE NAV */}
            {user?.role === "counter" && (
              <>
                <Link
                  to="/"
                  onClick={closeMenu}
                  className="rounded-lg px-4 py-3 hover:bg-orange-50"
                >
                  Home
                </Link>

                <Link
                  to="/menu"
                  onClick={closeMenu}
                  className="rounded-lg px-4 py-3 hover:bg-orange-50"
                >
                  Menu
                </Link>

                <Link
                  to="/counter/dashboard"
                  onClick={closeMenu}
                  className="rounded-lg px-4 py-3 hover:bg-orange-50"
                >
                  Counter Dashboard
                </Link>

                <button
                  onClick={handleLogout}
                  className="mt-2 rounded-lg bg-[#8b4513] px-4 py-3 font-bold text-white"
                >
                  Logout
                </button>
              </>
            )}

            {/* CHEF MOBILE NAV */}
            {user?.role === "chef" && (
              <>
                <Link
                  to="/"
                  onClick={closeMenu}
                  className="rounded-lg px-4 py-3 hover:bg-orange-50"
                >
                  Home
                </Link>

                <Link
                  to="/menu"
                  onClick={closeMenu}
                  className="rounded-lg px-4 py-3 hover:bg-orange-50"
                >
                  Menu
                </Link>

                <Link
                  to="/chef/dashboard"
                  onClick={closeMenu}
                  className="rounded-lg px-4 py-3 hover:bg-orange-50"
                >
                  Kitchen
                </Link>

                <button
                  onClick={handleLogout}
                  className="mt-2 rounded-lg bg-[#8b4513] px-4 py-3 font-bold text-white"
                >
                  Logout
                </button>
              </>
            )}

            {/* ADMIN MOBILE NAV */}
            {user?.role === "admin" && (
              <>
                <Link
                  to="/"
                  onClick={closeMenu}
                  className="rounded-lg px-4 py-3 hover:bg-orange-50"
                >
                  Home
                </Link>

                <Link
                  to="/menu"
                  onClick={closeMenu}
                  className="rounded-lg px-4 py-3 hover:bg-orange-50"
                >
                  Menu
                </Link>

                <Link
                  to="/admin/dashboard"
                  onClick={closeMenu}
                  className="rounded-lg px-4 py-3 hover:bg-orange-50"
                >
                  Dashboard
                </Link>

                <Link
                  to="/admin/feedback"
                  onClick={closeMenu}
                  className="rounded-lg px-4 py-3 hover:bg-orange-50"
                >
                  Feedback
                </Link>

                <button
                  onClick={handleLogout}
                  className="mt-2 rounded-lg bg-[#8b4513] px-4 py-3 font-bold text-white"
                >
                  Logout
                </button>
              </>
            )}

          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
