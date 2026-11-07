import { Link } from "react-router-dom";
import {
  FaUsers,
  FaBook,
  FaChartLine,
  FaUserTie,
} from "react-icons/fa";
import Card from "../components/Card";

function Home() {
  const services = [
    {
      icon: <FaUsers />,
      title: "Student Management",
      description: "Manage student profiles, records and registrations.",
    },
    {
      icon: <FaBook />,
      title: "Course Management",
      description: "Organize courses, subjects and enrollments.",
    },
    {
      icon: <FaChartLine />,
      title: "Reports & Analytics",
      description: "Monitor student performance and generate reports.",
    },
    {
      icon: <FaUserTie />,
      title: "Instructor Management",
      description: "Manage instructors and their assigned courses.",
    },
  ];

  return (
    <>
      <section className="hero-section py-5">
        <div className="container py-5">
          <div className="row align-items-center">
            <div className="col-lg-7">
              <span className="badge bg-primary-subtle text-primary mb-3 p-2">
                Smart Education Management
              </span>

              <h1 className="display-4 fw-bold">
                Manage Your Institution
                <span className="text-primary"> Smarter.</span>
              </h1>

              <p className="lead text-secondary my-4">
                A centralized platform to manage students, courses,
                instructors and academic information efficiently.
              </p>

              <Link to="/services" className="btn btn-primary btn-lg me-3">
                Explore Services
              </Link>

              <Link to="/about" className="btn btn-outline-primary btn-lg">
                Learn More
              </Link>
            </div>

            <div className="col-lg-5 text-center mt-5 mt-lg-0">
              <FaGraduationCapPlaceholder />
            </div>
          </div>
        </div>
      </section>

      <section className="container py-5">
        <div className="text-center mb-5">
          <h2 className="fw-bold">Our Management Solutions</h2>
          <p className="text-secondary">
            Everything your institution needs in one place.
          </p>
        </div>

        <div className="row g-4">
          {services.map((service) => (
            <div className="col-md-6 col-lg-3" key={service.title}>
              <Card {...service} />
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

function FaGraduationCapPlaceholder() {
  return (
    <div className="hero-icon mx-auto">
      <FaGraduationCap size={150} />
    </div>
  );
}

import { FaGraduationCap } from "react-icons/fa";

export default Home;