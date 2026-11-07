
import { NavLink } from "react-router-dom";
import {
  FaGraduationCap,
  FaHome,
  FaUsers,
  FaBook,
  FaChalkboardTeacher,
  FaChartBar,
  FaClipboardList,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";

function Sidebar() {
  const menuItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: <FaHome />,
    },
    {
      name: "Students",
      path: "/dashboard/students",
      icon: <FaUsers />,
    },
    {
      name: "Courses",
      path: "/dashboard/courses",
      icon: <FaBook />,
    },
    {
      name: "Instructors",
      path: "/dashboard/instructors",
      icon: <FaChalkboardTeacher />,
    },
    {
      name: "Enrollments",
      path: "/dashboard/enrollments",
      icon: <FaClipboardList />,
    },
    {
      name: "Reports",
      path: "/dashboard/reports",
      icon: <FaChartBar />,
    },
  ];

  return (
    <aside className="admin-sidebar">
      <div className="sidebar-brand">
       <img
  src="/logo.png"
  alt="EduSphere Logo"
  className="sidebar-logo"
/>
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
        <NavLink
          to="/dashboard/settings"
          className="sidebar-link"
        >
          <FaCog />
          <span>Settings</span>
        </NavLink>

        <NavLink to="/" className="sidebar-link">
          <FaSignOutAlt />
          <span>Back to Website</span>
        </NavLink>
      </div>
    </aside>
  );
}

export default Sidebar;
