
const express = require("express");
const router = express.Router();

const {
  createEnrollment,
  getAllEnrollments,
  getEnrollmentById,
  updateEnrollment,
  deleteEnrollment,
} = require("../controllers/enrollmentController");

const { protect, authorizeRoles } = require("../middleware/authMiddleware");

router.post("/", protect, authorizeRoles("Admin", "Staff"), createEnrollment);

router.get("/", protect, authorizeRoles("Admin", "Staff", "Viewer"), getAllEnrollments);
router.get("/:id", protect, authorizeRoles("Admin", "Staff", "Viewer"), getEnrollmentById);

router.put("/:id", protect, authorizeRoles("Admin", "Staff"), updateEnrollment);

router.delete("/:id", protect, authorizeRoles("Admin"), deleteEnrollment);

module.exports = router;
