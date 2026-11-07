
const mongoose = require("mongoose");

// Counter Schema
const counterSchema = new mongoose.Schema(
  {
    _id: String,
    seq: {
      type: Number,
      default: 100,
    },
  },
  {
    collection: "counters",
    versionKey: false,
  }
);

const Counter =
  mongoose.models.Counter ||
  mongoose.model("Counter", counterSchema);

// Student Schema
const studentSchema = new mongoose.Schema(
  {
    studentId: {
      type: Number,
      unique: true,
      min: [101, "Student ID must be at least 101"],
    },

    fullName: {
      type: String,
      required: [true, "Student name is required"],
      trim: true,
      minlength: [2, "Name must contain at least 2 characters"],
      maxlength: [100, "Name cannot exceed 100 characters"],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: [254, "Email cannot exceed 254 characters"],
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please provide a valid email address",
      ],
    },

    mobileNumber: {
      type: String,
      required: [true, "Mobile number is required"],
      trim: true,
      validate: {
        validator: function (value) {
          const digits = value.replace(/\D/g, "");
          return /^[+\d\s()-]+$/.test(value) &&
            digits.length >= 7 &&
            digits.length <= 15;
        },
        message: "Please provide a valid mobile number",
      },
    },

    gender: {
      type: String,
      enum: {
        values: ["Male", "Female", "Other"],
        message: "Please select a valid gender",
      },
      required: [true, "Gender is required"],
      trim: true,
    },

    address: {
      type: String,
      required: [true, "Address is required"],
      trim: true,
      minlength: [5, "Address must contain at least 5 characters"],
      maxlength: [500, "Address cannot exceed 500 characters"],
    },

    profileImage: {
      type: String,
      default: "",
      trim: true,
      maxlength: [500, "Profile image path is too long"],
    },
  },
  {
    timestamps: true,
  }
);

// Generate Student ID: 101, 102, 103...
studentSchema.statics.generateStudentId = async function () {
  await Counter.updateOne(
    { _id: "studentId" },
    { $setOnInsert: { seq: 100 } },
    { upsert: true }
  );

  const counter = await Counter.findOneAndUpdate(
    { _id: "studentId" },
    { $inc: { seq: 1 } },
    { new: true }
  );

  if (!counter) {
    throw new Error("Unable to generate student ID");
  }

  return counter.seq;
};

// Export Model
const Student =
  mongoose.models.Student ||
  mongoose.model("Student", studentSchema);

module.exports = Student;
