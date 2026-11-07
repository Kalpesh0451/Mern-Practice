import {
  FaUsers,
  FaBook,
  FaChalkboardTeacher,
  FaFileAlt,
  FaEnvelope,
  FaChartBar,
} from "react-icons/fa";
import Card from "../components/Card";

function Services() {
  const services = [
    {
      icon: <FaUsers />,
      title: "Student Management",
      description: "Register, update, search and manage student records.",
    },
    {
      icon: <FaBook />,
      title: "Course Management",
      description: "Create courses and manage student enrollments.",
    },
    {
      icon: <FaChalkboardTeacher />,
      title: "Instructor Management",
      description: "Organize instructor profiles and assignments.",
    },
    {
      icon: <FaFileAlt />,
      title: "Document Management",
      description: "Manage student profile photos and documents.",
    },
    {
      icon: <FaEnvelope />,
      title: "Email Notifications",
      description: "Send automated enrollment confirmation emails.",
    },
    {
      icon: <FaChartBar />,
      title: "Reports & Analytics",
      description: "View statistics and course-wise student reports.",
    },
  ];

  return (
    <div className="container py-5">
      <div className="text-center mb-5">
        <h1 className="fw-bold">Our Services</h1>
        <p className="text-secondary">
          Powerful features for modern educational institutions.
        </p>
      </div>

      <div className="row g-4">
        {services.map((service) => (
          <div className="col-md-6 col-lg-4" key={service.title}>
            <Card {...service} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Services;