import React, { useState } from "react";
import "../styles/navbar.css";
import ChatListButton from "./ChatListButton";
import { Link, useLocation } from "react-router-dom";

const Navbar = ({ darkMode, setDarkMode }) => {
  const location = useLocation();
  return (
    <nav className={`navbar ${darkMode ? "dark" : "light"}`}>
      <div className="navbar-container">
        <div className="navbar-left">
          {/* <ChatListButton/> */}
          <p className="name "> Feel GPT</p>
        </div>
        <div className="navbar-right">
          {location.pathname !== "/" && (
            <Link className="link" to="/">
              <button type="button" className="submit-btn button-66-smaller">
                  Chat
                </button>
            </Link>
          )}
          <div>
            {/* TASK-> its not implemented opening camera if wanted connected to this icon */}
          <img
                src={
                  
                    
                    "../images/camera.png" 
                }
                alt=""
                className="user-icon"
              />
          </div>


          <div class="checkbox-wrapper-64">
            <label class="switch">
              <input type="checkbox" onClick={() => setDarkMode(!darkMode)} />
              <span class="slider"></span>
            </label>
          </div>

          <div>
            <Link to="/my-info">
            <img
                src={
                  location.pathname === "/my-info"
                    ? "../images/logout.png" 
                    : "../images/icon.png" 
                }
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
