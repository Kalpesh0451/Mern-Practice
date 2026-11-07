
const express = require("express");
const router = express.Router();

const {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
} = require("../controllers/courseController");

const {
  protect,
  authorizeRoles,
} = require("../middleware/authMiddleware");

// Admin and Staff
router.post("/", protect, authorizeRoles("Admin", "Staff"), createCourse);

// Admin, Staff and Viewer
router.get("/", protect, authorizeRoles("Admin", "Staff", "Viewer"), getAllCourses);
router.get("/:id", protect, authorizeRoles("Admin", "Staff", "Viewer"), getCourseById);

// Admin and Staff
router.put("/:id", protect, authorizeRoles("Admin", "Staff"), updateCourse);

// Admin only
router.delete("/:id", protect, authorizeRoles("Admin"), deleteCourse);

module.exports = router;
