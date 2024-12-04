import React, { useState } from "react";
import "../styles/form.css";

const InfoForm = (darkMode) => {
  const [email, setEmail] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [responseTone, setResponseTone] = useState("neutral");
  const [reminderFrequency, setReminderFrequency] = useState("never");
  const [reminderTime, setReminderTime] = useState("");
  const [selectedDay, setSelectedDay] = useState(""); // Single day selection
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(""); // Language selection
  const [selectedReminderType, setSelectedReminderType] = useState("email"); // Reminder type (email or radio)

  const handleDaySelection = (e) => {
    setSelectedDay(e.target.value); // Update to a single selected day
  };

  const handleLanguageSelection = (e) => {
    setSelectedLanguage(e.target.value); // Update selected language
  };

  const handleReminderTypeSelection = (e) => {
    setSelectedReminderType(e.target.value); // Update selected reminder type
  };

  const handleSavePassword = () => {
    setIsChangingPassword(false);
    setOldPassword("");
    setNewPassword("");
    setRepeatPassword("");
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

        {!isChangingPassword && (
          <button
            type="button"
            className="change-password-button"
            onClick={() => setIsChangingPassword(true)}
          >
            I want to change my password
          </button>
        )}

        {isChangingPassword && (
          <div className="password-change">
            <div className="input-group">
              <input
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                required
              />
              <label>Old Password</label>
            </div>
            <div className="input-group">
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <label>New Password</label>
            </div>
            <div className="input-group">
              <input
                type="password"
                value={repeatPassword}
                onChange={(e) => setRepeatPassword(e.target.value)}
                required
              />
              <label>Repeat New Password</label>
            </div>
            <button
              type="button-update"
              className="summary-button wider"
              onClick={handleSavePassword}
            >
              Save my password
            </button>
          </div>
        )}
      </div>

      <div className="info-two">
        <div className="languages">
          <label>Select Language:</label>
          <select
            value={selectedLanguage}
            onChange={handleLanguageSelection}
            className={`form-control ${darkMode ? "dark" : "light"}`}
          >
            <option value="">Select language</option>
            {["English", "French", "Italian", "German"].map((language) => (
              <option key={language} value={language}>
                {language}
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

        {reminderFrequency === "daily" || reminderFrequency === "weekly" ? (
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
                className={`form-control ${darkMode ? "dark" : "light"}`}

                type="time"
                value={reminderTime}
                onChange={(e) => setReminderTime(e.target.value)}
              />
            </div>
          </div>
        ) : null}

        {reminderFrequency === "weekly" && (
          <div className="week">
            <label>Select Day:</label>
            <div className="week-picker">
              <select
              
                value={selectedDay}
                onChange={handleDaySelection}
                className={`form-control ${darkMode ? "dark" : "light"}`}
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
  );
};

export default InfoForm;
