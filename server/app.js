
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const path = require("path");

const studentRoutes = require("./routes/studentRoutes");
const courseRoutes = require("./routes/courseRoutes");
const instructorRoutes = require("./routes/instructorRoutes");
const reportRoutes = require("./routes/reportRoutes");
const enrollmentRoutes = require("./routes/enrollmentRoutes");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");

const {
  notFound,
  errorHandler
} = require("./middleware/errorMiddleware");

const app = express();

// ======================================
// SECURITY CONFIGURATION
// ======================================

// Helmet adds security-related HTTP headers
app.use(helmet());

// CORS configuration
const allowedOrigins = [
  process.env.CLIENT_URL || "http://localhost:5173"
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests without an Origin header
      // (e.g. Postman and server-to-server requests)
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(
        new Error("Not allowed by CORS")
      );
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
  })
);

// ======================================
// BODY PARSING
// ======================================

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({
  extended: true,
  limit: "10kb"
}));

// ======================================
// STATIC UPLOADS
// ======================================

app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"), {
    dotfiles: "deny",
    index: false
  })
);

// ======================================
// HEALTH CHECK API
// ======================================

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "EduSphere Backend is Running!"
  });
});

// ======================================
// API ROUTES
// ======================================

app.use("/api/students", studentRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/instructors", instructorRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/enrollments", enrollmentRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

// ======================================
// ERROR HANDLING
// ======================================

app.use(notFound);
app.use(errorHandler);

module.exports = app;
