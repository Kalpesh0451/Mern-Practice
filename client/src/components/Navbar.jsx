import { NavLink } from "react-router-dom";
import { FaGraduationCap } from "react-icons/fa";

function Navbar() {
  const links = [
    { name: "Home", path: "/" },
    { name: "About Us", path: "/about" },
    { name: "Services", path: "/services" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <nav className="navbar navbar-expand-lg bg-white shadow-sm py-3">
      <div className="container">
        <NavLink className="navbar-brand fw-bold text-primary" to="/">
          <FaGraduationCap className="me-2" size={25} />
          EduSphere
        </NavLink>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNavbar"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="mainNavbar">
          <div className="navbar-nav ms-auto gap-lg-3">
            {links.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `nav-link ${isActive ? "active fw-bold text-primary" : ""}`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </div>

          <NavLink to="/dashboard" className="btn btn-primary ms-lg-4">
            Get Started
          </NavLink>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;