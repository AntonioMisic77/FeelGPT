import React, { useState, useEffect } from "react";
import "../styles/navbar.css";
import { Link, useLocation } from "react-router-dom";

const Navbar = ({ darkMode, setDarkMode, setIsRecordingVideo }) => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Close the dropdown when clicking outside of it
    const handleClickOutside = (event) => {
      if (event.target.closest('.dropdown') === null) {
        setDropdownVisible(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  // Toggle the dropdown visibility when the camera icon is clicked
  const toggleDropdown = (e) => {
    e.preventDefault(); // Prevent default behavior of <details>
    setDropdownVisible(!dropdownVisible);
  };

  // Close the dropdown when an option is selected
  const handleOptionSelect = (option) => {
    console.log(option); // Option chosen
    if (option === "Toggle Camera") {
      toggleCamera();
    }
    setDropdownVisible(false); // Close dropdown after option is selected
  };

  // For camera input when user chooses
  const toggleCamera = () => {
    setIsRecordingVideo((prev) => {
      const newState = !prev;
      console.log(newState ? 'Camera is on' : 'Camera is off');
      return newState;
    });
  };

  return (
    <nav className={`navbar ${darkMode ? "dark" : "light"}`}>
      <div className="navbar-container">
        <div className="navbar-left">
          <p className="name">Feel GPT</p>
        </div>
        <div className="navbar-right">
          {location.pathname !== "/" && (
            <Link className="link" to="/">
              <button type="button" className="submit-btn button-66-smaller">
                Chat
              </button>
            </Link>
          )}

          <div className="checkbox-wrapper-64">
            <label className="switch">
              <input type="checkbox" onClick={() => setDarkMode(!darkMode)} />
              <span className="slider"></span>
            </label>
          </div>

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

              {/* Show dropdown only if it's visible */}
              {dropdownVisible && (
                <ul>
                  <li>
                    <a href="#" onClick={() => handleOptionSelect("Toggle Camera")}>
                      {setIsRecordingVideo ? "Show camera" : "Hide camera"}
                    </a>
                  </li>
                  <li>
                    <a href="#" onClick={() => handleOptionSelect("Disable Camera")}>
                      Disable camera
                    </a>
                  </li>
                </ul>
              )}
            </div>
          )}

<div>
            <Link to="/my-info">
              <img
                src={location.pathname === "/my-info" ? "../images/logout.png" : "../images/user.png"}
                alt=""
                className="user-icon"
              />
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
