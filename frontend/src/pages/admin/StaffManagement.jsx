import { useState } from "react";
import { Eye, EyeOff, UserPlus, ChefHat, CreditCard } from "lucide-react";
import toast from "react-hot-toast";

import api from "../../services/api";
import Loader from "../../components/Loader";

const StaffManagement = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
    role: "counter",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "mobile") {
      const onlyNumbers = value.replace(/\D/g, "").slice(0, 10);

      setFormData((prev) => ({
        ...prev,
        mobile: onlyNumbers,
      }));

      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, email, mobile, password, role } = formData;

    if (!name.trim() || !email.trim() || !mobile || !password) {
      toast.error("Please fill all fields");
      return;
    }

    if (mobile.length !== 10) {
      toast.error("Please enter a valid 10 digit mobile number");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/users/staff", {
        name: name.trim(),
        email: email.trim(),
        mobile,
        password,
        role,
      });

      toast.success(
        response.data.message || "Staff account created successfully"
      );

      setFormData({
        name: "",
        email: "",
        mobile: "",
        password: "",
        role: "counter",
      });

      setShowPassword(false);
    } catch (error) {
      console.error("Create Staff Error:", error);

      toast.error(
        error.response?.data?.message ||
          "Unable to create staff account"
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader text="Creating staff account..." />;
  }

  return (
    <div className="min-h-screen bg-[#fffaf3] px-4 py-8 md:px-8">
      <div className="mx-auto max-w-6xl">

        {/* Header */}
        <div className="mb-8">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-orange-100 px-4 py-2 text-sm font-semibold text-[#8b4513]">
            <UserPlus size={17} />
            Staff Management
          </div>

          <h1 className="text-3xl font-bold text-[#4b2e1f] md:text-4xl">
            Create Staff Account
          </h1>

          <p className="mt-2 max-w-2xl text-[#80664f]">
            Create and manage restaurant staff accounts for Counter and Chef
            operations.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">

          {/* Left Information */}
          <div className="space-y-5 lg:col-span-1">

            <div className="rounded-3xl bg-[#4b2e1f] p-7 text-white shadow-lg">
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-400 text-[#4b2e1f]">
                <UserPlus size={28} />
              </div>

              <h2 className="text-2xl font-bold">
                Add Restaurant Staff
              </h2>

              <p className="mt-3 leading-7 text-orange-100">
                Admin can create dedicated accounts for restaurant Counter
                and Chef staff members.
              </p>
            </div>

            {/* Counter */}
            <div className="rounded-3xl border border-orange-100 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-[#8b4513]">
                  <CreditCard size={24} />
                </div>

                <div>
                  <h3 className="font-bold text-[#4b2e1f]">
                    Counter Staff
                  </h3>

                  <p className="text-sm text-[#80664f]">
                    Orders & billing
                  </p>
                </div>
              </div>

              <p className="text-sm leading-6 text-[#80664f]">
                Counter staff can create customer orders, manage payments,
                search customers and generate bills.
              </p>
            </div>

            {/* Chef */}
            <div className="rounded-3xl border border-orange-100 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-[#8b4513]">
                  <ChefHat size={24} />
                </div>

                <div>
                  <h3 className="font-bold text-[#4b2e1f]">
                    Chef Staff
                  </h3>

                  <p className="text-sm text-[#80664f]">
                    Kitchen & orders
                  </p>
                </div>
              </div>

              <p className="text-sm leading-6 text-[#80664f]">
                Chef staff can view incoming orders and update their kitchen
                status from pending to preparing, ready and served.
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="rounded-3xl border border-orange-100 bg-white p-6 shadow-sm md:p-8 lg:col-span-2">

            <div className="mb-7 border-b border-orange-100 pb-5">
              <h2 className="text-2xl font-bold text-[#4b2e1f]">
                New Staff Account
              </h2>

              <p className="mt-1 text-sm text-[#80664f]">
                Enter the staff member's details below.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">

              {/* Name */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#4b2e1f]">
                  Full Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter staff name"
                  className="w-full rounded-xl border border-orange-100 bg-[#fffaf3] px-4 py-3 text-[#4b2e1f] outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                />
              </div>

              {/* Email + Mobile */}
              <div className="grid gap-5 md:grid-cols-2">

                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#4b2e1f]">
                    Email Address
                  </label>

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="staff@restaurant.com"
                    className="w-full rounded-xl border border-orange-100 bg-[#fffaf3] px-4 py-3 text-[#4b2e1f] outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#4b2e1f]">
                    Mobile Number
                  </label>

                  <input
                    type="text"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                    maxLength={10}
                    placeholder="10 digit mobile number"
                    className="w-full rounded-xl border border-orange-100 bg-[#fffaf3] px-4 py-3 text-[#4b2e1f] outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#4b2e1f]">
                  Password
                </label>

                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create password"
                    className="w-full rounded-xl border border-orange-100 bg-[#fffaf3] px-4 py-3 pr-12 text-[#4b2e1f] outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-[#80664f] transition hover:bg-orange-50 hover:text-[#8b4513]"
                  >
                    {showPassword ? (
                      <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )}
                  </button>
                </div>

                <p className="mt-2 text-xs text-[#80664f]">
                  Password must contain at least 6 characters.
                </p>
              </div>

              {/* Role */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#4b2e1f]">
                  Staff Role
                </label>

                <div className="grid gap-4 md:grid-cols-2">

                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        role: "counter",
                      }))
                    }
                    className={`rounded-2xl border-2 p-5 text-left transition ${
                      formData.role === "counter"
                        ? "border-orange-500 bg-orange-50"
                        : "border-orange-100 bg-white hover:border-orange-300"
                    }`}
                  >
                    <div className="mb-3 flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-100 text-[#8b4513]">
                        <CreditCard size={22} />
                      </div>

                      <div>
                        <p className="font-bold text-[#4b2e1f]">
                          Counter
                        </p>

                        <p className="text-xs text-[#80664f]">
                          Billing & Orders
                        </p>
                      </div>
                    </div>

                    <p className="text-sm text-[#80664f]">
                      Handles customer orders, payments and bills.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        role: "chef",
                      }))
                    }
                    className={`rounded-2xl border-2 p-5 text-left transition ${
                      formData.role === "chef"
                        ? "border-orange-500 bg-orange-50"
                        : "border-orange-100 bg-white hover:border-orange-300"
                    }`}
                  >
                    <div className="mb-3 flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-100 text-[#8b4513]">
                        <ChefHat size={22} />
                      </div>

                      <div>
                        <p className="font-bold text-[#4b2e1f]">
                          Chef
                        </p>

                        <p className="text-xs text-[#80664f]">
                          Kitchen Management
                        </p>
                      </div>
                    </div>

                    <p className="text-sm text-[#80664f]">
                      Handles incoming orders and kitchen status.
                    </p>
                  </button>

                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#8b4513] px-6 py-3.5 font-semibold text-white shadow-md transition hover:bg-[#6f350f] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <UserPlus size={20} />
                Create {formData.role === "counter" ? "Counter" : "Chef"} Account
              </button>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffManagement;