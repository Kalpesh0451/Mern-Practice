
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  getAllEnrollments,
  deleteEnrollment,
} from "../../services/enrollmentService";

function Enrollments() {
  const { user } = useAuth();

  const isAdmin = user?.role === "Admin";
  const canManage = ["Admin", "Staff"].includes(user?.role);

  const [enrollments, setEnrollments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const fetchEnrollments = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getAllEnrollments();
      setEnrollments(data.enrollments || []);
    } catch (error) {
      console.error("Error fetching enrollments:", error);
      setError("Failed to load enrollments.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnrollments();
  }, []);

  const handleDelete = async (id) => {
    if (!isAdmin) return;

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this enrollment?"
    );

    if (!confirmDelete) return;

    try {
      await deleteEnrollment(id);
      alert("Enrollment deleted successfully!");
      fetchEnrollments();
    } catch (error) {
      console.error("Delete error:", error);
      alert("Failed to delete enrollment.");
    }
  };

  const filteredEnrollments = enrollments.filter((enrollment) => {
    const studentName =
      enrollment.student?.fullName?.toLowerCase() || "";

    const courseName =
      enrollment.course?.courseName?.toLowerCase() || "";

    const status = enrollment.status?.toLowerCase() || "";
    const search = searchTerm.toLowerCase();

    return (
      studentName.includes(search) ||
      courseName.includes(search) ||
      status.includes(search)
    );
  });

  return (
    <div className="dashboard-panel">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3>Enrollment Management</h3>
          <p className="text-secondary">
            Manage student course enrollments.
          </p>
        </div>

        {canManage && (
          <button
            className="btn btn-primary"
            onClick={() => navigate("/dashboard/enrollments/add")}
          >
            + Add Enrollment
          </button>
        )}
      </div>

      <div className="table-container">
        <div className="mb-3">
          <h4>All Enrollments</h4>

          <input
            type="text"
            className="form-control"
            placeholder="Search student, course or status..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {loading ? (
          <p className="text-secondary">Loading enrollments...</p>
        ) : error ? (
          <div className="alert alert-danger">{error}</div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th>#</th>
                  <th>Student Name</th>
                  <th>Course Name</th>
                  <th>Enrollment Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredEnrollments.length > 0 ? (
                  filteredEnrollments.map((enrollment, index) => (
                    <tr key={enrollment._id}>
                      <td>{index + 1}</td>

                      <td>
                        {enrollment.student?.fullName || "N/A"}
                      </td>

                      <td>
                        {enrollment.course?.courseName || "N/A"}
                      </td>

                      <td>
                        {enrollment.enrollmentDate
                          ? new Date(
                              enrollment.enrollmentDate
                            ).toLocaleDateString("en-IN")
                          : "N/A"}
                      </td>

                      <td>
                        <span
                          className={`status-badge ${enrollment.status?.toLowerCase()}`}
                        >
                          {enrollment.status}
                        </span>
                      </td>

                      <td>
                        <div className="d-flex gap-2">
                          <button
                            className="btn btn-outline-success btn-sm"
                            onClick={() =>
                              navigate(
                                `/dashboard/enrollments/${enrollment._id}`
                              )
                            }
                          >
                            View
                          </button>

                          {canManage && (
                            <button
                              className="btn btn-outline-primary btn-sm"
                              onClick={() =>
                                navigate(
                                  `/dashboard/enrollments/edit/${enrollment._id}`
                                )
                              }
                            >
                              Edit
                            </button>
                          )}

                          {isAdmin && (
                            <button
                              className="btn btn-outline-danger btn-sm"
                              onClick={() =>
                                handleDelete(enrollment._id)
                              }
                            >
                              Delete
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center">
                      No enrollments found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        <p className="text-secondary mt-3">
          Total Enrollments: {filteredEnrollments.length}
        </p>
      </div>
    </div>
  );
}

export default Enrollments;
