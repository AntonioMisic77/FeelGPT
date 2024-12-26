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
  const [notifications, setNotifications] = useState("WEEKLY");
  //const [notificationMethod, setNotificationMethod] = useState("EMAIL");
  const [language, setLanguage] = useState("English");
  const [showOverlay, setShowOverlay] = useState(false);

  const [username, setUsername] = useState("username");
  const [email, setEmail] = useState("email");
  const [profileImage, setProfileImage] = useState("");
  const [notificationTime, setNotificationTime] = useState(null);
  const [responseTone, setResponseTone] = useState("NEUTRAL");
  const [selectedDay, setSelectedDay] = useState("");
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 600);
  const [showSettingsOverlay, setShowSettingsOverlay] = useState(false);


  // Initialize dark mode based on local storage or default to false
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem("darkMode");
    return savedMode ? JSON.parse(savedMode) : false;
  });
    // Update local storage whenever darkMode changes
    useEffect(() => {
      localStorage.setItem("darkMode", JSON.stringify(darkMode));
    }, [darkMode]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [currentComponentIndex, setCurrentComponentIndex] = useState(0);

  const components = [
    { name: "Graph", component: <Graph /> },
    { name: "History", component: <History darkMode={darkMode} /> },
    { name: "Mood Tracker", component: <MoodTracker /> },
  ];

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 600);
    };

    window.addEventListener("resize", handleResize);

    // Cleanup listener on unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

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
        setProfileImage(
          data.profileImage
            ? `data:image/png;base64,${data.profileImage}`
            : "https://thumbs.dreamstime.com/b/default-avatar-profile-flat-icon-social-media-user-vector-portrait-unknown-human-image-default-avatar-profile-flat-icon-184330869.jpg"
        );
        setNotifications(data.notificationFrequency);
        /* setNotificationMethod(data.notificationMode); */
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

  const setNotificationTimeCustom = (time) => {
    const [hours, minutes] = time.split(":").map(Number);
    const reminderTime = new Date();
    reminderTime.setHours(hours, minutes);
    setNotificationTime(reminderTime);
  };

  const setNotificationDayCustom = (day) => {
    if (notifications !== "WEEKLY") setSelectedDay(null);
    else setSelectedDay(day);
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
        //notificationMode: notificationMethod,
        language,
        responseTone,
        email,
        notificationTime: notificationTime,
        selectedDay,
      };

      await axiosInstance.put("/user/auth/update", updatedData, {
        params: { id: userId },
      });

      setShowOverlay(false);
    } catch (err) {
      console.error("Error updating user info:", err);
      const backendMessage = err.response?.data?.message;
      setError(
        backendMessage || "Failed to update settings. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <Navbar
        darkMode={darkMode}
        setDarkMode={() => setDarkMode((prev) => !prev)}
      />
      <div className={`info-page-container ${darkMode ? "dark" : "light"}`}>
        {/* my-info button */}
        {isSmallScreen && (
          <div className="my-info-button">
            <button
              onClick={() => setShowOverlay(!showOverlay)}
              className="summary-button"
            >
              My Info
            </button>
          </div>
        )}
        {showOverlay && isSmallScreen && (
          <div className="overlay" onClick={() => setShowOverlay(false)}></div>
        )}
        <div
          className={`info-container ${darkMode ? "dark" : "light"} ${
            isSmallScreen && showOverlay ? "show-overlay" : ""
          }`}
        >
          <div className="picture-profile">
            <img
              src={
                profileImage ||
                "https://thumbs.dreamstime.com/b/default-avatar-profile-flat-icon-social-media-user-vector-portrait-unknown-human-image-default-avatar-profile-flat-icon-184330869.jpg"
              }
              alt="User"
              className="user-picture-profile"
            />
          </div>
          <p className="username">{username}</p>
          <p className="email">{email}</p>
          <div className="settings-container">
            <div className="reminder-frequency">
              <label>Conversation Reminders</label>
              <input
                type="range"
                className="win10-thumb myinfo"
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
                disabled
              />
              <div className="reminder-labels">
                <span>Never</span>
                <span>Daily</span>
                <span>Weekly</span>
              </div>
            </div>
            {(notifications === "DAILY" || notifications === "WEEKLY") && (
              <div>
                <div className="email-choice">
                  <img
                    src={"images/email.png"}
                    alt="email"
                    className="email-icon"
                  />
                  <div style={{ color: "gray" }}>email</div>
                </div>
                <div className="email-choice">
                  <img
                    src={"images/clock.webp"}
                    alt="clock"
                    className="clock-icon"
                  />
                  <div style={{ color: "gray" }}>
                    {" "}
                    {notificationTime
                      ? new Date(notificationTime).toLocaleString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "N/A"}
                  </div>
                </div>
              </div>
            )}
            {notifications === "WEEKLY" && (
              <div>
                <div className="email-choice">
                  <img
                    src={"images/calendar.png"}
                    alt="calendar"
                    className="clock-icon"
                  />
                  <div style={{ color: "gray" }}>
                    {" "}
                    {notificationTime
                      ? new Date(notificationTime).toLocaleDateString([], {
                          weekday: "long",
                        })
                      : "N/A"}
                  </div>
                </div>
              </div>
            )}

            {/* <h3 className="section-title">Settings</h3>
            <hr className="divider" />
            <p>Language: {language}</p> */}
            <div className="reminder-frequency">
              <label>Response Tone</label>
              <input
                type="range"
                className="win10-thumb myinfo"
                min="1"
                max="3"
                value={
                  notifications === "EMPATHETIC"
                    ? 1
                    : notifications === "NEUTRAL"
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
                disabled
              />
              <div className="reminder-labels">
                <span>Empathetic</span>
                <span>Neutral</span>
                <span>Professional</span>
              </div>
            </div>

            <div className="button-down">
              <button
                className="summary-button update"
                onClick={() => setShowSettingsOverlay(true)}
              >
                Update Settings
              </button>
              <button
                className="summary-button update"
                onClick={() => setShowOverlay(false)}
              >
                Close
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

      {loading && !showOverlay && (
        <div className="loading-spinner">Loading...</div>
      )}
      {error && !showOverlay && (
        <div className="error-message">
          <p>{error}</p>
        </div>
      )}

      {showSettingsOverlay && (
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
              //notificationMethod={notificationMethod}
              //setNotificationMethod={setNotificationMethod}
              //language={language}
              //setLanguage={setLanguage}
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
                onClick={() => setShowSettingsOverlay(false)}
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
