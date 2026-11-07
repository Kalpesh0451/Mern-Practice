
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createStudent } from "../../services/studentService";

function AddStudent() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    mobileNumber: "",
    gender: "",
    address: "",
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

      await createStudent(formData);

      alert("Student registered successfully!");

      navigate("/dashboard/students");
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Failed to register student."
      );
    } finally {
      setLoading(false);
    }
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

      {error && (
        <div className="alert alert-danger">{error}</div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="row g-3">

          <div className="col-md-6">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              name="fullName"
              className="form-control"
              placeholder="Enter full name"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              name="email"
              className="form-control"
              placeholder="Enter email address"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">Mobile Number</label>
            <input
              type="tel"
              name="mobileNumber"
              className="form-control"
              placeholder="Enter 10-digit mobile number"
              pattern="[0-9]{10}"
              maxLength="10"
              value={formData.mobileNumber}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">Gender</label>
            <select
              name="gender"
              className="form-select"
              value={formData.gender}
              onChange={handleChange}
              required
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="col-12">
            <label className="form-label">Address</label>
            <textarea
              name="address"
              className="form-control"
              rows="3"
              placeholder="Enter complete address"
              value={formData.address}
              onChange={handleChange}
              required
            />
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
              type="reset"
              className="btn btn-outline-secondary ms-2"
              onClick={() =>
                setFormData({
                  fullName: "",
                  email: "",
                  mobileNumber: "",
                  gender: "",
                  address: "",
                })
              }
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
