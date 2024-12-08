// src/components/Signin.js

import React, { useState } from "react";
import "../styles/start.css";
import "../styles/signin.css";
import axiosInstance from "../api/axiosInstance";

const Signin = () => {
  // State variables
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

  // New state variables for profile picture
  const [profileImage, setProfileImage] = useState(""); // To store base64 data
  const [imageExtension, setImageExtension] = useState(""); // To store file extension

  // State variables for loading, error
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

  // Handler for image file selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result.split(",")[1]; // Remove the data URL prefix
        setProfileImage(base64String);
        const extension = file.type.split("/")[1]; // Extract the file extension
        setImageExtension(extension);
      };
      reader.readAsDataURL(file);
    }
  };

  // Updated handleSubmit to include validation and image data
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset the error state before sending the request
    setError(null);

    try {
      // Set loading state to true
      setLoading(true);

      // Include all required fields in the POST request
      const response = await axiosInstance.post("/user/auth/register", {
        username: username,
        email: email,
        password: password,
        responseTone: responseTone.toUpperCase(),
        notificationFrequency: reminderFrequency.toUpperCase(),
        notificationMode: selectedReminderType.toUpperCase(),
        // notificationTime : reminderTime,
        selectedDay: selectedDay, // Include if reminderFrequency is "weekly"
        profileImage: profileImage, // Add base64 image data
        imageExtension: imageExtension, // Add image file extension
      });

      const { token } = response.data;

      // Store the auth token and redirect the user
      localStorage.setItem("authToken", token);

      // Redirect after successful registration
      window.location.replace("/chat");
    } catch (err) {
      setLoading(false); // Stop loading state

      // Log and handle different error cases
      if (err.response) {
        // Server responded with a status other than 200 range
        console.error("Response error:", err.response);
        setError(
          err.response.data.message || "An error occurred. Please try again."
        );
      } else if (err.request) {
        // No response was received from the server
        console.error("Request error:", err.request);
        setError("Network error. Please check your connection.");
      } else {
        // Something else went wrong
        console.error("Error:", err.message);
        setError("An unexpected error occurred.");
      }
    } finally {
      setLoading(false); // Stop loading regardless of success or failure
    }
  };

  return (
    <div className="body-signin">
      <div className="sign-in-container">
        <div className="sign-in-form">
          <h1 className="form-title">FeelGPT Sign Up Form</h1>
          <form onSubmit={handleSubmit}>
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

            {/* Profile Picture Input Field */}
            <div>
              <label className="signin-label">Profile Picture</label>
              <input
                className="signin-input"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                required
              />
            </div>

            {/* Conditionally Render Image Preview */}
            {profileImage && (
              <div className="image-preview">
                <img
                  src={`data:image/${imageExtension};base64,${profileImage}`}
                  alt="Profile Preview"
                  style={{ width: "20vh", height: "20vh", objectFit: "cover" }}
                />
              </div>
            )}

            
          </form>
        </div>

        <div className="additional-info">
          {/* <h1 className="form-title">Additional Info</h1> */}
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
          {(reminderFrequency === "daily" ||
            reminderFrequency === "weekly") && (
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
                  {[
                    "Monday",
                    "Tuesday",
                    "Wednesday",
                    "Thursday",
                    "Friday",
                    "Saturday",
                    "Sunday",
                  ].map((day) => (
                    <option key={day} value={day}>
                      {day}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
          {/* Submit Button */}
          <div className="submit-container-signin">
            <button type="submit" className="submit-btn button-66-smaller">
              Submit
            </button>
          </div>
        </div>
      </div>

      {/* Error Handling Display */}
      {error && (
        <div className="error-message">
          <p>{error}</p>
        </div>
      )}

      {/* Loading State */}
      {loading ? <div className="loading-spinner">Loading...</div> : null}
    </div>
  );
};

export default Signin;
