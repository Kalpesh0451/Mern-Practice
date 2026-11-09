
import { useEffect, useState } from "react";
import {
  FaUsers,
  FaBook,
  FaChalkboardTeacher,
  FaRupeeSign,
} from "react-icons/fa";

import { Link } from "react-router-dom";
import StatCard from "../../components/StatCard";
import { getStudents } from "../../services/studentService";

function Dashboard() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const stats = [
    {
      title: "Total Students",
      value: "1,250",
      icon: <FaUsers />,
      color: "blue",
      change: "+12% from last month",
    },
    {
      title: "Total Courses",
      value: "48",
      icon: <FaBook />,
      color: "purple",
      change: "+4 new courses",
    },
    {
      title: "Instructors",
      value: "32",
      icon: <FaChalkboardTeacher />,
      color: "orange",
      change: "+2 new instructors",
    },
    {
      title: "Total Revenue",
      value: "₹8.5L",
      icon: <FaRupeeSign />,
      color: "green",
      change: "+8% from last month",
    },
  ];

  // Fetch actual students from MongoDB through the existing API
  useEffect(() => {
    let isMounted = true;

    const fetchRecentStudents = async () => {
      try {
        setLoading(true);
        setError("");

        // Fetch the first 5 records using the same service as Students.jsx
        const response = await getStudents(1, 5);

        if (isMounted) {
          setStudents(response.data || []);
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err.response?.data?.message ||
              "Failed to load recent students."
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchRecentStudents();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div>
      {/* Dashboard Heading */}
      <div className="dashboard-heading">
        <div>
          <h3>Dashboard Overview</h3>
          <p>Here's what's happening in your institution.</p>
        </div>

        <Link to="/dashboard/add-student" className="btn btn-primary">
          + Add Student
        </Link>
      </div>

      {/* Statistics Cards */}
      <div className="row g-4 mb-4">
        {stats.map((stat) => (
          <div className="col-sm-6 col-xl-3" key={stat.title}>
            <StatCard {...stat} />
          </div>
        ))}
      </div>

      {/* Recent Students and Quick Actions */}
      <div className="row g-4">
        <div className="col-lg-8">
          <div className="dashboard-panel">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 className="fw-bold mb-0">Recent Students</h5>

              <Link to="/dashboard/students">View All</Link>
            </div>

            <div className="table-responsive">
              <table className="table align-middle">
                <thead>
                  <tr>
                    <th>Student ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Mobile Number</th>
                  </tr>
                </thead>

                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="4" className="text-center py-4">
                        Loading students...
                      </td>
                    </tr>
                  ) : error ? (
                    <tr>
                      <td colSpan="4" className="text-center text-danger py-4">
                        {error}
                      </td>
                    </tr>
                  ) : students.length > 0 ? (
                    students.map((student) => (
                      <tr key={student._id}>
                        <td>{student.studentId}</td>

                        <td className="fw-semibold">
                          {student.fullName}
                        </td>

                        <td>{student.email}</td>

                        <td>{student.mobileNumber}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center py-4">
                        No students registered yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="col-lg-4">
          <div className="dashboard-panel">
            <h5 className="fw-bold mb-4">Quick Actions</h5>

            <div className="quick-actions">
              <Link
                to="/dashboard/add-student"
                className="quick-action"
              >
                <FaUsers /> Register Student
              </Link>

              <Link
                to="/dashboard/courses"
                className="quick-action"
              >
                <FaBook /> Manage Courses
              </Link>

              <Link
                to="/dashboard/instructors"
                className="quick-action"
              >
                <FaChalkboardTeacher /> Manage Instructors
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
