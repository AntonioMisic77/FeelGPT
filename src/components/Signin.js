import React, { useState } from "react";

import "../styles/start.css";
import "../styles/signin.css";

/* TASK -> fix positions of Additional Info */

const Signin = () => {
  const [consent, setConsent] = useState(false);
  const [notifications, setNotifications] = useState("daily"); // Options: 'daily', 'weekly'
  const [smsNumber, setSmsNumber] = useState("");

  const handleConsentChange = () => {
    setConsent(!consent);
  };

  const handleNotificationsChange = (e) => {
    setNotifications(e.target.value);
  };

  return (
    <div>
      <div className="sign-in-container">
        <div className="sign-in-form">
          <h1 className="form-title">Feel GPT Sign In Form</h1>
          <form>
            <div>
              <label className="signin-label">Email:</label>
              <input className="signin-input" type="email" placeholder="Enter your email" required />
            </div>
            <div>
              <label className="signin-label" >Password:</label>
              <input
              className="signin-input"
                type="password"
                placeholder="Enter your password"
                required
              />
            </div>
          </form>
        </div>

        <div className="additional-info">
          <h2 className="info-title">Additional Info</h2>
          <div className="consent-container">
            <label className="question-label">
              Would you like to you your camera for better performance?
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
            <label>Do you want to get notifications for conversations?</label>
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
                      <circle data-name="ellipse" cx="8" cy="8" r="8"></circle>
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
                      <circle data-name="ellipse" cx="8" cy="8" r="8"></circle>
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
                      <circle data-name="ellipse" cx="8" cy="8" r="8"></circle>
                    </svg>
                  </span>
                </label>
                <label for="example-5">never</label>
              </div>
            </div>
          </div>
          {(notifications === "weekly" || notifications === "daily") && (
            <div>
              <label>How would you like to receive notifications?</label>
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
      <div className="submit-container">
        <button type="submit" className="submit-btn button-66">
          Submit
        </button>
      </div>
    </div>
  );
};

export default Signin;
