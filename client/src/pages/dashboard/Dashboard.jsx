import {
  FaUsers,
  FaBook,
  FaChalkboardTeacher,
  FaRupeeSign,
} from "react-icons/fa";

import { Link } from "react-router-dom";
import StatCard from "../../components/StatCard";

function Dashboard() {
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

  const students = [
    { id: "STU001", name: "Aarav Sharma", course: "Computer Science", status: "Active" },
    { id: "STU002", name: "Diya Patel", course: "Data Science", status: "Active" },
    { id: "STU003", name: "Rohan Verma", course: "Web Development", status: "Pending" },
    { id: "STU004", name: "Ananya Singh", course: "Computer Science", status: "Active" },
    { id: "STU005", name: "Rahul Mehta", course: "Data Analytics", status: "Inactive" },
  ];

  return (
    <div>
      <div className="dashboard-heading">
        <div>
          <h3>Dashboard Overview</h3>
          <p>Here's what's happening in your institution.</p>
        </div>

        <Link to="/dashboard/add-student" className="btn btn-primary">
          + Add Student
        </Link>
      </div>

      <div className="row g-4 mb-4">
        {stats.map((stat) => (
          <div className="col-sm-6 col-xl-3" key={stat.title}>
            <StatCard {...stat} />
          </div>
        ))}
      </div>

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
                    <th>Course</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {students.map((student) => (
                    <tr key={student.id}>
                      <td>{student.id}</td>
                      <td className="fw-semibold">{student.name}</td>
                      <td>{student.course}</td>
                      <td>
                        <span
                          className={`status-badge ${student.status.toLowerCase()}`}
                        >
                          {student.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="dashboard-panel">
            <h5 className="fw-bold mb-4">Quick Actions</h5>

            <div className="quick-actions">
              <Link to="/dashboard/add-student" className="quick-action">
                <FaUsers /> Register Student
              </Link>

              <Link to="/dashboard/courses" className="quick-action">
                <FaBook /> Manage Courses
              </Link>

              <Link to="/dashboard/instructors" className="quick-action">
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