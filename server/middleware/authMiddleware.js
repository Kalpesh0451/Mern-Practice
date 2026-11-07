
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Protect routes using JWT authentication
const protect = async (req, res, next) => {
  try {
    // Check JWT secret configuration
    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is not configured.");

      return res.status(500).json({
        success: false,
        message: "Authentication service is not configured."
      });
    }

    // Extract token from Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Not authorized. Token missing."
      });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized. Token missing."
      });
    }

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ["HS256"]
    });

    // Validate token payload
    if (!decoded || typeof decoded.id !== "string" || !decoded.id) {
      return res.status(401).json({
        success: false,
        message: "Not authorized. Invalid token."
      });
    }

    // Fetch only required user fields
    const user = await User.findById(decoded.id).select(
      "_id fullName email role status"
    );

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User no longer exists."
      });
    }

    // Check whether account is active
    if (user.status !== "Active") {
      return res.status(403).json({
        success: false,
        message: "Your account is inactive."
      });
    }

    // Attach authenticated user to request
    req.user = user;

    next();

  } catch (error) {
    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError" ||
      error.name === "NotBeforeError"
    ) {
      return res.status(401).json({
        success: false,
        message: "Not authorized. Invalid or expired token."
      });
    }

    console.error("Authentication error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Authentication failed. Please try again."
    });
  }
};


// Check user roles
const authorizeRoles = (...roles) => {
  return (req, res, next) => {

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required."
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Access denied. You do not have permission."
      });
    }

    next();
  };
};


module.exports = {
  protect,
  authorizeRoles
};
