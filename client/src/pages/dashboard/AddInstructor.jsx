import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createInstructor } from "../../services/instructorService";

function AddInstructor() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    mobileNumber: "",
    specialization: "",
    qualification: "",
    experience: "",
    status: "Active",
  });

  const [loading, setLoading] = useState(false);

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
      setLoading(true);

      await createInstructor({
        ...formData,
        experience: Number(formData.experience),
      });

      alert("Instructor added successfully!");
      navigate("/dashboard/instructors");
    } catch (error) {
      console.error("Error adding instructor:", error);
      alert(
        error.response?.data?.message || "Failed to add instructor."
      );
    } finally {
      setLoading(false);
    }
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
                <label className="form-label">Email</label>
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
                  placeholder="Enter mobile number"
                  value={formData.mobileNumber}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Specialization</label>
                <input
                  type="text"
                  name="specialization"
                  className="form-control"
                  placeholder="e.g. Full Stack Development"
                  value={formData.specialization}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Qualification</label>
                <input
                  type="text"
                  name="qualification"
                  className="form-control"
                  placeholder="e.g. M.Tech Computer Science"
                  value={formData.qualification}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Experience (Years)</label>
                <input
                  type="number"
                  name="experience"
                  className="form-control"
                  placeholder="Enter experience"
                  min="0"
                  value={formData.experience}
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
                {loading ? "Saving..." : "Save Instructor"}
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