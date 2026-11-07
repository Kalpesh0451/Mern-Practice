require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;
    const fullName = process.env.ADMIN_NAME || "System Administrator";

    if (!email || !password || password.length < 8) {
      throw new Error(
        "Set ADMIN_EMAIL and an ADMIN_PASSWORD of at least 8 characters in .env"
      );
    }

    const existingAdmin = await User.findOne({
      email: email.toLowerCase().trim(),
    });

    if (existingAdmin) {
      console.log("An account with this email already exists.");
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await User.create({
      fullName,
      email,
      password: hashedPassword,
      role: "Admin",
      status: "Active",
    });

    console.log("Admin account created successfully.");
  } catch (error) {
    console.error("Admin creation failed:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

createAdmin();