import { FaBullseye, FaEye, FaAward } from "react-icons/fa";
import Card from "../components/Card";

function About() {
  return (
    <div className="container py-5">
      <div className="text-center mb-5">
        <h1 className="fw-bold">About EduSphere</h1>
        <p className="text-secondary">
          Transforming educational administration through technology.
        </p>
      </div>

      <div className="row align-items-center g-4 mb-5">
        <div className="col-lg-6">
          <h2 className="fw-bold">Who We Are</h2>
          <p className="text-secondary">
            EduSphere is a student management platform designed to
            simplify institutional operations. It brings student
            information, courses and instructors together in one system.
          </p>
          <p className="text-secondary">
            Our goal is to reduce manual administration and improve
            accessibility to academic information.
          </p>
        </div>

        <div className="col-lg-6">
          <div className="about-image">
            <FaAward size={110} />
            <h3 className="mt-3">Education Meets Technology</h3>
          </div>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-md-4">
          <Card
            icon={<FaBullseye />}
            title="Our Mission"
            description="Make educational administration simple and efficient."
          />
        </div>

        <div className="col-md-4">
          <Card
            icon={<FaEye />}
            title="Our Vision"
            description="Build smarter and more connected educational institutions."
          />
        </div>

        <div className="col-md-4">
          <Card
            icon={<FaAward />}
            title="Our Values"
            description="Focus on reliability, transparency and innovation."
          />
        </div>
      </div>
    </div>
  );
}

export default About;