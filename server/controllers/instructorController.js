
const Instructor = require("../models/Instructor");

// Create Instructor
const createInstructor = async (req, res, next) => {
  try {
    const instructor = await Instructor.create(req.body);

    res.status(201).json({
      success: true,
      message: "Instructor created successfully",
      data: instructor,
    });
  } catch (error) {
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
    const instructor = await Instructor.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
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
    next(error);
  }
};

// Delete Instructor
const deleteInstructor = async (req, res, next) => {
  try {
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
