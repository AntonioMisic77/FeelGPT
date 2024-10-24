import React, { useState } from "react";
import "../styles/start.css";
import "../styles/login.css";

const Login = () => {
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle the login submission here
  };

  const handleForgotPasswordClick = (e) => {
    e.preventDefault(); // Prevent the default anchor behavior
    setShowForgotPassword(true); // Show the password reset form
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
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
                <input  className="login-input" type="email" placeholder="Enter your email" required />
              </div>
              <div>
                <label className="login-label">Password:</label>
                <input  className="login-input" type="password" placeholder="Enter your password" required />
              </div>
              <div className="submit-container">
                <button type="submit" className="submit-btn button-66">
                  Log in
                </button>
              </div>
            </form>
          ) : (
            <div className="forgot-password-input">
              <label className="login-label" htmlFor="reset-email">Enter your email for password reset:</label>
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
