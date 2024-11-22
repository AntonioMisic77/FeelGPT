import Navbar from "../components/Navbar";
import Chat from "../components/Chat";
import "../styles/chat.css";
import React, { useState, useEffect } from "react";
import VisageLoader from "./VisageLicenceLoad";

const App = () => {
  const [isRecordingVideo, setIsRecordingVideo] = useState(false);
  const [isCameraEnabled, setIsCameraEnabled] = useState(false);

  // Initialize dark mode based on local storage or default to false
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem("darkMode");
    return savedMode ? JSON.parse(savedMode) : false;
  });

  // Update local storage whenever darkMode changes
  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  

  return (
    <div className={`app-container ${darkMode ? "dark" : "light"}`}>
      <VisageLoader />
      <Navbar 
        darkMode={darkMode} 
        setDarkMode={() => setDarkMode((prev) => !prev)} // Toggle dark mode
        setIsRecordingVideo={setIsRecordingVideo}
        setIsCameraEnabled={setIsCameraEnabled} 
        IsRecordingVideo={isRecordingVideo}
        IsCameraEnabled={isCameraEnabled} 
      />
      <Chat 
        darkMode={darkMode} 
        isRecordingVideo={isRecordingVideo} 
        setRecordingVideo={setIsRecordingVideo} 
        IsCameraEnabled={isCameraEnabled} 
        //setIsCameraEnabled={setIsCameraEnabled} 
      />
    </div>
  );
};

export default App;
