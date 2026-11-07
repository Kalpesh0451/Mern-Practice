import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getInstructorById } from "../../services/instructorService";

function ViewInstructor() {
  const { id } = useParams();

  const [instructor, setInstructor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInstructor = async () => {
      try {
        const data = await getInstructorById(id);
        setInstructor(data);
      } catch (error) {
        console.error("Error fetching instructor:", error);
        alert("Failed to load instructor details.");
      } finally {
        setLoading(false);
      }
    };

    fetchInstructor();
  }, [id]);

  if (loading) return <p>Loading instructor details...</p>;

  if (!instructor) {
    return (
      <div className="container-fluid">
        <h4>Instructor not found.</h4>
        <Link to="/dashboard/instructors" className="btn btn-primary">
          Back to Instructors
        </Link>
      </div>
    );
  }

  const details = [
    ["Full Name", instructor.fullName],
    ["Email", instructor.email],
    ["Mobile Number", instructor.mobileNumber],
    ["Specialization", instructor.specialization],
    ["Qualification", instructor.qualification],
    ["Experience", `${instructor.experience} years`],
    ["Status", instructor.status],
  ];

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2>Instructor Details</h2>
          <p className="text-muted">View complete instructor information.</p>
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
          <div className="row g-4">
            {details.map(([label, value]) => (
              <div className="col-md-6" key={label}>
                <p className="text-muted mb-1">{label}</p>
                <h6>{value || "Not provided"}</h6>
              </div>
            ))}
          </div>

          <hr />

          <div className="d-flex gap-2">
            <Link
              to={`/dashboard/edit-instructor/${instructor._id}`}
              className="btn btn-primary"
            >
              Edit Instructor
            </Link>

            <Link
              to="/dashboard/instructors"
              className="btn btn-light border"
            >
              Close
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewInstructor;