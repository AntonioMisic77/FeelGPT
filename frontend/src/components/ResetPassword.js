import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import "../styles/login.css";
import axiosInstance from "../api/axiosInstance";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      const response = await axiosInstance.post("/user/auth/reset-password", {
        email,
        token,
        newPassword,
      });

      // Handle success
      setSuccess("Password reset successful. You can now log in with your new password.");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(()=> window.location.replace("/login"), 1000)
    } catch (err) {
      console.error("Reset password error:", err);

      // Improved error handling
      let errorMessage = "An error occurred while resetting the password.";
      if (err.response) {
        errorMessage = err.response?.data?.message || errorMessage;
        if (err.response.status === 400 || err.response.status === 401) {
          errorMessage = "Invalid or expired token.";
        }
      } else if (err.request) {
        errorMessage = "Network error. Please try again later.";
      } else {
        errorMessage = err.message || errorMessage;
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = (e) => setNewPassword(e.target.value);
  const handleConfirmPasswordChange = (e) => setConfirmPassword(e.target.value);

  return (
    <div className="body-reset-password">
      <div className="reset-password-container">
        <h1 className="form-title">Reset Your Password</h1>
        <form onSubmit={handleSubmit}>
          <div>
            <label className="reset-password-label">New Password:</label>
            <input
              className="reset-password-input"
              type="password"
              placeholder="Enter your new password"
              value={newPassword}
              onChange={handlePasswordChange}
              required
            />
          </div>
          <div>
            <label className="reset-password-label">Confirm Password:</label>
            <input
              className="reset-password-input"
              type="password"
              placeholder="Confirm your new password"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              required
            />
          </div>
          {error && <p className="error-message">{error}</p>}
          {success && <p className="success-message">{success}</p>}
          <div className="submit-container">
            <button
              type="submit"
              className="submit-btn button-66"
              disabled={loading}
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
