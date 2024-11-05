import React, { useState, useEffect, useRef } from "react";
import "../styles/chat.css";
import axios from "axios";
import VisageLoader from "./VisageLicenceLoad";
import VisageAnalyzer from "./VisageAnalyzer";


/* IMPORTANT -> i thought it would be better idea to get emotions from user each second 
in period when the user is typing and get average or sum of emotions ( for better estimation) and average of years
and max appearance of gender
  -> implemented: each second emotions are recognized
  -> ont implemented: storing data and calculating average/sum and the rest */
const Chat = ({ darkMode, isRecordingVideo, setRecordingVideo }) => {
  const [messages, setMessages] = useState([
    {
      text: "Good Morning! What are you up to today, given the fact that you haven't been feeling good yesterday?",
      sender: "them",
    },
    {
      text: "I woke up feeling pretty good today! The sun is shining, and I'm ready to tackle whatever comes my way.",
      sender: "me",
    },
    {
      text: "That's awesome to hear! ☀️ I love those sunny mornings—they really set a positive tone for the day.",
      sender: "them",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [showVisage, setShowVisage] = useState(false);
  const [isTyping, setIsTyping] = useState(false); // Track if user is typing
  const messagesEndRef = useRef(null);
  const videoRef = useRef(null);
  const typingIntervalRef = useRef(null);

  // Function that keeps the chat scrolled to the bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Function to send a message
  const sendMessage = async () => {
    if (inputValue.trim()) {
      setMessages([...messages, { text: inputValue, sender: "me" }]);
      setInputValue("");
      setIsTyping(false); // Stop visage analysis when message is sent

      // Clear the visage interval
      clearInterval(typingIntervalRef.current);
      typingIntervalRef.current = null;

      setShowVisage(false);
      setTimeout(() => {
        setShowVisage(true);
      }, 100);
    }
  };

  // When Enter is pressed while typing, messages will be sent
  const EnterPressed = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  };

  // Start visage analysis when typing starts
  useEffect(() => {
    if (isTyping && !typingIntervalRef.current) {
      // Set an interval to toggle VisageAnalyzer every second
      typingIntervalRef.current = setInterval(() => {
        setShowVisage(false);
        setTimeout(() => setShowVisage(true), 100);
      }, 1000);
    }

    return () => {
      clearInterval(typingIntervalRef.current);
      typingIntervalRef.current = null;
    };
  }, [isTyping]);

  // Start video stream from the user's camera
  useEffect(() => {
    const getCameraStream = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (error) {
        console.error("Error accessing the camera: ", error);
      }
    };

    getCameraStream();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, []);

  return (
    <div className={`big-container ${isRecordingVideo ? "video-enabled" : ""}`}>
      <div className="video-container">
        <video
          className={`live-video ${isRecordingVideo ? "" : "hidden-video"}`}
          ref={videoRef}
          autoPlay
        />
      </div>

      <div className={`chat-container ${darkMode ? "dark" : "light"} ${isRecordingVideo ? "video-enabled-chat" : ""}`}>
        <div className="messages">
          {messages.map((message, index) => (
            <div className="message-container" key={index}>
              <div className={`message ${message.sender}`}>
                {message.sender === "them" && (
                  <img
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRE6zuMAkAaFxsS0nM0JLKYeEHgqJn5hBhNQg&s"
                    alt="User"
                    className="user-picture chat"
                  />
                )}
                <div className="message-border">{message.text}</div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="input-container">
          <textarea
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              setIsTyping(true); 
            }}
            placeholder="Type a message"
            className="input-field"
            rows="1"
            onKeyDown={EnterPressed}
          />
          <button className="send-button" onClick={sendMessage}>
            <img
              className="send-button-img"
              src="https://cdn-icons-png.freepik.com/512/5582/5582878.png"
              alt="Send"
            />
          </button>
        </div>

        {/* Conditionally render VisageAnalyzer and pass the video stream */}
        {showVisage && <VisageAnalyzer videoRef={videoRef} />}
      </div>
    </div>
  );
};

export default Chat;
