
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();

  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  // Show / Hide Password
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast.error("Please enter email and password");
      return;
    }

    setLoading(true);

    try {
      const response = await api.post(
        "/auth/login",
        formData
      );

      const { token, user } = response.data;

      login(user, token);

      // For now every normal registered user goes home.
      // Role-based dashboard will be added in the next step.
      navigate("/");

    } catch (error) {
      toast.error(
        error.response?.data?.message ||
        "Login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#fff4e5] px-6 py-16">

      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl">

        {/* Header */}
        <div className="text-center">

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#8b4513] text-3xl">
            🍽️
          </div>

          <h1 className="mt-5 text-3xl font-extrabold text-[#4b270b]">
            Welcome Back
          </h1>

          <p className="mt-2 text-[#80664f]">
            Login to continue to your account
          </p>

        </div>


        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-5"
        >

          {/* Email */}
          <div>

            <label className="mb-2 block font-medium text-[#5c2e0b]">
              Email
            </label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full rounded-xl border border-orange-100 px-4 py-3 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
            />

          </div>


          {/* Password */}
          <div>

            <label className="mb-2 block font-medium text-[#5c2e0b]">
              Password
            </label>

            <div className="relative">

              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="w-full rounded-xl border border-orange-100 px-4 py-3 pr-12 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
              />

              {/* Eye Button */}
              <button
                type="button"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg px-2 py-1 text-xl text-[#80664f] transition hover:bg-orange-50 hover:text-[#8b4513]"
                aria-label={
                  showPassword
                    ? "Hide password"
                    : "Show password"
                }
              >
                {showPassword ? "🙈" : "👁️"}
              </button>

            </div>

          </div>


          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-[#8b4513] py-3.5 font-bold text-white transition duration-300 hover:bg-[#6f350f] hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>


        {/* Register */}
        <p className="mt-6 text-center text-sm text-[#80664f]">

          Don't have an account?{" "}

          <Link
            to="/register"
            className="font-bold text-orange-600 hover:text-orange-700"
          >
            Create Account
          </Link>

        </p>

      </div>

    </main>
  );
};

export default Login;

