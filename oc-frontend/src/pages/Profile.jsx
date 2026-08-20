import { Header } from "../components/Header";
import { useState, useEffect } from "react";
import api from "../utils/axios";
import "./Profile.css";
import "../components/Header.css";

export function Profile({ cart }) {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get("/api/auth/me");
        setUser(response.data.user);
        setFormData({
          name: response.data.user.name,
          email: response.data.user.email,
        });
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load profile.");
      }
    };
    fetchProfile();
  }, []);

  const handleProfileChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const saveProfile = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    try {
      const response = await api.patch("/api/auth/profile", formData);
      setUser(response.data.user);
      setMessage("Profile updated successfully.");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile.");
    }
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const changePassword = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    try {
      await api.patch("/api/auth/password", passwordData);
      setPasswordData({ currentPassword: "", newPassword: "" });
      setMessage("Password updated successfully.");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update password.");
    }
  };

  return (
    <>
      <link rel="icon" type="image/png" href="/home-favicon.png" />
      <title>My Profile</title>

      <Header cart={cart} />

      <div className="profile-page">
        <div className="page-title">My Profile</div>

        {error && <div className="profile-message error">{error}</div>}
        {message && <div className="profile-message success">{message}</div>}

        {user && (
          <div className="profile-sections">
            <div className="profile-section">
              <div className="profile-section-title">Account details</div>
              <form onSubmit={saveProfile}>
                <label>
                  Name
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleProfileChange}
                    required
                  />
                </label>
                <label>
                  Email
                  <input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleProfileChange}
                    required
                  />
                </label>
                <button type="submit" className="button-primary">
                  Save changes
                </button>
              </form>
            </div>

            <div className="profile-section">
              <div className="profile-section-title">Change password</div>
              <form onSubmit={changePassword}>
                <label>
                  Current password
                  <input
                    name="currentPassword"
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    required
                  />
                </label>
                <label>
                  New password
                  <input
                    name="newPassword"
                    type="password"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    required
                  />
                </label>
                <button type="submit" className="button-primary">
                  Update password
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
}