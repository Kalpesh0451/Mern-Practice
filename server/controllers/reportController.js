const Student = require("../models/Student");
const Course = require("../models/Course");
const Instructor = require("../models/Instructor");

// Get dashboard statistics
const getDashboardStats = async (req, res) => {
  try {
    // Total records
    const totalStudents = await Student.countDocuments();
    const totalCourses = await Course.countDocuments();
    const totalInstructors = await Instructor.countDocuments();

    // Course statistics
    const activeCourses = await Course.countDocuments({
      status: "Active",
    });

    const inactiveCourses = await Course.countDocuments({
      status: "Inactive",
    });

    // Instructor statistics
    const activeInstructors = await Instructor.countDocuments({
      status: "Active",
    });

    const inactiveInstructors = await Instructor.countDocuments({
      status: "Inactive",
    });

    res.status(200).json({
      success: true,
      statistics: {
        totalStudents,
        totalCourses,
        totalInstructors,
        activeCourses,
        inactiveCourses,
        activeInstructors,
        inactiveInstructors,
      },
    });
  } catch (error) {
    console.error("Dashboard statistics error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard statistics",
      error: error.message,
    });
  }
};

// Get monthly student enrollment statistics
const getEnrollmentTrend = async (req, res) => {
  try {
    const enrollmentData = await Student.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          totalStudents: { $sum: 1 },
        },
      },
      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1,
        },
      },
      {
        $project: {
          _id: 0,
          year: "$_id.year",
          month: "$_id.month",
          totalStudents: 1,
        },
      },
    ]);

    const formattedData = enrollmentData.map((item) => ({
      month: new Date(
        item.year,
        item.month - 1
      ).toLocaleString("en-US", {
        month: "short",
        year: "numeric",
      }),
      totalStudents: item.totalStudents,
    }));

    res.status(200).json({
      success: true,
      enrollmentData: formattedData,
    });
  } catch (error) {
    console.error("Enrollment trend error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch enrollment statistics",
    });
  }
};
module.exports = {
  getDashboardStats,
  getEnrollmentTrend,
};