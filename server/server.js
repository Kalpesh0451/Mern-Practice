const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");


const connectDB = require("./config/db");
const studentRoutes = require("./routes/studentRoutes");
const courseRoutes = require("./routes/courseRoutes");
const instructorRoutes = require("./routes/instructorRoutes");
const reportRoutes = require("./routes/reportRoutes");
const enrollmentRoutes = require("./routes/enrollmentRoutes");

const {
    notFound,
    errorHandler
} = require("./middleware/errorMiddleware");

dotenv.config();

const app = express();


// Middleware
app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));


// Health Check API
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "EduSphere Backend is Running!"
    });
});


// Student APIs
app.use("/api/students", studentRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/instructors", instructorRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/enrollments", enrollmentRoutes);

// Error Handling
app.use(notFound);

app.use(errorHandler);


// Start Server
const PORT = process.env.PORT || 5001;

const startServer = async () => {
    try {
        await connectDB();

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });

    } catch (error) {
        console.error("Server startup failed:", error.message);
        process.exit(1);
    }
};

startServer();