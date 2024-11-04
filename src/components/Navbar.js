import React from "react";
import "../styles/navbar.css";
import { Link, useLocation } from "react-router-dom";

const Navbar = ({ darkMode, setDarkMode, setIsRecordingVideo }) => {
  const location = useLocation();

  //for camera input when user chooses
  const toggleCamera = () => {
    setIsRecordingVideo(prev => {
      const newState = !prev; 
      if (newState) {
        console.log('Camera is on'); 
      } else {
        console.log('Camera is off');
      }
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
          {location.pathname !== "/my-info" && (
          <div onClick={toggleCamera} style={{ cursor: 'pointer' }}>
            <img
              src="../images/camera.png" 
              alt="Camera"
              className="user-icon"
            />
          
          </div>
          )}

          <div className="checkbox-wrapper-64">
            <label className="switch">
              <input type="checkbox" onClick={() => setDarkMode(!darkMode)} />
              <span className="slider"></span>
            </label>
          </div>

          <div>
            <Link to="/my-info">
              <img
                src={location.pathname === "/my-info" ? "../images/logout.png" : "../images/icon.png"}
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
