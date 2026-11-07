import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getStudentById } from "../../services/studentService";

function ViewStudent() {
  const { id } = useParams();

  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const response = await getStudentById(id);
        setStudent(response.data);
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to load student details."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, [id]);

  if (loading) {
    return <p className="text-secondary">Loading student details...</p>;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  if (!student) {
    return <div className="alert alert-warning">Student not found.</div>;
  }

  return (
    <div className="dashboard-panel">
      <div className="d-flex justify-content-between align-items-center">
        <div>
          <h3>Student Details</h3>
          <p className="text-secondary">
            View complete student information.
          </p>
        </div>

        <Link to="/dashboard/students" className="btn btn-outline-secondary">
          Back to Students
        </Link>
      </div>

      <hr />

      <div className="card border-0 shadow-sm">
        <div className="card-body p-4">
          <h5 className="mb-4">Student Information</h5>

          <div className="row g-4">
            <div className="col-md-6">
              <strong>Student ID</strong>
              <p className="text-secondary">{student.studentId}</p>
            </div>

            <div className="col-md-6">
              <strong>Full Name</strong>
              <p className="text-secondary">{student.fullName}</p>
            </div>

            <div className="col-md-6">
              <strong>Email</strong>
              <p className="text-secondary">{student.email}</p>
            </div>

            <div className="col-md-6">
              <strong>Mobile Number</strong>
              <p className="text-secondary">{student.mobileNumber}</p>
            </div>

            <div className="col-md-6">
              <strong>Gender</strong>
              <p className="text-secondary">{student.gender}</p>
            </div>

            <div className="col-md-6">
              <strong>Address</strong>
              <p className="text-secondary">{student.address}</p>
            </div>

            <div className="col-md-6">
              <strong>Registered On</strong>
              <p className="text-secondary">
                {student.createdAt
                  ? new Date(student.createdAt).toLocaleDateString()
                  : "Not available"}
              </p>
            </div>

            <div className="col-md-6">
              <strong>Last Updated</strong>
              <p className="text-secondary">
                {student.updatedAt
                  ? new Date(student.updatedAt).toLocaleDateString()
                  : "Not available"}
              </p>
            </div>
          </div>

          <hr />

          <Link
            to={`/dashboard/edit-student/${student.studentId}`}
            className="btn btn-primary"
          >
            Edit Student
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ViewStudent;