const bcrypt = require("bcryptjs");
const User = require("../models/User");


// Search user by mobile
const searchUserByMobile = async (req, res) => {
  try {
    const { mobile } = req.query;

    if (!mobile) {
      return res.status(400).json({
        message: "Mobile number is required",
      });
    }

    // Mobile number ko normalize karo
    const normalizedMobile = mobile
      .toString()
      .replace(/\D/g, "")
      .slice(-10);

    if (normalizedMobile.length !== 10) {
      return res.status(400).json({
        message: "Please enter a valid 10 digit mobile number",
      });
    }

    // Database me possible formatting ke saath search
    const users = await User.find({
      role: "user",
    }).select("-password");

    const user = users.find((item) => {
      const dbMobile = item.mobile
        ?.toString()
        .replace(/\D/g, "")
        .slice(-10);

      return dbMobile === normalizedMobile;
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      message: "User found successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        profileImage: user.profileImage,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Search User Error:", error);

    res.status(500).json({
      message: "Server error while searching user",
    });
  }
};


// Get current user's profile
const getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      message: "Profile fetched successfully",
      user,
    });
  } catch (error) {
    console.error("Get Profile Error:", error);

    res.status(500).json({
      message: "Server error while fetching profile",
    });
  }
};


// Update current user's profile
const updateMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const { name, mobile } = req.body;

    if (name !== undefined) {
      if (!name.trim()) {
        return res.status(400).json({
          message: "Name cannot be empty",
        });
      }

      user.name = name.trim();
    }

    if (mobile !== undefined) {
      if (!mobile.trim()) {
        return res.status(400).json({
          message: "Mobile number cannot be empty",
        });
      }

      user.mobile = mobile.trim();
    }

    // Profile image uploaded through Multer + Cloudinary
    if (req.file) {
      user.profileImage = req.file.path;
    }

    await user.save();

    res.status(200).json({
      message: "Profile updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        profileImage: user.profileImage,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Update Profile Error:", error);

    res.status(500).json({
      message: "Server error while updating profile",
    });
  }
};


// Get all users - Admin
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-password")
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "Users fetched successfully",
      users,
    });
  } catch (error) {
    console.error("Get All Users Error:", error);

    res.status(500).json({
      message: "Server error while fetching users",
    });
  }
};


// Delete user - Admin
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (user.role === "admin") {
      return res.status(403).json({
        message: "Admin user cannot be deleted",
      });
    }

    await User.findByIdAndDelete(id);

    res.status(200).json({
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Delete User Error:", error);

    res.status(500).json({
      message: "Server error while deleting user",
    });
  }
};

// Create Counter / Chef Account - Admin
const createStaffAccount = async (req, res) => {
  try {
    const { name, email, mobile, password, role } = req.body;

    // Check required fields
    if (!name || !email || !mobile || !password || !role) {
      return res.status(400).json({
        message: "Please fill all fields",
      });
    }

    // Only counter and chef can be created
    if (!["counter", "chef"].includes(role)) {
      return res.status(400).json({
        message: "Only Counter or Chef account can be created",
      });
    }

    // Check existing email
    const existingUser = await User.findOne({
      email: email.toLowerCase().trim(),
    });

    if (existingUser) {
      return res.status(400).json({
        message: "An account already exists with this email",
      });
    }

    // Check existing mobile
    const existingMobile = await User.findOne({
      mobile: mobile.trim(),
    });

    if (existingMobile) {
      return res.status(400).json({
        message: "An account already exists with this mobile number",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create staff account
    const staffUser = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      mobile: mobile.trim(),
      password: hashedPassword,
      role,
    });

    res.status(201).json({
      message: `${role === "counter" ? "Counter" : "Chef"} account created successfully`,
      user: {
        id: staffUser._id,
        name: staffUser.name,
        email: staffUser.email,
        mobile: staffUser.mobile,
        profileImage: staffUser.profileImage,
        role: staffUser.role,
      },
    });
  } catch (error) {
    console.error("Create Staff Account Error:", error);

    res.status(500).json({
      message: "Server error while creating staff account",
    });
  }
};


module.exports = {
  searchUserByMobile,
  getMyProfile,
  updateMyProfile,
  getAllUsers,
  deleteUser,
  createStaffAccount,
};