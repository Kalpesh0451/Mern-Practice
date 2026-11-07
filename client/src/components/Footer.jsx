import { Link } from "react-router-dom";
import { FaGraduationCap } from "react-icons/fa";

function Footer() {
  return (
    <footer className="bg-dark text-white py-4 mt-auto">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-md-6 mb-3 mb-md-0">
            <h5 className="fw-bold">
              <FaGraduationCap className="me-2" />
              EduSphere
            </h5>
            <p className="text-secondary mb-0">
              Simplifying student management through technology.
            </p>
          </div>

          <div className="col-md-6 text-md-end">
            <Link to="/privacy-policy" className="text-white text-decoration-none">
              Privacy Policy
            </Link>
            <p className="text-secondary mt-2 mb-0">
              © {new Date().getFullYear()} EduSphere. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;