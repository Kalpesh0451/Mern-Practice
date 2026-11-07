
const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    courseName: {
      type: String,
      required: [true, "Course name is required"],
      trim: true,
    },

    courseCode: {
      type: String,
      required: [true, "Course code is required"],
      unique: true,
      uppercase: true,
      trim: true,
    },

    description: {
      type: String,
      required: [true, "Course description is required"],
      trim: true,
    },

    duration: {
      type: String,
      required: [true, "Course duration is required"],
    },

    fees: {
      type: Number,
      required: [true, "Course fees are required"],
      min: [0, "Fees cannot be negative"],
    },

    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Course", courseSchema);
