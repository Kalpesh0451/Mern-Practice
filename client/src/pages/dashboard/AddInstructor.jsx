
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createInstructor } from "../../services/instructorService";

function AddInstructor() {
  const navigate = useNavigate();

  const initialFormData = {
    fullName: "",
    email: "",
    mobileNumber: "",
    specialization: "",
    qualification: "",
    experience: "",
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

    if (!formData.fullName.trim()) {
      errors.fullName = "Full name is required.";
    } else if (!/^[a-zA-Z\s.'-]+$/.test(formData.fullName.trim())) {
      errors.fullName = "Enter a valid name.";
    }

    if (!formData.email.trim()) {
      errors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errors.email = "Enter a valid email address.";
    }

    if (!/^[0-9]{10}$/.test(formData.mobileNumber)) {
      errors.mobileNumber = "Enter a valid 10-digit mobile number.";
    }

    if (!formData.specialization.trim()) {
      errors.specialization = "Specialization is required.";
    } else if (formData.specialization.trim().length < 2) {
      errors.specialization = "Enter a valid specialization.";
    }

    if (!formData.qualification.trim()) {
      errors.qualification = "Qualification is required.";
    }

    if (formData.experience === "") {
      errors.experience = "Experience is required.";
    } else if (
      !Number.isFinite(Number(formData.experience)) ||
      Number(formData.experience) < 0
    ) {
      errors.experience = "Experience cannot be negative.";
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

      await createInstructor({
        ...formData,
        fullName: formData.fullName.trim(),
        email: formData.email.trim().toLowerCase(),
        mobileNumber: formData.mobileNumber,
        specialization: formData.specialization.trim(),
        qualification: formData.qualification.trim(),
        experience: Number(formData.experience),
      });

      alert("Instructor added successfully!");
      navigate("/dashboard/instructors");
    } catch (error) {
      console.error("Error adding instructor:", error);
      setError(
        error.response?.data?.message || "Failed to add instructor."
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
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2>Add Instructor</h2>
          <p className="text-muted">
            Enter the instructor's information below.
          </p>
        </div>

        <Link to="/dashboard/instructors" className="btn btn-outline-secondary">
          Back to Instructors
        </Link>
      </div>

      <div className="card shadow-sm border-0">
        <div className="card-body p-4">
          {error && (
            <div className="alert alert-danger">{error}</div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  className={`form-control ${fieldErrors.fullName ? "is-invalid" : ""}`}
                  placeholder="Enter full name"
                  value={formData.fullName}
                  onChange={handleChange}
                />
                {fieldErrors.fullName && (
                  <div className="invalid-feedback">{fieldErrors.fullName}</div>
                )}
              </div>

              <div className="col-md-6">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  name="email"
                  className={`form-control ${fieldErrors.email ? "is-invalid" : ""}`}
                  placeholder="Enter email address"
                  value={formData.email}
                  onChange={handleChange}
                />
                {fieldErrors.email && (
                  <div className="invalid-feedback">{fieldErrors.email}</div>
                )}
              </div>

              <div className="col-md-6">
                <label className="form-label">Mobile Number</label>
                <input
                  type="tel"
                  name="mobileNumber"
                  className={`form-control ${fieldErrors.mobileNumber ? "is-invalid" : ""}`}
                  placeholder="Enter 10-digit mobile number"
                  maxLength="10"
                  value={formData.mobileNumber}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "");
                    handleChange({
                      target: { name: "mobileNumber", value },
                    });
                  }}
                />
                {fieldErrors.mobileNumber && (
                  <div className="invalid-feedback">{fieldErrors.mobileNumber}</div>
                )}
              </div>

              <div className="col-md-6">
                <label className="form-label">Specialization</label>
                <input
                  type="text"
                  name="specialization"
                  className={`form-control ${fieldErrors.specialization ? "is-invalid" : ""}`}
                  placeholder="e.g. Full Stack Development"
                  value={formData.specialization}
                  onChange={handleChange}
                />
                {fieldErrors.specialization && (
                  <div className="invalid-feedback">{fieldErrors.specialization}</div>
                )}
              </div>

              <div className="col-md-6">
                <label className="form-label">Qualification</label>
                <input
                  type="text"
                  name="qualification"
                  className={`form-control ${fieldErrors.qualification ? "is-invalid" : ""}`}
                  placeholder="e.g. M.Tech Computer Science"
                  value={formData.qualification}
                  onChange={handleChange}
                />
                {fieldErrors.qualification && (
                  <div className="invalid-feedback">{fieldErrors.qualification}</div>
                )}
              </div>

              <div className="col-md-6">
                <label className="form-label">Experience (Years)</label>
                <input
                  type="number"
                  name="experience"
                  className={`form-control ${fieldErrors.experience ? "is-invalid" : ""}`}
                  placeholder="Enter experience"
                  min="0"
                  step="0.1"
                  value={formData.experience}
                  onChange={handleChange}
                />
                {fieldErrors.experience && (
                  <div className="invalid-feedback">{fieldErrors.experience}</div>
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
                {loading ? "Saving..." : "Save Instructor"}
              </button>

              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={handleReset}
                disabled={loading}
              >
                Reset
              </button>

              <Link
                to="/dashboard/instructors"
                className="btn btn-light border"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddInstructor;
