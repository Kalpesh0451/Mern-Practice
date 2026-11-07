
import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:5001/api/users";

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [editingId, setEditingId] = useState(null);

  const initialForm = {
    fullName: "",
    email: "",
    password: "",
    role: "Staff",
  };

  const [form, setForm] = useState(initialForm);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_URL);

      const data = response.data;
      setUsers(
        Array.isArray(data)
          ? data
          : data.users || data.data || []
      );
      setError("");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Unable to load users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setForm(initialForm);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      if (editingId) {
        const { password, ...updateData } = form;

        await axios.put(`${API_URL}/${editingId}`, updateData);
        setSuccess("User updated successfully.");
      } else {
        await axios.post(API_URL, form);
        setSuccess("User created successfully.");
      }

      resetForm();
      await fetchUsers();
    } catch (err) {
      setError(
        err.response?.data?.message || "Something went wrong."
      );
    }
  };

  const handleEdit = (user) => {
    setEditingId(user._id);
    setForm({
      fullName: user.fullName || "",
      email: user.email || "",
      password: "",
      role: user.role || "Staff",
    });

    setError("");
    setSuccess("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleStatusChange = async (user) => {
    const newStatus = user.status === "Active" ? "Inactive" : "Active";

    try {
      setError("");
      setSuccess("");

      await axios.put(`${API_URL}/${user._id}`, {
        status: newStatus,
      });

      setSuccess(
        `${user.fullName} is now ${newStatus.toLowerCase()}.`
      );

      await fetchUsers();
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to update user status."
      );
    }
  };

  return (
    <div className="container-fluid py-3">
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
        <div>
          <h2 className="fw-bold mb-1">User Management</h2>
          <p className="text-muted mb-0">
            Create and manage EduSphere user accounts.
          </p>
        </div>

        <button
          className="btn btn-outline-primary"
          onClick={fetchUsers}
          disabled={loading}
        >
          <i className="bi bi-arrow-clockwise me-2"></i>
          Refresh
        </button>
      </div>

      {error && (
        <div className="alert alert-danger">{error}</div>
      )}

      {success && (
        <div className="alert alert-success">{success}</div>
      )}

      {/* Create / Edit User */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body p-4">
          <h5 className="fw-bold mb-3">
            {editingId ? "Edit User" : "Create New User"}
          </h5>

          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  className="form-control"
                  placeholder="Enter full name"
                  value={form.fullName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  placeholder="Enter email"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>

              {!editingId && (
                <div className="col-md-6">
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    name="password"
                    className="form-control"
                    placeholder="Minimum 8 characters"
                    value={form.password}
                    onChange={handleChange}
                    minLength={8}
                    required
                  />
                </div>
              )}

              <div className="col-md-6">
                <label className="form-label">User Role</label>
                <select
                  name="role"
                  className="form-select"
                  value={form.role}
                  onChange={handleChange}
                >
                  <option value="Staff">Staff</option>
                  <option value="Viewer">Viewer</option>
                </select>
              </div>
            </div>

            <div className="d-flex gap-2 mt-4">
              <button type="submit" className="btn btn-primary">
                <i className="bi bi-check-circle me-2"></i>
                {editingId ? "Update User" : "Create User"}
              </button>

              {editingId && (
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={resetForm}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* Users Table */}
      <div className="card border-0 shadow-sm">
        <div className="card-body p-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="fw-bold mb-0">Registered Users</h5>
            <span className="badge bg-primary">
              {users.length} Users
            </span>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary"></div>
              <p className="mt-2 text-muted">Loading users...</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Full Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {users.length > 0 ? (
                    users.map((user) => (
                      <tr key={user._id}>
                        <td className="fw-semibold">
                          {user.fullName}
                        </td>

                        <td>{user.email}</td>

                        <td>
                          <span className="badge bg-info text-dark">
                            {user.role}
                          </span>
                        </td>

                        <td>
                          <span
                            className={`badge ${
                              user.status === "Active"
                                ? "bg-success"
                                : "bg-secondary"
                            }`}
                          >
                            {user.status}
                          </span>
                        </td>

                        <td>
                          <div className="d-flex gap-2">
                            <button
                              className="btn btn-sm btn-outline-primary"
                              onClick={() => handleEdit(user)}
                              title="Edit user"
                            >
                              <i className="bi bi-pencil"></i>
                            </button>

                            <button
                              className={`btn btn-sm ${
                                user.status === "Active"
                                  ? "btn-outline-danger"
                                  : "btn-outline-success"
                              }`}
                              onClick={() => handleStatusChange(user)}
                              title="Change account status"
                            >
                              {user.status === "Active" ? (
                                <i className="bi bi-person-x"></i>
                              ) : (
                                <i className="bi bi-person-check"></i>
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="5"
                        className="text-center text-muted py-4"
                      >
                        No users found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Users;
