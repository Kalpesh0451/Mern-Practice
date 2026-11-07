
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  getCourseById,
  updateCourse,
} from "../../services/courseService";

function EditCourse() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    courseName: "",
    courseCode: "",
    description: "",
    duration: "",
    fees: "",
    status: "Active",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await getCourseById(id);
        const course = response.data;

        if (!course) {
          setError("Course not found.");
          return;
        }

        setFormData({
          courseName: course.courseName || "",
          courseCode: course.courseCode || "",
          description: course.description || "",
          duration: course.duration || "",
          fees: course.fees ?? "",
          status: course.status || "Active",
        });
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to load course."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setSaving(true);

      await updateCourse(id, {
        ...formData,
        fees: Number(formData.fees),
      });

      alert("Course updated successfully!");
      navigate("/dashboard/courses");
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to update course."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="dashboard-panel">Loading course...</div>;
  }

  return (
    <div className="dashboard-panel">
      <div className="d-flex justify-content-between align-items-center">
        <div>
          <h3>Edit Course</h3>
          <p className="text-secondary">Update course information.</p>
        </div>

        <Link to="/dashboard/courses" className="btn btn-outline-secondary">
          Back to Courses
        </Link>
      </div>

      <hr />

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label">Course Name</label>
            <input
              name="courseName"
              className="form-control"
              value={formData.courseName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">Course Code</label>
            <input
              name="courseCode"
              className="form-control"
              value={formData.courseCode}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-12">
            <label className="form-label">Description</label>
            <textarea
              name="description"
              className="form-control"
              rows="3"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">Duration</label>
            <input
              name="duration"
              className="form-control"
              value={formData.duration}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">Fees (₹)</label>
            <input
              type="number"
              name="fees"
              className="form-control"
              min="0"
              value={formData.fees}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">Status</label>
            <select
              name="status"
              className="form-select"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          className="btn btn-primary mt-4"
          disabled={saving}
        >
          {saving ? "Updating..." : "Update Course"}
        </button>
      </form>
    </div>
  );
}

export default EditCourse;
