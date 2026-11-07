import { useState } from "react";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    alert("Thank you! Your message has been received.");

    setFormData({
      name: "",
      email: "",
      message: "",
    });
  };

  return (
    <div className="container py-5">
      <div className="text-center mb-5">
        <h1 className="fw-bold">Contact Us</h1>
        <p className="text-secondary">
          Have questions? We'd love to hear from you.
        </p>
      </div>

      <div className="row justify-content-center">
        <div className="col-lg-7">
          <form onSubmit={handleSubmit} className="card border-0 shadow-sm p-4">
            <div className="mb-3">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                name="name"
                className="form-control"
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                name="email"
                className="form-control"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Message</label>
              <textarea
                name="message"
                className="form-control"
                rows="5"
                placeholder="Write your message"
                value={formData.message}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary">
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Contact;