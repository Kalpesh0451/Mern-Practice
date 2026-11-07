const express = require("express");
const router = express.Router();

const {
  createInstructor,
  getAllInstructors,
  getInstructorById,
  updateInstructor,
  deleteInstructor,
} = require("../controllers/instructorController");

// Create instructor
router.post("/", createInstructor);

// Get all instructors
router.get("/", getAllInstructors);

// Get instructor by ID
router.get("/:id", getInstructorById);

// Update instructor
router.put("/:id", updateInstructor);

// Delete instructor
router.delete("/:id", deleteInstructor);

module.exports = router;