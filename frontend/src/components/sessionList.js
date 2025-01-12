import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/sessionList.css";

const SessionList = ({ sessions }) => {
  const navigate = useNavigate();

  const handleSessionClick = (sessionId) => {
    navigate(`/chat-history/${sessionId}`);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getDate()}. ${date.toLocaleString("default", {
      month: "long",
    })} ${date.getFullYear()}.`;
  };

  // Helper function to check if a session exists for the given date
  const findSessionForDate = (targetDate) => {
    return sessions.find(
      (session) => new Date(session.startTime).toDateString() === targetDate.toDateString()
    );
  };

  // Get today's date and the previous and next days
  const today = new Date();
  const dayBefore = new Date(today);
  dayBefore.setDate(today.getDate() - 1);
  const dayAfter = new Date(today);
  dayAfter.setDate(today.getDate() + 1);

  const sessionToday = findSessionForDate(today);
  const sessionDayBefore = findSessionForDate(dayBefore);
  const sessionDayAfter = findSessionForDate(dayAfter);

  return (
    <div className="session-list">
      <button onClick={() => navigate("/my-info")} 
      className="session-button carousel-tab">
        History
      </button>

      {sessionDayBefore && (
        <button
          onClick={() => handleSessionClick(sessionDayBefore.id)}
          className="session-button carousel-tab"
        >
          {formatDate(sessionDayBefore.startTime)}
        </button>
      )}

      {sessionToday && (
        <button
          onClick={() => handleSessionClick(sessionToday.id)}
          className="session-button carousel-tab"
        >
          {formatDate(sessionToday.startTime)}
        </button>
      )}

      {sessionDayAfter && (
        <button
          onClick={() => handleSessionClick(sessionDayAfter.id)}
          className="session-button carousel-tab"
        >
          {formatDate(sessionDayAfter.startTime)}
        </button>
      )}
    </div>
  );
};

export default SessionList;
