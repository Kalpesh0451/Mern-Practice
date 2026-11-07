
const request = require("supertest");
const jwt = require("jsonwebtoken");

// ======================================
// MOCK DATABASE MODELS
// ======================================

jest.mock("../models/User", () => ({
  findById: jest.fn()
}));

jest.mock("../models/student", () => ({
  countDocuments: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
  generateStudentId: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  findByIdAndDelete: jest.fn()
}));

// Enrollment controller imports Student with a capital S.
jest.mock("../models/Student", () => ({
  findById: jest.fn()
}));

jest.mock("../models/Course", () => ({
  find: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  findByIdAndDelete: jest.fn()
}));

jest.mock("../models/Instructor", () => ({
  find: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  findByIdAndDelete: jest.fn()
}));

jest.mock("../models/Enrollment", () => ({
  find: jest.fn(),
  findOne: jest.fn(),
  findById: jest.fn(),
  findByIdAndDelete: jest.fn(),
  create: jest.fn()
}));

// Mock email services to prevent actual emails during tests.
jest.mock("../services/emailService", () =>
  jest.fn().mockResolvedValue({})
);

jest.mock("../services/emailTemplates", () => ({
  enrollmentConfirmation: jest.fn().mockReturnValue("<p>Confirmed</p>")
}));

// ======================================
// IMPORT MOCKED MODELS
// ======================================

const User = require("../models/User");
const Student = require("../models/student");
const EnrollmentStudent = require("../models/Student");
const Course = require("../models/Course");
const Instructor = require("../models/Instructor");
const Enrollment = require("../models/Enrollment");

const app = require("../app");

// ======================================
// COMMON TEST HELPERS
// ======================================

const createToken = (id = "test-user-id") => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
};

const mockUser = (role, status = "Active") => {
  User.findById.mockReturnValue({
    select: jest.fn().mockResolvedValue({
      _id: "test-user-id",
      fullName: "Test User",
      role,
      status
    })
  });
};

// ======================================
// 1. GENERAL BACKEND TESTS
// ======================================

describe("EduSphere Backend API Tests", () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("GET / should return backend running message", async () => {
    const response = await request(app).get("/");

    expect(response.statusCode).toBe(200);

    expect(response.body).toEqual({
      success: true,
      message: "EduSphere Backend is Running!"
    });
  });

  // Authentication

  test("Should reject requests without a token", async () => {
    const response = await request(app)
      .get("/api/students");

    expect(response.statusCode).toBe(401);
    expect(response.body.success).toBe(false);
  });

  test("Should reject requests with an invalid token", async () => {
    const response = await request(app)
      .get("/api/students")
      .set("Authorization", "Bearer invalid-token");

    expect(response.statusCode).toBe(401);
  });

  // Student permissions

  test("Viewer should be allowed to view students", async () => {
    mockUser("Viewer");

    Student.countDocuments.mockResolvedValue(0);

    Student.find.mockReturnValue({
      sort: jest.fn().mockReturnValue({
        skip: jest.fn().mockReturnValue({
          limit: jest.fn().mockResolvedValue([])
        })
      })
    });

    const response = await request(app)
      .get("/api/students")
      .set("Authorization", `Bearer ${createToken()}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toEqual([]);
  });

  test("Viewer should not be allowed to create students", async () => {
    mockUser("Viewer");

    const response = await request(app)
      .post("/api/students")
      .set("Authorization", `Bearer ${createToken()}`)
      .send({
        fullName: "Test Student"
      });

    expect(response.statusCode).toBe(403);
    expect(response.body.success).toBe(false);
  });

  test("Staff should not be allowed to delete students", async () => {
    mockUser("Staff");

    const response = await request(app)
      .delete("/api/students/123")
      .set("Authorization", `Bearer ${createToken()}`);

    expect(response.statusCode).toBe(403);
    expect(response.body.success).toBe(false);
  });

});

// ======================================
// 2. STUDENT API TESTS
// ======================================

describe("Student API Validation Tests", () => {

  beforeEach(() => {
    jest.clearAllMocks();
    mockUser("Admin");
  });

  test("Should reject invalid student email", async () => {
    Student.generateStudentId.mockResolvedValue(101);

    Student.create.mockRejectedValue({
      name: "ValidationError",
      message: "Please enter a valid email"
    });

    const response = await request(app)
      .post("/api/students")
      .set("Authorization", `Bearer ${createToken()}`)
      .send({
        fullName: "Test Student",
        email: "invalid-email",
        mobileNumber: "9876543210",
        gender: "Male",
        address: "Pune"
      });

    expect(response.statusCode).toBe(400);
    expect(response.body.success).toBe(false);
  });

  test("Should reject missing required fields", async () => {
    Student.generateStudentId.mockResolvedValue(102);

    Student.create.mockRejectedValue({
      name: "ValidationError",
      message: "Full name is required"
    });

    const response = await request(app)
      .post("/api/students")
      .set("Authorization", `Bearer ${createToken()}`)
      .send({});

    expect(response.statusCode).toBe(400);
    expect(response.body.success).toBe(false);
  });

  test("Should reject duplicate student email", async () => {
    Student.generateStudentId.mockResolvedValue(103);

    Student.create.mockRejectedValue({
      code: 11000
    });

    const response = await request(app)
      .post("/api/students")
      .set("Authorization", `Bearer ${createToken()}`)
      .send({
        fullName: "Test Student",
        email: "existing@example.com",
        mobileNumber: "9876543210",
        gender: "Male",
        address: "Pune"
      });

    expect(response.statusCode).toBe(409);
    expect(response.body.success).toBe(false);
  });

  test("Should reject invalid student ID", async () => {
    const response = await request(app)
      .get("/api/students/invalid-id")
      .set("Authorization", `Bearer ${createToken()}`);

    expect(response.statusCode).toBe(404);
    expect(response.body.success).toBe(false);
  });

  test("Should return 404 when student does not exist", async () => {
    Student.findOne.mockResolvedValue(null);

    const response = await request(app)
      .get("/api/students/999999")
      .set("Authorization", `Bearer ${createToken()}`);

    expect(response.statusCode).toBe(404);
    expect(response.body.success).toBe(false);
  });

});

// ======================================
// 3. COURSE API TESTS
// ======================================

describe("Course API Tests", () => {

  beforeEach(() => {
    jest.clearAllMocks();
    mockUser("Admin");
  });

  const validCourse = {
    courseName: "React Development",
    courseCode: "REACT101",
    description: "Complete React development course",
    duration: "3 Months",
    fees: 15000,
    status: "Active"
  };

  test("Should fetch all courses successfully", async () => {
    mockUser("Viewer");

    Course.find.mockReturnValue({
      sort: jest.fn().mockResolvedValue([
        {
          courseName: "React Development",
          courseCode: "REACT101"
        }
      ])
    });

    const response = await request(app)
      .get("/api/courses")
      .set("Authorization", `Bearer ${createToken()}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.count).toBe(1);
    expect(response.body.data).toHaveLength(1);
  });

  test("Should create a course successfully", async () => {
    Course.create.mockResolvedValue({
      _id: "course123",
      ...validCourse
    });

    const response = await request(app)
      .post("/api/courses")
      .set("Authorization", `Bearer ${createToken()}`)
      .send(validCourse);

    expect(response.statusCode).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data.courseCode).toBe("REACT101");
  });

  test("Should reject invalid course data", async () => {
    const response = await request(app)
      .post("/api/courses")
      .set("Authorization", `Bearer ${createToken()}`)
      .send({
        courseName: "AB",
        courseCode: "",
        description: "Short",
        duration: "",
        fees: -100
      });

    expect(response.statusCode).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.errors.length).toBeGreaterThan(0);
  });

  test("Should reject duplicate course code", async () => {
    Course.create.mockRejectedValue({
      code: 11000
    });

    const response = await request(app)
      .post("/api/courses")
      .set("Authorization", `Bearer ${createToken()}`)
      .send(validCourse);

    expect(response.statusCode).toBe(409);
    expect(response.body.success).toBe(false);
  });

  test("Viewer should not be allowed to create courses", async () => {
    mockUser("Viewer");

    const response = await request(app)
      .post("/api/courses")
      .set("Authorization", `Bearer ${createToken()}`)
      .send(validCourse);

    expect(response.statusCode).toBe(403);
    expect(response.body.success).toBe(false);
  });

  test("Staff should not be allowed to delete courses", async () => {
    mockUser("Staff");

    const response = await request(app)
      .delete("/api/courses/507f1f77bcf86cd799439011")
      .set("Authorization", `Bearer ${createToken()}`);

    expect(response.statusCode).toBe(403);
    expect(response.body.success).toBe(false);
  });

  test("Should reject invalid course ID", async () => {
    const response = await request(app)
      .get("/api/courses/invalid-id")
      .set("Authorization", `Bearer ${createToken()}`);

    expect(response.statusCode).toBe(400);
    expect(response.body.success).toBe(false);
  });

  test("Should return 404 when course does not exist", async () => {
    Course.findById.mockResolvedValue(null);

    const response = await request(app)
      .get("/api/courses/507f1f77bcf86cd799439011")
      .set("Authorization", `Bearer ${createToken()}`);

    expect(response.statusCode).toBe(404);
    expect(response.body.success).toBe(false);
  });

});

// ======================================
// 4. INSTRUCTOR API TESTS
// ======================================

describe("Instructor API Tests", () => {

  beforeEach(() => {
    jest.clearAllMocks();
    mockUser("Admin");
  });

  const validInstructor = {
    fullName: "Rahul Sharma",
    email: "rahul@example.com",
    mobileNumber: "9876543210",
    specialization: "Web Development",
    qualification: "MCA",
    experience: 5,
    status: "Active"
  };

  test("Should fetch all instructors successfully", async () => {
    mockUser("Viewer");

    Instructor.find.mockReturnValue({
      sort: jest.fn().mockResolvedValue([
        {
          fullName: "Rahul Sharma",
          email: "rahul@example.com"
        }
      ])
    });

    const response = await request(app)
      .get("/api/instructors")
      .set("Authorization", `Bearer ${createToken()}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.count).toBe(1);
    expect(response.body.data).toHaveLength(1);
  });

  test("Should create an instructor successfully", async () => {
    Instructor.create.mockResolvedValue({
      _id: "instructor123",
      ...validInstructor
    });

    const response = await request(app)
      .post("/api/instructors")
      .set("Authorization", `Bearer ${createToken()}`)
      .send(validInstructor);

    expect(response.statusCode).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data.email).toBe("rahul@example.com");
  });

  test("Should reject invalid instructor details", async () => {
    const response = await request(app)
      .post("/api/instructors")
      .set("Authorization", `Bearer ${createToken()}`)
      .send({
        fullName: "R",
        email: "invalid-email",
        mobileNumber: "123",
        specialization: "A",
        qualification: "",
        experience: -5
      });

    expect(response.statusCode).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.errors.length).toBeGreaterThan(0);
  });

  test("Should reject duplicate instructor email", async () => {
    Instructor.create.mockRejectedValue({
      code: 11000
    });

    const response = await request(app)
      .post("/api/instructors")
      .set("Authorization", `Bearer ${createToken()}`)
      .send(validInstructor);

    expect(response.statusCode).toBe(409);
    expect(response.body.success).toBe(false);
  });

  test("Viewer should not be allowed to create instructors", async () => {
    mockUser("Viewer");

    const response = await request(app)
      .post("/api/instructors")
      .set("Authorization", `Bearer ${createToken()}`)
      .send(validInstructor);

    expect(response.statusCode).toBe(403);
    expect(response.body.success).toBe(false);
  });

  test("Staff should not be allowed to delete instructors", async () => {
    mockUser("Staff");

    const response = await request(app)
      .delete("/api/instructors/507f1f77bcf86cd799439011")
      .set("Authorization", `Bearer ${createToken()}`);

    expect(response.statusCode).toBe(403);
    expect(response.body.success).toBe(false);
  });

  test("Should reject invalid instructor ID", async () => {
    const response = await request(app)
      .get("/api/instructors/invalid-id")
      .set("Authorization", `Bearer ${createToken()}`);

    expect(response.statusCode).toBe(400);
    expect(response.body.success).toBe(false);
  });

  test("Should return 404 when instructor does not exist", async () => {
    Instructor.findById.mockResolvedValue(null);

    const response = await request(app)
      .get("/api/instructors/507f1f77bcf86cd799439011")
      .set("Authorization", `Bearer ${createToken()}`);

    expect(response.statusCode).toBe(404);
    expect(response.body.success).toBe(false);
  });

});

// ======================================
// 5. ENROLLMENT API TESTS
// ======================================

describe("Enrollment API Tests", () => {

  beforeEach(() => {
    jest.clearAllMocks();
    mockUser("Admin");
  });

  const studentId = "507f1f77bcf86cd799439011";
  const courseId = "507f1f77bcf86cd799439012";
  const enrollmentId = "507f1f77bcf86cd799439013";

  const validEnrollment = {
    student: studentId,
    course: courseId,
    enrollmentDate: "2020-01-15",
    status: "Active"
  };

  const populatedEnrollment = {
    _id: enrollmentId,
    student: {
      _id: studentId,
      fullName: "Test Student",
      email: "student@example.com"
    },
    course: {
      _id: courseId,
      courseName: "React Development"
    },
    enrollmentDate: "2020-01-15",
    status: "Active"
  };

  const mockPopulatedEnrollment = (data = populatedEnrollment) => {
    Enrollment.findById.mockReturnValue({
      populate: jest.fn().mockReturnValue({
        populate: jest.fn().mockResolvedValue(data)
      })
    });
  };

  // CREATE ENROLLMENT

  test("Should create an enrollment successfully", async () => {
    EnrollmentStudent.findById.mockResolvedValue({
      _id: studentId,
      fullName: "Test Student",
      email: "student@example.com"
    });

    Course.findById.mockResolvedValue({
      _id: courseId,
      courseName: "React Development"
    });

    Enrollment.findOne.mockResolvedValue(null);

    Enrollment.create.mockResolvedValue({
      _id: enrollmentId
    });

    mockPopulatedEnrollment();

    const response = await request(app)
      .post("/api/enrollments")
      .set("Authorization", `Bearer ${createToken()}`)
      .send(validEnrollment);

    expect(response.statusCode).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.enrollment.status).toBe("Active");
  });

  // REQUIRED FIELDS

  test("Should reject enrollment with missing required fields", async () => {
    const response = await request(app)
      .post("/api/enrollments")
      .set("Authorization", `Bearer ${createToken()}`)
      .send({});

    expect(response.statusCode).toBe(400);
    expect(response.body.success).toBe(false);
  });

  // INVALID ID

  test("Should reject invalid student or course ID", async () => {
    const response = await request(app)
      .post("/api/enrollments")
      .set("Authorization", `Bearer ${createToken()}`)
      .send({
        ...validEnrollment,
        student: "invalid-id"
      });

    expect(response.statusCode).toBe(400);
    expect(response.body.success).toBe(false);
  });

  // INVALID DATE

  test("Should reject invalid enrollment date", async () => {
    const response = await request(app)
      .post("/api/enrollments")
      .set("Authorization", `Bearer ${createToken()}`)
      .send({
        ...validEnrollment,
        enrollmentDate: "invalid-date"
      });

    expect(response.statusCode).toBe(400);
    expect(response.body.success).toBe(false);
  });

  // DUPLICATE ENROLLMENT

  test("Should reject duplicate student enrollment in the same course", async () => {
    EnrollmentStudent.findById.mockResolvedValue({
      _id: studentId
    });

    Course.findById.mockResolvedValue({
      _id: courseId
    });

    Enrollment.findOne.mockResolvedValue({
      _id: "existing-enrollment"
    });

    const response = await request(app)
      .post("/api/enrollments")
      .set("Authorization", `Bearer ${createToken()}`)
      .send(validEnrollment);

    expect(response.statusCode).toBe(409);
    expect(response.body.success).toBe(false);
  });

  // VIEWER PERMISSION

  test("Viewer should not be allowed to create enrollments", async () => {
    mockUser("Viewer");

    const response = await request(app)
      .post("/api/enrollments")
      .set("Authorization", `Bearer ${createToken()}`)
      .send(validEnrollment);

    expect(response.statusCode).toBe(403);
    expect(response.body.success).toBe(false);
  });

  // GET ALL ENROLLMENTS

  test("Should fetch all enrollments successfully", async () => {
    Enrollment.find.mockReturnValue({
      populate: jest.fn().mockReturnThis(),
      sort: jest.fn().mockResolvedValue([populatedEnrollment])
    });

    const response = await request(app)
      .get("/api/enrollments")
      .set("Authorization", `Bearer ${createToken()}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.total).toBe(1);
    expect(response.body.enrollments).toHaveLength(1);
  });

  // GET ENROLLMENT BY ID

  test("Should return 404 when enrollment does not exist", async () => {
    Enrollment.findById.mockReturnValue({
      populate: jest.fn().mockReturnValue({
        populate: jest.fn().mockResolvedValue(null)
      })
    });

    const response = await request(app)
      .get(`/api/enrollments/${enrollmentId}`)
      .set("Authorization", `Bearer ${createToken()}`);

    expect(response.statusCode).toBe(404);
    expect(response.body.success).toBe(false);
  });

  // UPDATE ENROLLMENT

  test("Should update enrollment successfully", async () => {
    const existingEnrollment = {
      _id: enrollmentId,
      student: studentId,
      course: courseId,
      status: "Active",
      enrollmentDate: "2020-01-15",
      save: jest.fn().mockResolvedValue(true)
    };

    Enrollment.findById
      .mockResolvedValueOnce(existingEnrollment)
      .mockReturnValueOnce({
        populate: jest.fn().mockReturnValue({
          populate: jest.fn().mockResolvedValue({
            ...populatedEnrollment,
            status: "Completed"
          })
        })
      });

    Enrollment.findOne.mockResolvedValue(null);

    const response = await request(app)
      .put(`/api/enrollments/${enrollmentId}`)
      .set("Authorization", `Bearer ${createToken()}`)
      .send({
        status: "Completed"
      });

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(existingEnrollment.status).toBe("Completed");
    expect(existingEnrollment.save).toHaveBeenCalled();
  });

  // DELETE ENROLLMENT

  test("Should delete enrollment successfully", async () => {
    Enrollment.findByIdAndDelete.mockResolvedValue({
      _id: enrollmentId
    });

    const response = await request(app)
      .delete(`/api/enrollments/${enrollmentId}`)
      .set("Authorization", `Bearer ${createToken()}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
  });

  // STAFF PERMISSION

  test("Staff should not be allowed to delete enrollments", async () => {
    mockUser("Staff");

    const response = await request(app)
      .delete(`/api/enrollments/${enrollmentId}`)
      .set("Authorization", `Bearer ${createToken()}`);

    expect(response.statusCode).toBe(403);
    expect(response.body.success).toBe(false);
  });

});
