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
  const [loading, setLoading] = useState(false); // Add loading state

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Reset any previous errors
    setLoading(true); // Set loading state

    try {
      const response = await axiosInstance.post("/user/auth/login", {
        email,
        password,
      });

      // Assuming the backend returns a token in response.data.token
      const { token } = response.data;

      if (!token) {
        throw new Error('No authentication token received.');
      }

      // Store the token in localStorage
      localStorage.setItem("authToken", token);

      // Redirect to the dashboard or home page
      window.location.replace("/chat"); // Prevent going back to the login page

    } catch (err) {
      console.error("Login error:", err);

      // Improved error handling: check different error types
      let errorMessage = "An error occurred during login.";
      if (err.response) {
        // Backend error
        errorMessage = err.response?.data?.message || errorMessage;
        if (err.response.status === 401) {
          errorMessage = "Invalid email or password.";
        }
      } else if (err.request) {
        // No response was received (e.g., network issues)
        errorMessage = "Network error. Please try again later.";
      } else {
        // Other errors (e.g., unexpected client-side error)
        errorMessage = err.message || errorMessage;
      }

      setError(errorMessage);
    } finally {
      setLoading(false); // Reset loading state after the request
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
                <button
                  type="submit"
                  className="submit-btn button-66"
                  disabled={loading} // Disable button when loading
                >
                  {loading ? "Logging in..." : "Log in"} {/* Show loading text */}
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
