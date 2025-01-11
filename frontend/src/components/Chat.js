import React, { useState, useEffect, useRef } from "react";
import "../styles/chat.css";
import "../styles/darkMode.css";
import ImageCapture from "./ImageCapture"; // Import ImageCapture directly
import VisageAnalyzer from "./VisageAnalyzer"; // Import VisageAnalyzer
import chatService from "../services/chatService"; // Import Chat Service
import axiosInstance from "../api/axiosInstance"; // Import axiosInstance

import Cookies from "js-cookie";

const Chat = ({
  darkMode,
  isRecordingVideo,
  setRecordingVideo,
  IsCameraEnabled,
}) => {
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
      // For time and date below messages
      const timestamp = new Date().toLocaleTimeString();

      setMessages([
        ...messages,
        {
          text: inputValue,
          sender: "me",
          timestamp,
          emotionLabel: IsCameraEnabled ? dominantEmotion : "",
        },
        { text: "...", sender: "them", timestamp, isLoading: true },
      ]);
      setInputValue("");
      setIsTyping(false); // Stop visage analysis when message is sent

      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
        textareaRef.current.blur();
      }

      const processedEmotionsCleaned = processedEmotions.slice(1);
      const processedEmotionsSending = processedEmotionsCleaned.map(
        ({ dominant_emotion }) => ({
          dominant_emotion, // Wrap it in an object
        })
      );

      // Remove first value (0,0,0,...)
      const emotionWhileTypingCleaned = emotionWhileTyping.slice(1);
      // Extract data from emotionWhileTyping
      const emotionsArray = emotionWhileTypingCleaned.map(
        ({ age, gender, ...emotions }) => emotions
      );

      const averageAge =
        emotionWhileTypingCleaned.reduce(
          (sum, { age }) => sum + (age || 0),
          0
        ) /
        emotionWhileTypingCleaned.filter(({ age }) => age !== null).length ||
        null;

      // most common gender
      const genderSum = emotionsArray.reduce((sum, value) => sum + value, 0);
      const threshold = emotionsArray.length / 2;
      const mostCommonGender = genderSum[0] < threshold ? 0 : 1;

      const chatData = {
        message: inputValue,
        emotion: IsCameraEnabled ? processedEmotionsSending : [], // Array of emotion arrays while typing
        age: IsCameraEnabled ? averageAge : undefined, // Average age detected
        gender: IsCameraEnabled ? mostCommonGender : undefined, // Most common gender detected
      };

      document.getElementById("textarea-id").focus();

      /* CONNECTION TO BACKEND */
      try {
        const response = await chatService.sendMessageWithEmotion(chatData);
        //.log("Backend response: ", response);
        setMessages((prevMessages) =>
          prevMessages.map((message, index) =>
            index === prevMessages.length - 1
              ? { ...message, text: response.reply, isLoading: false }
              : message
          )
        );

        // for typing letter by letter
        //console.log(response.reply);
        //console.log('messages: ' + messages.length);
        simulateTypingEffect(response.reply);

        // type out the message letter by letter
      } catch (error) {
        console.error("Failed to send message: ", error);
        setMessages((prevMessages) =>
          prevMessages.map((message, index) =>
            index === prevMessages.length - 1
              ? { ...message, text: "Failed to load reply", isLoading: false }
              : message
          )
        );
      }
    }
  };
  const simulateTypingEffect = (fullText) => {
    let currentText = "";
    const typingSpeed = 5;

    const typingInterval = setInterval(() => {
      if (currentText.length < fullText.length) {
        currentText += fullText[currentText.length]; // Append the next character

        setMessages((prevMessages) => {
          // Update only the last message with the new currentText
          const updatedMessages = [...prevMessages];
          updatedMessages[updatedMessages.length - 1] = {
            ...updatedMessages[updatedMessages.length - 1],
            text: currentText, // Update the text progressively
            isLoading: false,
          };

          return updatedMessages;
        });
      }
    }, typingSpeed);
  };

  //for data for switches

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

    //

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
          setImageCaptured: () => { },
        });
      };

      startVisageAnalyzer();
    }
  }, [isTyping, visageData]); // Only start visage analyzer when typing starts and it's not initialized

  //for switches
  const [emotionValues, setEmotionValues] = useState({
    anger: 0,
    disgust: 0,
    fear: 0,
    happiness: 0,
    sadness: 0,
    surprise: 0,
    neutral: 0,
    age: null,
    gender: null,
  });

  // in this is stored all emotions while typing
  const [emotionWhileTyping, setEmotionWhileTyping] = useState([]);

  // Capture the emotions during typing and reset after typing stops
  useEffect(() => {
    if (isTyping) {
      // Clear history at the start of a new typing session
      setEmotionWhileTyping([]);
      setStartTime(Date.now());
    } else {
      if (emotionValues) {
        setEmotionWhileTyping((prev) => [...prev, emotionValues]);
      }
      //console.log("Typing stopped. Final emotion history for session:", emotionWhileTyping);

      // Reset emotionValues after capturing
      setEmotionValues({
        anger: 0,
        disgust: 0,
        fear: 0,
        happiness: 0,
        sadness: 0,
        surprise: 0,
        neutral: 0,
        age: null,
        gender: null,
      });
    }
  }, [isTyping]);

  // Track each new set of emotion values while typing
  useEffect(() => {
    if (isTyping) {
      setEmotionWhileTyping((prev) => [...prev, emotionValues]);
    }
  }, [emotionValues, isTyping]);

  //for emotion lable -> now gets max from last detection
  const [dominantEmotion, setDominantEmotion] = useState(null);
  const [processedEmotions, setProcessedEmotions] = useState(null);
  const [showOverlay, setShowOverlay] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(null);

  useEffect(() => {
    if (emotionWhileTyping.length > 0) {
      if (!startTime) {
        setStartTime(Date.now());
      }
      // Process the emotionWhileTyping array
      const processedEmotions = emotionWhileTyping.map((emotionValues) => {
        // Extract age, gender, and emotions
        const { age, gender, ...emotions } = emotionValues;
        
        emotionValues.neutral = emotionValues.neutral * 0.7;
        
        // Determine the dominant emotion
        let maxEmotion = null;
        let maxEmotionValue = -Infinity;
        const allZero = Object.values(emotions).every((value) => value === 0);
        if (allZero) {
          maxEmotion = "not detected";
        } else {
          for (const [emotion, value] of Object.entries(emotions)) {
            if (value > maxEmotionValue) {
              maxEmotionValue = value;
              maxEmotion = emotion;
            }
          }
        }

        // Return the desired object format
        return {
          dominant_emotion: maxEmotion,
          age,
          gender,
        };
      });

      // Set the processed list
      setProcessedEmotions(processedEmotions);

      // remove the first emotion
      // get time counter: if more seconds have passed than there are
      // detected emotions, than face is not in the camera
      const currentTime = Date.now();
      const elapsedSecondss = Math.floor((currentTime - startTime) / 1000);
      setElapsedSeconds(elapsedSecondss);

      const lastEmotion = processedEmotions[processedEmotions.length - 1];

      // change so that it isnt the last emotion, but most common emotion
      function getMostCommonNonNeutralWord(words, neutralWords) {
        const filteredWords = words.filter(word => !neutralWords.includes(word));
      
        const wordCounts = filteredWords.reduce((counts, word) => {
          counts[word] = (counts[word] || 0) + 1;
          return counts;
        }, {});
        const mostCommonWord = Object.keys(wordCounts).reduce((a, b) => 
          wordCounts[a] > wordCounts[b] ? a : b
        );
      
        return mostCommonWord;
      }
      const dominantEmotions = processedEmotions.map(item => item.dominant_emotion);
      const mostCommonEmotion = getMostCommonNonNeutralWord(dominantEmotions, ['neutral']);

      setDominantEmotion(mostCommonEmotion);


    } else {
      setProcessedEmotions([]); // Reset the list if no data
      setDominantEmotion(null); // Reset the dominant emotion if no data
    }
  }, [emotionWhileTyping]);

  // for overlay -> when face in not in the camera
  const lastChangeRef = useRef(null);
  useEffect(() => {
    const timeoutThreshold = 3000;

    if (isTyping) {
      if (processedEmotions) {
        lastChangeRef.current = Date.now();
        setShowOverlay(false);
      }

      // Check every second if there is no change for 3 seconds
      const interval = setInterval(() => {
        if (lastChangeRef.current) {
          const elapsedTime = Date.now() - lastChangeRef.current;
          if (elapsedTime > timeoutThreshold) {
            setShowOverlay(true);
          }
        }
      }, 1000);

      return () => {
        clearInterval(interval);
      };
    } else {
      setShowOverlay(false);
      lastChangeRef.current = null;
    }
  }, [processedEmotions, isTyping]);

  // getting user image
  const [profileImage, setProfileImage] = useState("");
  const [isProfileImage, setIsProfileImage] = useState(false);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = Cookies.get("authToken");
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

  return (
    <div
      className={`big-container ${isRecordingVideo ? "video-enabled" : ""} `}
    >
      <div
        className={`video-container ${
          isRecordingVideo ? "video-enabled" : ""
        } `}
      >
        <video
          className={`live-video ${isRecordingVideo ? "" : "hidden-video"} ${!showOverlay ? "" : "overlay-video"} `}
          ref={videoRef}
          autoPlay
          style={{
            /* display: IsCameraEnabled ? "inherit" : "none", */
            filter: IsCameraEnabled ? "none" : "brightness(0)",
          }}
        />
        {showOverlay && (
          <div className="warning">
            For optimal performance, ensure your face is fully visible in the
            camera.
          </div>
        )}

        {!IsCameraEnabled && isRecordingVideo && (
          <div className="centered-text">
            Camera is currently disabled and the emotion detection is not
            working.
          </div>
        )}

        {isRecordingVideo && (
          <div
            className={`sliders
            ${showOverlay ? "overlay-camera" : ""}`}
          >
            <div>
              <input
                type="range"
                className="win10-thumb"
                value={emotionValues.anger * 100}
                disabled
                onChange={(e) =>
                  setEmotionValues((prev) => ({
                    ...prev,
                    anger: e.target.value / 100,
                  }))
                }
              />
              <div className="slider-label">ANGER</div>
              <input
                type="range"
                className="win10-thumb"
                value={emotionValues.disgust * 100}
                disabled
                onChange={(e) =>
                  setEmotionValues((prev) => ({
                    ...prev,
                    disgust: e.target.value / 100,
                  }))
                }
              />
              <div className="slider-label">DISGUST</div>
              <input
                type="range"
                className="win10-thumb"
                value={emotionValues.fear * 100}
                disabled
                onChange={(e) =>
                  setEmotionValues((prev) => ({
                    ...prev,
                    fear: e.target.value / 100,
                  }))
                }
              />
              <div className="slider-label">FEAR</div>
              <input
                type="range"
                className="win10-thumb"
                value={emotionValues.happiness * 100}
                disabled
                onChange={(e) =>
                  setEmotionValues((prev) => ({
                    ...prev,
                    happiness: e.target.value / 100,
                  }))
                }
              />
              <div className="slider-label">HAPPINESS</div>
            </div>
            <div>
              <input
                type="range"
                className="win10-thumb"
                value={emotionValues.sadness * 100}
                disabled
                onChange={(e) =>
                  setEmotionValues((prev) => ({
                    ...prev,
                    sadness: e.target.value / 100,
                  }))
                }
              />
              <div className="slider-label">SADNESS</div>
              <input
                type="range"
                className="win10-thumb"
                value={emotionValues.surprise * 100}
                disabled
                onChange={(e) =>
                  setEmotionValues((prev) => ({
                    ...prev,
                    surprise: e.target.value / 100,
                  }))
                }
              />
              <div className="slider-label">SURPRISE</div>
              <input
                type="range"
                className="win10-thumb"
                value={emotionValues.neutral * 100 * 0.7}
                onChange={(e) =>
                  setEmotionValues((prev) => ({
                    ...prev,
                    neutral: e.target.value / 100,
                  }))
                }
              />
              <div className="slider-label">NEUTRAL</div>
            </div>
          </div>
        )}
      </div>

      <div
        className={`chat-container ${darkMode ? "dark" : "light"} ${
          isRecordingVideo ? "video-enabled-chat" : ""
        }
          ${showOverlay ? "overlay-camera" : ""}`}
      >
        <div className={`messages ${darkMode ? "dark" : "light"}`}>
          <div className={`date-bar ${darkMode ? "dark" : "light"}`}>Today</div>{" "}
          {/* Date Bar */}
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
                  className={`message-border ${darkMode ? "dark" : "light"} ${
                    message.isLoading ? "transparent-background" : ""
                  }`}
                >
                  {message.isLoading ? (
                    <div class="dots-bounce-container">
                      <div class="dots-bounce">
                        <div class="dot"></div>
                        <div class="dot"></div>
                        <div class="dot"></div>
                      </div>
                    </div>
                  ) : (
                    <p>{message.text}</p>
                  )}
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
                    {!message.isLoading && message.timestamp}
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

        <div className="input-container">
          <textarea
            id="textarea-id"
            ref={textareaRef}
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              if (IsCameraEnabled) setIsTyping(true); // Only track typing if the camera is enabled
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
        {IsCameraEnabled && visageData && (
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
        {IsCameraEnabled && visageData && (
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
            setEmotionValues={setEmotionValues}
          />
        )}
      </div>
    </div>
  );
};

export default Chat;
