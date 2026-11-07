
const Student = require("../models/Student");
const Course = require("../models/Course");
const Enrollment = require("../models/Enrollment");

// Dashboard overview
const getDashboardStats = async (req, res) => {
  try {
    const [
      totalStudents,
      totalCourses,
      totalEnrollments,
      activeCourses,
      activeEnrollments,
      completedEnrollments,
      cancelledEnrollments,
      recentEnrollments,
      courses,
    ] = await Promise.all([
      Student.countDocuments(),
      Course.countDocuments(),
      Enrollment.countDocuments(),
      Course.countDocuments({ status: "Active" }),
      Enrollment.countDocuments({ status: "Active" }),
      Enrollment.countDocuments({ status: "Completed" }),
      Enrollment.countDocuments({ status: "Cancelled" }),

      Enrollment.find()
        .populate("student", "studentId fullName email")
        .populate("course", "courseName courseCode")
        .sort({ createdAt: -1 })
        .limit(5),

      Course.find().select("courseName courseCode"),
    ]);

    const courseDistribution = await Promise.all(
      courses.map(async (course) => ({
        courseName: course.courseName,
        courseCode: course.courseCode,
        enrollmentCount: await Enrollment.countDocuments({
          course: course._id,
        }),
      }))
    );

    res.status(200).json({
      success: true,
      stats: {
        totalStudents,
        totalCourses,
        totalEnrollments,
        activeCourses,
        activeEnrollments,
        completedEnrollments,
        cancelledEnrollments,
      },
      recentEnrollments,
      courseDistribution,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard statistics",
      error: error.message,
    });
  }
};

// Enrollment trend for the last six months
const getEnrollmentTrend = async (req, res) => {
  try {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);
    sixMonthsAgo.setHours(0, 0, 0, 0);

    const trend = await Enrollment.aggregate([
      {
        $match: {
          enrollmentDate: { $gte: sixMonthsAgo },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$enrollmentDate" },
            month: { $month: "$enrollmentDate" },
          },
          total: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    const enrollmentTrend = [];

    for (let i = 0; i < 6; i++) {
      const date = new Date(sixMonthsAgo);
      date.setMonth(date.getMonth() + i);

      const year = date.getFullYear();
      const month = date.getMonth() + 1;

      const record = trend.find(
        (item) =>
          item._id.year === year && item._id.month === month
      );

      enrollmentTrend.push({
        month: date.toLocaleString("en-US", { month: "short" }),
        year,
        enrollments: record ? record.total : 0,
      });
    }

    res.status(200).json({
      success: true,
      enrollmentTrend,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch enrollment trend",
      error: error.message,
    });
  }
};

module.exports = {
  getDashboardStats,
  getEnrollmentTrend,
};
