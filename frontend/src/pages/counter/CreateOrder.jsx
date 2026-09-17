
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import api from "../../services/api";
import Loader from "../../components/Loader";

const CreateOrder = () => {
  const navigate = useNavigate();

  const [menuItems, setMenuItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);

  const [customerName, setCustomerName] = useState("");
  const [customerMobile, setCustomerMobile] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash");

  const [searchedUser, setSearchedUser] = useState(null);
  const [searchingCustomer, setSearchingCustomer] = useState(false);
  const [customerSearchDone, setCustomerSearchDone] = useState(false);

  const [loadingMenu, setLoadingMenu] = useState(true);
  const [creatingOrder, setCreatingOrder] = useState(false);

  const fetchMenu = async () => {
    try {
      setLoadingMenu(true);

      const response = await api.get("/menu");

      const availableItems = (response.data.menuItems || []).filter(
        (item) => item.isAvailable
      );

      setMenuItems(availableItems);
    } catch (error) {
      console.error("Menu Error:", error);

      toast.error(
        error.response?.data?.message || "Unable to load menu"
      );
    } finally {
      setLoadingMenu(false);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  // SEARCH REGISTERED CUSTOMER
  const handleSearchCustomer = async () => {
    const mobile = customerMobile.trim();

    if (!mobile) {
      toast.error("Please enter customer mobile number");
      return;
    }

    if (!/^\d{10}$/.test(mobile)) {
      toast.error("Please enter a valid 10-digit mobile number");
      return;
    }

    try {
      setSearchingCustomer(true);
      setSearchedUser(null);
      setCustomerSearchDone(false);

      const response = await api.get(
        `/users/search?mobile=${encodeURIComponent(mobile)}`
      );

      // IMPORTANT:
      // Backend directly sends response.data.user
      // It does NOT send response.data.found
      if (response.data.user) {
        setSearchedUser(response.data.user);

        // Automatically fill registered user's details
        setCustomerName(response.data.user.name);
        setCustomerMobile(response.data.user.mobile);

        toast.success("Registered customer found");
      } else {
        setSearchedUser(null);

        toast("No registered customer found. You can continue as walk-in.", {
          icon: "👤",
        });
      }
    } catch (error) {
      console.error("Search Customer Error:", error);

      if (error.response?.status === 404) {
        setSearchedUser(null);

        toast("No registered customer found. You can continue as walk-in.", {
          icon: "👤",
        });
      } else {
        toast.error(
          error.response?.data?.message || "Unable to search customer"
        );
      }
    } finally {
      setCustomerSearchDone(true);
      setSearchingCustomer(false);
    }
  };

  const handleSelectCustomer = () => {
    if (!searchedUser) {
      return;
    }

    setCustomerName(searchedUser.name);
    setCustomerMobile(searchedUser.mobile);

    toast.success("Customer selected");
  };

  const addItem = (item) => {
    setSelectedItems((previousItems) => {
      const existingItem = previousItems.find(
        (selected) => selected.menuItem === item._id
      );

      if (existingItem) {
        return previousItems.map((selected) =>
          selected.menuItem === item._id
            ? {
                ...selected,
                quantity: selected.quantity + 1,
              }
            : selected
        );
      }

      return [
        ...previousItems,
        {
          menuItem: item._id,
          name: item.name,
          price: item.price,
          quantity: 1,
        },
      ];
    });

    toast.success(`${item.name} added`);
  };

  const increaseQuantity = (menuItemId) => {
    setSelectedItems((previousItems) =>
      previousItems.map((item) =>
        item.menuItem === menuItemId
          ? {
              ...item,
              quantity: item.quantity + 1,
            }
          : item
      )
    );
  };

  const decreaseQuantity = (menuItemId) => {
    setSelectedItems((previousItems) =>
      previousItems
        .map((item) =>
          item.menuItem === menuItemId
            ? {
                ...item,
                quantity: item.quantity - 1,
              }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeItem = (menuItemId) => {
    setSelectedItems((previousItems) =>
      previousItems.filter((item) => item.menuItem !== menuItemId)
    );
  };

  const totalAmount = useMemo(() => {
    return selectedItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  }, [selectedItems]);

  const handleCreateOrder = async (e) => {
    e.preventDefault();

    if (!customerName.trim()) {
      toast.error("Please enter customer name");
      return;
    }

    if (!customerMobile.trim()) {
      toast.error("Please enter customer mobile");
      return;
    }

    if (!/^[0-9]{10}$/.test(customerMobile)) {
      toast.error("Please enter a valid 10 digit mobile number");
      return;
    }

    if (selectedItems.length === 0) {
      toast.error("Please select at least one dish");
      return;
    }

    try {
      setCreatingOrder(true);

      const orderData = {
        customerName: customerName.trim(),
        customerMobile: customerMobile.trim(),

        // IMPORTANT:
        // If registered customer was found,
        // save their MongoDB user ID with the order.
        user: searchedUser ? searchedUser._id : null,

        items: selectedItems.map((item) => ({
          menuItem: item.menuItem,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          subtotal: item.price * item.quantity,
        })),

        totalAmount,

        paymentMethod,
      };

      const response = await api.post("/orders", orderData);

      toast.success(
        response.data.message || "Order created successfully!"
      );

      setCustomerName("");
      setCustomerMobile("");
      setSelectedItems([]);
      setPaymentMethod("cash");
      setSearchedUser(null);
      setCustomerSearchDone(false);

      navigate("/counter/dashboard");
    } catch (error) {
      console.error("Create Order Error:", error);

      toast.error(
        error.response?.data?.message || "Unable to create order"
      );
    } finally {
      setCreatingOrder(false);
    }
  };

  if (loadingMenu) {
    return (
      <main className="min-h-screen bg-[#fffaf3]">
        <Loader text="Loading menu for counter..." />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#fffaf3] px-5 py-10 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl">
        {/* HEADER */}
        <div className="mb-10">
          <p className="font-semibold uppercase tracking-[0.25em] text-orange-600">
            Counter Portal
          </p>

          <h1 className="mt-2 text-4xl font-extrabold text-[#4b270b]">
            Create New Order
          </h1>

          <p className="mt-3 text-[#80664f]">
            Take customer details, select dishes and create the order.
          </p>
        </div>

        <form onSubmit={handleCreateOrder}>
          <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr]">
            {/* LEFT */}
            <section>
              {/* CUSTOMER */}
              <div className="rounded-3xl bg-white p-6 shadow-xl sm:p-8">
                <h2 className="text-2xl font-bold text-[#4b270b]">
                  Customer Details
                </h2>

                <div className="grid gap-5 md:grid-cols-2">
                  {/* Customer Mobile */}
                  <div>
                    <label className="mb-2 block text-sm font-bold text-[#4b270b]">
                      Customer Mobile
                    </label>

                    <div className="flex flex-col gap-3 sm:flex-row">
                      <input
                        type="tel"
                        value={customerMobile}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, "");

                          setCustomerMobile(value);
                          setSearchedUser(null);
                          setCustomerSearchDone(false);
                        }}
                        placeholder="Enter 10-digit mobile"
                        maxLength={10}
                        className="w-full rounded-xl border border-orange-200 bg-[#fffaf3] px-4 py-3 text-[#4b270b] outline-none transition focus:border-orange-500"
                      />

                      <button
                        type="button"
                        onClick={handleSearchCustomer}
                        disabled={searchingCustomer}
                        className="rounded-xl bg-[#8b4513] px-5 py-3 font-bold text-white transition hover:bg-[#6f350d] disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {searchingCustomer ? "Searching..." : "Search"}
                      </button>
                    </div>
                  </div>

                  {/* Customer Name */}
                  <div>
                    <label className="mb-2 block text-sm font-bold text-[#4b270b]">
                      Customer Name
                    </label>

                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Customer name"
                      disabled={!!searchedUser}
                      className="w-full rounded-xl border border-orange-200 bg-[#fffaf3] px-4 py-3 text-[#4b270b] outline-none transition focus:border-orange-500 disabled:cursor-not-allowed disabled:bg-orange-50"
                    />
                  </div>
                </div>

                {/* REGISTERED CUSTOMER */}
                {searchedUser && (
                  <div className="mt-5 rounded-2xl border border-green-200 bg-green-50 p-5">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm font-bold text-green-700">
                          ✓ Registered Customer Found
                        </p>

                        <h3 className="mt-1 text-lg font-extrabold text-[#4b270b]">
                          {searchedUser.name}
                        </h3>

                        <p className="mt-1 text-sm text-[#80664f]">
                          {searchedUser.mobile}
                        </p>

                        <p className="mt-1 text-sm text-[#80664f]">
                          {searchedUser.email}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={handleSelectCustomer}
                        className="rounded-xl bg-green-600 px-5 py-3 font-bold text-white transition hover:bg-green-700"
                      >
                        Select Customer
                      </button>
                    </div>
                  </div>
                )}

                {/* WALK-IN CUSTOMER */}
                {customerSearchDone && !searchedUser && (
                  <div className="mt-5 rounded-2xl border border-orange-200 bg-orange-50 p-5">
                    <p className="font-bold text-[#8b4513]">
                      Walk-in Customer
                    </p>

                    <p className="mt-1 text-sm text-[#80664f]">
                      No registered account found with this mobile number.
                      You can enter the customer's name and continue with the
                      order.
                    </p>
                  </div>
                )}
              </div>

              {/* MENU */}
              <div className="mt-8 rounded-3xl bg-white p-6 shadow-xl sm:p-8">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-[#4b270b]">
                    Select Dishes
                  </h2>

                  <span className="rounded-full bg-orange-100 px-4 py-2 text-sm font-bold text-[#8b4513]">
                    {menuItems.length} Available
                  </span>
                </div>

                {menuItems.length === 0 ? (
                  <div className="mt-8 rounded-2xl bg-orange-50 p-8 text-center">
                    <div className="text-5xl">🍽️</div>

                    <h3 className="mt-3 font-bold text-[#4b270b]">
                      No dishes available
                    </h3>

                    <p className="mt-1 text-sm text-[#80664f]">
                      Ask admin to add available menu items.
                    </p>
                  </div>
                ) : (
                  <div className="mt-6 grid gap-5 sm:grid-cols-2">
                    {menuItems.map((item) => {
                      const selected = selectedItems.find(
                        (selectedItem) => selectedItem.menuItem === item._id
                      );

                      return (
                        <div
                          key={item._id}
                          className="overflow-hidden rounded-2xl border border-orange-100 bg-[#fffaf3] transition hover:-translate-y-1 hover:shadow-lg"
                        >
                          <div className="h-40 overflow-hidden bg-orange-50">
                            {item.image ? (
                              <img
                                src={item.image}
                                alt={item.name}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="flex h-full items-center justify-center">
                                <span className="text-5xl">🍽️</span>
                              </div>
                            )}
                          </div>

                          <div className="p-4">
                            <div className="flex justify-between gap-3">
                              <div>
                                <h3 className="font-bold text-[#4b270b]">
                                  {item.name}
                                </h3>

                                <p className="mt-1 text-xs text-orange-600">
                                  {item.category}
                                </p>
                              </div>

                              <span className="font-extrabold text-orange-600">
                                ₹{item.price}
                              </span>
                            </div>

                            <button
                              type="button"
                              onClick={() => addItem(item)}
                              className="mt-4 w-full rounded-xl bg-[#8b4513] py-2.5 text-sm font-bold text-white transition hover:bg-[#6f350e]"
                            >
                              {selected
                                ? `Added × ${selected.quantity}`
                                : "Add to Order"}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </section>

            {/* RIGHT */}
            <aside className="h-fit lg:sticky lg:top-24">
              <div className="rounded-3xl bg-[#4b270b] p-6 text-white shadow-2xl sm:p-8">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">Current Order</h2>

                  <span className="rounded-full bg-white/10 px-3 py-1 text-sm">
                    {selectedItems.length} Items
                  </span>
                </div>

                {selectedItems.length === 0 ? (
                  <div className="py-14 text-center">
                    <div className="text-5xl">🛒</div>

                    <p className="mt-4 text-orange-100">
                      No items selected yet.
                    </p>

                    <p className="mt-1 text-sm text-orange-200/70">
                      Select dishes from the menu.
                    </p>
                  </div>
                ) : (
                  <div className="mt-6 space-y-4">
                    {selectedItems.map((item) => (
                      <div
                        key={item.menuItem}
                        className="rounded-2xl bg-white/10 p-4"
                      >
                        <div className="flex justify-between gap-3">
                          <div>
                            <h3 className="font-bold">{item.name}</h3>

                            <p className="mt-1 text-sm text-orange-200">
                              ₹{item.price} × {item.quantity}
                            </p>
                          </div>

                          <span className="font-bold">
                            ₹{item.price * item.quantity}
                          </span>
                        </div>

                        <div className="mt-3 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                decreaseQuantity(item.menuItem)
                              }
                              className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/15 font-bold hover:bg-white/25"
                            >
                              −
                            </button>

                            <span className="w-6 text-center font-bold">
                              {item.quantity}
                            </span>

                            <button
                              type="button"
                              onClick={() =>
                                increaseQuantity(item.menuItem)
                              }
                              className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/15 font-bold hover:bg-white/25"
                            >
                              +
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => removeItem(item.menuItem)}
                            className="text-xs font-semibold text-orange-200 hover:text-white"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* TOTAL */}
                <div className="mt-6 border-t border-white/20 pt-5">
                  <div className="flex justify-between text-orange-100">
                    <span>Subtotal</span>
                    <span>₹{totalAmount}</span>
                  </div>

                  <div className="mt-3 flex justify-between text-xl font-extrabold">
                    <span>Total</span>
                    <span>₹{totalAmount}</span>
                  </div>
                </div>

                {/* PAYMENT */}
                <div className="mt-6">
                  <label className="mb-2 block text-sm font-semibold text-orange-100">
                    Payment Method
                  </label>

                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white outline-none"
                  >
                    <option value="cash" className="text-black">
                      Cash
                    </option>

                    <option value="upi" className="text-black">
                      UPI
                    </option>

                    <option value="card" className="text-black">
                      Card
                    </option>

                    <option value="other" className="text-black">
                      Other
                    </option>
                  </select>
                </div>

                {/* CREATE */}
                <button
                  type="submit"
                  disabled={
                    creatingOrder || selectedItems.length === 0
                  }
                  className="mt-6 w-full rounded-xl bg-orange-500 py-3.5 font-extrabold text-white shadow-lg transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {creatingOrder ? "Creating Order..." : "Create Order"}
                </button>
              </div>
            </aside>
          </div>
        </form>
      </div>
    </main>
  );
};

export default CreateOrder;

