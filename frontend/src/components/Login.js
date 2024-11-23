// src/components/Login.js

import React, { useState } from "react";
import "../styles/start.css";
import "../styles/login.css";
import axiosInstance from "../api/axiosInstance"; // Import the axios instance

const Login = () => {
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState(""); // Add state for password
  const [error, setError] = useState(null); // Optional: Add state for error messages

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Reset any previous errors

    try {
      const response = await axiosInstance.post("/user/auth/login", {
        email,
        password,
      });

      // Assuming the backend returns a token in response.data.token
      const { token } = response.data;

      // Store the token in localStorage
      localStorage.setItem("authToken", token);

      // Redirect to the dashboard or home page
      window.location.href = "/dashboard"; // Change the path as needed
    } catch (err) {
      console.error("Login error:", err);
      setError(
        err.response?.data?.message || "An error occurred during login."
      );
    }
  };

  const handleForgotPasswordClick = (e) => {
    e.preventDefault(); // Prevent the default anchor behavior
    setShowForgotPassword(true); // Show the password reset form
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  return (
    <div className="body-login">
      <div className="log-in-container">
        <div className="log-in-form">
          <h1 className="form-title">
            {showForgotPassword ? "Password Reset" : "Feel GPT Login"}
          </h1>
          {!showForgotPassword ? (
            <form onSubmit={handleSubmit}>
              <div>
                <label className="login-label">Email:</label>
                <input
                  className="login-input"
                  type="email"
                  placeholder="Enter your email"
                  value={email} // Bind the email state
                  onChange={handleEmailChange} // Handle email changes
                  required
                />
              </div>
              <div>
                <label className="login-label">Password:</label>
                <input
                  className="login-input"
                  type="password"
                  placeholder="Enter your password"
                  value={password} // Bind the password state
                  onChange={handlePasswordChange} // Handle password changes
                  required
                />
              </div>
              {error && <p className="error-message">{error}</p>} {/* Optional: Display error */}
              <div className="submit-container">
                <button type="submit" className="submit-btn button-66">
                  Log in
                </button>
              </div>
            </form>
          ) : (
            <div className="forgot-password-input">
              <label className="login-label" htmlFor="reset-email">
                Enter your email for password reset:
              </label>
              <input
                className="login-input"
                type="email"
                id="reset-email"
                value={email}
                onChange={handleEmailChange}
                placeholder="Enter your email"
                required
              />
              <div className="submit-container">
                <button type="button" className="submit-btn button-66">
                  Send Reset Link
                </button>
              </div>
            </div>
          )}
          {!showForgotPassword && (
            <div className="forgot-password">
              <a href="#" onClick={handleForgotPasswordClick}>
                I have forgotten my password
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
