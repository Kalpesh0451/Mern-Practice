import { FaBell, FaSearch, FaUserCircle } from "react-icons/fa";

function DashboardNavbar() {
  return (
    <header className="dashboard-navbar">
      <div>
        <h5 className="mb-0 fw-bold">Admin Dashboard</h5>
        <small className="text-secondary">Welcome back, Admin!</small>
      </div>

      <div className="dashboard-nav-right">
        <button className="icon-button" aria-label="Search">
          <FaSearch />
        </button>

        <button className="icon-button" aria-label="Notifications">
          <FaBell />
        </button>

        <div className="admin-profile">
          <FaUserCircle size={32} className="text-primary" />
          <div>
            <strong>Administrator</strong>
            <small className="d-block text-secondary">Admin</small>
          </div>
        </div>
      </div>
    </header>
  );
}

export default DashboardNavbar;