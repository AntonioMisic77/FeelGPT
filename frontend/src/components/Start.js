import React, { useState, useEffect } from "react";
import "../styles/start.css";
import { Link } from "react-router-dom";
import gsap from "gsap";


/* TASK: add navbar element -> modify it so it has language */
const SignInLogin = () => {
  const [language, setLanguage] = useState("EN");


  // Initialize dark mode based on local storage or default to false
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem("darkMode");
    return savedMode ? JSON.parse(savedMode) : false;
  });

  // Update local storage whenever darkMode changes
  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  

  const toggleDarkMode = () => {
    setDarkMode((prevMode) => !prevMode);
  };


  const toggleLanguage = () => {
    setLanguage(language === "EN" ? "FR" : "EN");
  };


  //animation
  useEffect(() => {
    gsap.fromTo(
      ".feelgpt-text",
      { opacity: 0, y: -50 },
      { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
    );
  }, []);

  useEffect(() => {
    gsap.fromTo(
      ".button-animation",
      { opacity: 0, y: -50 },
      { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
    );
  }, []);


  return (
    <div className={`bckg ${darkMode ? "dark" : "light"}`}>
      <div className="container">
        {/* Top right buttons */}
        <div className="top-right">
          {/* Dark Mode Toggle Switch */}
          <div className="checkbox-wrapper-64 down">
            <label className="switch">
              <input
                type="checkbox"
                checked={darkMode}
                onChange={() => setDarkMode((prevMode) => !prevMode)}
              />
              <span className="slider"></span>
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
              <button className="button-66 button-animation">Sign Up</button>
            </Link>
            <Link to="/login">
              <button className="button-66 button-animation login-padding">Log In</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignInLogin;
