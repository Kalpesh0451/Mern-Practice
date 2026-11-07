const express = require("express");
const router = express.Router();

const { loginUser } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");
const User = require("../models/User");

// Login
router.post("/login", loginUser);

// Get logged-in user profile
router.get("/profile", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to fetch profile.",
    });
  }
});

module.exports = router;