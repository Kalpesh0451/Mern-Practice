
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getStudents,
  deleteStudent,
} from "../../services/studentService";

function Students() {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchStudents = async (page = 1) => {
    try {
      setLoading(true);
      setError("");

      const response = await getStudents(page, 10);

      setStudents(response.data || []);
      setCurrentPage(response.currentPage || 1);
      setTotalPages(response.totalPages || 1);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to load students."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents(currentPage);
  }, [currentPage]);

  const handleDelete = async (student) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${student.fullName}?`
    );

    if (!confirmed) return;

    try {
      await deleteStudent(student.studentId);

      if (students.length === 1 && currentPage > 1) {
        setCurrentPage((page) => page - 1);
      } else {
        fetchStudents(currentPage);
      }
    } catch (err) {
      alert(
        err.response?.data?.message || "Failed to delete student."
      );
    }
  };

  const filteredStudents = students.filter((student) => {
    const searchValue = search.toLowerCase();

    return (
      String(student.studentId).includes(searchValue) ||
      student.fullName?.toLowerCase().includes(searchValue) ||
      student.email?.toLowerCase().includes(searchValue) ||
      student.mobileNumber?.includes(searchValue)
    );
  });

  return (
    <div className="dashboard-panel">
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
        <div>
          <h3>Student Management</h3>
          <p className="text-secondary">
            Manage all registered students.
          </p>
        </div>

        <Link to="/dashboard/add-student" className="btn btn-primary">
          + Add Student
        </Link>
      </div>

      <hr />

      <div className="row mb-3">
        <div className="col-md-5">
          <input
            type="text"
            className="form-control"
            placeholder="Search by ID, name, email or mobile..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <p className="text-secondary">Loading students...</p>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : (
        <>
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th>Student ID</th>
                  <th>Full Name</th>
                  <th>Email</th>
                  <th>Mobile Number</th>
                  <th>Gender</th>
                  <th>Address</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((student) => (
                    <tr key={student._id}>
                      <td>{student.studentId}</td>
                      <td>{student.fullName}</td>
                      <td>{student.email}</td>
                      <td>{student.mobileNumber}</td>
                      <td>{student.gender}</td>
                      <td>{student.address}</td>
                      <td>
                        <div className="d-flex gap-2">
  <Link
    to={`/dashboard/view-student/${student.studentId}`}
    className="btn btn-sm btn-outline-success"
  >
    View
  </Link>

  <Link
    to={`/dashboard/edit-student/${student.studentId}`}
    className="btn btn-sm btn-outline-primary"
  >
    Edit
  </Link>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDelete(student)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center py-4">
                      {search
                        ? "No matching students found."
                        : "No students registered yet."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="d-flex justify-content-between align-items-center mt-3">
            <span className="text-secondary">
              Page {currentPage} of {totalPages}
            </span>

            <div className="d-flex gap-2">
              <button
                className="btn btn-outline-primary btn-sm"
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage((page) => page - 1)}
              >
                Previous
              </button>

              <button
                className="btn btn-outline-primary btn-sm"
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((page) => page + 1)}
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Students;
