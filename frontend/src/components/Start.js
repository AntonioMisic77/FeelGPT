import React, { useState } from "react";
import "../styles/start.css";
import { Link } from "react-router-dom";


/* TASK: add navbar element -> modify it so it has language */
const SignInLogin = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState("EN");

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const toggleLanguage = () => {
    setLanguage(language === "EN" ? "FR" : "EN");
  };

  return (
    <div className={`bckg ${darkMode ? "dark" : "light"}`}>
      <div className="container">
        {/* Top right buttons */}
        <div className="top-right">
          {/* Dark Mode Toggle Switch */}
          <div class="checkbox-wrapper-64 down">
            <label class="switch">
              <input type="checkbox" onClick={() => toggleDarkMode()} />
              <span class="slider"></span>
            </label>
          </div>

          <button onClick={toggleLanguage} className="language-btn">
            <img
              src="/images/union_jack.png" // Language icon changes with language setting
              alt="Language Icon"
              className="language-icon"
            />
          </button>
        </div>

        {/* Center buttons */}
        <div className="center-start">
          <h1 className="feelgpt-text">FeelGPT</h1>
          <div className="button-group">
            <Link to="/signin">
              <button className="button-66">Sign In</button>
            </Link>
            <Link to="/login">
              <button className="button-66">Log In</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignInLogin;
