
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createCourse } from "../../services/courseService";

function AddCourse() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    courseName: "",
    courseCode: "",
    description: "",
    duration: "",
    fees: "",
    status: "Active",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);

      await createCourse({
        ...formData,
        fees: Number(formData.fees),
      });

      alert("Course created successfully!");
      navigate("/dashboard/courses");
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to create course."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-panel">
      <div className="d-flex justify-content-between align-items-center">
        <div>
          <h3>Add New Course</h3>
          <p className="text-secondary">
            Enter the course information below.
          </p>
        </div>

        <Link
          to="/dashboard/courses"
          className="btn btn-outline-secondary"
        >
          Back to Courses
        </Link>
      </div>

      <hr />

      {error && (
        <div className="alert alert-danger">{error}</div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label">Course Name</label>
            <input
              type="text"
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
              type="text"
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
              type="text"
              name="duration"
              className="form-control"
              placeholder="e.g. 6 Months"
              value={formData.duration}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">Course Fees (₹)</label>
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

        <div className="d-flex gap-2 mt-4">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Course"}
          </button>

          <button
            type="reset"
            className="btn btn-outline-secondary"
            onClick={() =>
              setFormData({
                courseName: "",
                courseCode: "",
                description: "",
                duration: "",
                fees: "",
                status: "Active",
              })
            }
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddCourse;
