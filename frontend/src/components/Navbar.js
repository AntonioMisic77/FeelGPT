// src/components/Navbar.js

import React, { useState, useEffect } from "react";
import "../styles/navbar.css";
import { Link, useLocation } from "react-router-dom";

const Navbar = ({ darkMode, setDarkMode, setIsRecordingVideo }) => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const location = useLocation();
  const [isCameraOn, setIsCameraOn] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (event.target.closest(".dropdown") === null) {
        setDropdownVisible(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const toggleDropdown = (e) => {
    e.preventDefault();
    setDropdownVisible(!dropdownVisible);
  };

  const handleOptionSelect = (option) => {
    console.log(option);
    if (option === "Toggle Camera") {
      toggleCamera();
    }
    setDropdownVisible(false);
  };

  const toggleCamera = () => {
    setIsRecordingVideo((prev) => {
      const newState = !prev;
      setIsCameraOn(newState);
      console.log(newState ? "Camera is on" : "Camera is off");
      return newState;
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    window.location.href = "/start";
  };

  return (
    <nav className={`navbar ${darkMode ? "dark" : "light"}`}>
      <div className="navbar-container">
        <div className="navbar-left">
          <p className="name">Feel GPT</p>
        </div>
        <div className="navbar-right">
          <div className="checkbox-wrapper-64">
            <label className="switch">
              <input
                type="checkbox"
                checked={darkMode}
                onChange={() => setDarkMode((prevMode) => !prevMode)}
              />
              <span className="slider"></span>
            </label>
          </div>

          {location.pathname !== "/" && (
            <Link className="link" to="/">
              <button type="button" className="chat-button">
                Chat
              </button>
            </Link>
          )}

          {location.pathname !== "/my-info" && (
            <div className="dropdown">
              <summary role="button" onClick={toggleDropdown}>
                <a className="button">
                  <img
                    src="../images/camera.png"
                    alt="Camera"
                    className="camera-icon"
                  />
                </a>
              </summary>

              {dropdownVisible && (
                <ul>
                  <li>
                    <a
                      href="#"
                      onClick={() => handleOptionSelect("Toggle Camera")}
                    >
                      {isCameraOn ? "Hide camera" : "Show camera"}
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      onClick={() => handleOptionSelect("Disable Camera")}
                    >
                      Disable camera
                    </a>
                  </li>
                </ul>
              )}
            </div>
          )}

          <div>
            {location.pathname === "/my-info" ? (
              <img
                src="../images/logout.png"
                alt="Logout"
                className="logout-icon"
                onClick={handleLogout}
                style={{ cursor: "pointer" }}
              />
            ) : (
              <Link to="/my-info">
                <img
                  src="../images/user.png"
                  alt="User"
                  className="user-icon"
                />
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
