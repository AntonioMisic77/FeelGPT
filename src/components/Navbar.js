import React, { useState } from "react";
import "../styles/navbar.css";
import ChatListButton from "./ChatListButton";
import { Link, useLocation} from "react-router-dom";

const Navbar = ({ darkMode, setDarkMode }) => {
  const location = useLocation();
  return (
    <nav className={`navbar ${darkMode ? "dark" : "light"}`}>
      <div className="navbar-container">
        <div className="navbar-left">
          {/* <ChatListButton/> */}
          <p className="name"> Feel GPT</p>
        </div>
        <div className="navbar-right">
        {location.pathname !== "/" && (
            <Link className="link" to="/">
              Chat with me
            </Link>
          )}
          <button
            className="button-mode"
            onClick={() => setDarkMode(!darkMode)}
          >
            {darkMode ? "Light Mode" : "Dark Mode"}
          </button>
          <Link to="/my-info">
            <img
              src="https://thumbs.dreamstime.com/b/default-avatar-profile-flat-icon-social-media-user-vector-portrait-unknown-human-image-default-avatar-profile-flat-icon-184330869.jpg"
              alt=""
              className="user-picture"
            />
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
