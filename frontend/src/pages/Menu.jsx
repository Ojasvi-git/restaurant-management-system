import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

import api from "../services/api";
import Loader from "../components/Loader";

const Menu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const fetchMenuItems = async () => {
    try {
      setLoading(true);

      const response = await api.get("/menu");

      setMenuItems(response.data.menuItems || []);
    } catch (error) {
      console.error("Menu Fetch Error:", error);

      toast.error(
        error.response?.data?.message ||
          "Unable to load menu"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const categories = useMemo(() => {
    const uniqueCategories = [
      ...new Set(menuItems.map((item) => item.category)),
    ];

    return ["All", ...uniqueCategories];
  }, [menuItems]);

  const filteredItems =
    selectedCategory === "All"
      ? menuItems
      : menuItems.filter(
          (item) => item.category === selectedCategory
        );

  if (loading) {
    return (
      <main className="min-h-screen bg-[#fffaf3]">
        <Loader text="Loading delicious menu..." />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#fffaf3] px-5 py-12 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl">

        {/* HEADER */}
        <div className="text-center">
          <p className="font-semibold uppercase tracking-[0.25em] text-orange-600">
            Our Menu
          </p>

          <h1 className="mt-3 text-4xl font-extrabold text-[#4b270b] sm:text-5xl">
            Delicious Food, Made With Love
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-[#80664f]">
            Explore our carefully prepared dishes made with
            fresh ingredients and authentic flavours.
          </p>
        </div>

        {/* CATEGORY FILTER */}
        {categories.length > 1 && (
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() =>
                  setSelectedCategory(category)
                }
                className={`rounded-full px-5 py-2.5 text-sm font-semibold transition ${
                  selectedCategory === category
                    ? "bg-[#8b4513] text-white shadow-md"
                    : "bg-white text-[#6b4423] shadow-sm hover:bg-orange-50"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        )}

        {/* EMPTY STATE */}
        {filteredItems.length === 0 ? (
          <div className="mt-16 rounded-3xl bg-white p-10 text-center shadow-lg">
            <div className="text-6xl">🍽️</div>

            <h2 className="mt-5 text-2xl font-bold text-[#4b270b]">
              Menu Coming Soon
            </h2>

            <p className="mt-2 text-[#80664f]">
              Our delicious menu items will appear here.
            </p>
          </div>
        ) : (
          /* MENU GRID */
          <div className="mt-12 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {filteredItems.map((item) => (
              <article
                key={item._id}
                className="group overflow-hidden rounded-3xl bg-white shadow-lg transition duration-300 hover:-translate-y-2 hover:shadow-2xl"
              >
                {/* IMAGE */}
                <div className="relative h-56 overflow-hidden bg-orange-50">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <span className="text-7xl">🍽️</span>
                    </div>
                  )}

                  {/* CATEGORY */}
                  <span className="absolute left-4 top-4 rounded-full bg-white/95 px-4 py-1.5 text-xs font-bold text-[#8b4513] shadow">
                    {item.category}
                  </span>

                  {!item.isAvailable && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                      <span className="rounded-full bg-white px-5 py-2 font-bold text-red-600">
                        Currently Unavailable
                      </span>
                    </div>
                  )}
                </div>

                {/* CONTENT */}
                <div className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <h2 className="text-xl font-bold text-[#4b270b]">
                      {item.name}
                    </h2>

                    <span className="shrink-0 text-lg font-extrabold text-orange-600">
                      ₹{item.price}
                    </span>
                  </div>

                  {item.description && (
                    <p className="mt-3 line-clamp-2 text-sm leading-6 text-[#80664f]">
                      {item.description}
                    </p>
                  )}

                  <div className="mt-5 flex items-center justify-between border-t border-orange-100 pt-4">
                    <span
                      className={`text-sm font-semibold ${
                        item.isAvailable
                          ? "text-green-600"
                          : "text-red-500"
                      }`}
                    >
                      {item.isAvailable
                        ? "● Available"
                        : "● Unavailable"}
                    </span>

                    <span className="text-sm font-medium text-[#9a7655]">
                      Freshly Prepared
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default Menu;