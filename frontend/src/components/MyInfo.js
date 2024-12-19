import React, { useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance"; // Import axiosInstance
import Navbar from "../components/Navbar";
import History from "../components/History";
import Graph from "../components/Graph";
import MoodTracker from "../components/MoodTracker";
import InfoForm from "../components/InfoForm";
import "../styles/chat.css";
import "../styles/myinfo.css";
import "../styles/darkMode.css";

const MyInfo = () => {
  const [cameraConsent, setCameraConsent] = useState(true);
  const [notifications, setNotifications] = useState("NEVER");
  const [notificationMethod, setNotificationMethod] = useState("EMAIL");
  const [language, setLanguage] = useState("English");
  const [showOverlay, setShowOverlay] = useState(false);

  const [username, setUsername] = useState("username");
  const [email, setEmail] = useState("email");
  const [profileImage, setProfileImage] = useState("");
  const [notificationTime, setNotificationTime] = useState(null);
  const [responseTone, setResponseTone] = useState("NEUTRAL");
  const [selectedDay, setSelectedDay] = useState("");

  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem("darkMode");
    return savedMode ? JSON.parse(savedMode) : false;
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [currentComponentIndex, setCurrentComponentIndex] = useState(0);

  const components = [
    { name: "Graph", component: <Graph /> },
    { name: "History", component: <History darkMode={darkMode} /> },
    { name: "Mood Tracker", component: <MoodTracker /> },
  ];

  useEffect(() => {
    const fetchUserInfo = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("authToken");
        if (!token) throw new Error("No auth token found");

        const payloadBase64 = token.split(".")[1];
        const decodedPayload = JSON.parse(atob(payloadBase64));

        const response = await axiosInstance.get("/user/auth/me", {
          params: { id: decodedPayload.userId },
        });

        const data = response.data.result;

        setUsername(data.username);
        setEmail(data.email);
        setProfileImage(`data:image/png;base64,${data.profileImage}`);
        setNotifications(data.notificationFrequency);
        setNotificationMethod(data.notificationMode);
        setNotificationTime(data.notificationTime);
        setResponseTone(data.responseTone);
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

  const handleComponentChange = (index) => {
    setCurrentComponentIndex(index);
  };

  const handleSaveChanges = async () => {
    setError(null);
    setLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("No auth token found");

      const payloadBase64 = token.split(".")[1];
      const decodedPayload = JSON.parse(atob(payloadBase64));
      const userId = decodedPayload.userId;

      const updatedData = {
        username,
        cameraConsent,
        notificationFrequency: notifications,
        notificationMode: notificationMethod,
        language,
        responseTone,
        email,
        notificationTime,
        selectedDay,
      };

      await axiosInstance.put("/user/auth/update", updatedData, {
        params: { id: userId },
      });

      setShowOverlay(false);
    } catch (err) {
      console.error("Error updating user info:", err);
      const backendMessage = err.response?.data?.message;
      setError(backendMessage || "Failed to update settings. Please try again.");
    } finally {
      setLoading(false);
    }
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
          <p className="username">{username}</p>
          <p className="email">{email}</p>
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
                className="summary-button"
                onClick={() => setShowOverlay(true)}
              >
                Update Settings
              </button>
            </div>
          </div>
        </div>

        

        {/* Top Navigation for Carousel */}
        <div className="carousel-container">
        <div className="carousel-navigation">
          {components.map((item, index) => (
            <button
              key={index}
              className={`carousel-tab ${
                currentComponentIndex === index ? "active" : ""
              }`}
              onClick={() => handleComponentChange(index)}
            >
              {item.name}
            </button>
          ))}
        </div>

        {/* Display the selected component */}
        <div className="carousel-content">
          {components[currentComponentIndex].component}
        </div>
        </div>
      </div>

      {loading && !showOverlay && <div className="loading-spinner">Loading...</div>}
      {error && !showOverlay && (
        <div className="error-message">
          <p>{error}</p>
        </div>
      )}

{showOverlay && (
          <div className="overlay">
            <div className={`overlay-content ${darkMode ? "dark" : "light"}`}>
              <h3>Update Settings</h3>
              <InfoForm
                email={email}
                setEmail={setEmail}
                selectedDay={selectedDay}
                username={username}
                setUsername={setUsername}
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
                setNotificationTime={(time) =>
                  setNotificationTime(new Date(time))
                }
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
                  onClick={() => setShowOverlay(false)}
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
    </div>

    
  );
};

export default MyInfo;
