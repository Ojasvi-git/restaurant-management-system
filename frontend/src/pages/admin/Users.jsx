import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../../services/api";
import Loader from "../../components/Loader";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [search, setSearch] = useState("");

  const fetchUsers = async () => {
    try {
      setLoading(true);

      const response = await api.get("/users");

      setUsers(response.data.users || []);
    } catch (error) {
      console.error("Fetch Users Error:", error);

      toast.error(
        error.response?.data?.message ||
          "Users fetch karne me problem hui"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const deleteUser = async (userId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      setDeletingId(userId);

      await api.delete(`/users/${userId}`);

      toast.success("User deleted successfully");

      setUsers((prev) =>
        prev.filter((user) => user._id !== userId)
      );
    } catch (error) {
      console.error("Delete User Error:", error);

      toast.error(
        error.response?.data?.message ||
          "User delete nahi ho paya"
      );
    } finally {
      setDeletingId(null);
    }
  };

  const filteredUsers = users.filter((user) => {
    const searchText = search.toLowerCase();

    return (
      user.name?.toLowerCase().includes(searchText) ||
      user.email?.toLowerCase().includes(searchText) ||
      user.mobile?.toLowerCase().includes(searchText) ||
      user.role?.toLowerCase().includes(searchText)
    );
  });

  const getRoleClass = (role) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-700";

      case "counter":
        return "bg-orange-100 text-orange-700";

      case "chef":
        return "bg-blue-100 text-blue-700";

      case "user":
        return "bg-green-100 text-green-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const formatRole = (role) => {
    if (!role) return "Unknown";

    return role.charAt(0).toUpperCase() + role.slice(1);
  };

  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  if (loading) {
    return <Loader text="Loading users..." />;
  }

  return (
    <div className="min-h-screen bg-[#fffaf3] px-4 py-8 md:px-8">
      <div className="mx-auto max-w-7xl">

        {/* HEADER */}
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-orange-600">
              Admin Panel
            </p>

            <h1 className="text-3xl font-extrabold text-[#4b270b] md:text-4xl">
              User Management
            </h1>

            <p className="mt-2 text-sm text-[#80664f] md:text-base">
              Manage restaurant customers and staff accounts.
            </p>
          </div>

          <button
            onClick={fetchUsers}
            className="rounded-xl bg-[#8b4513] px-5 py-3 font-semibold text-white shadow-md transition hover:bg-[#6f350f]"
          >
            🔄 Refresh Users
          </button>
        </div>

        {/* STATS */}
        <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">

          <div className="rounded-2xl border border-orange-100 bg-white p-5 shadow-sm">
            <p className="text-sm text-[#80664f]">
              Total Users
            </p>

            <h2 className="mt-2 text-3xl font-extrabold text-[#4b270b]">
              {users.length}
            </h2>
          </div>

          <div className="rounded-2xl border border-green-100 bg-white p-5 shadow-sm">
            <p className="text-sm text-[#80664f]">
              Customers
            </p>

            <h2 className="mt-2 text-3xl font-extrabold text-green-600">
              {
                users.filter((user) => user.role === "user").length
              }
            </h2>
          </div>

          <div className="rounded-2xl border border-orange-100 bg-white p-5 shadow-sm">
            <p className="text-sm text-[#80664f]">
              Staff
            </p>

            <h2 className="mt-2 text-3xl font-extrabold text-orange-600">
              {
                users.filter(
                  (user) =>
                    user.role === "counter" ||
                    user.role === "chef"
                ).length
              }
            </h2>
          </div>

          <div className="rounded-2xl border border-red-100 bg-white p-5 shadow-sm">
            <p className="text-sm text-[#80664f]">
              Admins
            </p>

            <h2 className="mt-2 text-3xl font-extrabold text-red-600">
              {
                users.filter((user) => user.role === "admin").length
              }
            </h2>
          </div>

        </div>

        {/* SEARCH */}
        <div className="mb-8 rounded-2xl border border-orange-100 bg-white p-5 shadow-sm">
          <label className="mb-2 block text-sm font-bold text-[#4b270b]">
            Search Users
          </label>

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, mobile or role..."
            className="w-full rounded-xl border border-orange-200 bg-[#fffaf3] px-4 py-3 text-sm text-[#4b270b] outline-none transition focus:border-orange-500"
          />
        </div>

        {/* USER COUNT */}
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-bold text-[#4b270b]">
            Registered Users
          </h2>

          <span className="rounded-full bg-orange-100 px-4 py-2 text-sm font-semibold text-orange-700">
            {filteredUsers.length} Users
          </span>
        </div>

        {/* USERS */}
        {filteredUsers.length === 0 ? (
          <div className="rounded-3xl border border-orange-100 bg-white px-6 py-16 text-center shadow-sm">
            <div className="text-5xl">👥</div>

            <h3 className="mt-4 text-xl font-bold text-[#4b270b]">
              No Users Found
            </h3>

            <p className="mt-2 text-sm text-[#80664f]">
              No users match your search.
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-3xl border border-orange-100 bg-white shadow-sm">

            {/* DESKTOP TABLE */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-orange-100 bg-[#fffaf3]">
                    <th className="px-6 py-4 text-left text-sm font-bold text-[#4b270b]">
                      User
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-bold text-[#4b270b]">
                      Contact
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-bold text-[#4b270b]">
                      Role
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-bold text-[#4b270b]">
                      Joined
                    </th>

                    <th className="px-6 py-4 text-right text-sm font-bold text-[#4b270b]">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredUsers.map((user) => (
                    <tr
                      key={user._id}
                      className="border-b border-orange-50 transition hover:bg-[#fffaf3]"
                    >
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">

                          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-orange-100 text-lg font-bold text-orange-700">
                            {user.name?.charAt(0)?.toUpperCase()}
                          </div>

                          <div>
                            <p className="font-bold text-[#4b270b]">
                              {user.name}
                            </p>

                            <p className="text-xs text-[#80664f]">
                              ID: {user._id.slice(-8)}
                            </p>
                          </div>

                        </div>
                      </td>

                      <td className="px-6 py-5">
                        <p className="text-sm font-medium text-[#4b270b]">
                          {user.email}
                        </p>

                        <p className="mt-1 text-xs text-[#80664f]">
                          {user.mobile}
                        </p>
                      </td>

                      <td className="px-6 py-5">
                        <span
                          className={`rounded-full px-3 py-1.5 text-xs font-bold ${getRoleClass(
                            user.role
                          )}`}
                        >
                          {formatRole(user.role)}
                        </span>
                      </td>

                      <td className="px-6 py-5 text-sm text-[#80664f]">
                        {formatDate(user.createdAt)}
                      </td>

                      <td className="px-6 py-5 text-right">
                        {user.role === "admin" ? (
                          <span className="text-xs font-semibold text-gray-400">
                            Protected
                          </span>
                        ) : (
                          <button
                            onClick={() =>
                              deleteUser(user._id)
                            }
                            disabled={
                              deletingId === user._id
                            }
                            className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {deletingId === user._id
                              ? "Deleting..."
                              : "🗑️ Delete"}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* MOBILE CARDS */}
            <div className="space-y-4 p-4 md:hidden">
              {filteredUsers.map((user) => (
                <div
                  key={user._id}
                  className="rounded-2xl border border-orange-100 bg-[#fffaf3] p-4"
                >
                  <div className="flex items-start justify-between gap-3">

                    <div className="flex items-center gap-3">

                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-orange-100 text-lg font-bold text-orange-700">
                        {user.name?.charAt(0)?.toUpperCase()}
                      </div>

                      <div>
                        <h3 className="font-bold text-[#4b270b]">
                          {user.name}
                        </h3>

                        <p className="text-xs text-[#80664f]">
                          {user.email}
                        </p>
                      </div>

                    </div>

                    <span
                      className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold ${getRoleClass(
                        user.role
                      )}`}
                    >
                      {formatRole(user.role)}
                    </span>

                  </div>

                  <div className="mt-4 space-y-2 border-t border-orange-100 pt-4 text-sm">
                    <p className="text-[#80664f]">
                      <span className="font-semibold text-[#4b270b]">
                        Mobile:
                      </span>{" "}
                      {user.mobile}
                    </p>

                    <p className="text-[#80664f]">
                      <span className="font-semibold text-[#4b270b]">
                        Joined:
                      </span>{" "}
                      {formatDate(user.createdAt)}
                    </p>
                  </div>

                  {user.role === "admin" ? (
                    <div className="mt-4 rounded-xl bg-gray-100 px-4 py-3 text-center text-xs font-semibold text-gray-500">
                      🔒 Admin account protected
                    </div>
                  ) : (
                    <button
                      onClick={() => deleteUser(user._id)}
                      disabled={deletingId === user._id}
                      className="mt-4 w-full rounded-xl bg-red-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {deletingId === user._id
                        ? "Deleting..."
                        : "🗑️ Delete User"}
                    </button>
                  )}
                </div>
              ))}
            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default Users;