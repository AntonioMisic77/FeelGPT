// src/pages/MyInfo.js

import React, { useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance"; // Import axiosInstance
import Navbar from "../components/Navbar";
import History from "../components/History";
import Graph from "../components/Graph";
import InfoForm from "../components/InfoForm";

import "../styles/chat.css";
import "../styles/myinfo.css";
import "../styles/darkMode.css";

const MyInfo = () => {
  // State variables
  const [cameraConsent, setCameraConsent] = useState(true);
  const [notifications, setNotifications] = useState("NEVER");
  const [notificationMethod, setNotificationMethod] = useState("EMAIL");
  const [language, setLanguage] = useState("English");
  const [showOverlay, setShowOverlay] = useState(false);

  // Additional state variables for user info
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [notificationTime, setNotificationTime] = useState(null);
  const [responseTone, setResponseTone] = useState("NEUTRAL");

  // New state for selectedDay
  const [selectedDay, setSelectedDay] = useState("");

  // Initialize dark mode from localStorage or default to false if not set
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem("darkMode");
    return savedMode ? JSON.parse(savedMode) : false;
  });

  // State variables for loading and error
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Update localStorage whenever darkMode changes
  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  // Fetch user info on component mount
  useEffect(() => {
    const fetchUserInfo = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          throw new Error("No auth token found");
        }
        const payloadBase64 = token.split('.')[1];
        const decodedPayload = JSON.parse(atob(payloadBase64));

        const response = await axiosInstance.get("/user/auth/me", {
          params: {
            id: decodedPayload.userId
          }
        });

        const data = response.data.result;

        // Update state variables with response data
        setUsername(data.username);
        setEmail(data.email);
        setProfileImage(`data:image/png;base64,${data.profileImage}`);
        setNotifications(data.notificationFrequency);
        setNotificationMethod(data.notificationMode);
        setNotificationTime(data.notificationTime);
        setResponseTone(data.responseTone);
        // Uncomment if available
        // setCameraConsent(data.cameraConsent);
        // setLanguage(data.language);
      } catch (err) {
        console.error("Error fetching user info:", err);
        const backendMessage = err.response?.data?.message;
        setError(backendMessage || "Failed to load user information.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  const toggleCameraConsent = () => setCameraConsent(!cameraConsent);
  const toggleNotifications = (value) => setNotifications(value);
  const toggleNotificationMethod = (value) => setNotificationMethod(value);
  const toggleLanguage = () => setLanguage(language === "EN" ? "FR" : "EN");

  const formatTime = (date) => {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const setNotificationTimeCustom = (time) => {
    const [hours, minutes] = time.split(":").map(Number);
    const reminderTime = new Date();
    reminderTime.setHours(hours, minutes);
    setNotificationTime(reminderTime);
  }

  const handleSaveChanges = async () => {
    setError(null);
    setLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("No auth token found");
      }

      const payloadBase64 = token.split('.')[1];
      const decodedPayload = JSON.parse(atob(payloadBase64));
      const userId = decodedPayload.userId;

      const updatedData = {
        cameraConsent,
        notificationFrequency: notifications,
        notificationMode: notificationMethod,
        language,
        responseTone,
        email,
        notificationTime : notificationTime,
        selectedDay, // Include selectedDay if needed
        // Include other fields if necessary
      };

      await axiosInstance.put("/user/auth/update", updatedData, {
        params: { id: userId },
      });

      setShowOverlay(false);
      // Optionally fetch updated data or show success message
    } catch (err) {
      console.error("Error updating user info:", err);
      const backendMessage = err.response?.data?.message;
      setError(backendMessage || "Failed to update settings. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenOverlay = () => {
    setShowOverlay(true);
  };

  const handleCloseOverlay = () => {
    setShowOverlay(false);
  };

  return (
    <div className="app-container">
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
      <div className={`info-page-container ${darkMode ? "dark" : "light"}`}>
        <div className={`info-container ${darkMode ? "dark" : "light"}`}>
          <img
            src={
              profileImage ||
              "https://thumbs.dreamstime.com/b/default-avatar-profile-flat-icon-social-media-user-vector-portrait-unknown-human-image-default-avatar-profile-flat-icon-184330869.jpg"
            }
            alt="User"
            className="user-picture-profile"
          />
          <p className="username">{email || username}</p>

          <div className="settings-container">
            <h3 className="section-title">Conversation Reminders</h3>
            <hr className="divider" />
            <p>How often: {notifications}</p>
            <p>
              When:{" "}
              {notificationTime
                ? new Date(notificationTime).toLocaleString()
                : "N/A"}
            </p>
            <p>How: {notificationMethod}</p>
            <h3 className="section-title">Settings</h3>
            <hr className="divider" />
            <p>Language: {language}</p>
            <p>Response tone: {responseTone}</p>

            <div className="button-right">
              <button
                className="button-66-smaller manage"
                onClick={handleOpenOverlay}
              >
                Update Settings
              </button>
            </div>
          </div>
        </div>

        {/* Overlay Form */}
        {showOverlay && (
          <div className="overlay">
            <div className={`overlay-content ${darkMode ? "dark" : "light"}`}>
              <h3>Update Settings</h3>
              <InfoForm
                email={email}
                setEmail={setEmail}
                selectedDay={selectedDay}
                setSelectedDay={setSelectedDay}
                cameraConsent={cameraConsent}
                setCameraConsent={setCameraConsent}
                notifications={notifications}
                setNotifications={setNotifications}
                notificationMethod={notificationMethod}
                setNotificationMethod={setNotificationMethod}
                language={language}
                setLanguage={setLanguage}
                darkMode={darkMode}
                responseTone={responseTone}
                setResponseTone={setResponseTone}
                notificationTime={notificationTime}
                setNotificationTime={setNotificationTimeCustom}
              />
              <div className="update-buttons">
                <button
                  onClick={handleSaveChanges}
                  className="summary-button"
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Save Changes"}
                </button>
                <button
                  className="summary-button"
                  onClick={handleCloseOverlay}
                  disabled={loading}
                >
                  Close
                </button>
              </div>
              {error && (
                <div className="error-message">
                  <p>{error}</p>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="second-container">
          <div className="legend-container">
            <div className="graph-legend-container">
              <Graph />
              <div className="legend">
                <ul className="list">
                  {/* Legend items */}
                </ul>
              </div>
            </div>
            <History darkMode={darkMode} />
          </div>
        </div>
      </div>

      {/* Error Handling Display */}
      {error && !showOverlay && (
        <div className="error-message">
          <p>{error}</p>
        </div>
      )}

      {/* Loading State */}
      {loading && !showOverlay && (
        <div className="loading-spinner">Loading...</div>
      )}
    </div>
  );
};

export default MyInfo;
