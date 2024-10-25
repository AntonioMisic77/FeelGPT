import Navbar from "../components/Navbar";
import Chat from "../components/Chat";
import "../styles/chat.css";
import "../styles/myinfo.css";
import React, { useState } from "react";

const MyInfo = () => {
  const [darkMode, setDarkMode] = useState(false); // State to manage dark/light mode

  //additional info
  const [consent, setConsent] = useState(false);
  const [notifications, setNotifications] = useState("daily"); // Options: 'daily', 'weekly'

  const handleConsentChange = () => {
    setConsent(!consent);
  };

  const handleNotificationsChange = (e) => {
    setNotifications(e.target.value);
  };

  return (
    <div className="app-container">
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
      <div className={`info-page-container ${darkMode ? "dark" : "light"}`}>
        <div className="info-container">
          <img
            src="https://thumbs.dreamstime.com/b/default-avatar-profile-flat-icon-social-media-user-vector-portrait-unknown-human-image-default-avatar-profile-flat-icon-184330869.jpg"
            alt=""
            className="user-picture-profile"
          />
          <p className="username">user.name@gmail.com</p>
          <div className="additional-my-info">
            
              <div className="consent-container">
                <label className="question-label">
                  Would you like to you use your camera for better performance?
                </label>
                <div class="checkbox-wrapper-10">
                  <input
                    class="tgl tgl-flip"
                    id="cb5"
                    type="checkbox"
                    checked={consent}
                    onChange={handleConsentChange}
                  />
                  <label
                    class="tgl-btn"
                    data-tg-off="Nope"
                    data-tg-on="Yeah!"
                    for="cb5"
                  ></label>
                </div>
              </div>

              <div>
                <label className="question-label radio-label">
                  Do you want to get notifications for conversations?
                </label>
                <div class="horizontal-radio">
                  <div class="radio-wrapper-5">
                    <label for="example-5" class="forCircle">
                      <input
                        id="example-5"
                        type="radio"
                        name="radio-examples"
                        value="daily"
                        checked={notifications === "daily"}
                        onChange={handleNotificationsChange}
                      />
                      <span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          class="h-3.5 w-3.5"
                          viewBox="0 0 16 16"
                          fill="currentColor"
                        >
                          <circle
                            data-name="ellipse"
                            cx="8"
                            cy="8"
                            r="8"
                          ></circle>
                        </svg>
                      </span>
                    </label>
                    <label for="example-5">daily</label>
                  </div>

                  <div class="radio-wrapper-5">
                    <label for="example-5" class="forCircle">
                      <input
                        id="example-5"
                        type="radio"
                        name="radio-examples"
                        value="weekly"
                        checked={notifications === "daily"}
                        onChange={handleNotificationsChange}
                      />
                      <span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          class="h-3.5 w-3.5"
                          viewBox="0 0 16 16"
                          fill="currentColor"
                        >
                          <circle
                            data-name="ellipse"
                            cx="8"
                            cy="8"
                            r="8"
                          ></circle>
                        </svg>
                      </span>
                    </label>
                    <label for="example-5">weekly</label>
                  </div>

                  <div class="radio-wrapper-5">
                    <label for="example-5" class="forCircle">
                      <input
                        id="example-5"
                        type="radio"
                        name="radio-examples"
                        value="never"
                        checked={notifications === "daily"}
                        onChange={handleNotificationsChange}
                      />
                      <span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          class="h-3.5 w-3.5"
                          viewBox="0 0 16 16"
                          fill="currentColor"
                        >
                          <circle
                            data-name="ellipse"
                            cx="8"
                            cy="8"
                            r="8"
                          ></circle>
                        </svg>
                      </span>
                    </label>
                    <label for="example-5">never</label>
                  </div>
                </div>
              </div>
              {(notifications === "weekly" || notifications === "daily") && (
                <div>
                  <label className="question-label radio-label">
                    How would you like to receive notifications?
                  </label>
                  <div class="horizontal-radio">
                    <div class="radio-wrapper-5">
                      <label for="example-5" class="forCircle">
                        <input
                          id="example-5"
                          type="radio"
                          name="notificationMethod"
                          value="mail"
                          checked={notifications === "daily"}
                          onChange={handleNotificationsChange}
                        />
                        <span>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-3.5 w-3.5"
                            viewBox="0 0 16 16"
                            fill="currentColor"
                          >
                            <circle
                              data-name="ellipse"
                              cx="8"
                              cy="8"
                              r="8"
                            ></circle>
                          </svg>
                        </span>
                      </label>
                      <label for="example-5">Email</label>
                    </div>

                    <div class="radio-wrapper-5">
                      <label for="example-5" class="forCircle">
                        <input
                          id="example-5"
                          type="radio"
                          name="notificationMethod"
                          value="push"
                          checked={notifications === "daily"}
                          onChange={handleNotificationsChange}
                        />
                        <span>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-3.5 w-3.5"
                            viewBox="0 0 16 16"
                            fill="currentColor"
                          >
                            <circle
                              data-name="ellipse"
                              cx="8"
                              cy="8"
                              r="8"
                            ></circle>
                          </svg>
                        </span>
                      </label>
                      <label for="example-5">Push notification</label>
                    </div>
                  </div>
                </div>
              )}
              {/* Button at the bottom */}
            
          </div>
        </div>
        <div className="graphs-container">
          <img
            src="https://cdn-icons-png.flaticon.com/512/7192/7192761.png"
            alt=""
            className="graph"
          />
          <img
            src="https://cdn-icons-png.flaticon.com/512/7192/7192761.png"
            alt=""
            className="graph"
          />
          <img
            src="https://cdn-icons-png.flaticon.com/512/7192/7192761.png"
            alt=""
            className="graph"
          />
          <img
            src="https://cdn-icons-png.flaticon.com/512/7192/7192761.png"
            alt=""
            className="graph"
          />
          <img
            src="https://cdn-icons-png.flaticon.com/512/7192/7192761.png"
            alt=""
            className="graph"
          />
          <img
            src="https://cdn-icons-png.flaticon.com/512/7192/7192761.png"
            alt=""
            className="graph"
          />
          <img
            src="https://cdn-icons-png.flaticon.com/512/7192/7192761.png"
            alt=""
            className="graph"
          />
          <img
            src="https://cdn-icons-png.flaticon.com/512/7192/7192761.png"
            alt=""
            className="graph"
          />
        </div>
        <div className="legend-container">
          
        </div>
      </div>
    </div>
  );
};

export default MyInfo;
