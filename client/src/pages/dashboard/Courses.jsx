
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  getCourses,
  deleteCourse,
} from "../../services/courseService";

function Courses() {
  const { user } = useAuth();

  const isAdmin = user?.role === "Admin";
  const canManage = ["Admin", "Staff"].includes(user?.role);

  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getCourses();
      setCourses(response.data || []);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to load courses."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleDelete = async (course) => {
    if (!isAdmin) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete ${course.courseName}?`
    );

    if (!confirmed) return;

    try {
      await deleteCourse(course._id);
      fetchCourses();
    } catch (err) {
      alert(
        err.response?.data?.message || "Failed to delete course."
      );
    }
  };

  const filteredCourses = courses.filter((course) => {
    const value = search.toLowerCase();

    return (
      course.courseName?.toLowerCase().includes(value) ||
      course.courseCode?.toLowerCase().includes(value)
    );
  });

  return (
    <div className="dashboard-panel">
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
        <div>
          <h3>Course Management</h3>
          <p className="text-secondary">
            Manage all available courses.
          </p>
        </div>

        {canManage && (
          <Link
            to="/dashboard/add-course"
            className="btn btn-primary"
          >
            + Add Course
          </Link>
        )}
      </div>

      <hr />

      <div className="row mb-3">
        <div className="col-md-5">
          <input
            type="text"
            className="form-control"
            placeholder="Search by course name or code..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <p>Loading courses...</p>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>Course Name</th>
                <th>Course Code</th>
                <th>Duration</th>
                <th>Fees</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredCourses.length > 0 ? (
                filteredCourses.map((course) => (
                  <tr key={course._id}>
                    <td>{course.courseName}</td>
                    <td>{course.courseCode}</td>
                    <td>{course.duration}</td>
                    <td>₹{course.fees}</td>
                    <td>
                      <span
                        className={`badge ${
                          course.status === "Active"
                            ? "bg-success"
                            : "bg-secondary"
                        }`}
                      >
                        {course.status}
                      </span>
                    </td>
                    <td>
                      <div className="d-flex gap-2">
                        <Link
                          to={`/dashboard/view-course/${course._id}`}
                          className="btn btn-sm btn-outline-success"
                        >
                          View
                        </Link>

                        {canManage && (
                          <Link
                            to={`/dashboard/edit-course/${course._id}`}
                            className="btn btn-sm btn-outline-primary"
                          >
                            Edit
                          </Link>
                        )}

                        {isAdmin && (
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDelete(course)}
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
                  <td colSpan="6" className="text-center py-4">
                    {search
                      ? "No matching courses found."
                      : "No courses available."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Courses;
