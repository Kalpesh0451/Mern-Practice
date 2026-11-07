
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createEnrollment } from "../../services/enrollmentService";
import axios from "axios";

const STUDENT_API = "http://localhost:5001/api/students";
const COURSE_API = "http://localhost:5001/api/courses";

function AddEnrollment() {
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);

  const [formData, setFormData] = useState({
    student: "",
    course: "",
    enrollmentDate: new Date().toISOString().split("T")[0],
    status: "Active",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch students and courses
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [studentResponse, courseResponse] =
          await Promise.all([
            axios.get(STUDENT_API),
            axios.get(COURSE_API),
          ]);

        const studentData = studentResponse.data;
        const courseData = courseResponse.data;

        setStudents(
          Array.isArray(studentData)
            ? studentData
            : studentData.students || []
        );

        setCourses(
          Array.isArray(courseData)
            ? courseData
            : courseData.courses || []
        );
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Unable to load students and courses.");
      }
    };

    fetchData();
  }, []);

  // Handle form changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Submit enrollment
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      await createEnrollment(formData);

      alert("Student enrolled successfully!");

      navigate("/dashboard/enrollments");
    } catch (error) {
      console.error("Enrollment error:", error);

      setError(
        error.response?.data?.message ||
          "Failed to create enrollment."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h2>Add Enrollment</h2>
          <p>Enroll a student into a course.</p>
        </div>
      </div>

      <div className="form-container">
        {error && <p className="error-message">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Select Student *</label>

            <select
              name="student"
              value={formData.student}
              onChange={handleChange}
              required
            >
              <option value="">Choose Student</option>

              {students.map((student) => (
                <option key={student._id} value={student._id}>
                  {student.fullName} ({student.studentId})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Select Course *</label>

            <select
              name="course"
              value={formData.course}
              onChange={handleChange}
              required
            >
              <option value="">Choose Course</option>

              {courses.map((course) => (
                <option key={course._id} value={course._id}>
                  {course.courseName} ({course.courseCode})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Enrollment Date *</label>

            <input
              type="date"
              name="enrollmentDate"
              value={formData.enrollmentDate}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Enrollment Status</label>

            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="Active">Active</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          <div className="form-actions">
            <button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Create Enrollment"}
            </button>

            <button
              type="button"
              className="secondary-btn"
              onClick={() =>
                navigate("/dashboard/enrollments")
              }
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddEnrollment;
