import React, { useState, useEffect, useRef } from "react";
import "../styles/chat.css";
import "../styles/darkMode.css";
import Navbar from "../components/Navbar";
import chatService from "../services/chatService";
import SessionList from "../components/sessionList";

import { useParams } from "react-router-dom";
import axiosInstance from "../api/axiosInstance"; // Import axiosInstance


const ChatHistory = ({}) => {
  const { sessionId } = useParams(); // Get sessionId from URL parameters
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRecordingVideo, setIsRecordingVideo] = useState(false);
  const [isCameraEnabled, setIsCameraEnabled] = useState(false);
  const [sessions, setSessions] = useState([]);

  /* real session from be */

    // getting user image
    const [profileImage, setProfileImage] = useState("");
    const [isProfileImage, setIsProfileImage] = useState(false);

    useEffect(() => {
      const fetchUserInfo = async () => {
        try {
          const token = localStorage.getItem("authToken");
          if (!token) throw new Error("No auth token found");
  
          const payloadBase64 = token.split(".")[1];
          const decodedPayload = JSON.parse(atob(payloadBase64));
  
          const response = await axiosInstance.get("/user/auth/me", {
            params: { id: decodedPayload.userId },
          });
  
          const data = response.data.result;
  
          setProfileImage(
            data.profileImage
              ? `data:image/png;base64,${data.profileImage}`
              : "https://thumbs.dreamstime.com/b/default-avatar-profile-flat-icon-social-media-user-vector-portrait-unknown-human-image-default-avatar-profile-flat-icon-184330869.jpg"
          );
  
          if (profileImage === null) {
            setIsProfileImage(false);
          } else {
            setIsProfileImage(true);
          }
        } catch (err) {
          const backendMessage = err.response?.data?.message;
        }
        console.log("profile image:", profileImage);
      };
  
      fetchUserInfo();
    }, []);
  

  const messagesEndRef = useRef(null);


  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const sessionData = await chatService.getAllSessions();
      setSessions(sessionData);
      
    } catch (err) {
      console.error("Error loading sessions:", err);
    } finally {
      setLoading(false);
    }
  };

  
  useEffect(() => {
    if (sessionId) {
      fetchChatHistory();
    }
  }, [sessionId]);

  const fetchChatHistory = async () => {
    try {
      const response = await chatService.getSessionMessages(sessionId);

      // Access messages through result.messages
      if (response.messages) {
        const formattedMessages = response.messages.map((msg) => ({
          text: msg.content,
          sender: msg.messageType === "assistant" ? "them" : "me",
          timestamp: new Date(msg.timestamp),
          emotionLabel: msg.emotionalState,
        }));
        setMessages(formattedMessages);
      } else {
        console.error("No messages found in response:", response);
        setMessages([]);
      }
    } catch (error) {
      console.error("Error fetching chat history:", error);
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  // Initialize dark mode based on local storage or default to false
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem("darkMode");
    return savedMode ? JSON.parse(savedMode) : false;
  });

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);
/* 
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]); */

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    console.log('date u chat history:', date);
    return `${date.getDate()}. ${date.toLocaleString("default", {
      month: "long",
    })} ${date.getFullYear()}.`;
  };

  if (loading) {
    return <div>Loading chat history...</div>;
  }

  return (
    <div className={`app-container ${darkMode ? "dark" : "light"}`}>
      <Navbar
        darkMode={darkMode}
        setDarkMode={() => setDarkMode((prev) => !prev)}
        setIsRecordingVideo={setIsRecordingVideo}
        setIsCameraEnabled={setIsCameraEnabled}
        IsRecordingVideo={isRecordingVideo}
        IsCameraEnabled={isCameraEnabled}
      />
      <div
        className={`big-container ${isRecordingVideo ? "video-enabled" : ""} `}
      >
        <div className={`chat-container ${darkMode ? "dark" : "light"}`}>
          <div className="history-header">
            <h2>Chat History</h2>
            <SessionList sessions={sessions} sessionId={sessionId} /> 
          </div>

          <div className={`messages ${darkMode ? "dark" : "light"}`}>
            <div className={`date-bar ${darkMode ? "dark" : "light"}`}>
              {messages.length > 0
                ? formatDate(messages[0].timestamp)
                : "No messages"}
            </div>

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
                  <div
                    className={`message-border ${darkMode ? "dark" : "light"}`}
                  >
                    <p>{message.text}</p>
                  </div>

                  {message.sender === "me" && isProfileImage && (
                  <img
                    src={profileImage}
                    alt="User"
                    className="user-picture chat picture-me"
                  />
                )}

                  <div className="message-meta">
                  <div className={`timestamp ${isProfileImage ? "left" : ""}`}>
                      {message.timestamp.toLocaleTimeString()}
                    </div>
                    {message.sender === "me" && message.emotionLabel && (
                      <div
                      className={`emotion-label ${message.emotionLabel.toUpperCase()} ${
                        isProfileImage ? "left" : ""
                      } `}
                    >
                        <span>{message.emotionLabel.toUpperCase()}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatHistory;
