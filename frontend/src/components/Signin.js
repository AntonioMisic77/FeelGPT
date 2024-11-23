// src/components/Signin.js

import React, { useState } from "react";
import "../styles/start.css";
import "../styles/signin.css";
import axiosInstance from "../api/axiosInstance";

const Signin = () => {
  const [consent, setConsent] = useState(false);
  const [notifications, setNotifications] = useState("daily");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleConsentChange = () => {
    setConsent(!consent);
  };

  const handleNotificationsChange = (e) => {
    setNotifications(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post("/user/auth/register", {
        email,
        password,
      });
      window.location.href = "/login";
    } catch (err) {
      console.error("Signin error:", err);
    }
  };

  return (
    <div className="body-signin">
      <div className="sign-in-container">
        <div className="sign-in-form">
          <h1 className="form-title">Feel GPT Sign In Form</h1>
          <form>
            <div>
              <label className="signin-label">Email</label>
              <input
                className="signin-input"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={handleEmailChange}
                required
              />
            </div>
            <div>
              <label className="signin-label">Password</label>
              <input
                className="signin-input"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={handlePasswordChange}
                required
              />
            </div>
          </form>
        </div>

        <div className="additional-info">
          <h2 className="info-title">Additional Info</h2>
          <div className="consent-container">
            <label className="question-label">
              Would you like to you use your camera for better performance?
            </label>
            <div className="checkbox-wrapper-10">
              <input
                className="tgl tgl-flip"
                id="cb5"
                type="checkbox"
                checked={consent}
                onChange={handleConsentChange}
              />
              <label
                className="tgl-btn"
                data-tg-off="Nope"
                data-tg-on="Yeah!"
                htmlFor="cb5"
              ></label>
            </div>
          </div>

          <div>
            <label className="question-label radio-label">
              Do you want to get notifications for conversations?
            </label>
            <div className="horizontal-radio">
              <div className="radio-wrapper-5">
                <label htmlFor="daily" className="forCircle">
                  <input
                    id="daily"
                    type="radio"
                    name="radio-examples"
                    value="daily"
                    checked={notifications === "daily"}
                    onChange={handleNotificationsChange}
                  />
                  <span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-3.5 w-3.5"
                      viewBox="0 0 16 16"
                      fill="currentColor"
                    >
                      <circle data-name="ellipse" cx="8" cy="8" r="8"></circle>
                    </svg>
                  </span>
                </label>
                <label htmlFor="daily">daily</label>
              </div>

              <div className="radio-wrapper-5">
                <label htmlFor="weekly" className="forCircle">
                  <input
                    id="weekly"
                    type="radio"
                    name="radio-examples"
                    value="weekly"
                    checked={notifications === "weekly"}
                    onChange={handleNotificationsChange}
                  />
                  <span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-3.5 w-3.5"
                      viewBox="0 0 16 16"
                      fill="currentColor"
                    >
                      <circle data-name="ellipse" cx="8" cy="8" r="8"></circle>
                    </svg>
                  </span>
                </label>
                <label htmlFor="weekly">weekly</label>
              </div>

              <div className="radio-wrapper-5">
                <label htmlFor="never" className="forCircle">
                  <input
                    id="never"
                    type="radio"
                    name="radio-examples"
                    value="never"
                    checked={notifications === "never"}
                    onChange={handleNotificationsChange}
                  />
                  <span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-3.5 w-3.5"
                      viewBox="0 0 16 16"
                      fill="currentColor"
                    >
                      <circle data-name="ellipse" cx="8" cy="8" r="8"></circle>
                    </svg>
                  </span>
                </label>
                <label htmlFor="never">never</label>
              </div>
            </div>
          </div>
          {(notifications === "weekly" || notifications === "daily") && (
            <div>
              <label className="question-label radio-label">
                How would you like to receive notifications?
              </label>
              <div className="horizontal-radio">
                <div className="radio-wrapper-5">
                  <label htmlFor="mail" className="forCircle">
                    <input
                      id="mail"
                      type="radio"
                      name="notificationMethod"
                      value="mail"
                      checked={notifications === "mail"}
                      onChange={handleNotificationsChange}
                    />
                    <span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-3.5 w-3.5"
                        viewBox="0 0 16 16"
                        fill="currentColor"
                      >
                        <circle data-name="ellipse" cx="8" cy="8" r="8"></circle>
                      </svg>
                    </span>
                  </label>
                  <label htmlFor="mail">Email</label>
                </div>

                <div className="radio-wrapper-5">
                  <label htmlFor="push" className="forCircle">
                    <input
                      id="push"
                      type="radio"
                      name="notificationMethod"
                      value="push"
                      checked={notifications === "push"}
                      onChange={handleNotificationsChange}
                    />
                    <span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-3.5 w-3.5"
                        viewBox="0 0 16 16"
                        fill="currentColor"
                      >
                        <circle data-name="ellipse" cx="8" cy="8" r="8"></circle>
                      </svg>
                    </span>
                  </label>
                  <label htmlFor="push">Push notification</label>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="submit-container-signin">
        <button type="button" className="submit-btn button-66" onClick={handleSubmit}>
          Submit
        </button>
      </div>
    </div>
  );
};

export default Signin;
