import React, { useState } from 'react';
import "../styles/chat.css";

const CalendarCarousel = ({ dates }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const handleNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % dates.length);
    };

    const handlePrev = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + dates.length) % dates.length);
    };

    return (
        <div className="date-carousel">
            <button onClick={handlePrev} className="arrow left-arrow">←</button>
            <div className="date-display">
                {dates.map((date, index) => (
                    <span
                        key={index}
                        className={`date-item ${index === currentIndex ? 'active' : ''}`}
                    >
                        {date}
                    </span>
                ))}
            </div>
            <button onClick={handleNext} className="arrow right-arrow">→</button>
        </div>
    );
};

export default CalendarCarousel;
