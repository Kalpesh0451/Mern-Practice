
const mongoose = require("mongoose");

// Counter Schema
const counterSchema = new mongoose.Schema(
    {
        _id: String,
        seq: {
            type: Number,
            default: 100
        }
    },
    {
        collection: "counters",
        versionKey: false
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
            unique: true
        },
        fullName: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            match: /^\S+@\S+\.\S+$/
        },
        mobileNumber: {
            type: String,
            required: true,
            trim: true
        },
        gender: {
            type: String,
            enum: ["Male", "Female", "Other"],
            required: true
        },
        address: {
            type: String,
            required: true,
            trim: true
        }
    },
    {
        timestamps: true
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

    return counter.seq;
};


// Export Model
const Student =
    mongoose.models.Student ||
    mongoose.model("Student", studentSchema);

module.exports = Student;
