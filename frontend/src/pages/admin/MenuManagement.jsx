import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import api from "../../services/api";
import Loader from "../../components/Loader";

const MenuManagement = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    isAvailable: true,
    image: null,
  });

  const fetchMenu = async () => {
    try {
      setLoading(true);

      const response = await api.get("/menu");

      setMenuItems(
        response.data.menuItems || []
      );
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unable to load menu"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked, files } =
      e.target;

    if (type === "file") {
      setFormData((previous) => ({
        ...previous,
        image: files[0] || null,
      }));

      return;
    }

    setFormData((previous) => ({
      ...previous,
      [name]:
        type === "checkbox" ? checked : value,
    }));
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      category: "",
      price: "",
      isAvailable: true,
      image: null,
    });

    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.category ||
      !formData.price
    ) {
      toast.error(
        "Please fill all required fields"
      );

      return;
    }

    try {
      setSaving(true);

      const data = new FormData();

      data.append("name", formData.name);
      data.append(
        "description",
        formData.description
      );
      data.append("category", formData.category);
      data.append("price", formData.price);
      data.append(
        "isAvailable",
        formData.isAvailable
      );

      if (formData.image) {
        data.append("image", formData.image);
      }

      if (editingId) {
        const response = await api.put(
          `/menu/${editingId}`,
          data
        );

        toast.success(
          response.data.message ||
            "Menu item updated successfully"
        );
      } else {
        const response = await api.post(
          "/menu",
          data
        );

        toast.success(
          response.data.message ||
            "Menu item added successfully"
        );
      }

      resetForm();

      await fetchMenu();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unable to save menu item"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (item) => {
    setEditingId(item._id);

    setFormData({
      name: item.name,
      description: item.description || "",
      category: item.category,
      price: item.price,
      isAvailable: item.isAvailable,
      image: null,
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this menu item?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(id);

      const response = await api.delete(
        `/menu/${id}`
      );

      toast.success(
        response.data.message ||
          "Menu item deleted successfully"
      );

      await fetchMenu();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unable to delete menu item"
      );
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#fffaf3]">
        <Loader text="Loading menu management..." />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#fffaf3] px-5 py-12 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl">

        {/* HEADER */}
        <div className="mb-10">
          <p className="font-semibold uppercase tracking-[0.25em] text-orange-600">
            Admin Panel
          </p>

          <h1 className="mt-2 text-4xl font-extrabold text-[#4b270b]">
            Menu Management
          </h1>

          <p className="mt-3 text-[#80664f]">
            Add, edit and manage restaurant menu items.
          </p>
        </div>

        {/* FORM */}
        <section className="rounded-3xl bg-white p-6 shadow-xl sm:p-8">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-[#4b270b]">
                {editingId
                  ? "Edit Menu Item"
                  : "Add New Dish"}
              </h2>

              <p className="mt-1 text-sm text-[#80664f]">
                Menu images can be uploaded directly from
                the admin panel.
              </p>
            </div>

            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="rounded-xl bg-orange-100 px-4 py-2 text-sm font-semibold text-[#8b4513] hover:bg-orange-200"
              >
                Cancel Edit
              </button>
            )}
          </div>

          <form
            onSubmit={handleSubmit}
            className="grid gap-5 md:grid-cols-2"
          >
            {/* NAME */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-[#4b270b]">
                Dish Name *
              </label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Paneer Tikka"
                className="w-full rounded-xl border border-orange-100 px-4 py-3 outline-none focus:border-orange-400"
              />
            </div>

            {/* CATEGORY */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-[#4b270b]">
                Category *
              </label>

              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full rounded-xl border border-orange-100 bg-white px-4 py-3 outline-none focus:border-orange-400"
              >
                <option value="">
                  Select Category
                </option>
                <option value="Starters">
                  Starters
                </option>
                <option value="Main Course">
                  Main Course
                </option>
                <option value="Pizza">
                  Pizza
                </option>
                <option value="Burgers">
                  Burgers
                </option>
                <option value="Pasta">
                  Pasta
                </option>
                <option value="Drinks">
                  Drinks
                </option>
                <option value="Desserts">
                  Desserts
                </option>
              </select>
            </div>

            {/* PRICE */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-[#4b270b]">
                Price *
              </label>

              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="249"
                min="0"
                className="w-full rounded-xl border border-orange-100 px-4 py-3 outline-none focus:border-orange-400"
              />
            </div>

            {/* IMAGE */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-[#4b270b]">
                Dish Image
              </label>

              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleChange}
                className="w-full rounded-xl border border-orange-100 bg-white px-4 py-3 text-sm"
              />

              <p className="mt-2 text-xs text-[#80664f]">
                JPG, PNG or WEBP • Maximum 5MB
              </p>
            </div>

            {/* DESCRIPTION */}
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-semibold text-[#4b270b]">
                Description
              </label>

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                placeholder="Describe the dish..."
                className="w-full resize-none rounded-xl border border-orange-100 px-4 py-3 outline-none focus:border-orange-400"
              />
            </div>

            {/* AVAILABLE */}
            <label className="flex cursor-pointer items-center gap-3 text-sm font-semibold text-[#4b270b]">
              <input
                type="checkbox"
                name="isAvailable"
                checked={formData.isAvailable}
                onChange={handleChange}
                className="h-5 w-5 accent-orange-600"
              />

              Item is available
            </label>

            {/* SUBMIT */}
            <div className="flex justify-end md:col-span-2">
              <button
                type="submit"
                disabled={saving}
                className="rounded-xl bg-[#8b4513] px-7 py-3 font-bold text-white shadow-md transition hover:bg-[#6f350e] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving
                  ? editingId
                    ? "Updating..."
                    : "Adding..."
                  : editingId
                    ? "Update Dish"
                    : "Add Dish"}
              </button>
            </div>
          </form>
        </section>

        {/* MENU LIST */}
        <section className="mt-10">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-[#4b270b]">
              Menu Items
            </h2>

            <span className="rounded-full bg-orange-100 px-4 py-2 text-sm font-semibold text-[#8b4513]">
              {menuItems.length} Items
            </span>
          </div>

          {menuItems.length === 0 ? (
            <div className="rounded-3xl bg-white p-10 text-center shadow-lg">
              <div className="text-6xl">🍽️</div>

              <h3 className="mt-4 text-xl font-bold text-[#4b270b]">
                No menu items yet
              </h3>

              <p className="mt-2 text-[#80664f]">
                Add your first dish using the form above.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {menuItems.map((item) => (
                <article
                  key={item._id}
                  className="overflow-hidden rounded-3xl bg-white shadow-lg"
                >
                  <div className="h-52 overflow-hidden bg-orange-50">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <span className="text-6xl">
                          🍽️
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-xl font-bold text-[#4b270b]">
                          {item.name}
                        </h3>

                        <p className="mt-1 text-sm font-medium text-orange-600">
                          {item.category}
                        </p>
                      </div>

                      <span className="font-extrabold text-orange-600">
                        ₹{item.price}
                      </span>
                    </div>

                    {item.description && (
                      <p className="mt-3 text-sm leading-6 text-[#80664f]">
                        {item.description}
                      </p>
                    )}

                    <div className="mt-5 flex items-center justify-between">
                      <span
                        className={`text-sm font-bold ${
                          item.isAvailable
                            ? "text-green-600"
                            : "text-red-500"
                        }`}
                      >
                        {item.isAvailable
                          ? "● Available"
                          : "● Unavailable"}
                      </span>

                      <div className="flex gap-2">
                        <button
                          onClick={() =>
                            handleEdit(item)
                          }
                          className="rounded-lg bg-orange-100 px-3 py-2 text-sm font-bold text-[#8b4513] hover:bg-orange-200"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() =>
                            handleDelete(item._id)
                          }
                          disabled={
                            deletingId === item._id
                          }
                          className="rounded-lg bg-red-50 px-3 py-2 text-sm font-bold text-red-600 hover:bg-red-100 disabled:opacity-50"
                        >
                          {deletingId === item._id
                            ? "Deleting..."
                            : "Delete"}
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
};

export default MenuManagement;