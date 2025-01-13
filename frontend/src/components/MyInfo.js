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

import Cookies from "js-cookie"; // Import js-cookie

const MyInfo = () => {
  const [notifications, setNotifications] = useState("WEEKLY");
  //const [notificationMethod, setNotificationMethod] = useState("EMAIL");
  const [showOverlay, setShowOverlay] = useState(false);
  const [success, setSuccess] = useState(null);


  const [username, setUsername] = useState("username");
  const [email, setEmail] = useState("email");
  const [profileImage, setProfileImage] = useState("");
  const [notificationTime, setNotificationTime] = useState(null);
  const [responseTone, setResponseTone] = useState("NEUTRAL");
  const [selectedDay, setSelectedDay] = useState("");
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 600);
  const [showSettingsOverlay, setShowSettingsOverlay] = useState(false);

  // New state variables for profile picture
  const [imageExtension, setImageExtension] = useState(""); // To store file extension
  // Handler for image file selection
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result.split(",")[1]; // Extract base64 string
        const extension = file.type.split("/")[1]; // Extract file extension
  
        try {
          const token = Cookies.get("authToken"); // Retrieve token from cookies
          if (!token) throw new Error("No auth token found");
  
          const payloadBase64 = token.split(".")[1];
          const decodedPayload = JSON.parse(atob(payloadBase64));
          const userId = decodedPayload.userId;
  
          const updatedData = {
            profileImage: base64String, // Use the base64 string directly
           // imageExtension: extension, // Uneccessary since we're storing the base64 string
          };
  
          // Send the updated data to the server
          await axiosInstance.put("/user/auth/update", updatedData, {
            params: { id: userId },
          });
          console.log('updatedData:', updatedData)
          // Update local state only after a successful response
          setProfileImage(`data:image/${extension};base64,${base64String}`);
          setImageExtension(extension);
  
          console.log("Profile image updated successfully");
        } catch (err) {
          console.error("Error updating user image:", err);
          const backendMessage = err.response?.data?.message;
          setError(
            backendMessage || "Failed to update image. Please try again."
          );
        }
      };
  
      reader.readAsDataURL(file); // Start reading the file
    }
  };
  

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
    { name: "History", component: <History darkMode={darkMode} /> },
    { name: "Mood Tracker", component: <MoodTracker darkMode={darkMode} /> },
    
    { name: "Graph", component: <Graph /> },
    
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
        const token = Cookies.get("authToken"); // Retrieve token from cookies
        if (!token) throw new Error("No auth token found");

        const payloadBase64 = token.split(".")[1];
        const decodedPayload = JSON.parse(atob(payloadBase64));

        const response = await axiosInstance.get("/user/auth/me", {
          params: { id: decodedPayload.userId },
        });

        const data = response.data.result;
        //
        // console.log("data:", data);

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
        setSelectedDay(data.notificationDayOfWeek);
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

  const setNotificationDayCustom = (day) => {
    if (notifications !== "WEEKLY") setSelectedDay(null);
    else setSelectedDay(day);
  };

  const handleSaveChanges = async () => {
    setError(null);
    setLoading(true);

    try {
      const token = Cookies.get("authToken"); // Retrieve token from cookies
      if (!token) throw new Error("No auth token found");

      const payloadBase64 = token.split(".")[1];
      const decodedPayload = JSON.parse(atob(payloadBase64));
      const userId = decodedPayload.userId;

      const updatedData = {
        username: localUsername,
        notificationFrequency: localNotifications,
        //notificationMode: notificationMethod,
        responseTime: localResponseTone,
        notificationTime: localNotificationTime,
      };
      // if reminderFrequency is weekly, add notificationDayOfWeek
      if (localNotifications === "WEEKLY" && localSelectedDay) {
        updatedData.notificationDayOfWeek = localSelectedDay;
      }

      //console.log("updatedData:", updatedData);

      await axiosInstance.put("/user/auth/update", updatedData, {
        params: { id: userId },
      });

      setShowSettingsOverlay(false);

      
      setUsername(localUsername);
      setNotifications(localNotifications);
      setResponseTone(localResponseTone);
      setNotificationDayCustom(localSelectedDay);
      setNotificationTime(localNotificationTime);
      setSelectedDay(localSelectedDay);

      //console.log("overlay ugasen");

      setSuccess("Settings updated successfully.");

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

  /* const handleSave = () => {
    // Update parent state with the new values
    setUsername(localUsername);
    setNotifications(localNotifications);
    setResponseTone(localResponseTone);
    setNotificationDayCustom(localSelectedDay);
    setNotificationTime(localNotificationTime);
  }; */

  const [localUsername, setLocalUsername] = useState(username);
  const [localNotifications, setLocalNotifications] = useState(notifications);
  const [localResponseTone, setLocalResponseTone] = useState(responseTone);
  const [localSelectedDay, setLocalSelectedDay] = useState(selectedDay);
  const [localNotificationTime, setLocalNotificationTime] =
    useState(notificationTime);

  useEffect(() => {
    setLocalUsername(username);
  }, [username]);
  useEffect(() => {
    setLocalNotifications(notifications);
  }, [notifications]);
  useEffect(() => {
    setLocalResponseTone(responseTone);
  }, [responseTone]);
  useEffect(() => {
    setLocalSelectedDay(selectedDay);

    console.log(selectedDay);
  }, [selectedDay]);
  useEffect(() => {
    setLocalNotificationTime(notificationTime);
    //console.log(typeof notificationTime);
  }, [notificationTime]);

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
          <div className="picture-profile-2">
  <div className="picture-profile" style={{ position: "relative" }}>
    {/* Image as the button */}
    <img
      src={
        profileImage ||
        "https://thumbs.dreamstime.com/b/default-avatar-profile-flat-icon-social-media-user-vector-portrait-unknown-human-image-default-avatar-profile-flat-icon-184330869.jpg"
      }
      alt="User"
      className="user-picture-profile"
      
    />
    <input
      id="image-upload"
      type="file"
      accept="image/*"
      onChange={handleImageChange} // Handle image change and upload
      style={{ display: "none" }} // Hide the input elements
    />
        <span className="overlay-text"
        onClick={() => document.getElementById("image-upload").click()} >Change</span> {/* Text over the image */}

  </div>
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
                  <div style={{ color: "gray" }}> {selectedDay}</div>
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
                disabled
              />

              <div className="reminder-labels smaller-labels">
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
              {/* <button
                className="summary-button update"
                onClick={() => setShowOverlay(false)}
              >
                Close
              </button> */}
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
      {success && <div className="success-message">{success}</div>}

      {showSettingsOverlay && (
        <div className="overlay">
          <div className={`overlay-content ${darkMode ? "dark" : "light"}`}>
            <h3>Update Settings</h3>
            <InfoForm
              email={email}
              localUsername={localUsername}
              setLocalUsername={setLocalUsername}
              localSelectedDay={localSelectedDay}
              setLocalSelectedDay={setLocalSelectedDay}
              localNotifications={localNotifications}
              setLocalNotifications={setLocalNotifications}
              //notificationMethod={notificationMethod}
              //setNotificationMethod={setNotificationMethod}
              //language={language}
              //setLanguage={setLanguage}
              darkMode={darkMode}
              localResponseTone={localResponseTone}
              setLocalResponseTone={setLocalResponseTone}
              localNotificationTime={localNotificationTime}
              setLocalNotificationTime={setLocalNotificationTime}
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
