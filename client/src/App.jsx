
import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [message, setMessage] = useState("Connecting...");
  const [status, setStatus] = useState("Checking");

  useEffect(() => {
    axios
      .get("/api")
      .then((response) => {
        setMessage(response.data.message);
        setStatus("Connected Successfully");
      })
      .catch((error) => {
        console.error("API Error:", error);
        setMessage("Backend connection failed");
        setStatus("Disconnected");
      });
  }, []);

  return (
    <div className="app">
      <div className="card">
        <h1>MERN Practice</h1>
        <p>React Frontend with Express Backend</p>

        <div className="status">
          Backend Status: {status}
        </div>

        <h3>{message}</h3>

        <p>Frontend is running successfully!</p>
      </div>
    </div>
  );
}

export default App;
