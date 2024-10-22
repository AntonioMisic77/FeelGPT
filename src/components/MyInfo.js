import Navbar from "../components/Navbar";
import Chat from "../components/Chat";
import "../styles/chat.css";
import "../styles/myinfo.css";
import React, { useState } from "react";

const MyInfo = () => {
  const [darkMode, setDarkMode] = useState(false); // State to manage dark/light mode

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
          <p>info1</p>
          <p>info2</p>
          <p>info3</p>
          <p>info4</p>
          <p>info5</p>
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
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTcML41w4uMSnsAv37ttl6lvCHKVVNYqV-_7Q&s"
            alt=""
            className="legend"
          />
        </div>
      </div>
    </div>
  );
};

export default MyInfo;
