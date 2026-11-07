
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getCourseById } from "../../services/courseService";

function ViewCourse() {
  const { id } = useParams();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await getCourseById(id);
        setCourse(response.data);
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to load course details."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  if (loading) {
    return <div className="dashboard-panel">Loading course...</div>;
  }

  if (error || !course) {
    return (
      <div className="dashboard-panel">
        <div className="alert alert-danger">
          {error || "Course not found."}
        </div>
        <Link to="/dashboard/courses" className="btn btn-secondary">
          Back to Courses
        </Link>
      </div>
    );
  }

  return (
    <div className="dashboard-panel">
      <div className="d-flex justify-content-between align-items-center">
        <div>
          <h3>Course Details</h3>
          <p className="text-secondary">
            Complete information about this course.
          </p>
        </div>

        <Link to="/dashboard/courses" className="btn btn-outline-secondary">
          Back to Courses
        </Link>
      </div>

      <hr />

      <div className="row g-4">
        <div className="col-md-6">
          <strong>Course Name</strong>
          <p>{course.courseName}</p>
        </div>

        <div className="col-md-6">
          <strong>Course Code</strong>
          <p>{course.courseCode}</p>
        </div>

        <div className="col-md-6">
          <strong>Duration</strong>
          <p>{course.duration}</p>
        </div>

        <div className="col-md-6">
          <strong>Course Fees</strong>
          <p>₹{course.fees}</p>
        </div>

        <div className="col-md-6">
          <strong>Status</strong>
          <p>
            <span className={`badge ${
              course.status === "Active" ? "bg-success" : "bg-secondary"
            }`}>
              {course.status}
            </span>
          </p>
        </div>

        <div className="col-12">
          <strong>Description</strong>
          <p>{course.description}</p>
        </div>

        <div className="col-md-6">
          <strong>Created At</strong>
          <p>
            {course.createdAt
              ? new Date(course.createdAt).toLocaleDateString()
              : "Not available"}
          </p>
        </div>

        <div className="col-md-6">
          <strong>Last Updated</strong>
          <p>
            {course.updatedAt
              ? new Date(course.updatedAt).toLocaleDateString()
              : "Not available"}
          </p>
        </div>
      </div>

      <Link
        to={`/dashboard/edit-course/${course._id}`}
        className="btn btn-primary mt-3"
      >
        Edit Course
      </Link>
    </div>
  );
}

export default ViewCourse;
