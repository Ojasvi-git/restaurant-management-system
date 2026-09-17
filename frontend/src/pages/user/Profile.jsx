import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";
import Loader from "../../components/Loader";

const Profile = () => {
  const { user, updateUser } = useAuth();

  const fileInputRef = useRef(null);

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    mobile: "",
    role: "",
    profileImage: "",
  });

  const [selectedImage, setSelectedImage] = useState(null);
  const [previewImage, setPreviewImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Fetch profile
  const fetchProfile = async () => {
    try {
      setLoading(true);

      const response = await api.get("/users/profile");

      const profileData = response.data.user;

      setProfile({
        name: profileData.name || "",
        email: profileData.email || "",
        mobile: profileData.mobile || "",
        role: profileData.role || "",
        profileImage: profileData.profileImage || "",
      });

      setPreviewImage(profileData.profileImage || "");
    } catch (error) {
      console.error("Profile Fetch Error:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to load profile"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // Input change
  const handleChange = (event) => {
    const { name, value } = event.target;

    setProfile((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // Image select
  const handleImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    // Allowed image types
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      toast.error(
        "Please select JPG, JPEG, PNG or WEBP image"
      );

      event.target.value = "";
      return;
    }

    // Maximum 5 MB
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5 MB");

      event.target.value = "";
      return;
    }

    setSelectedImage(file);

    const imageUrl = URL.createObjectURL(file);

    setPreviewImage(imageUrl);
  };

  // Remove selected image before saving
  const handleRemoveImage = () => {
    setSelectedImage(null);

    setPreviewImage(profile.profileImage || "");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Save profile
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!profile.name.trim()) {
      toast.error("Name is required");
      return;
    }

    if (!profile.mobile.trim()) {
      toast.error("Mobile number is required");
      return;
    }

    try {
      setSaving(true);

      const formData = new FormData();

      formData.append("name", profile.name.trim());
      formData.append("mobile", profile.mobile.trim());

      if (selectedImage) {
        formData.append(
          "profileImage",
          selectedImage
        );
      }

      const response = await api.put(
        "/users/profile",
        formData
      );

      const updatedUser = response.data.user;

      setProfile({
        name: updatedUser.name || "",
        email: updatedUser.email || "",
        mobile: updatedUser.mobile || "",
        role: updatedUser.role || "",
        profileImage:
          updatedUser.profileImage || "",
      });

      setPreviewImage(
        updatedUser.profileImage || ""
      );

      setSelectedImage(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      // Update AuthContext + localStorage
       updateUser(updatedUser);

      toast.success(
        "Profile updated successfully!"
      );
    } catch (error) {
      console.error("Profile Update Error:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to update profile"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <Loader text="Loading your profile..." />;
  }

  return (
    <main className="min-h-screen bg-[#fffaf3] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">

        {/* Header */}
        <section className="overflow-hidden rounded-3xl bg-[#4b270b] p-8 shadow-xl md:p-10">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">

            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-orange-300">
                My Account
              </p>

              <h1 className="mt-3 text-3xl font-extrabold text-white md:text-4xl">
                My Profile
              </h1>

              <p className="mt-3 max-w-2xl text-orange-100">
                Manage your personal information and profile
                picture.
              </p>
            </div>

            <Link
              to="/user/dashboard"
              className="w-fit rounded-xl bg-white px-5 py-3 font-bold text-[#8b4513] transition hover:bg-orange-50"
            >
              ← Dashboard
            </Link>

          </div>
        </section>

        {/* Profile Card */}
        <section className="mt-8 rounded-3xl border border-orange-100 bg-white p-6 shadow-sm md:p-8">

          <form onSubmit={handleSubmit}>

            {/* Profile Image */}
            <div className="flex flex-col items-center border-b border-orange-100 pb-8">

              <div className="relative">

                <div className="flex h-36 w-36 items-center justify-center overflow-hidden rounded-full border-4 border-orange-200 bg-orange-50 shadow-lg">

                  {previewImage ? (
                    <img
                      src={previewImage}
                      alt="Profile"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-6xl">
                      👤
                    </span>
                  )}

                </div>

                {/* Camera button */}
                <button
                  type="button"
                  onClick={() =>
                    fileInputRef.current?.click()
                  }
                  className="absolute bottom-1 right-1 flex h-11 w-11 items-center justify-center rounded-full bg-[#8b4513] text-xl text-white shadow-lg transition hover:bg-[#6f350f] hover:scale-105"
                  title="Change profile image"
                >
                  📷
                </button>

              </div>

              <h2 className="mt-5 text-xl font-extrabold text-[#4b270b]">
                {profile.name || "User"}
              </h2>

              <p className="mt-1 text-sm text-[#80664f]">
                {profile.email}
              </p>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={handleImageChange}
                className="hidden"
              />

              <div className="mt-5 flex flex-wrap justify-center gap-3">

                <button
                  type="button"
                  onClick={() =>
                    fileInputRef.current?.click()
                  }
                  className="rounded-xl bg-orange-100 px-5 py-2.5 text-sm font-bold text-orange-700 transition hover:bg-orange-200"
                >
                  📷 Change Photo
                </button>

                {selectedImage && (
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="rounded-xl bg-red-100 px-5 py-2.5 text-sm font-bold text-red-700 transition hover:bg-red-200"
                  >
                    ✕ Remove
                  </button>
                )}

              </div>

              <p className="mt-3 text-xs text-[#9a8067]">
                JPG, PNG, JPEG or WEBP • Maximum 5 MB
              </p>

            </div>

            {/* Personal Information */}
            <div className="mt-8">

              <div className="mb-6">
                <p className="font-semibold uppercase tracking-widest text-orange-600">
                  Personal Information
                </p>

                <h2 className="mt-2 text-2xl font-extrabold text-[#4b270b]">
                  Account Details
                </h2>
              </div>

              <div className="grid gap-6 md:grid-cols-2">

                {/* Name */}
                <div>
                  <label
                    htmlFor="name"
                    className="mb-2 block text-sm font-bold text-[#4b270b]"
                  >
                    Full Name
                  </label>

                  <input
                    id="name"
                    type="text"
                    name="name"
                    value={profile.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    className="w-full rounded-xl border border-orange-200 bg-[#fffaf3] px-4 py-3 text-[#4b270b] outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                  />
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-bold text-[#4b270b]"
                  >
                    Email Address
                  </label>

                  <input
                    id="email"
                    type="email"
                    value={profile.email}
                    disabled
                    className="w-full cursor-not-allowed rounded-xl border border-orange-100 bg-gray-100 px-4 py-3 text-gray-500"
                  />

                  <p className="mt-2 text-xs text-[#9a8067]">
                    Email cannot be changed from profile settings.
                  </p>
                </div>

                {/* Mobile */}
                <div>
                  <label
                    htmlFor="mobile"
                    className="mb-2 block text-sm font-bold text-[#4b270b]"
                  >
                    Mobile Number
                  </label>

                  <input
                    id="mobile"
                    type="tel"
                    name="mobile"
                    value={profile.mobile}
                    onChange={handleChange}
                    placeholder="Enter mobile number"
                    className="w-full rounded-xl border border-orange-200 bg-[#fffaf3] px-4 py-3 text-[#4b270b] outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                  />
                </div>

                {/* Role */}
                <div>
                  <label
                    htmlFor="role"
                    className="mb-2 block text-sm font-bold text-[#4b270b]"
                  >
                    Account Type
                  </label>

                  <input
                    id="role"
                    type="text"
                    value={
                      profile.role
                        ? profile.role
                            .charAt(0)
                            .toUpperCase() +
                          profile.role.slice(1)
                        : ""
                    }
                    disabled
                    className="w-full cursor-not-allowed rounded-xl border border-orange-100 bg-gray-100 px-4 py-3 text-gray-500"
                  />
                </div>

              </div>

            </div>

            {/* Save */}
            <div className="mt-8 flex flex-col justify-end gap-3 border-t border-orange-100 pt-6 sm:flex-row">

              <Link
                to="/user/dashboard"
                className="rounded-xl border border-orange-200 px-6 py-3 text-center font-bold text-[#6b4423] transition hover:bg-orange-50"
              >
                Cancel
              </Link>

              <button
                type="submit"
                disabled={saving}
                className="rounded-xl bg-[#8b4513] px-7 py-3 font-bold text-white shadow-sm transition hover:bg-[#6f350f] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving
                  ? "Saving Changes..."
                  : "💾 Save Changes"}
              </button>

            </div>

          </form>

        </section>

        {/* Account Info */}
        <section className="mt-6 rounded-2xl border border-orange-100 bg-orange-50 p-5">

          <div className="flex gap-4">

            <div className="text-2xl">
              🔐
            </div>

            <div>
              <h3 className="font-bold text-[#4b270b]">
                Your Account is Secure
              </h3>

              <p className="mt-1 text-sm leading-6 text-[#80664f]">
                Your profile information is securely stored in
                MongoDB and your profile image is stored on
                Cloudinary.
              </p>
            </div>

          </div>

        </section>

      </div>
    </main>
  );
};

export default Profile;