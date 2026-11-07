
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  getStudentById,
  updateStudent,
} from "../../services/studentService";

function EditStudent() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    mobileNumber: "",
    gender: "",
    address: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const response = await getStudentById(id);
        const student = response.data;

        setFormData({
          fullName: student.fullName || "",
          email: student.email || "",
          mobileNumber: student.mobileNumber || "",
          gender: student.gender || "",
          address: student.address || "",
        });
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to load student."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setSaving(true);
      await updateStudent(id, formData);
      alert("Student updated successfully!");
      navigate("/dashboard/students");
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to update student."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p className="text-secondary">Loading student...</p>;
  }

  return (
    <div className="dashboard-panel">
      <div className="d-flex justify-content-between align-items-center">
        <div>
          <h3>Edit Student</h3>
          <p className="text-secondary">
            Update student information.
          </p>
        </div>

        <Link to="/dashboard/students" className="btn btn-outline-secondary">
          Back to Students
        </Link>
      </div>

      <hr />

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              name="fullName"
              className="form-control"
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
              value={formData.address}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="d-flex gap-2 mt-4">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={saving}
          >
            {saving ? "Updating..." : "Update Student"}
          </button>

          <Link to="/dashboard/students" className="btn btn-secondary">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}

export default EditStudent;
