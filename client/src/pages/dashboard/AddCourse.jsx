
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createCourse } from "../../services/courseService";

function AddCourse() {
  const navigate = useNavigate();

  const initialFormData = {
    courseName: "",
    courseCode: "",
    description: "",
    duration: "",
    fees: "",
    status: "Active",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

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

    if (!formData.courseName.trim()) {
      errors.courseName = "Course name is required.";
    } else if (formData.courseName.trim().length < 3) {
      errors.courseName = "Course name must contain at least 3 characters.";
    }

    if (!formData.courseCode.trim()) {
      errors.courseCode = "Course code is required.";
    } else if (!/^[a-zA-Z0-9-]+$/.test(formData.courseCode.trim())) {
      errors.courseCode = "Use only letters, numbers and hyphens.";
    }

    if (!formData.description.trim()) {
      errors.description = "Description is required.";
    } else if (formData.description.trim().length < 10) {
      errors.description = "Description must contain at least 10 characters.";
    }

    if (!formData.duration.trim()) {
      errors.duration = "Course duration is required.";
    }

    if (formData.fees === "") {
      errors.fees = "Course fees are required.";
    } else if (!Number.isFinite(Number(formData.fees)) || Number(formData.fees) <= 0) {
      errors.fees = "Course fees must be greater than zero.";
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

      await createCourse({
        ...formData,
        courseName: formData.courseName.trim(),
        courseCode: formData.courseCode.trim().toUpperCase(),
        description: formData.description.trim(),
        duration: formData.duration.trim(),
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

  const handleReset = () => {
    setFormData(initialFormData);
    setFieldErrors({});
    setError("");
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

      <form onSubmit={handleSubmit} noValidate>
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label">Course Name</label>
            <input
              type="text"
              name="courseName"
              className={`form-control ${fieldErrors.courseName ? "is-invalid" : ""}`}
              value={formData.courseName}
              onChange={handleChange}
            />
            {fieldErrors.courseName && (
              <div className="invalid-feedback">{fieldErrors.courseName}</div>
            )}
          </div>

          <div className="col-md-6">
            <label className="form-label">Course Code</label>
            <input
              type="text"
              name="courseCode"
              className={`form-control ${fieldErrors.courseCode ? "is-invalid" : ""}`}
              value={formData.courseCode}
              onChange={handleChange}
            />
            {fieldErrors.courseCode && (
              <div className="invalid-feedback">{fieldErrors.courseCode}</div>
            )}
          </div>

          <div className="col-12">
            <label className="form-label">Description</label>
            <textarea
              name="description"
              className={`form-control ${fieldErrors.description ? "is-invalid" : ""}`}
              rows="3"
              value={formData.description}
              onChange={handleChange}
            />
            {fieldErrors.description && (
              <div className="invalid-feedback">{fieldErrors.description}</div>
            )}
          </div>

          <div className="col-md-6">
            <label className="form-label">Duration</label>
            <input
              type="text"
              name="duration"
              className={`form-control ${fieldErrors.duration ? "is-invalid" : ""}`}
              placeholder="e.g. 6 Months"
              value={formData.duration}
              onChange={handleChange}
            />
            {fieldErrors.duration && (
              <div className="invalid-feedback">{fieldErrors.duration}</div>
            )}
          </div>

          <div className="col-md-6">
            <label className="form-label">Course Fees (₹)</label>
            <input
              type="number"
              name="fees"
              className={`form-control ${fieldErrors.fees ? "is-invalid" : ""}`}
              min="0.01"
              value={formData.fees}
              onChange={handleChange}
            />
            {fieldErrors.fees && (
              <div className="invalid-feedback">{fieldErrors.fees}</div>
            )}
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
            type="button"
            className="btn btn-outline-secondary"
            onClick={handleReset}
            disabled={loading}
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddCourse;
