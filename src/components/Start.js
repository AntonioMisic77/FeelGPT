import React, { useState } from "react";
import "../styles/start.css";
import { Link } from "react-router-dom";

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
    <div className="bckg">
    <div className={`container ${darkMode ? "dark-start" : "light-start"}`}>
      {/* Top right buttons */}
      <div className="top-right">
        {/* Dark Mode Toggle Switch */}
        <label className="toggle-switch">
          <input type="checkbox" checked={darkMode} onChange={toggleDarkMode} />
          <div className="toggle-switch-background">
            <div className="toggle-switch-handle"></div>
          </div>
        </label>

        <button onClick={toggleLanguage} className="language-btn">
          <img
            /* TASK: images change with language -> now it is harcoded english */
            src="/images/union_jack.png"
            alt="Language Icon"
            className="language-icon"
          />
          {/* {language} */}
        </button>
      </div>

      {/* Center buttons */}
      <div className="center">
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
