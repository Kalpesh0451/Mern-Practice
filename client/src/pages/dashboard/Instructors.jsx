import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getInstructors,
  deleteInstructor,
} from "../../services/instructorService";

function Instructors() {
  const [instructors, setInstructors] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

 const fetchInstructors = async () => {
  try {
    const data = await getInstructors();

    console.log("Instructor API Response:", data);

    const instructorList = Array.isArray(data)
      ? data
      : data.instructors || data.data || [];

    setInstructors(instructorList);
  } catch (error) {
    console.error("Error fetching instructors:", error);
    alert("Failed to load instructors");
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchInstructors();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this instructor?"
    );

    if (!confirmDelete) return;

    try {
      await deleteInstructor(id);
      alert("Instructor deleted successfully");
      fetchInstructors();
    } catch (error) {
      console.error("Error deleting instructor:", error);
      alert("Failed to delete instructor");
    }
  };

  const filteredInstructors = instructors.filter((instructor) =>
    `${instructor.fullName} ${instructor.email} ${instructor.specialization}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  if (loading) {
    return <p>Loading instructors...</p>;
  }

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2>Instructor Management</h2>
          <p className="text-muted">
            Manage all instructors and their details.
          </p>
        </div>

        <Link to="/dashboard/add-instructor" className="btn btn-primary">
          + Add Instructor
        </Link>
      </div>

      <div className="card shadow-sm border-0">
        <div className="card-body">
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Search by name, email or specialization..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th>#</th>
                  <th>Instructor Name</th>
                  <th>Email</th>
                  <th>Specialization</th>
                  <th>Experience</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredInstructors.length > 0 ? (
                  filteredInstructors.map((instructor, index) => (
                    <tr key={instructor._id}>
                      <td>{index + 1}</td>
                      <td>{instructor.fullName}</td>
                      <td>{instructor.email}</td>
                      <td>{instructor.specialization}</td>
                      <td>{instructor.experience} years</td>
                      <td>
                        <span
                          className={`badge ${
                            instructor.status === "Active"
                              ? "bg-success"
                              : "bg-secondary"
                          }`}
                        >
                          {instructor.status}
                        </span>
                      </td>
                      <td>
                        <div className="d-flex gap-2">
                          <Link
                            to={`/dashboard/view-instructor/${instructor._id}`}
                            className="btn btn-sm btn-outline-success"
                          >
                            View
                          </Link>

                          <Link
                            to={`/dashboard/edit-instructor/${instructor._id}`}
                            className="btn btn-sm btn-outline-primary"
                          >
                            Edit
                          </Link>

                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDelete(instructor._id)}
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
                      No instructors found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <p className="text-muted mb-0">
            Total Instructors: {filteredInstructors.length}
          </p>
        </div>
      </div>
    </div>
  );
}

export default Instructors;