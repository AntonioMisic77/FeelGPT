// src/components/InfoForm.js

import React from "react";
import "../styles/form.css";

const InfoForm = ({
  email,
  setEmail,
  selectedDay,
  setSelectedDay,
  cameraConsent,
  setCameraConsent,
  notifications,
  setNotifications,
  notificationMethod,
  setNotificationMethod,
  language,
  setLanguage,
  darkMode,
  responseTone,
  setResponseTone,
  notificationTime,
  setNotificationTime,
}) => {

  const handleDaySelection = (e) => {
    setSelectedDay(e.target.value); // Update to a single selected day
  };

  const handleLanguageSelection = (e) => {
    setLanguage(e.target.value); // Update selected language
  };

  const handleReminderTypeSelection = (e) => {
    setNotificationMethod(e.target.value); // Update selected reminder type
  };

  return (
    <div className={`settings-form ${darkMode ? "dark" : "light"}`}>
      <div className="info-one">
        <div className="input-group">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <label>email address</label>
        </div>

        {/* Password change logic can be handled similarly if needed */}
        {/* If password change is managed here, you might need to pass additional props */}
      </div>

      <div className="info-two">
        <div className="languages">
          <label>Select Language:</label>
          <select
            value={language}
            onChange={handleLanguageSelection}
            className={`form-control ${darkMode ? "dark" : "light"}`}
          >
            <option value="">Select language</option>
            {["English", "French", "Italian", "German"].map((lang) => (
              <option key={lang} value={lang}>
                {lang}
              </option>
            ))}
          </select>
        </div>

        <div className="preferences">
          <label>Response Tone</label>
          <input
            className="win10-thumb"
            type="range"
            min="1"
            max="3"
            value={
              responseTone === "EMPATHETIC"
                ? 1
                : responseTone === "NEUTRAL"
                  ? 2
                  : 3
            }
            onChange={(e) => {
              const value = parseInt(e.target.value);
              setResponseTone(
                value === 1
                  ? "EMPATHETIC"
                  : value === 2
                    ? "NEUTRAL"
                    : "PROFESSIONAL"
              );
            }}
          />
          <div className="tone-labels">
            <span>Empathetic</span>
            <span>Neutral</span>
            <span>Professional</span>
          </div>
        </div>

        <div className="reminder-frequency">
          <label>Conversation Reminders</label>
          <input
            type="range"
            className="win10-thumb"
            min="1"
            max="3"
            value={
              notifications === "NEVER"
                ? 1
                : notifications === "DAILY"
                  ? 2
                  : 3
            }
            onChange={(e) => {
              const value = parseInt(e.target.value);
              setNotifications(
                value === 1 ? "NEVER" : value === 2 ? "DAILY" : "WEEKLY"
              );
            }}
          />
          <div className="reminder-labels">
            <span>Never</span>
            <span>Daily</span>
            <span>Weekly</span>
          </div>
        </div>

        {(notifications === "DAILY" || notifications === "WEEKLY") && (
          <div>
            {/* Reminder Type Radio Buttons */}
            <div className="reminder-type">
              <label>Select Reminder Type:</label>
              <div className="radio-buttons">
                <label>
                  <input
                    type="radio"
                    value="EMAIL"
                    checked={notificationMethod === "EMAIL"}
                    onChange={handleReminderTypeSelection}
                  />
                  Email
                </label>
                <label>
                  <input
                    type="radio"
                    value="PUSH_NOTIFICATION"
                    checked={notificationMethod === "PUSH_NOTIFICATION"}
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
                className={`form-control ${darkMode ? "dark" : "light"}`}
                type="time"
                value={notificationTime}
                onChange={(e) => setNotificationTime(e.target.value)}
              />
            </div>
          </div>
        )}

        {notifications === "WEEKLY" && (
          <div className="week">
            <label>Select Day:</label>
            <div className="week-picker">
              <select
                value={selectedDay}
                onChange={handleDaySelection}
                className={`form-control ${darkMode ? "dark" : "light"}`}
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
      </div>
    </div>
  );
};

export default InfoForm;
