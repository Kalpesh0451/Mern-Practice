
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Login user
const loginUser = async (req, res) => {
  try {

    // Check JWT configuration
    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is not configured.");

      return res.status(500).json({
        success: false,
        message: "Authentication service is not configured."
      });
    }

    // Get login credentials
    const { email, password } = req.body || {};

    // Validate input types
    if (
      typeof email !== "string" ||
      typeof password !== "string" ||
      !email.trim() ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message: "Valid email and password are required."
      });
    }

    // Normalize email
    const normalizedEmail = email.trim().toLowerCase();

    // Find user
    const user = await User.findOne({
      email: normalizedEmail
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password."
      });
    }

    // Check account status
    if (user.status !== "Active") {
      return res.status(403).json({
        success: false,
        message: "Your account is inactive. Contact administrator."
      });
    }

    // Verify password
    if (typeof user.password !== "string" || !user.password) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password."
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password."
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user._id.toString()
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
        algorithm: "HS256"
      }
    );

    // Return safe user information
    return res.status(200).json({
      success: true,
      message: "Login successful.",
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {

    console.error("Login error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Server error during login."
    });
  }
};


module.exports = {
  loginUser
};
