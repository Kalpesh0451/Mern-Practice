
const express = require("express");
const router = express.Router();

const {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
} = require("../controllers/courseController");

// Create Course
router.post("/", createCourse);

// Get All Courses
router.get("/", getAllCourses);

// Get Course By ID
router.get("/:id", getCourseById);

// Update Course
router.put("/:id", updateCourse);

// Delete Course
router.delete("/:id", deleteCourse);

module.exports = router;
