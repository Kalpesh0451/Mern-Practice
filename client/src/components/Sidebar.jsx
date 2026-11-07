
import { NavLink, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaUsers,
  FaBook,
  FaChalkboardTeacher,
  FaChartBar,
  FaClipboardList,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";

import { useAuth } from "../context/AuthContext";

function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const menuItems = [
    { name: "Dashboard", path: "/dashboard", icon: <FaHome /> },
    { name: "Students", path: "/dashboard/students", icon: <FaUsers /> },
    { name: "Courses", path: "/dashboard/courses", icon: <FaBook /> },
    { name: "Instructors", path: "/dashboard/instructors", icon: <FaChalkboardTeacher /> },
    { name: "Enrollments", path: "/dashboard/enrollments", icon: <FaClipboardList /> },
    { name: "Reports", path: "/dashboard/reports", icon: <FaChartBar /> },
  ];

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <aside className="admin-sidebar">
      <div className="sidebar-brand">
        <img src="/logo.png" alt="EduSphere Logo" className="sidebar-logo" />
        <span>EduSphere</span>
      </div>

      <p className="sidebar-label">MAIN MENU</p>

      <nav className="sidebar-menu">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/dashboard"}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "active" : ""}`
            }
          >
            {item.icon}
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-bottom">
        <div className="sidebar-user">
          <strong>{user?.fullName || "User"}</strong>
          <small>{user?.role || "Member"}</small>
        </div>

        <NavLink to="/dashboard/settings" className="sidebar-link">
          <FaCog />
          <span>Settings</span>
        </NavLink>

        <NavLink to="/" className="sidebar-link">
          <FaHome />
          <span>Back to Website</span>
        </NavLink>

        <button
          type="button"
          className="sidebar-link sidebar-logout"
          onClick={handleLogout}
        >
          <FaSignOutAlt />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
