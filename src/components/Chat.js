import React, { useState, useEffect, useRef } from "react";
import "../styles/chat.css";
import axios from "axios";
import VisageLoader from "./VisageLicenceLoad"; 
import VisageAnalyzer from "./VisageAnalyzer";
import CalendarCarousel from './CalendarCarousel';

/* PROBLEMS and TASKS:
  -> when there are multiple messages, upper disappear, they cant be seen any more 
  -> add time beneath sent and received messages - down left
  -> don't know if messages from LLM should appear letter by letter on in one piece
  -> dark mode doesnt work -> but that is for later
  > for camera part -> add drop down where user chooses if camera is used, and to display current camera input*/
const Chat = ({ darkMode }) => {
  
  /* TASK: get messages from LLM  -> axios code down*/
  const [messages, setMessages] = useState([
    { text: "Good Morning! What are you up to today, given the fact that you haven't been feeling good yesterday?", sender: "them" },
    { text: " I woke up feeling pretty good today! The sun is shining, and I'm ready to tackle whatever comes my way.", sender: "me" },
    { text: "That's awesome to hear! ☀️ I love those sunny mornings—they really set a positive tone for the day.", sender: "them" },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [showVisage, setShowVisage] = useState(false);

  const messagesEndRef = useRef(null);


  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Function that keeps the chat scrolled to the bottom
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Puts new message in messages and triggers VisageAnalyzer
  const sendMessage = async () => {
    if (inputValue.trim()) {
      setMessages([...messages, { text: inputValue, sender: "me" }]);
      setInputValue("");

      //TASK
      // Optionally send the message to backend
      /* try {
        await axios.post("YOUR_BACKEND_API_URL", {
          message: inputValue, 
          user: "user"
        });
      } catch (error) {
        console.error("Error sending post message to backend:", error);
      } */

      // Trigger VisageAnalyzer by toggling showVisage

      setShowVisage(false); // Temporarily hide
      setTimeout(() => {    
        setShowVisage(true); // Re-show after short delay
      }, 100); // Re-show after short delay
    }
  };

  // When Enter is pressed while typing, messages will be sent
  const EnterPressed = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  };

  //dates for DataCarousel
  const dates = [
    '2024-01-01',
    '2024-02-01',
    '2024-03-01',
    '2024-04-01',
    '2024-05-01',
    '2024-01-01',
    '2024-02-01',
    '2024-03-01',
    '2024-04-01',
    '2024-05-01',
    '2024-01-01',
    '2024-02-01',
    '2024-03-01',
    '2024-04-01',
    '2024-05-01',
    '2024-01-01',
    '2024-02-01',
    '2024-03-01',
    '2024-04-01',
    '2024-05-01',
    '2024-01-01',
    '2024-02-01',
    '2024-03-01',
    '2024-04-01',
    '2024-05-01',   
];

  return (
    <div className={`chat-container ${darkMode ? "dark" : "light"}`}>
      
      <div className="messages">
      {/* <CalendarCarousel dates={dates} /> */}
        {messages.map((message, index) => (
          <div className="message-container" key={index}>
            <div className={`message ${message.sender}`}>
              {message.sender === 'them' && (
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRE6zuMAkAaFxsS0nM0JLKYeEHgqJn5hBhNQg&s"
                  alt=""
                  className="user-picture chat"
                />
              )}
              <div className="message-border ">{message.text}</div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="input-container">
        <textarea
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Type a message"
          className="input-field"
          rows="1"
          onKeyDown={EnterPressed}
        />
        <button className="send-button" onClick={sendMessage}>
          <img className="send-button-img" src="https://cdn-icons-png.freepik.com/512/5582/5582878.png" alt="" />
        </button>
      </div>

      {/* Conditionally render VisageAnalyzer */}
      { showVisage && <VisageAnalyzer />}
    </div>
  );
};

export default Chat;
