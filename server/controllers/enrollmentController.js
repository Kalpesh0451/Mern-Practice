
const Enrollment = require("../models/Enrollment");
const Student = require("../models/Student");
const Course = require("../models/Course");

// @desc    Create a new enrollment
// @route   POST /api/enrollments
const createEnrollment = async (req, res) => {
  try {
    const { student, course, status, enrollmentDate } = req.body;

    // Check required fields
    if (!student || !course) {
      return res.status(400).json({
        success: false,
        message: "Student and course are required.",
      });
    }

    // Check whether student exists
    const studentExists = await Student.findById(student);

    if (!studentExists) {
      return res.status(404).json({
        success: false,
        message: "Student not found.",
      });
    }

    // Check whether course exists
    const courseExists = await Course.findById(course);

    if (!courseExists) {
      return res.status(404).json({
        success: false,
        message: "Course not found.",
      });
    }

    // Check duplicate enrollment
    const existingEnrollment = await Enrollment.findOne({
      student,
      course,
    });

    if (existingEnrollment) {
      return res.status(409).json({
        success: false,
        message: "Student is already enrolled in this course.",
      });
    }

    const enrollment = await Enrollment.create({
      student,
      course,
      status,
      enrollmentDate,
    });

    const populatedEnrollment = await Enrollment.findById(
      enrollment._id
    )
      .populate("student")
      .populate("course");

    res.status(201).json({
      success: true,
      message: "Student enrolled successfully.",
      enrollment: populatedEnrollment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get all enrollments
// @route   GET /api/enrollments
const getAllEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find()
      .populate("student")
      .populate("course")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      total: enrollments.length,
      enrollments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get enrollment by ID
// @route   GET /api/enrollments/:id
const getEnrollmentById = async (req, res) => {
  try {
    const enrollment = await Enrollment.findById(req.params.id)
      .populate("student")
      .populate("course");

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: "Enrollment not found.",
      });
    }

    res.status(200).json({
      success: true,
      enrollment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update enrollment
// @route   PUT /api/enrollments/:id
const updateEnrollment = async (req, res) => {
  try {
    const { student, course, status, enrollmentDate } = req.body;

    const enrollment = await Enrollment.findById(req.params.id);

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: "Enrollment not found.",
      });
    }

    if (student) {
      const studentExists = await Student.findById(student);

      if (!studentExists) {
        return res.status(404).json({
          success: false,
          message: "Student not found.",
        });
      }

      enrollment.student = student;
    }

    if (course) {
      const courseExists = await Course.findById(course);

      if (!courseExists) {
        return res.status(404).json({
          success: false,
          message: "Course not found.",
        });
      }

      enrollment.course = course;
    }

    if (status) enrollment.status = status;
    if (enrollmentDate) enrollment.enrollmentDate = enrollmentDate;

    await enrollment.save();

    const updatedEnrollment = await Enrollment.findById(enrollment._id)
      .populate("student")
      .populate("course");

    res.status(200).json({
      success: true,
      message: "Enrollment updated successfully.",
      enrollment: updatedEnrollment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete enrollment
// @route   DELETE /api/enrollments/:id
const deleteEnrollment = async (req, res) => {
  try {
    const enrollment = await Enrollment.findByIdAndDelete(req.params.id);

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: "Enrollment not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Enrollment deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createEnrollment,
  getAllEnrollments,
  getEnrollmentById,
  updateEnrollment,
  deleteEnrollment,
};
