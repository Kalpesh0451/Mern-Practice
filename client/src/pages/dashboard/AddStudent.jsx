import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createStudent } from "../../services/studentService";

function AddStudent() {
  const navigate = useNavigate();

  const initialFormData = {
    fullName: "",
    email: "",
    mobileNumber: "",
    gender: "",
    address: "",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [profileImage, setProfileImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    if (!profileImage) {
      setPreview("");
      return;
    }

    const imageUrl = URL.createObjectURL(profileImage);
    setPreview(imageUrl);

    return () => URL.revokeObjectURL(imageUrl);
  }, [profileImage]);

  const validateForm = () => {
    const errors = {};

    if (!formData.fullName.trim()) {
      errors.fullName = "Full name is required.";
    } else if (!/^[a-zA-Z\s.'-]+$/.test(formData.fullName.trim())) {
      errors.fullName = "Enter a valid name.";
    }

    if (!formData.email.trim()) {
      errors.email = "Email address is required.";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())
    ) {
      errors.email = "Enter a valid email address.";
    }

    if (!/^[0-9]{10}$/.test(formData.mobileNumber)) {
      errors.mobileNumber = "Enter a valid 10-digit mobile number.";
    }

    if (!formData.gender) {
      errors.gender = "Please select a gender.";
    }

    if (!formData.address.trim()) {
      errors.address = "Address is required.";
    } else if (formData.address.trim().length < 5) {
      errors.address = "Address must contain at least 5 characters.";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

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

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      setError("Only JPG, PNG and WebP images are allowed.");
      e.target.value = "";
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setError("Image size must not exceed 2 MB.");
      e.target.value = "";
      return;
    }

    setError("");
    setProfileImage(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) return;

    try {
      setLoading(true);

      const payload = new FormData();

      payload.append("fullName", formData.fullName.trim());
      payload.append("email", formData.email.trim().toLowerCase());
      payload.append("mobileNumber", formData.mobileNumber);
      payload.append("gender", formData.gender);
      payload.append("address", formData.address.trim());

      if (profileImage) {
        payload.append("profileImage", profileImage);
      }

      await createStudent(payload);

      alert("Student registered successfully!");
      navigate("/dashboard/students");
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to register student."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData(initialFormData);
    setProfileImage(null);
    setFieldErrors({});
    setError("");
  };

  return (
    <div className="dashboard-panel">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3>Add New Student</h3>
          <p className="text-secondary">
            Enter student details to register.
          </p>
        </div>

        <Link
          to="/dashboard/students"
          className="btn btn-outline-secondary"
        >
          Back to Students
        </Link>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit} noValidate>
        <div className="row g-3">

          <div className="col-12">
            <label className="form-label">Profile Photo</label>

            <div className="d-flex align-items-center gap-3 flex-wrap">
              {preview ? (
                <img
                  src={preview}
                  alt="Student preview"
                  className="rounded-circle border"
                  style={{
                    width: "100px",
                    height: "100px",
                    objectFit: "cover",
                  }}
                />
              ) : (
                <div
                  className="rounded-circle bg-light border d-flex align-items-center justify-content-center"
                  style={{ width: "100px", height: "100px" }}
                >
                  <span className="text-secondary">No Photo</span>
                </div>
              )}

              <div>
                <input
                  type="file"
                  className="form-control"
                  accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                  onChange={handleImageChange}
                />
                <small className="text-secondary">
                  JPG, PNG or WebP. Maximum size: 2 MB.
                </small>
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              name="fullName"
              className={`form-control ${
                fieldErrors.fullName ? "is-invalid" : ""
              }`}
              placeholder="Enter full name"
              value={formData.fullName}
              onChange={handleChange}
            />
            {fieldErrors.fullName && (
              <div className="invalid-feedback">
                {fieldErrors.fullName}
              </div>
            )}
          </div>

          <div className="col-md-6">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              name="email"
              className={`form-control ${
                fieldErrors.email ? "is-invalid" : ""
              }`}
              placeholder="Enter email address"
              value={formData.email}
              onChange={handleChange}
            />
            {fieldErrors.email && (
              <div className="invalid-feedback">
                {fieldErrors.email}
              </div>
            )}
          </div>

          <div className="col-md-6">
            <label className="form-label">Mobile Number</label>
            <input
              type="tel"
              name="mobileNumber"
              className={`form-control ${
                fieldErrors.mobileNumber ? "is-invalid" : ""
              }`}
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
              <div className="invalid-feedback">
                {fieldErrors.mobileNumber}
              </div>
            )}
          </div>

          <div className="col-md-6">
            <label className="form-label">Gender</label>
            <select
              name="gender"
              className={`form-select ${
                fieldErrors.gender ? "is-invalid" : ""
              }`}
              value={formData.gender}
              onChange={handleChange}
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            {fieldErrors.gender && (
              <div className="invalid-feedback">
                {fieldErrors.gender}
              </div>
            )}
          </div>

          <div className="col-12">
            <label className="form-label">Address</label>
            <textarea
              name="address"
              className={`form-control ${
                fieldErrors.address ? "is-invalid" : ""
              }`}
              rows="3"
              placeholder="Enter complete address"
              value={formData.address}
              onChange={handleChange}
            />
            {fieldErrors.address && (
              <div className="invalid-feedback">
                {fieldErrors.address}
              </div>
            )}
          </div>

          <div className="col-12 mt-4">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? "Registering..." : "Register Student"}
            </button>

            <button
              type="button"
              className="btn btn-outline-secondary ms-2"
              onClick={handleReset}
              disabled={loading}
            >
              Reset
            </button>
          </div>

        </div>
      </form>
    </div>
  );
}

export default AddStudent;