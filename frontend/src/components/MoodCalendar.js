import React, { useState } from "react";
import "../styles/moodCalendar.css";

// Emotion definitions with associated colors
const emotions = [
  { name: "Anger", color: "#E74C3C" },
  { name: "Disgust", color: "#F39C12" },
  { name: "Fear", color: "#8E44AD" },
  { name: "Happiness", color: "#F1C40F" },
  { name: "Sadness", color: "#3498DB" },
  { name: "Surprise", color: "#2ECC71" },
  { name: "Neutral", color: "lightblue" },
];

const calculateDominantEmotion = (dayData) => {
  if (!dayData || dayData.length === 0)
    return { name: "not detected", color: "lightgray" };
  const summedEmotions = dayData.reduce(
    (acc, probs) => acc.map((sum, i) => sum + probs[i]),
    new Array(emotions.length).fill(0)
  );
  const maxIndex = summedEmotions.indexOf(Math.max(...summedEmotions));
  return emotions[maxIndex];
};

const calculateRowEmotions = (rowData) => {
  if (!rowData || rowData.length === 0) {
    return { colorList: [], totalOccurrences: 0 };
  }

  const colorList = [];
  let totalOccurrences = 0;

  rowData.forEach((em) => {
    const maxIndex = em.indexOf(Math.max(...em));
    const color = emotions[maxIndex].color;
    const occurrences = em[maxIndex];

    for (let i = 0; i < occurrences; i++) {
      colorList.push(color);
    }
    totalOccurrences += occurrences;
  });

  return { colorList, totalOccurrences };
};

const getDaysInMonth = (month, year) => new Date(year, month, 0).getDate();
const getStartDay = (month, year) => {
  const day = new Date(year, month - 1, 1).getDay();
  return day === 0 ? 6 : day - 1;
};

const MoodCalendar = ({ data }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [viewMode, setViewMode] = useState("monthly"); // "monthly" or "yearly"

  const renderMonthCalendar = (monthData, year, month) => {
    const daysInMonth = getDaysInMonth(month, year);
    const startDay = getStartDay(month, year);
    const weeks = [];
    let day = 1;

    for (let i = 0; i < 6; i++) {
      const week = [];
      for (let j = 0; j < 7; j++) {
        if ((i === 0 && j < startDay) || day > daysInMonth) {
          week.push(null);
        } else {
          const dateKey = `${year}-${month.toString().padStart(2, "0")}-${day
            .toString()
            .padStart(2, "0")}`;
          const dayData = monthData[dateKey];
          const dominantEmotion = calculateDominantEmotion(dayData);
          const rowEmotions = calculateRowEmotions(dayData);
          week.push({
            day,
            color: dominantEmotion.color,
            emotion: dominantEmotion.name,
            rowEmotions,
          });
          day++;
        }
      }
      weeks.push(week);
    }

    return (
      <div className="month-container" key={`${year}-${month}`}>
        <h3>{`${new Date(year, month - 1).toLocaleString("default", {
          month: "long",
        })} ${year}`}</h3>
        <div className="calendar-grid">
          <div className="calendar-header">
            <div>Mon</div>
            <div>Tue</div>
            <div>Wed</div>
            <div>Thu</div>
            <div>Fri</div>
            <div>Sat</div>
            <div>Sun</div>
          </div>
          <div className="calendar-body">
            {weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="calendar-week">
                {week.map((day, dayIndex) => (
                  <div
                    key={dayIndex}
                    className={`calendar-day ${day ? "active" : ""}`}
                    style={{
                      backgroundColor: day ? day.color : "transparent",
                    }}
                    title={day ? `${day.day} - ${day.emotion}` : ""}
                  >
                    {day && <span className="day-number">{day.day}</span>}
                    {day &&
                      day.rowEmotions &&
                      day.rowEmotions.colorList.length > 0 && (
                        <div className="hover-element">
                          <div
                            className="hover-element-segment"
                            style={{
                              background: `linear-gradient(to right, ${day.rowEmotions.colorList.join(
                                ", "
                              )})`,
                              width: "100%",
                            }}
                          />
                        </div>
                      )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // for year calendar

  const renderYearCalendar = (year) => {
    const yearData = Object.keys(data).reduce((acc, dateKey) => {
      const [keyYear, keyMonth] = dateKey.split("-");
      if (parseInt(keyYear, 10) === year) {
        if (!acc[keyMonth]) acc[keyMonth] = {};
        acc[keyMonth][dateKey] = data[dateKey];
      }
      return acc;
    }, {});

    return (
      <div className="year-container">
        {Array.from({ length: 12 }, (_, index) => {
          const month = index + 1;
          const monthKey = month.toString().padStart(2, "0");
          const monthData = yearData[monthKey];

          return (
            <div key={month} className="yearly-month">
              {renderMonthCalendar(monthData || {}, year, month)}
            </div>
          );
        })}
      </div>
    );
  };

  const nextMonth = () => {
    if (currentMonth === 12) {
      setCurrentMonth(1);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const prevMonth = () => {
    if (currentMonth === 1) {
      setCurrentMonth(12);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  // for montly calendar
  return (
    <div className="calendar-wrapper">
      <div className="calendar-navigation">
        <button className="calendar-button" onClick={() => setViewMode("monthly")} >
          Monthly View
        </button>
        <button className="calendar-button" onClick={() => setViewMode("yearly")}>
          Yearly View
        </button>
      </div>

      {viewMode === "monthly" ? (
        <div className="monthly-view">
          <div className="calendar-navigation-month">
            <button className="calendar-button-month " onClick={prevMonth}>&lt;</button>
            {renderMonthCalendar(data, currentYear, currentMonth)}
            <button className="calendar-button-month" onClick={nextMonth}>&gt;</button>
            
          </div>
          
        </div>
      ) : (
        <div className="yearly-view">
          
          {renderYearCalendar(currentYear)}
        </div>
      )}
    </div>
  );
};

export default MoodCalendar;
