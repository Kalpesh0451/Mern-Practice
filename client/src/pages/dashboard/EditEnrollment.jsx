
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const API_URL = "http://localhost:5001/api";

function EditEnrollment() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    student: "",
    course: "",
    enrollmentDate: "",
    status: "Active",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");

        const [enrollmentRes, studentsRes, coursesRes] =
          await Promise.all([
            axios.get(`${API_URL}/enrollments/${id}`),
            axios.get(`${API_URL}/students`),
            axios.get(`${API_URL}/courses`),
          ]);

        // Extract enrollment
        const enrollment =
          enrollmentRes.data.enrollment ||
          enrollmentRes.data.data;

        if (!enrollment) {
          throw new Error("Enrollment record not found.");
        }

        // Extract students and courses
        const studentList = Array.isArray(studentsRes.data.data)
          ? studentsRes.data.data
          : Array.isArray(studentsRes.data.students)
          ? studentsRes.data.students
          : [];

        const courseList = Array.isArray(coursesRes.data.data)
          ? coursesRes.data.data
          : Array.isArray(coursesRes.data.courses)
          ? coursesRes.data.courses
          : [];

        setStudents(studentList);
        setCourses(courseList);

        // Set existing enrollment values
        setFormData({
          student:
            enrollment.student?._id ||
            enrollment.student ||
            "",
          course:
            enrollment.course?._id ||
            enrollment.course ||
            "",
          enrollmentDate: enrollment.enrollmentDate
            ? new Date(enrollment.enrollmentDate)
                .toISOString()
                .split("T")[0]
            : "",
          status: enrollment.status || "Active",
        });
      } catch (err) {
        console.error("Error loading enrollment:", err);
        setError(
          err.response?.data?.message ||
            err.message ||
            "Unable to load enrollment information."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");

      await axios.put(`${API_URL}/enrollments/${id}`, formData);

      alert("Enrollment updated successfully!");

      navigate("/dashboard/enrollments");
    } catch (err) {
      console.error("Error updating enrollment:", err);

      setError(
        err.response?.data?.message ||
          "Failed to update enrollment."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        Loading enrollment...
      </div>
    );
  }

  if (error && !formData.student) {
    return (
      <div className="page-container">
        <p className="error-message">{error}</p>

        <button
          onClick={() => navigate("/dashboard/enrollments")}
        >
          Back to Enrollments
        </button>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h2>Edit Enrollment</h2>
          <p>Update student course enrollment information.</p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/dashboard/enrollments")}
        >
          Back to Enrollments
        </button>
      </div>

      <div className="form-container">
        <form onSubmit={handleSubmit}>
          {/* Student Selection */}
          <div className="form-group">
            <label htmlFor="student">Select Student</label>

            <select
              id="student"
              name="student"
              value={formData.student}
              onChange={handleChange}
              required
            >
              <option value="">Choose Student</option>

              {students.map((student) => (
                <option
                  key={student._id}
                  value={student._id}
                >
                  {student.fullName} ({student.studentId})
                </option>
              ))}
            </select>
          </div>

          {/* Course Selection */}
          <div className="form-group">
            <label htmlFor="course">Select Course</label>

            <select
              id="course"
              name="course"
              value={formData.course}
              onChange={handleChange}
              required
            >
              <option value="">Choose Course</option>

              {courses.map((course) => (
                <option
                  key={course._id}
                  value={course._id}
                >
                  {course.courseName} ({course.courseCode})
                </option>
              ))}
            </select>
          </div>

          {/* Enrollment Date */}
          <div className="form-group">
            <label htmlFor="enrollmentDate">
              Enrollment Date
            </label>

            <input
              type="date"
              id="enrollmentDate"
              name="enrollmentDate"
              value={formData.enrollmentDate}
              onChange={handleChange}
              required
            />
          </div>

          {/* Enrollment Status */}
          <div className="form-group">
            <label htmlFor="status">Enrollment Status</label>

            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
            >
              <option value="Active">Active</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          {error && (
            <p className="error-message">{error}</p>
          )}

          {/* Form Actions */}
          <div className="form-actions">
            <button type="submit" disabled={saving}>
              {saving ? "Updating..." : "Update Enrollment"}
            </button>

            <button
              type="button"
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

export default EditEnrollment;
