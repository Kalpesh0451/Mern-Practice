
const express = require("express");
const router = express.Router();

const {
  createEnrollment,
  getAllEnrollments,
  getEnrollmentById,
  updateEnrollment,
  deleteEnrollment,
} = require("../controllers/enrollmentController");

// Create enrollment
router.post("/", createEnrollment);

// Get all enrollments
router.get("/", getAllEnrollments);

// Get enrollment by ID
router.get("/:id", getEnrollmentById);

// Update enrollment
router.put("/:id", updateEnrollment);

// Delete enrollment
router.delete("/:id", deleteEnrollment);

module.exports = router;
