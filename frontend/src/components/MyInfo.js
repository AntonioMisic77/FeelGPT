import Navbar from "../components/Navbar";
import History from "../components/History";
import Graph from "../components/Graph";
import "../styles/chat.css";
import "../styles/myinfo.css";
import "../styles/darkMode.css";

import React, { useState, useEffect } from "react";

const MyInfo = () => {
  const [cameraConsent, setCameraConsent] = useState(true);
  const [notifications, setNotifications] = useState("daily");
  const [notificationMethod, setNotificationMethod] = useState("push");
  const [language, setLanguage] = useState("EN");
  const [showOverlay, setShowOverlay] = useState(false);

  // Initialize dark mode from localStorage or default to false if not set
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem("darkMode");
    return savedMode ? JSON.parse(savedMode) : false;
  });

  // Update localStorage whenever darkMode changes
  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  const toggleCameraConsent = () => setCameraConsent(!cameraConsent);
  const toggleNotifications = (value) => setNotifications(value);
  const toggleNotificationMethod = (value) => setNotificationMethod(value);
  const toggleLanguage = () => setLanguage(language === "EN" ? "FR" : "EN");

  const handleSaveChanges = () => {
    setShowOverlay(false); // Close overlay when saving
  };

  const handleOpenOverlay = () => {
    setShowOverlay(true); // Open overlay
  };

  const items = [];

  return (
    <div className="app-container">
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
      <div className={`info-page-container ${darkMode ? "dark" : "light"}`}>
        <div className="info-container">
          <img
            src="https://thumbs.dreamstime.com/b/default-avatar-profile-flat-icon-social-media-user-vector-portrait-unknown-human-image-default-avatar-profile-flat-icon-184330869.jpg"
            alt="User"
            className="user-picture-profile"
          />
          <p className="username">user.name@gmail.com</p>

          <div className="settings-container">
            <h3 className="section-title">Settings</h3>
            <hr className="divider" />
            {/* Camera Settings */}
            <ul className="settings-list">
              <li
                className={`settings-item ${cameraConsent ? "selected" : ""}`}
                onClick={toggleCameraConsent}
              >
                {cameraConsent && <span className="tick">✓</span>} Use Camera
              </li>
            </ul>
            <h3 className="section-title">Notification Settings</h3>
            <hr className="divider" />
            <ul className="settings-list">
              <li
                className={`settings-item ${
                  notifications === "daily" ? "selected" : ""
                }`}
                onClick={() => toggleNotifications("daily")}
              >
                {notifications === "daily" && <span className="tick">✓</span>}{" "}
                Daily Notifications
              </li>
              <li
                className={`settings-item ${
                  notificationMethod === "push" ? "selected" : ""
                }`}
                onClick={() => toggleNotificationMethod("push")}
              >
                {notificationMethod === "push" && (
                  <span className="tick">✓</span>
                )}{" "}
                Push Notifications
              </li>
            </ul>
            <h3 className="section-title">Accessibility Settings</h3>
            <hr className="divider" />
            <ul className="settings-list">
              <li
                className={`settings-item ${
                  language === "EN" ? "selected" : ""
                }`}
                onClick={toggleLanguage}
              >
                {language === "EN" && <span className="tick">✓</span>} English
              </li>
              <li
                className={`settings-item ${!darkMode ? "selected" : ""}`}
                onClick={() => setDarkMode(!darkMode)}
              >
                {!darkMode && <span className="tick">✓</span>} Light Mode
              </li>
            </ul>

            <div className="button-right">
              <button className="button-66-smaller manage" onClick={handleOpenOverlay}>
                Manage Settings
              </button>
            </div>
          </div>
        </div>

        {/* Overlay Form */}
        {showOverlay && (
          <div className="overlay">
            <div className="overlay-content">
              <h3>Manage Settings</h3>
              
              <button onClick={handleSaveChanges}>Save Changes</button>
              <button onClick={() => setShowOverlay(false)}>Close</button>
            </div>
          </div>
        )}

        <div className="second-container">
          <div className="legend-container">
            <div className="graph-legend-container">
              <Graph />
              <div className="legend">
                <ul className="list">
                  {items.map((item, index) => (
                    <li key={index} className="list-item-legend">
                      <span className="checkmark"></span> {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <History darkMode={darkMode} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyInfo;
