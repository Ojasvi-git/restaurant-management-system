import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import api from "../services/api";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.email ||
      !formData.mobile ||
      !formData.password
    ) {
      toast.error("Please fill all fields");
      return;
    }

    setLoading(true);

    try {
      await api.post("/auth/register", formData);

      toast.success("Registration successful!");

      setFormData({
        name: "",
        email: "",
        mobile: "",
        password: "",
      });

      navigate("/login");

    } catch (error) {
      toast.error(
        error.response?.data?.message ||
        "Registration failed"
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
            Create Account
          </h1>

          <p className="mt-2 text-[#80664f]">
            Join Flavor House today
          </p>

        </div>


        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-5"
        >

          {/* Name */}
          <div>
            <label className="mb-2 block font-medium text-[#5c2e0b]">
              Full Name
            </label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
              className="w-full rounded-xl border border-orange-100 px-4 py-3 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
            />
          </div>


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


          {/* Mobile */}
          <div>
            <label className="mb-2 block font-medium text-[#5c2e0b]">
              Mobile Number
            </label>

            <input
              type="tel"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              placeholder="Enter your mobile number"
              className="w-full rounded-xl border border-orange-100 px-4 py-3 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
            />
          </div>


          {/* Password */}
          <div>
            <label className="mb-2 block font-medium text-[#5c2e0b]">
              Password
            </label>

            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a password"
              className="w-full rounded-xl border border-orange-100 px-4 py-3 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
            />
          </div>


          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-[#8b4513] py-3.5 font-bold text-white transition duration-300 hover:bg-[#6f350f] hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>

        </form>


        {/* Login Link */}
        <p className="mt-6 text-center text-sm text-[#80664f]">

          Already have an account?{" "}

          <Link
            to="/login"
            className="font-bold text-orange-600 hover:text-orange-700"
          >
            Login
          </Link>

        </p>

      </div>

    </main>
  );
};

export default Register;