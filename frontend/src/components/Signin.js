// src/components/Signin.js

import React, { useState } from "react";
import "../styles/start.css";
import "../styles/signin.css";
import axiosInstance from "../api/axiosInstance";

const Signin = () => {
  // Existing state variables
  const [consent, setConsent] = useState(false);
  const [notifications, setNotifications] = useState("daily");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  // New state variables for additional info
  const [responseTone, setResponseTone] = useState("neutral");
  const [reminderFrequency, setReminderFrequency] = useState("never");
  const [reminderTime, setReminderTime] = useState("");
  const [selectedDay, setSelectedDay] = useState(""); // Single day selection
  const [selectedReminderType, setSelectedReminderType] = useState("email"); // Reminder type (email or push)

  // Handlers for form fields
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

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handleDaySelection = (e) => {
    setSelectedDay(e.target.value); // Update to a single selected day
  };

  const handleReminderTypeSelection = (e) => {
    setSelectedReminderType(e.target.value); // Update selected reminder type
  };

  // Updated handleSubmit to include additional fields
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Include all required fields in the POST request
      const response = await axiosInstance.post("/user/auth/register", {
        username,
        email,
        password,
        responseTone,
        reminderFrequency,
        reminderType: selectedReminderType,
        reminderTime,
        selectedDay, // Include if reminderFrequency is "weekly"
      });

      const { token } = response.data;

      localStorage.setItem("authToken", token);

      window.location.href = "/chat";
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
            {/* Username Input Field */}
            <div>
              <label className="signin-label">Username</label>
              <input
                className="signin-input"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={handleUsernameChange}
                required
              />
            </div>

            {/* Email Input Field */}
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

            {/* Password Input Field */}
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
          <h1 className="form-title">Additional Info</h1>
          <div className="preferences">
            {/* Response Tone Slider */}
            <label>Response Tone</label>
            <input
              className="win10-thumb"
              type="range"
              min="1"
              max="3"
              value={
                responseTone === "empathetic"
                  ? 1
                  : responseTone === "neutral"
                    ? 2
                    : 3
              }
              onChange={(e) => {
                const value = parseInt(e.target.value);
                setResponseTone(
                  value === 1
                    ? "empathetic"
                    : value === 2
                      ? "neutral"
                      : "professional"
                );
              }}
            />
            <div className="tone-labels">
              <span>Empathetic</span>
              <span>Neutral</span>
              <span>Professional</span>
            </div>
          </div>

          {/* Conversation Reminders Slider */}
          <div className="reminder-frequency">
            <label>Conversation Reminders</label>
            <input
              type="range"
              className="win10-thumb"
              min="1"
              max="3"
              value={
                reminderFrequency === "never"
                  ? 1
                  : reminderFrequency === "daily"
                    ? 2
                    : 3
              }
              onChange={(e) => {
                const value = parseInt(e.target.value);
                setReminderFrequency(
                  value === 1 ? "never" : value === 2 ? "daily" : "weekly"
                );
              }}
            />
            <div className="reminder-labels">
              <span>Never</span>
              <span>Daily</span>
              <span>Weekly</span>
            </div>
          </div>

          {/* Conditional Rendering Based on Reminder Frequency */}
          {(reminderFrequency === "daily" || reminderFrequency === "weekly") && (
            <div>
              {/* Reminder Type Radio Buttons */}
              <div className="reminder-type">
                <label>Select Reminder Type:</label>
                <div className="radio-buttons">
                  <label>
                    <input
                      type="radio"
                      value="email"
                      checked={selectedReminderType === "email"}
                      onChange={handleReminderTypeSelection}
                    />
                    Email
                  </label>
                  <label>
                    <input
                      type="radio"
                      value="push"
                      checked={selectedReminderType === "push"}
                      onChange={handleReminderTypeSelection}
                    />
                    Push Notification
                  </label>
                </div>
              </div>

              {/* Pick Time for Daily/Weekly Reminders */}
              <div className="time-picker">
                <label>Pick a Time:</label>
                <input
                  className="form-control"
                  type="time"
                  value={reminderTime}
                  onChange={(e) => setReminderTime(e.target.value)}
                />
              </div>
            </div>
          )}

          {/* Conditional Rendering for Weekly Reminders */}
          {reminderFrequency === "weekly" && (
            <div className="week">
              <label>Select Day:</label>
              <div className="week-picker">
                <select
                  value={selectedDay}
                  onChange={handleDaySelection}
                  className="form-control"
                >
                  <option value="">Select a day</option>
                  {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
                    <option key={day} value={day}>
                      {day}
                    </option>
                  ))}
                </select>
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
