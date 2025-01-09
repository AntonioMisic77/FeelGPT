import React, { useState } from "react";
import "../styles/start.css";
import "../styles/login.css";
import axiosInstance from "../api/axiosInstance"; // Import the axios instance
import Cookies from "js-cookie"; // Import js-cookie

const Login = () => {
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null); // State for success messages
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await axiosInstance.post("/user/auth/login", {
        email,
        password,
      });

      const { token } = response.data;

      if (!token) {
        throw new Error("No authentication token received.");
      }

      // Updated line using js-cookie
      Cookies.set("authToken", token, {
        expires: 1, // Cookie expires in 7 days
        secure: true, // Ensures the cookie is sent over HTTPS
        sameSite: "strict", // Protects against CSRF
        path: "/", // Accessible on all pages
      });


      // Redirect to the dashboard or home page
      window.location.replace("/chat"); // Prevent going back to the login page

    } catch (err) {
      console.error("Login error:", err);

      let errorMessage = "An error occurred during login.";
      if (err.response) {
        errorMessage = err.response?.data?.message || errorMessage;
        if (err.response.status === 401) {
          errorMessage = "Invalid email or password.";
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

  const handleForgotPassword = async () => {
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const response = await axiosInstance.post("/user/auth/forgot-password", {
        email,
      });

      setSuccess(
        "A reset link has been sent to your email address. Please check your inbox."
      );
      setEmail(""); // Clear email input
    } catch (err) {
      console.error("Forgot password error:", err);

      let errorMessage = "An error occurred while sending the reset link.";
      if (err.response) {
        errorMessage = err.response?.data?.message || errorMessage;
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

  const handleForgotPasswordClick = (e) => {
    e.preventDefault();
    setShowForgotPassword(true);
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
                  value={email}
                  onChange={handleEmailChange}
                  required
                />
              </div>
              <div>
                <label className="login-label">Password:</label>
                <input
                  className="login-input"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={handlePasswordChange}
                  required
                />
              </div>
              {error && <p className="error-message">{error}</p>}
              <div className="submit-container">
                <button
                  type="submit"
                  className="submit-btn button-66"
                  disabled={loading}
                >
                  {loading ? "Logging in..." : "Log in"}
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
              {error && <p className="error-message">{error}</p>}
              {success && <p className="success-message">{success}</p>}
              <div className="submit-container">
                <button
                  type="button"
                  className="submit-btn button-66"
                  onClick={handleForgotPassword}
                  disabled={loading}
                >
                  {loading ? "Sending..." : "Send Reset Link"}
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
