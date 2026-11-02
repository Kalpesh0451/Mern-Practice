
import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [backendStatus, setBackendStatus] = useState("checking");
  const [apiMessage, setApiMessage] = useState("");
  const [developer, setDeveloper] = useState("Kalpesh Patil");

  useEffect(() => {
    const checkBackend = async () => {
      try {
        const response = await axios.get("/api");

        setBackendStatus("connected");
        setApiMessage(response.data.message);
        setDeveloper(response.data.developer || "Kalpesh Patil");
      } catch (error) {
        console.error("Backend connection failed:", error);
        setBackendStatus("disconnected");
        setApiMessage("Unable to connect to the backend.");
      }
    };

    checkBackend();
  }, []);

  const technologies = [
    {
      name: "MongoDB",
      short: "M",
      description: "NoSQL database for flexible data storage.",
      color: "mongo",
    },
    {
      name: "Express.js",
      short: "Ex",
      description: "Backend framework for building APIs.",
      color: "express",
    },
    {
      name: "React.js",
      short: "R",
      description: "Frontend library for building user interfaces.",
      color: "react",
    },
    {
      name: "Node.js",
      short: "N",
      description: "JavaScript runtime for server-side development.",
      color: "node",
    },
  ];

  return (
    <div className="app">

      {/* Navigation */}
      <header className="navbar">
        <a href="#" className="brand">
          <span className="brand-icon">M</span>
          <span>MERN Practice</span>
        </a>

        <nav className="nav-links">
          <a href="#home">Home</a>
          <a href="#status">System Status</a>
          <a href="#technologies">Technologies</a>
        </nav>

        <a href="#about" className="nav-button">
          About
        </a>
      </header>

      {/* Hero Section */}
      <main>
        <section className="hero" id="home">

          <div className="hero-badge">
            <span className="badge-dot"></span>
            Full Stack Development Project
          </div>

          <h1>
            Welcome to <span>MERN Practice.</span>
          </h1>

          <p className="hero-description">
            A simple and modern development environment built
            with React and Express. Explore the application,
            check system connectivity and learn full-stack
            development.
          </p>

          <div className="hero-actions">
            <a href="#status" className="primary-button">
              Explore Project <span>→</span>
            </a>

            <a href="#technologies" className="secondary-button">
              View Technologies
            </a>
          </div>

        </section>

        {/* System Status */}
        <section className="status-section" id="status">

          <div className="section-heading">
            <div>
              <span className="section-label">SYSTEM OVERVIEW</span>
              <h2>Application Status</h2>
            </div>

            <span className="live-indicator">
              <span className="live-dot"></span>
              Live Monitoring
            </span>
          </div>

          <div className="status-grid">

            <div className="status-card">
              <div className="status-card-top">
                <span className="status-icon frontend-icon">F</span>
                <span className="status-dot success"></span>
              </div>
              <h3>Frontend</h3>
              <p>React application</p>
              <div className="status-value">
                <span className="small-dot success"></span>
                Running
              </div>
            </div>

            <div className="status-card">
              <div className="status-card-top">
                <span className="status-icon backend-icon">B</span>
                <span className={`status-dot ${backendStatus === "connected" ? "success" : backendStatus === "disconnected" ? "error" : "pending"}`}></span>
              </div>
              <h3>Backend</h3>
              <p>Express server</p>
              <div className="status-value">
                <span className={`small-dot ${backendStatus === "connected" ? "success" : backendStatus === "disconnected" ? "error" : "pending"}`}></span>
                {backendStatus === "connected"
                  ? "Connected"
                  : backendStatus === "disconnected"
                  ? "Disconnected"
                  : "Checking..."}
              </div>
            </div>

            <div className="status-card">
              <div className="status-card-top">
                <span className="status-icon api-icon">API</span>
                <span className={`status-dot ${backendStatus === "connected" ? "success" : backendStatus === "disconnected" ? "error" : "pending"}`}></span>
              </div>
              <h3>API Connection</h3>
              <p>GET /api endpoint</p>
              <div className="status-value">
                <span className={`small-dot ${backendStatus === "connected" ? "success" : backendStatus === "disconnected" ? "error" : "pending"}`}></span>
                {backendStatus === "connected"
                  ? "Active"
                  : backendStatus === "disconnected"
                  ? "Unavailable"
                  : "Checking..."}
              </div>
            </div>

          </div>

          <div className={`connection-message ${backendStatus}`}>
            <span className="connection-indicator"></span>
            <div>
              <strong>
                {backendStatus === "connected"
                  ? "Backend connection successful"
                  : backendStatus === "disconnected"
                  ? "Backend connection failed"
                  : "Checking backend connection"}
              </strong>
              <p>
                {apiMessage || "Waiting for API response..."}
              </p>
            </div>
          </div>

        </section>

        {/* Technology Section */}
        <section className="technology-section" id="technologies">

          <div className="section-heading">
            <div>
              <span className="section-label">OUR TECH STACK</span>
              <h2>Built with MERN</h2>
            </div>
          </div>

          <div className="technology-grid">

            {technologies.map((tech) => (
              <div className="technology-card" key={tech.name}>
                <div className={`tech-icon ${tech.color}`}>
                  {tech.short}
                </div>

                <h3>{tech.name}</h3>
                <p>{tech.description}</p>
              </div>
            ))}

          </div>

        </section>

      </main>

      {/* Footer */}
      <footer className="footer" id="about">
        <a href="#" className="brand footer-brand">
          <span className="brand-icon">M</span>
          <span>MERN Practice</span>
        </a>

        <p>
          Developed by <strong>{developer}</strong>
        </p>

        <p className="copyright">
          © {new Date().getFullYear()} MERN Practice. All rights reserved.
        </p>
      </footer>

    </div>
  );
}

export default App;
