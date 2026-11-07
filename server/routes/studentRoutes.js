
const express = require("express");
const router = express.Router();

const {
  createStudent,
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
} = require("../controllers/studentController");

const {
  protect,
  authorizeRoles,
} = require("../middleware/authMiddleware");

const upload = require("../middleware/uploadMiddleware");

// Create student with optional profile image
router.post(
  "/",
  protect,
  authorizeRoles("Admin", "Staff"),
  upload.single("profileImage"),
  createStudent
);

// View students
router.get(
  "/",
  protect,
  authorizeRoles("Admin", "Staff", "Viewer"),
  getAllStudents
);

router.get(
  "/:id",
  protect,
  authorizeRoles("Admin", "Staff", "Viewer"),
  getStudentById
);

// Update student with optional profile image
router.put(
  "/:id",
  protect,
  authorizeRoles("Admin", "Staff"),
  upload.single("profileImage"),
  updateStudent
);

// Delete student
router.delete(
  "/:id",
  protect,
  authorizeRoles("Admin"),
  deleteStudent
);

module.exports = router;
