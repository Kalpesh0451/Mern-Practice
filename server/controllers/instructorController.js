
const mongoose = require("mongoose");
const Instructor = require("../models/Instructor");

const allowedFields = [
  "fullName",
  "email",
  "mobileNumber",
  "specialization",
  "qualification",
  "experience",
  "status",
];

const validateInstructor = (data, isUpdate = false) => {
  const errors = [];

  if (!isUpdate || data.fullName !== undefined) {
    if (!data.fullName || !/^[a-zA-Z\s.'-]{2,}$/.test(data.fullName.trim())) {
      errors.push("Enter a valid instructor name");
    }
  }

  if (!isUpdate || data.email !== undefined) {
    if (
      !data.email ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())
    ) {
      errors.push("Enter a valid email address");
    }
  }

  if (!isUpdate || data.mobileNumber !== undefined) {
    if (!data.mobileNumber || !/^[0-9]{10}$/.test(data.mobileNumber.trim())) {
      errors.push("Mobile number must contain exactly 10 digits");
    }
  }

  if (!isUpdate || data.specialization !== undefined) {
    if (!data.specialization || data.specialization.trim().length < 2) {
      errors.push("Specialization must contain at least 2 characters");
    }
  }

  if (!isUpdate || data.qualification !== undefined) {
    if (!data.qualification || !data.qualification.trim()) {
      errors.push("Qualification is required");
    }
  }

  if (data.experience !== undefined || !isUpdate) {
    if (
      data.experience === undefined ||
      data.experience === "" ||
      !Number.isFinite(Number(data.experience)) ||
      Number(data.experience) < 0
    ) {
      errors.push("Experience must be a valid non-negative number");
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

  if (data.fullName) data.fullName = data.fullName.trim();
  if (data.email) data.email = data.email.trim().toLowerCase();
  if (data.mobileNumber) data.mobileNumber = data.mobileNumber.trim();
  if (data.specialization) data.specialization = data.specialization.trim();
  if (data.qualification) data.qualification = data.qualification.trim();
  if (data.experience !== undefined) {
    data.experience = Number(data.experience);
  }

  return data;
};

const invalidId = (res) =>
  res.status(400).json({
    success: false,
    message: "Invalid instructor ID",
  });

// Create Instructor
const createInstructor = async (req, res, next) => {
  try {
    const data = getAllowedData(req.body);
    const errors = validateInstructor(data);

    if (errors.length) {
      return res.status(400).json({
        success: false,
        message: errors[0],
        errors,
      });
    }

    const instructor = await Instructor.create(data);

    res.status(201).json({
      success: true,
      message: "Instructor created successfully",
      data: instructor,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Instructor email already exists",
      });
    }
    next(error);
  }
};

// Get All Instructors
const getAllInstructors = async (req, res, next) => {
  try {
    const instructors = await Instructor.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: instructors.length,
      data: instructors,
    });
  } catch (error) {
    next(error);
  }
};

// Get Instructor By ID
const getInstructorById = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return invalidId(res);
    }

    const instructor = await Instructor.findById(req.params.id);

    if (!instructor) {
      return res.status(404).json({
        success: false,
        message: "Instructor not found",
      });
    }

    res.status(200).json({
      success: true,
      data: instructor,
    });
  } catch (error) {
    next(error);
  }
};

// Update Instructor
const updateInstructor = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return invalidId(res);
    }

    const data = getAllowedData(req.body);

    if (Object.keys(data).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid instructor fields provided",
      });
    }

    const errors = validateInstructor(data, true);

    if (errors.length) {
      return res.status(400).json({
        success: false,
        message: errors[0],
        errors,
      });
    }

    const instructor = await Instructor.findByIdAndUpdate(
      req.params.id,
      { $set: data },
      { new: true, runValidators: true }
    );

    if (!instructor) {
      return res.status(404).json({
        success: false,
        message: "Instructor not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Instructor updated successfully",
      data: instructor,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Instructor email already exists",
      });
    }
    next(error);
  }
};

// Delete Instructor
const deleteInstructor = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return invalidId(res);
    }

    const instructor = await Instructor.findByIdAndDelete(req.params.id);

    if (!instructor) {
      return res.status(404).json({
        success: false,
        message: "Instructor not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Instructor deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createInstructor,
  getAllInstructors,
  getInstructorById,
  updateInstructor,
  deleteInstructor,
};
