import Navbar from "../components/Navbar";
import History from "../components/History";
import Graph from "../components/Graph";
import InfoForm from "../components/InfoForm";

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
        <div className={`info-container ${darkMode ? "dark" : "light"}` }>
          <img
            src="https://thumbs.dreamstime.com/b/default-avatar-profile-flat-icon-social-media-user-vector-portrait-unknown-human-image-default-avatar-profile-flat-icon-184330869.jpg"
            alt="User"
            className="user-picture-profile"
          />
          <p className="username">user.name@gmail.com</p>

          <div className="settings-container">
            <h3 className="section-title">Conversation Reminders</h3>
            <hr className="divider" />
            {/* Camera Settings */}
            <p>How often: daily</p>
            <p> When: 12:00</p>
            <p> How: email</p>
            <h3 className="section-title">Settings</h3>
            <hr className="divider" />
            <p> Language: English</p>
            <p> Respose tone: empathic</p>
            

            <div className="button-right">
              <button className="button-66-smaller manage" onClick={handleOpenOverlay}>
                Update Settings
              </button>
            </div>
          </div>
        </div>

        {/* Overlay Form */}
        {showOverlay && (
          <div className="overlay">
            <div className={`overlay-content ${darkMode ? "dark" : "light"}` }>
              <h3>Update settings</h3>
              <InfoForm darkMode={darkMode}/>
              <div className="update-buttons">
              <button onClick={handleSaveChanges}
              className="summary-button">Save Changes</button>
              <button 
              className="summary-button"
              onClick={() => setShowOverlay(false)}>Close</button>
            </div>
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
