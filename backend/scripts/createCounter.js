const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

const User = require("../models/User");

dotenv.config();

const createCounter = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB Atlas Connected");

    const email = "Aman@restaurant.com" ;

    const existingCounter = await User.findOne({ email });

    if (existingCounter) {
      console.log("Counter account already exists.");
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash(
      "Aman@123",
      10
    );

    const counter = await User.create({
      name: "Restaurant Counter",
      email,
      mobile: "88888888",
      password: hashedPassword,
      role: "counter",
    });

    console.log("Counter account created successfully!");

    console.log({
      id: counter._id,
      name: counter.name,
      email: counter.email,
      mobile: counter.mobile,
      role: counter.role,
    });

    console.log("Login Password: Aman@123");

    process.exit(0);
  } catch (error) {
    console.error(
      "Counter creation error:",
      error.message
    );

    process.exit(1);
  }
};

createCounter();