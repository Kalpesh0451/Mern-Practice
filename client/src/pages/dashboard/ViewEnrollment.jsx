
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getEnrollmentById } from "../../services/enrollmentService";

function ViewEnrollment() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [enrollment, setEnrollment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch enrollment details
  useEffect(() => {
    const fetchEnrollment = async () => {
      try {
        setLoading(true);

        const data = await getEnrollmentById(id);

        setEnrollment(data.enrollment);
      } catch (error) {
        console.error("Error fetching enrollment:", error);
        setError("Unable to load enrollment details.");
      } finally {
        setLoading(false);
      }
    };

    fetchEnrollment();
  }, [id]);

  if (loading) {
    return (
      <div className="page-container">
        <p>Loading enrollment details...</p>
      </div>
    );
  }

  if (error || !enrollment) {
    return (
      <div className="page-container">
        <p className="error-message">
          {error || "Enrollment not found."}
        </p>

        <button onClick={() => navigate("/dashboard/enrollments")}>
          Back to Enrollments
        </button>
      </div>
    );
  }

  const student = enrollment.student;
  const course = enrollment.course;

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h2>Enrollment Details</h2>
          <p>View complete student enrollment information.</p>
        </div>

        <button
          className="secondary-btn"
          onClick={() => navigate("/dashboard/enrollments")}
        >
          Back to Enrollments
        </button>
      </div>

      <div className="form-container">
        <h3>Enrollment Information</h3>

        <div className="details-grid">
          <div className="detail-item">
            <label>Enrollment ID</label>
            <p>{enrollment._id}</p>
          </div>

          <div className="detail-item">
            <label>Enrollment Date</label>
            <p>
              {enrollment.enrollmentDate
                ? new Date(enrollment.enrollmentDate).toLocaleDateString("en-IN")
                : "N/A"}
            </p>
          </div>

          <div className="detail-item">
            <label>Enrollment Status</label>
            <p>{enrollment.status}</p>
          </div>
        </div>

        <hr />

        <h3>Student Information</h3>

        <div className="details-grid">
          <div className="detail-item">
            <label>Student Name</label>
            <p>{student?.fullName || "N/A"}</p>
          </div>

          <div className="detail-item">
            <label>Student ID</label>
            <p>{student?.studentId || "N/A"}</p>
          </div>

          <div className="detail-item">
            <label>Email</label>
            <p>{student?.email || "N/A"}</p>
          </div>

          <div className="detail-item">
            <label>Mobile Number</label>
            <p>{student?.mobileNumber || "N/A"}</p>
          </div>
        </div>

        <hr />

        <h3>Course Information</h3>

        <div className="details-grid">
          <div className="detail-item">
            <label>Course Name</label>
            <p>{course?.courseName || "N/A"}</p>
          </div>

          <div className="detail-item">
            <label>Course Code</label>
            <p>{course?.courseCode || "N/A"}</p>
          </div>

          <div className="detail-item">
            <label>Duration</label>
            <p>{course?.duration || "N/A"}</p>
          </div>

          <div className="detail-item">
            <label>Course Fees</label>
            <p>{course?.fees ?? "N/A"}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewEnrollment;
