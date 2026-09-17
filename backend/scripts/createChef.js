const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

const User = require("../models/User");

dotenv.config();

const createChef = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB Atlas Connected");

    const email = "chef@restaurant.com";

    const existingChef = await User.findOne({ email });

    if (existingChef) {
      console.log("Chef account already exists.");
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash(
      "Chef@123",
      10
    );

    const chef = await User.create({
      name: "Restaurant Chef",
      email,
      mobile: "7777777777",
      password: hashedPassword,
      role: "chef",
    });

    console.log("Chef account created successfully!");

    console.log({
      id: chef._id,
      name: chef.name,
      email: chef.email,
      mobile: chef.mobile,
      role: chef.role,
    });

    console.log("Login Password: Chef@123");

    process.exit(0);
  } catch (error) {
    console.error(
      "Chef creation error:",
      error.message
    );

    process.exit(1);
  }
};

createChef();