import { useNavigate } from "react-router";
import { useState } from "react";
import api from "../utils/axios";
import "./AuthModal.css";

export function AuthModal() {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const goToRegister = () => {
    navigate("/register");
  };

  const goToLogin = () => {
    navigate("/login");
  };

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setError("");
    const username = e.target.username.value;
    const password = e.target.password.value;

    try {
      const response = await api.post("/api/admin/signin", {
        username,
        password,
      });
      localStorage.setItem("adminToken", response.data.token);
      window.location.href = "/admin";
    } catch (err) {
      console.error("Admin login failed:", err);
      setError(err.response?.data?.message || "Invalid admin credentials.");
    }
  };

  return (
    <div className="auth-modal-overlay" onClick={() => navigate("/")}>
      <div
        className="auth-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="auth-modal-close"
          aria-label="Close"
          onClick={() => navigate("/")}
        >
          &times;
        </button>

        <div className="auth-modal-icon">🔐</div>

        <h2 id="auth-modal-title" className="auth-modal-title">
          Admin Login
        </h2>

        <p className="auth-modal-text">
          Please enter your admin credentials to access the admin panel.
        </p>

        {error && <p className="error-message" style={{color: "red", marginBottom: "12px"}}>{error}</p>}

        <form onSubmit={handleAdminLogin}>
          <div className="auth-modal-field">
            <input
              type="text"
              name="username"
              className="auth-modal-input"
              placeholder="Admin Username"
              required
            />
          </div>

          <div className="auth-modal-field">
            <input
              type="password"
              name="password"
              className="auth-modal-input"
              placeholder="Admin Password"
              required
            />
          </div>

          <button type="submit" className="auth-modal-primary">
            Login
          </button>
        </form>

        <div className="auth-modal-footer">
          <button className="auth-modal-secondary" onClick={goToLogin}>
            Go to Customer Login
          </button>
        </div>
      </div>
    </div>
  );
}
