import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  getInstructorById,
  updateInstructor,
} from "../../services/instructorService";

function EditInstructor() {
  const { id } = useParams();
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

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchInstructor = async () => {
      try {
        const data = await getInstructorById(id);

        setFormData({
          fullName: data.fullName || "",
          email: data.email || "",
          mobileNumber: data.mobileNumber || "",
          specialization: data.specialization || "",
          qualification: data.qualification || "",
          experience: data.experience ?? "",
          status: data.status || "Active",
        });
      } catch (error) {
        console.error("Error fetching instructor:", error);
        alert("Failed to load instructor details.");
      } finally {
        setLoading(false);
      }
    };

    fetchInstructor();
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

      await updateInstructor(id, {
        ...formData,
        experience: Number(formData.experience),
      });

      alert("Instructor updated successfully!");
      navigate("/dashboard/instructors");
    } catch (error) {
      console.error("Error updating instructor:", error);
      alert(
        error.response?.data?.message || "Failed to update instructor."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p>Loading instructor details...</p>;

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2>Edit Instructor</h2>
          <p className="text-muted">Update instructor information.</p>
        </div>

        <Link
          to="/dashboard/instructors"
          className="btn btn-outline-secondary"
        >
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
                <label className="form-label">Specialization</label>
                <input
                  type="text"
                  name="specialization"
                  className="form-control"
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
                disabled={saving}
              >
                {saving ? "Updating..." : "Update Instructor"}
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

export default EditInstructor;