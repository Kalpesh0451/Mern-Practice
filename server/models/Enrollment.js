
const mongoose = require("mongoose");

const enrollmentSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: [true, "Student is required"],
      index: true,
    },

    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: [true, "Course is required"],
      index: true,
    },

    enrollmentDate: {
      type: Date,
      required: true,
      default: Date.now,
      validate: {
        validator: function (value) {
          return value instanceof Date && !isNaN(value.getTime());
        },
        message: "Please provide a valid enrollment date",
      },
    },

    status: {
      type: String,
      enum: {
        values: ["Active", "Completed", "Cancelled"],
        message: "Invalid enrollment status",
      },
      default: "Active",
      trim: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Prevent duplicate enrollment in the same course
enrollmentSchema.index(
  { student: 1, course: 1 },
  { unique: true, name: "unique_student_course" }
);

module.exports = mongoose.model("Enrollment", enrollmentSchema);
