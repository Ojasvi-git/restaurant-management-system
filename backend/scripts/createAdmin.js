const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

const User = require("../models/User");

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB Atlas Connected");

    const email = "admin@restaurant.com";

    const existingAdmin = await User.findOne({ email });

    if (existingAdmin) {
      console.log("Admin account already exists.");
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash(
      "Admin@123",
      10
    );

    const admin = await User.create({
      name: "Restaurant Admin",
      email,
      mobile: "8888888888",
      password: hashedPassword,
      role: "admin",
    });

    console.log("Admin account created successfully!");

    console.log({
      id: admin._id,
      name: admin.name,
      email: admin.email,
      mobile: admin.mobile,
      role: admin.role,
    });

    console.log("Login Password: Admin@123");

    process.exit(0);
  } catch (error) {
    console.error(
      "Admin creation error:",
      error.message
    );

    process.exit(1);
  }
};

createAdmin();