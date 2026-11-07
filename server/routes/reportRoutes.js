const express = require("express");
const router = express.Router();

const {
  protect,
  authorizeRoles,
} = require("../middleware/authMiddleware");

const {
  getDashboardStats,
  getEnrollmentTrend,
} = require("../controllers/reportController");

router.get(
  "/overview",
  protect,
  authorizeRoles("Admin", "Staff", "Viewer"),
  getDashboardStats
);

router.get(
  "/enrollment-trend",
  protect,
  authorizeRoles("Admin", "Staff", "Viewer"),
  getEnrollmentTrend
);

module.exports = router;