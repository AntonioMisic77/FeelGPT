// src/components/InfoForm.js
import React, { useState } from "react";
import "../styles/form.css";
import axiosInstance from "../api/axiosInstance";

const InfoForm = ({
  email,
  localUsername,
  setLocalUsername,
  localSelectedDay,
  setLocalSelectedDay,
  localNotifications,
  setLocalNotifications,
  darkMode,
  localResponseTone,
  setLocalResponseTone,
  localNotificationTime,
  setLocalNotificationTime,
}) => {
  // Password change states
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  //console.log('updating time to:', localNotificationTime);

  const handleSavePassword = async () => {
    setPasswordError("");
    setPasswordSuccess("");

    if (newPassword !== repeatPassword) {
      setPasswordError("New password and repeat password do not match.");
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters long.");
      return;
    }

    try {
      // Make a POST request to change the password
      const response = await axiosInstance.post("user/auth/change-password", {
        oldPassword,
        newPassword,
      });

      if (response.data.status === "ok") {
        setPasswordSuccess("Password updated successfully.");
        setIsChangingPassword(false);
        setOldPassword("");
        setNewPassword("");
        setRepeatPassword("");
      } else {
        setPasswordError(response.data.message || "Failed to update password.");
      }
    } catch (error) {
      console.error("Error updating password:", error);
      if (error.response && error.response.data && error.response.data.message) {
        setPasswordError(error.response.data.message);
      } else {
        setPasswordError("An error occurred. Please try again later.");
      }
    }
  };

  const handleDaySelection = (e) => {
    setLocalSelectedDay(e.target.value);
  };

  const isoToTimeFormat = (isoString) => {
    //console.log('before: ', isoString);
    const date = new Date(isoString);
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    //console.log('after: ', `${hours}:${minutes}`);
    return `${hours}:${minutes}`;
  };

  return (
    <div className={`settings-form ${darkMode ? "dark" : "light"}`}>
      <div className="info-one">
        <div className="input-group">
          <div>
            <input
              type="email"
              value={email}
              required
              readOnly
              className="readonly-email"
            />
            <label>Email Address</label>
          </div>
          <div>
            <input
              type="username"
              value={localUsername}
              onChange={(e) => setLocalUsername(e.target.value)}
              required
              className="update-username"
            />
            <label>Username</label>
          </div>
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
            <div className="input-group" style={{ marginBottom: "10px" }}>
              <input
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                required
              />
              <label>Old Password</label>
            </div>
            <div className="input-group" style={{ marginBottom: "10px" }}>
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
            {passwordError && <p className="error-message">{passwordError}</p>}
            {passwordSuccess && (
              <p className="success-message">{passwordSuccess}</p>
            )}
            <button
              type="button"
              className="summary-button wider"
              onClick={handleSavePassword}
            >
              Save my password
            </button>
          </div>
        )}
        {!isChangingPassword && passwordSuccess && (
          <p className="success-message">{passwordSuccess}</p>
        )}
      </div>

      <div className="info-two">
        {/* Existing preference settings */}
        <div className="preferences">
          <label>Response Tone</label>
          <input
            className="win10-thumb"
            type="range"
            min="1"
            max="3"
            value={
              localResponseTone === "EMPATHETIC"
                ? 1
                : localResponseTone === "NEUTRAL"
                  ? 2
                  : 3
            }
            onChange={(e) => {
              const value = parseInt(e.target.value);
              setLocalResponseTone(
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
              localNotifications === "NEVER"
                ? 1
                : localNotifications === "DAILY"
                  ? 2
                  : 3
            }
            onChange={(e) => {
              const value = parseInt(e.target.value);
              setLocalNotifications(
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

        {(localNotifications === "DAILY" ||
          localNotifications === "WEEKLY") && (
            <div>
              <div className="time-picker">
                <label>Pick a Time:</label>
                <input
                  className={`form-control ${darkMode ? "dark" : "light"}`}
                  type="time"
                  value={localNotificationTime ? isoToTimeFormat(localNotificationTime) : ""}
                  onChange={(e) => {
                    const timeString = e.target.value; // "HH:mm"
                    if (!timeString) return; // Prevent invalid changes

                    const [hours, minutes] = timeString.split(":").map(Number);
                    if (isNaN(hours) || isNaN(minutes)) return; // Guard against invalid numbers

                    const date = new Date(localNotificationTime || Date.now());
                    date.setHours(hours, minutes, 0, 0);
                    setLocalNotificationTime(date.toISOString());
                  }}
                />
              </div>
            </div>
          )}

        {localNotifications === "WEEKLY" && (
          <div className="week">
            <label>Select Day:</label>
            <div className="week-picker">
              <select
                value={localSelectedDay}
                onChange={handleDaySelection}
                className={`form-control ${darkMode ? "dark" : "light"}`}
              >
                <option className="option-form" value="">
                  Select a day
                </option>
                {[
                  "MONDAY",
                  "TUESDAY",
                  "WEDNESDAY",
                  "THURSDAY",
                  "FRIDAY",
                  "SATURDAY",
                  "SUNDAY",
                ].map((day) => (
                  <option className="option-form" key={day} value={day}>
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
