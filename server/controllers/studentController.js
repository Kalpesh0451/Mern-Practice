const mongoose = require("mongoose");
const Student = require("../models/student");


// Helper: Find student using Student ID or MongoDB ID
const findStudent = async (id) => {

    const conditions = [];

    // Find using short Student ID
    if (/^\d+$/.test(id)) {
        conditions.push({
            studentId: Number(id)
        });
    }

    // Find using MongoDB ObjectId
    if (mongoose.Types.ObjectId.isValid(id)) {
        conditions.push({
            _id: id
        });
    }

    if (conditions.length === 0) {
        return null;
    }

    return Student.findOne({
        $or: conditions
    });
};


// CREATE STUDENT
exports.createStudent = async (req, res) => {
    try {

        const studentId = await Student.generateStudentId();

        const student = await Student.create({
            studentId,
            fullName: req.body.fullName,
            email: req.body.email,
            mobileNumber: req.body.mobileNumber,
            gender: req.body.gender,
            address: req.body.address
        });

        res.status(201).json({
            success: true,
            message: "Student created successfully",
            data: student
        });

    } catch (error) {

        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: "Student ID or email already exists"
            });
        }

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// GET ALL STUDENTS
exports.getAllStudents = async (req, res) => {
    try {

        const page = Math.max(1, parseInt(req.query.page) || 1);
        const limit = Math.max(1, parseInt(req.query.limit) || 10);

        const skip = (page - 1) * limit;

        const totalStudents = await Student.countDocuments();

        const students = await Student.find()
            .sort({ studentId: 1 })
            .skip(skip)
            .limit(limit);

        res.status(200).json({
            success: true,
            totalStudents,
            currentPage: page,
            totalPages: Math.ceil(totalStudents / limit),
            data: students
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// GET SINGLE STUDENT
exports.getStudentById = async (req, res) => {
    try {

        const student = await findStudent(req.params.id);

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student not found"
            });
        }

        res.status(200).json({
            success: true,
            data: student
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// UPDATE STUDENT
exports.updateStudent = async (req, res) => {
    try {

        const student = await findStudent(req.params.id);

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student not found"
            });
        }

        const allowedFields = [
            "fullName",
            "email",
            "mobileNumber",
            "gender",
            "address"
        ];

        const updateData = {};

        allowedFields.forEach((field) => {
            if (req.body[field] !== undefined) {
                updateData[field] = req.body[field];
            }
        });

        const updatedStudent = await Student.findByIdAndUpdate(
            student._id,
            { $set: updateData },
            {
                new: true,
                runValidators: true
            }
        );

        res.status(200).json({
            success: true,
            message: "Student updated successfully",
            data: updatedStudent
        });

    } catch (error) {

        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: "Email already exists"
            });
        }

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// DELETE STUDENT
exports.deleteStudent = async (req, res) => {
    try {

        const student = await findStudent(req.params.id);

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student not found"
            });
        }

        await Student.findByIdAndDelete(student._id);

        res.status(200).json({
            success: true,
            message: "Student deleted successfully"
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};