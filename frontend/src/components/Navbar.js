// src/components/Navbar.js

import React, { useState, useEffect } from "react";
import "../styles/navbar.css";
import { Link, useLocation } from "react-router-dom";

const Navbar = ({ darkMode, setDarkMode, setIsRecordingVideo, setIsCameraEnabled}) => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const location = useLocation();
  const [isCameraOn, setIsCameraOn] = useState(false); // New state for camera status
  const [isCameraEn, setIsCameraEn] = useState(false); 

  const handleSetIsCameraEnabled = setIsCameraEnabled || (() => {});


  useEffect(() => {
    const storedCameraEn = localStorage.getItem("isCameraEn");
    if (storedCameraEn !== null) {
      setIsCameraEn(JSON.parse(storedCameraEn)); 
      handleSetIsCameraEnabled(JSON.parse(storedCameraEn));
    }
  }, []);

  useEffect(() => {
    // Save the updated isCameraEn value to localStorage whenever it changes
    localStorage.setItem("isCameraEn", JSON.stringify(isCameraEn));
  }, [isCameraEn]);

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
    if (option === "Toggle Camera") {
      toggleCamera();
    }
    if (option === "Enable/Disable Camera") {
      enableCamera();
    }
    setDropdownVisible(false);
  };

  const toggleCamera = () => {
    setIsRecordingVideo((prev) => {
      const newState = !prev;
      setIsCameraOn(newState);
      return newState;
    });
  };

  // For camera enabled
  const enableCamera = () => {
    setIsCameraEnabled((prev) => {
      const newState = !prev;
      setIsCameraEn(newState);
      return newState;
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    window.location.href = "/chat";
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

          {location.pathname === "/my-info" && (
            <Link className="link" to="/chat">
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
                      onClick={() =>
                        handleOptionSelect("Enable/Disable Camera")
                      }
                    >
                      {isCameraEn ? "Disable camera" : "Enable camera"}
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
