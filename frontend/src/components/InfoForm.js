// src/components/InfoForm.js
import React, { useState } from "react";
import "../styles/form.css";

const InfoForm = ({
  email,
  localUsername,
  setLocalUsername,
  localSelectedDay,
  setLocalSelectedDay,
  localNotifications,
  setLocalNotifications,
  // REMOVED NOTIFICATION METHOD AND LANGUAGE
  darkMode,
  localResponseTone,
  setLocalResponseTone,
  localNotificationTime,
  setLocalNotificationTime,
}) => {
  //ADDED FOR CHANGE PASSWORD
  // checking if the old from db (storedPassword) matches oldPAssword from input (done)
  // checking if repeat and new password in the same (done)
  // need to connect storedPassword
  // need to save newPassword to db
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  // in "storedPassword" should be value of users password from db
  let storedPassword = "mypassword";

  console.log('updating time to:',localNotificationTime  )
  const handleSavePassword = () => {
    setPasswordError("");
    setPasswordSuccess("");

    if (oldPassword !== storedPassword) {
      setPasswordError("Old password is incorrect.");
      return;
    }

    if (newPassword !== repeatPassword) {
      setPasswordError("New password and repeat password do not match.");
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters long.");
      return;
    }

    setPasswordSuccess("Password updated successfully.");
    setIsChangingPassword(false);
    setOldPassword("");
    setNewPassword("");
    setRepeatPassword("");
  };

  const handleDaySelection = (e) => {
    setLocalSelectedDay(e.target.value);
    //setNotificationDayCustom(e.target.value); // Update to a single selected day
  };

  const isoToTimeFormat = (isoString) => {
    console.log('before: ',isoString);
    const date = new Date(isoString);
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    console.log('after: ',`${hours}:${minutes}`);
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
        {/* <div className="languages">
          <label>Select Language:</label>
          <select
            value={language}
            onChange={handleLanguageSelection}
            className={`form-control ${darkMode ? "dark" : "light"}`}
          >
            <option className="option-form" value="">
              Select language
            </option>
            {["English", "French", "Italian", "German"].map((language) => (
              <option className="option-form" key={language} value={language}>
                {language}
              </option>
            ))}
          </select>
        </div> */}

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
            {/* Reminder Type Radio Buttons */}
            {/* <div className="reminder-type">
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
            </div> */}

            {/* Pick Time for Daily/Weekly Reminders */}
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
