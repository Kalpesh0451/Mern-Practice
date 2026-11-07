
const express = require("express");
const router = express.Router();

const {
  createInstructor,
  getAllInstructors,
  getInstructorById,
  updateInstructor,
  deleteInstructor,
} = require("../controllers/instructorController");

const { protect, authorizeRoles } = require("../middleware/authMiddleware");

router.post("/", protect, authorizeRoles("Admin", "Staff"), createInstructor);

router.get("/", protect, authorizeRoles("Admin", "Staff", "Viewer"), getAllInstructors);
router.get("/:id", protect, authorizeRoles("Admin", "Staff", "Viewer"), getInstructorById);

router.put("/:id", protect, authorizeRoles("Admin", "Staff"), updateInstructor);

router.delete("/:id", protect, authorizeRoles("Admin"), deleteInstructor);

module.exports = router;
