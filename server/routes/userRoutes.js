
const express = require("express");
const router = express.Router();

const {
  createUser,
  getUsers,
  updateUser,
} = require("../controllers/userController");

const {
  protect,
  authorizeRoles,
} = require("../middleware/authMiddleware");

// Only Admin can create users
router.post("/", protect, authorizeRoles("Admin"), createUser);

// Only Admin can view all users
router.get("/", protect, authorizeRoles("Admin"), getUsers);

// Only Admin can update user accounts
router.put("/:id", protect, authorizeRoles("Admin"), updateUser);
module.exports = router;
