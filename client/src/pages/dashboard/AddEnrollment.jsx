
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

  const initialFormData = {
    student: "",
    course: "",
    enrollmentDate: new Date().toISOString().split("T")[0],
    status: "Active",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [studentResponse, courseResponse] = await Promise.all([
          axios.get(STUDENT_API),
          axios.get(COURSE_API),
        ]);

        const studentData = studentResponse.data;
        const courseData = courseResponse.data;

        setStudents(
          Array.isArray(studentData)
            ? studentData
            : studentData.students || studentData.data || []
        );

        setCourses(
          Array.isArray(courseData)
            ? courseData
            : courseData.courses || courseData.data || []
        );
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Unable to load students and courses.");
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setFieldErrors((prev) => ({
      ...prev,
      [name]: "",
    }));

    setError("");
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.student) {
      errors.student = "Please select a student.";
    }

    if (!formData.course) {
      errors.course = "Please select a course.";
    }

    if (!formData.enrollmentDate) {
      errors.enrollmentDate = "Enrollment date is required.";
    } else {
      const selectedDate = new Date(
        `${formData.enrollmentDate}T00:00:00`
      );

      if (Number.isNaN(selectedDate.getTime())) {
        errors.enrollmentDate = "Enter a valid enrollment date.";
      } else if (selectedDate > new Date()) {
        errors.enrollmentDate = "Enrollment date cannot be in the future.";
      }
    }

    if (!["Active", "Completed", "Cancelled"].includes(formData.status)) {
      errors.status = "Please select a valid enrollment status.";
    }

    setFieldErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) return;

    try {
      setLoading(true);

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

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label>Select Student *</label>

            <select
              name="student"
              value={formData.student}
              onChange={handleChange}
              className={fieldErrors.student ? "is-invalid" : ""}
            >
              <option value="">Choose Student</option>

              {students.map((student) => (
                <option key={student._id} value={student._id}>
                  {student.fullName} ({student.studentId})
                </option>
              ))}
            </select>

            {fieldErrors.student && (
              <small className="text-danger">{fieldErrors.student}</small>
            )}
          </div>

          <div className="form-group">
            <label>Select Course *</label>

            <select
              name="course"
              value={formData.course}
              onChange={handleChange}
              className={fieldErrors.course ? "is-invalid" : ""}
            >
              <option value="">Choose Course</option>

              {courses.map((course) => (
                <option key={course._id} value={course._id}>
                  {course.courseName} ({course.courseCode})
                </option>
              ))}
            </select>

            {fieldErrors.course && (
              <small className="text-danger">{fieldErrors.course}</small>
            )}
          </div>

          <div className="form-group">
            <label>Enrollment Date *</label>

            <input
              type="date"
              name="enrollmentDate"
              value={formData.enrollmentDate}
              onChange={handleChange}
              max={new Date().toLocaleDateString("en-CA")}
              className={fieldErrors.enrollmentDate ? "is-invalid" : ""}
            />

            {fieldErrors.enrollmentDate && (
              <small className="text-danger">
                {fieldErrors.enrollmentDate}
              </small>
            )}
          </div>

          <div className="form-group">
            <label>Enrollment Status</label>

            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className={fieldErrors.status ? "is-invalid" : ""}
            >
              <option value="Active">Active</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>

            {fieldErrors.status && (
              <small className="text-danger">{fieldErrors.status}</small>
            )}
          </div>

          <div className="form-actions">
            <button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Create Enrollment"}
            </button>

            <button
              type="button"
              className="secondary-btn"
              onClick={() => navigate("/dashboard/enrollments")}
              disabled={loading}
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
