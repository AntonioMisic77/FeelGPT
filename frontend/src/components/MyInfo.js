import Navbar from "../components/Navbar";
import History from "../components/History";

import Graph from "../components/Graph";
import "../styles/chat.css";
import "../styles/myinfo.css";
import "../styles/darkMode.css";

import React, { useState } from "react";


/* PROBLEMS and TASK
  -> these are not all the settings we need -  think about what we need -> later
  -> no change settings part implemented yet
  -> disconnect from settings list functions - it shoulld be just a list
  -> remove: tick disappear when clicked


   */
const MyInfo = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [cameraConsent, setCameraConsent] = useState(true);
  const [notifications, setNotifications] = useState("daily");
  const [notificationMethod, setNotificationMethod] = useState("push");
  const [language, setLanguage] = useState("EN");

  /* legend */
  const items = [
    "0 - No record",
    "1 - Anger",
    "2 - Disgust",
    "3 - Fear ",
    "4 - Happiness",
    "5 - Sadness",
    "6 - Surprise",
    "7 - Neutral",
  ];

  const toggleCameraConsent = () => setCameraConsent(!cameraConsent);
  const toggleNotifications = (value) => setNotifications(value);
  const toggleNotificationMethod = (value) => setNotificationMethod(value);
  const toggleLanguage = () => setLanguage(language === "EN" ? "FR" : "EN");

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

          {/* Settings */}
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

            {/* Notification Settings */}
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

            {/* Accessibility Settings */}
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
              <button className="button-66-smaller down">
                Manage Settings
              </button>
            </div>
          </div>
        </div>
        {/* <div className="graphs-container">
          
        </div> */}
        <div className="second-container">
          {/* rename -> its upper-second-container */}
          <div className="legend-container">
            <div className="graph-legend-container">
              <Graph />
              <div className="legend">
                <ul className="list">
                  {items.map((item, index) => (
                    <li key={index} className="list-item-legend">
                      <span className="checkmark"></span> {/* Tick symbol */}
                      {item}
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
