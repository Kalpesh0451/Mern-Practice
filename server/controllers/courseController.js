
const mongoose = require("mongoose");
const Course = require("../models/Course");

const allowedFields = [
  "courseName",
  "courseCode",
  "description",
  "duration",
  "fees",
  "status",
];

const validateCourse = (data, isUpdate = false) => {
  const errors = [];

  if (!isUpdate || data.courseName !== undefined) {
    if (!data.courseName || data.courseName.trim().length < 3) {
      errors.push("Course name must contain at least 3 characters");
    }
  }

  if (!isUpdate || data.courseCode !== undefined) {
    if (!data.courseCode || !/^[A-Z0-9-]+$/i.test(data.courseCode.trim())) {
      errors.push("Enter a valid course code");
    }
  }

  if (!isUpdate || data.description !== undefined) {
    if (!data.description || data.description.trim().length < 10) {
      errors.push("Description must contain at least 10 characters");
    }
  }

  if (!isUpdate || data.duration !== undefined) {
    if (!data.duration || !data.duration.trim()) {
      errors.push("Course duration is required");
    }
  }

  if (data.fees !== undefined || !isUpdate) {
    if (
      data.fees === undefined ||
      data.fees === "" ||
      !Number.isFinite(Number(data.fees)) ||
      Number(data.fees) < 0
    ) {
      errors.push("Course fees must be a valid non-negative number");
    }
  }

  if (
    data.status !== undefined &&
    !["Active", "Inactive"].includes(data.status)
  ) {
    errors.push("Status must be Active or Inactive");
  }

  return errors;
};

const getAllowedData = (body) => {
  const data = {};

  allowedFields.forEach((field) => {
    if (body[field] !== undefined) {
      data[field] = body[field];
    }
  });

  if (data.courseName) data.courseName = data.courseName.trim();
  if (data.courseCode) data.courseCode = data.courseCode.trim().toUpperCase();
  if (data.description) data.description = data.description.trim();
  if (data.duration) data.duration = data.duration.trim();
  if (data.fees !== undefined) data.fees = Number(data.fees);

  return data;
};

const invalidId = (res) =>
  res.status(400).json({
    success: false,
    message: "Invalid course ID",
  });

// Create Course
const createCourse = async (req, res, next) => {
  try {
    const data = getAllowedData(req.body);
    const errors = validateCourse(data);

    if (errors.length) {
      return res.status(400).json({
        success: false,
        message: errors[0],
        errors,
      });
    }

    const course = await Course.create(data);

    res.status(201).json({
      success: true,
      message: "Course created successfully",
      data: course,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Course code already exists",
      });
    }
    next(error);
  }
};

// Get All Courses
const getAllCourses = async (req, res, next) => {
  try {
    const courses = await Course.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: courses.length,
      data: courses,
    });
  } catch (error) {
    next(error);
  }
};

// Get Course By ID
const getCourseById = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return invalidId(res);
    }

    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    res.status(200).json({
      success: true,
      data: course,
    });
  } catch (error) {
    next(error);
  }
};

// Update Course
const updateCourse = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return invalidId(res);
    }

    const data = getAllowedData(req.body);

    if (Object.keys(data).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid course fields provided",
      });
    }

    const errors = validateCourse(data, true);

    if (errors.length) {
      return res.status(400).json({
        success: false,
        message: errors[0],
        errors,
      });
    }

    const course = await Course.findByIdAndUpdate(
      req.params.id,
      { $set: data },
      { new: true, runValidators: true }
    );

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Course updated successfully",
      data: course,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Course code already exists",
      });
    }
    next(error);
  }
};

// Delete Course
const deleteCourse = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return invalidId(res);
    }

    const course = await Course.findByIdAndDelete(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Course deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
};
