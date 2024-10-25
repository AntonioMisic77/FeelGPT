import React from "react";
import "../styles/history.css";

const History = () => {
  const summaries = [
    {
      id: 1,
      text: " Detected anxiety about upcoming work deadlines, leading to feelings of overwhelm. Explored the sources of this anxiety together.",
    },
    {
      id: 2,
      text: "You experienced a panic attack triggered by stress at work. Discussed the emotional impact and the circumstances surrounding the event.",
    },
    {
      id: 3,
      text: "You expressed fluctuating emotions, feeling more positive overall but still facing challenging days. Collaborated to identify triggers for the tougher moments.",
    },
    {
      id: 4,
      text: "Noted avoidance of social situations due to anxiety. Together, we recognized the patterns of avoidance and their effects on the patient’s daily life.",
    },
    {
      id: 5,
      text: "You reported a successful week with daily walks but also mentioned anxiety creeping in during moments of solitude. We examined the relationship between activity and anxiety levels.",
    },
    {
      id: 6,
      text: "Identified persistent negative thoughts, especially during alone time, contributing to anxiety. Explored the nature of these thoughts and their impact on well-being together.",
    },
  ];

  return (
    <div>
      <h2>History</h2>
      <div className="summary-list">
        {summaries.map((summary) => (
          <div>
          <p className="date">25. October 2024. </p>
          <div className="summary-item" key={summary.id}>
            
            <div className="summary-text">{summary.text}</div>
            <div className="summary-buttons">
              <button className="summary-button">View chat</button>
              <button className="summary-button">Delete chat</button>
            </div>
          </div></div>
        ))}

        <button className="button-66-smaller down">Delete all history</button>
      </div>
    </div>
  );
};

export default History;
