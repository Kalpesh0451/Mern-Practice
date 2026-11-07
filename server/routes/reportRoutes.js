const express = require("express");
const router = express.Router();

const {
  getDashboardStats,
  getEnrollmentTrend,
} = require("../controllers/reportController");

router.get("/overview", getDashboardStats);

router.get("/enrollment-trend", getEnrollmentTrend);

module.exports = router;