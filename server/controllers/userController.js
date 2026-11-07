
const User = require("../models/User");
const bcrypt = require("bcryptjs");

// Create a new user
const createUser = async (req, res) => {
  try {
    const { fullName, email, password, role } = req.body;

    if (!fullName || !email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields.",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must contain at least 8 characters.",
      });
    }

    if (!["Admin", "Staff", "Viewer"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user role.",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "A user with this email already exists.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      fullName,
      email: normalizedEmail,
      password: hashedPassword,
      role,
    });

    res.status(201).json({
      success: true,
      message: "User created successfully.",
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        status: user.status,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to create user.",
    });
  }
};

// Get all users
const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to fetch users.",
    });
  }
};


const updateUser = async (req, res) => {
  try {
    const { fullName, email, role, status } = req.body;

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    if (
      role !== undefined &&
      !["Admin", "Staff", "Viewer"].includes(role)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid user role.",
      });
    }

    if (
      status !== undefined &&
      !["Active", "Inactive"].includes(status)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid account status.",
      });
    }

    if (fullName !== undefined) user.fullName = fullName.trim();

    if (email !== undefined) {
      const normalizedEmail = email.toLowerCase().trim();

      const existingUser = await User.findOne({
        email: normalizedEmail,
        _id: { $ne: user._id },
      });

      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: "Email is already in use.",
        });
      }

      user.email = normalizedEmail;
    }

    if (role !== undefined) user.role = role;
    if (status !== undefined) user.status = status;

    await user.save();

    res.status(200).json({
      success: true,
      message: "User updated successfully.",
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        status: user.status,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to update user.",
    });
  }
};

module.exports = {
  createUser,
  getUsers,
  updateUser,
};