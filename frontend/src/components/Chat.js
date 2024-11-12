import React, { useState, useEffect, useRef } from "react";
import "../styles/chat.css";
import "../styles/darkMode.css";
import ImageCapture from "./ImageCapture"; // Import ImageCapture directly
import VisageAnalyzer from "./VisageAnalyzer"; // Import VisageAnalyzer
import chatService from "../services/chatService"; // Import Chat Service

/* TASKS:
1. change "date-bar" so that it display for today current date
and when some prior chat is shown, its date
2. change "emotionLabel" so it display the most detected emotion 
3. into each slider from "sliders" feed current emotion value through "value" 
4. make sure that you're saving times and dates with messages*/
const Chat = ({ darkMode, isRecordingVideo, setRecordingVideo }) => {
  const first_timestamp = new Date().toLocaleTimeString();
  const [messages, setMessages] = useState([
    {
      text: "Welcome to FeelGPT. I am here to listen and help you reflect on your emotions. How are you feeling today?",
      sender: "them",
      timestamp: first_timestamp,
    },
  ]);

  // for input to increase with row of texts
  const textareaRef = useRef(null);
  const adjustHeight = (element) => {
    element.style.height = "auto"; // Reset height
    element.style.height = element.scrollHeight - 20 + "px"; // Adjust height to fit content
  };

  //for top shadow on chat

  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false); // Track if user is typing
  const messagesEndRef = useRef(null);
  const videoRef = useRef(null); // Reference for the video element
  const canvasRef = useRef(null); // Reference for the canvas element

  // Tracker and analysis data refs for visage processing
  const ppixelsRef = useRef(null);
  const pixelsRef = useRef(null);
  const m_Tracker = useRef(null);
  const TfaceDataArrayRef = useRef(null);
  const tmpAnalysisDataRef = useRef(null);
  const m_FaceAnalyserRef = useRef(null);

  const mWidth = 640;
  const mHeight = 480;

  // Initialize VisageAnalyzer once and store its data
  const [visageData, setVisageData] = useState(null);

  // Function that keeps the chat scrolled to the bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Function to send a message
  const sendMessage = async () => {
    if (inputValue.trim()) {
      // for time and date below messages
      const timestamp = new Date().toLocaleTimeString();
      const dominantEmotion = "HAPPINESS";
      setMessages([
        ...messages,
        {
          text: inputValue,
          sender: "me",
          timestamp,
          emotionLabel: dominantEmotion,
        },
        { text: "...", sender: "them", timestamp },
      ]);
      setInputValue("");
      setIsTyping(false); // Stop visage analysis when message is sent

      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
        textareaRef.current.blur();
      }

      // extract emotion detection values
      const emotionsArray = Array.from(
        tmpAnalysisDataRef.current?.get(0)?.getEmotionProbabilities() || []
      );

      const age = tmpAnalysisDataRef.current?.get(0)?.getAge();
      const gender = tmpAnalysisDataRef.current?.get(0)?.getGender();

      const chatData = {
        message: inputValue,
        emotion: emotionsArray,
        age,
        gender,
      };

      try {
        const response = await chatService.sendMessageWithEmotion(chatData);
        console.log("Backend response: ", response);
        setMessages((prevMessages) =>
          prevMessages.map((message, index) =>
            index == prevMessages.length - 1
              ? { ...message, text: response.reply }
              : message
          )
        );
      } catch (error) {
        console.error("Failed to send message: ", error);
      }
    }
  };

  // When Enter is pressed while typing, messages will be sent
  const EnterPressed = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  };

  // Start video stream from the user's camera
  useEffect(() => {
    const getCameraStream = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
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

  // Use an interval to capture image every second when the user is typing
  useEffect(() => {
    let captureInterval;

    if (isTyping) {
      // Start an interval to capture the image every second
      captureInterval = setInterval(() => {
        if (videoRef.current && canvasRef.current) {
          const ctx = canvasRef.current.getContext("2d");
          ctx.drawImage(videoRef.current, 0, 0, mWidth, mHeight); // Capture the current frame
          const imageCaptured = canvasRef.current.toDataURL(); // Convert the captured frame to data URL
          setVisageData((prevData) => ({
            ...prevData,
            imageCaptured, // Update the image captured data
          }));
        }
      }, 1000); // Capture every second
    } else {
      // If typing stops, clear the interval
      clearInterval(captureInterval);
    }

    return () => {
      // Clean up the interval when the component is unmounted or when typing stops
      if (captureInterval) {
        clearInterval(captureInterval);
      }
    };
  }, [isTyping]); // Runs whenever isTyping changes

  // Start visage analysis when typing starts
  useEffect(() => {
    if (isTyping && !visageData) {
      // Initialize VisageAnalyzer once the user starts typing
      const startVisageAnalyzer = () => {
        setVisageData({
          imageCaptured: null,
          setImageCaptured: () => {},
          // You can pass more relevant data here
        });
      };

      startVisageAnalyzer();
    }
  }, [isTyping, visageData]); // Only start visage analyzer when typing starts and it's not initialized

  return (
    <div className={`big-container ${isRecordingVideo ? "video-enabled" : ""}`}>
      <div
        className={`video-container ${isRecordingVideo ? "video-enabled" : ""}`}
      >
        <video
          className={`live-video ${isRecordingVideo ? "" : "hidden-video"}`}
          ref={videoRef}
          autoPlay
        />
        {isRecordingVideo && (
          <div className="sliders">
            <div>
              <input type="range" class="win10-thumb" disabled value="64" />
              <div className="slider-label">ANGER</div>
              <input type="range" class="win10-thumb" disabled value="50" />
              <div className="slider-label">DISGUST</div>
              <input type="range" class="win10-thumb" disabled value="1" />
              <div className="slider-label">FEAR</div>
              <input type="range" class="win10-thumb" disabled value="100" />
              <div className="slider-label">HAPPINESS</div>
            </div>
            <div>
              <input type="range" class="win10-thumb" disabled value="4" />
              <div className="slider-label">SADNESS</div>
              <input type="range" class="win10-thumb" disabled value="78" />
              <div className="slider-label">SURPRISE</div>
              <input type="range" class="win10-thumb" disabled value="18" />
              <div className="slider-label">NEUTRAL</div>
            </div>
          </div>
        )}
      </div>

      <div
        className={`chat-container ${darkMode ? "dark" : "light"} ${
          isRecordingVideo ? "video-enabled-chat" : ""
        }`}
      >
        <div className={`messages ${darkMode ? "dark" : "light"}`}>
        <div className={`date-bar ${darkMode ? "dark" : "light"}`}>Today</div> {/* Date Bar */}
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
                <div className={`message-border ${darkMode ? "dark" : "light"}`}>{message.text}</div>

                <div className="message-meta">
                  <div className="timestamp">{message.timestamp}</div>
                  {message.sender === "me" && message.emotionLabel && (
                    <div className={`emotion-label ${message.emotionLabel}`}>
                      <span>{message.emotionLabel}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="input-container">
          <textarea
            ref={textareaRef}
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              setIsTyping(true); // User is typing
            }}
            onInput={(e) => adjustHeight(e.target)}
            placeholder="Type a message"
            className={`input-field ${darkMode ? "dark" : "light"}`}
            rows="1"
            onKeyDown={EnterPressed}
          />
          <button className="send-button" onClick={sendMessage}>
            <img className="send-button-img" src="images/send.png" alt="Send" />
          </button>
        </div>

        {/* Initialize VisageAnalyzer only when the user starts typing */}
        {visageData && (
          <VisageAnalyzer
            videoRef={videoRef}
            canvasRef={canvasRef}
            setVisageData={setVisageData} // Set the data from VisageAnalyzer
            mWidth={mWidth}
            mHeight={mHeight}
            ppixelsRef={ppixelsRef}
            pixelsRef={pixelsRef}
            m_Tracker={m_Tracker}
            TfaceDataArrayRef={TfaceDataArrayRef}
            tmpAnalysisDataRef={tmpAnalysisDataRef}
            m_FaceAnalyserRef={m_FaceAnalyserRef}
          />
        )}

        {/* Conditionally render ImageCapture and pass the required props */}
        {visageData && (
          <ImageCapture
            videoRef={videoRef}
            canvasRef={canvasRef}
            imageCaptured={visageData.imageCaptured}
            setImageCaptured={visageData.setImageCaptured}
            mWidth={mWidth}
            mHeight={mHeight}
            pixelsRef={pixelsRef}
            ppixelsRef={ppixelsRef}
            m_Tracker={m_Tracker}
            TfaceDataArrayRef={TfaceDataArrayRef}
            tmpAnalysisDataRef={tmpAnalysisDataRef}
            m_FaceAnalyserRef={m_FaceAnalyserRef}
          />
        )}
      </div>
    </div>
  );
};

export default Chat;
