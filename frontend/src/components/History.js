import React, { useState, useEffect } from "react";
import "../styles/darkMode.css";
import "../styles/history.css";
import chatService from "../services/chatService";
import { useNavigate } from "react-router-dom";

const History = ({ darkMode }) => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const sessionData = await chatService.getAllSessions();
      console.log("fetched session data: ", sessionData);
      setSessions(sessionData);
      
    } catch (err) {
      console.error("Error loading sessions:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("Updated sessions: ", sessions);
  }, [sessions]);

  const handleDeleteSession = async (sessionId) => {
    if (window.confirm("Are you sure you want to delete this chat session?")) {
      try {
        await chatService.deleteSession(sessionId);
        // Refresh sessions after deletion
        fetchSessions();
      } catch (err) {
        console.error("Error deleting session:", err);
      }
    }
  };

  const handleDeleteAllSessions = async () => {
    if (window.confirm("Are you sure you want to delete all chat session?")) {
      try {
        await chatService.deleteAllSessions();
        // Refresh sessions after deletion
        fetchSessions();
      } catch (err) {
        console.error("Error deleting session:", err);
      }
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    console.log('date u history:', date);
    return `${date.getDate()}. ${date.toLocaleString("default", {
      month: "long",
    })} ${date.getFullYear()}.`;
  };

  if (loading) {
    return <h2>History</h2>;
  }

  return (
    <div className="history-container">
      <h2 className="history">History</h2>
      <div className={`summary-list ${darkMode ? "dark" : "light"}`}>
        {sessions.length === 0 ? (
          <div className={`summary-item ${darkMode ? "dark" : "light"}`}>
            <div className={`summary-text ${darkMode ? "dark" : "light"}`}>
              No history data available
            </div>
          </div>
        ) : (
          <>
            {sessions.map((session) => (
              <div /* hidden={session.status == "active"} */ key={session.id}>
                <p className="date">{formatDate(session.startTime)}</p>
                <div className={`summary-item ${darkMode ? "dark" : "light"}`}>
                  <div
                    className={`summary-text ${darkMode ? "dark" : "light"}`}
                  >
                    {session.summary}
                  </div>
                  <div
                    className={`summary-buttons ${darkMode ? "dark" : "light"}`}
                  >
                    <button
                      className="summary-button view"
                      onClick={() => navigate(`/chat-history/${session.id}`)}
                    >
                      View chat
                    </button>
                    <button
                      className="summary-button"
                      onClick={() => handleDeleteSession(session.id)}
                    >
                      Delete chat
                    </button>
                  </div>
                </div>
              </div>
            ))}
            <button
              className={`button-66-smaller down ${
                darkMode ? "dark" : "light"
              }`}
              onClick={() => handleDeleteAllSessions()}
            >
              Delete all history
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default History;
