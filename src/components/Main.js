import Navbar from "../components/Navbar";
import Chat from "../components/Chat";
import "../styles/chat.css";
import React, { useState } from "react";
import VisageLoader from "./VisageLicenceLoad";

/* PROBLEMS and TASK
   -> change background 
   -> add motivational text
   -> make logo??
   */
   const App = () => {
    const [darkMode, setDarkMode] = useState(false); // State to manage dark/light mode
    const [isRecordingVideo, setIsRecordingVideo] = useState(false); // State to manage camera input
  
    return (
      <div className={`app-container ${darkMode ? "dark" : "light"}`}>
        <VisageLoader />
        <Navbar 
          darkMode={darkMode} 
          setDarkMode={setDarkMode} 
          setIsRecordingVideo={setIsRecordingVideo} 
        />
        <Chat 
          darkMode={darkMode} 
          isRecordingVideo={isRecordingVideo} 
          setRecordingVideo={setIsRecordingVideo} 
        />
      </div>
    );
  };
  
  export default App;
