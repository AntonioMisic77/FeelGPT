import Navbar from "../components/Navbar";
import Chat from "../components/Chat";
import "../styles/chat.css";
import React, { useState } from "react";
import VisageLoader from "./VisageLicenceLoad";


const App = () => {
  const [darkMode, setDarkMode] = useState(false); // State to manage dark/light mode

  return (
    <div className={`app-container ${darkMode ? "dark" : "light"}`}>
      <VisageLoader /> 
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
      <Chat darkMode={darkMode} />
    </div>
  );
};

export default App;
