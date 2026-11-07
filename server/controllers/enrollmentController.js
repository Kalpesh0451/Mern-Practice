
const mongoose = require("mongoose");
const Enrollment = require("../models/Enrollment");
const Student = require("../models/Student");
const Course = require("../models/Course");

const VALID_STATUSES = ["Active", "Completed", "Cancelled"];
const sendEmail = require("../services/emailService");
const {
  enrollmentConfirmation,
} = require("../services/emailTemplates");

// Validate MongoDB ObjectId
const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

// Validate enrollment date
const validateEnrollmentDate = (date) => {
  if (!date) return "Enrollment date is required.";

  if (
    typeof date !== "string" ||
    !/^\d{4}-\d{2}-\d{2}$/.test(date)
  ) {
    return "Enter a valid enrollment date.";
  }

  const [year, month, day] = date.split("-").map(Number);

  const parsedDate = new Date(year, month - 1, day);

  // Validate the actual calendar date
  if (
    parsedDate.getFullYear() !== year ||
    parsedDate.getMonth() !== month - 1 ||
    parsedDate.getDate() !== day
  ) {
    return "Enter a valid enrollment date.";
  }

  // Compare using local calendar dates
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (parsedDate > today) {
    return "Enrollment date cannot be in the future.";
  }

  return null;
};

// @desc Create a new enrollment
// @route POST /api/enrollments
const createEnrollment = async (req, res) => {
  try {
    const { student, course, enrollmentDate } = req.body;
    const status = req.body.status || "Active";

    if (!student || !course || !enrollmentDate) {
      return res.status(400).json({
        success: false,
        message: "Student, course and enrollment date are required.",
      });
    }

    if (!isValidId(student) || !isValidId(course)) {
      return res.status(400).json({
        success: false,
        message: "Invalid student or course ID.",
      });
    }

    if (!VALID_STATUSES.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid enrollment status.",
      });
    }

    const dateError = validateEnrollmentDate(enrollmentDate);

    if (dateError) {
      return res.status(400).json({
        success: false,
        message: dateError,
      });
    }

    const studentExists = await Student.findById(student);

    if (!studentExists) {
      return res.status(404).json({
        success: false,
        message: "Student not found.",
      });
    }

    const courseExists = await Course.findById(course);

    if (!courseExists) {
      return res.status(404).json({
        success: false,
        message: "Course not found.",
      });
    }

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

    const populatedEnrollment = await Enrollment.findById(enrollment._id)
      .populate("student")
      .populate("course");
    // Send enrollment confirmation email
try {
  await sendEmail({
    to: populatedEnrollment.student.email,
    subject: "Enrollment Confirmation - EduSphere",
    html: enrollmentConfirmation(
      populatedEnrollment.student.fullName,
      populatedEnrollment.course.courseName
    ),
  });

  console.log("Enrollment confirmation email sent.");
} catch (emailError) {
  console.error(
    "Enrollment email failed:",
    emailError.message
  );
}

    return res.status(201).json({
      success: true,
      message: "Student enrolled successfully.",
      enrollment: populatedEnrollment,
    });
  } catch (error) {
    console.error("Create enrollment error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create enrollment.",
    });
  }
};

// @desc Get all enrollments
// @route GET /api/enrollments
const getAllEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find()
      .populate("student")
      .populate("course")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      total: enrollments.length,
      enrollments,
    });
  } catch (error) {
    console.error("Get enrollments error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch enrollments.",
    });
  }
};

// @desc Get enrollment by ID
// @route GET /api/enrollments/:id
const getEnrollmentById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid enrollment ID.",
      });
    }

    const enrollment = await Enrollment.findById(id)
      .populate("student")
      .populate("course");

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: "Enrollment not found.",
      });
    }

    return res.status(200).json({
      success: true,
      enrollment,
    });
  } catch (error) {
    console.error("Get enrollment error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch enrollment.",
    });
  }
};

// @desc Update enrollment
// @route PUT /api/enrollments/:id
const updateEnrollment = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid enrollment ID.",
      });
    }

    const enrollment = await Enrollment.findById(id);

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: "Enrollment not found.",
      });
    }

    const { student, course, status, enrollmentDate } = req.body;

    const updatedStudent = student ?? enrollment.student;
    const updatedCourse = course ?? enrollment.course;

    if (!isValidId(updatedStudent) || !isValidId(updatedCourse)) {
      return res.status(400).json({
        success: false,
        message: "Invalid student or course ID.",
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
    }

    if (course) {
      const courseExists = await Course.findById(course);

      if (!courseExists) {
        return res.status(404).json({
          success: false,
          message: "Course not found.",
        });
      }
    }

    if (
      status !== undefined &&
      !VALID_STATUSES.includes(status)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid enrollment status.",
      });
    }

    if (enrollmentDate !== undefined) {
      const dateError = validateEnrollmentDate(enrollmentDate);

      if (dateError) {
        return res.status(400).json({
          success: false,
          message: dateError,
        });
      }
    }

    // Prevent duplicate enrollment when changing student or course
    const duplicateEnrollment = await Enrollment.findOne({
      student: updatedStudent,
      course: updatedCourse,
      _id: { $ne: id },
    });

    if (duplicateEnrollment) {
      return res.status(409).json({
        success: false,
        message: "Student is already enrolled in this course.",
      });
    }

    enrollment.student = updatedStudent;
    enrollment.course = updatedCourse;

    if (status !== undefined) {
      enrollment.status = status;
    }

    if (enrollmentDate !== undefined) {
      enrollment.enrollmentDate = enrollmentDate;
    }

    await enrollment.save();

    const updatedEnrollment = await Enrollment.findById(id)
      .populate("student")
      .populate("course");

    return res.status(200).json({
      success: true,
      message: "Enrollment updated successfully.",
      enrollment: updatedEnrollment,
    });
  } catch (error) {
    console.error("Update enrollment error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update enrollment.",
    });
  }
};

// @desc Delete enrollment
// @route DELETE /api/enrollments/:id
const deleteEnrollment = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid enrollment ID.",
      });
    }

    const enrollment = await Enrollment.findByIdAndDelete(id);

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: "Enrollment not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Enrollment deleted successfully.",
    });
  } catch (error) {
    console.error("Delete enrollment error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete enrollment.",
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
