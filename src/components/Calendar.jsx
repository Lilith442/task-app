import React from "react";
import "./Calendar.css";
import { CalendarDays } from "lucide-react";

function Calendar({

    selectedDate,
    setSelectedDate,
    tasks,
    goToPreviousMonth,
    goToNextMonth

}) {
const tasksByDate = tasks.reduce((acc, task) => {

  if (!task.due_date) return acc;

  acc[task.due_date] = (acc[task.due_date] || 0) + 1;

  return acc;

}, {});

const currentDate = new Date(selectedDate);

const currentMonth = currentDate.getMonth();

const currentYear = currentDate.getFullYear();

const firstDay = new Date(currentYear, currentMonth, 1);

const daysInMonth = new Date(
  currentYear,
  currentMonth + 1,
  0
).getDate();

const startDay = (firstDay.getDay() + 6) % 7;

const calendarDays = [];

for (let i = 0; i < startDay; i++) {
  calendarDays.push(null);
}

for (let day = 1; day <= daysInMonth; day++) {
  calendarDays.push(day);
}

while (calendarDays.length < 42) {
  calendarDays.push(null);
}
  return (
    
  <div className="calendar-card">
    
      <h3>
    <CalendarDays size={22}/>
          Takvim
      </h3>

      <div className="calendar-header">

          <button
              className="calendar-nav"
              onClick={goToPreviousMonth}
          >
              ‹
          </button>

          <h4>
              {new Date(selectedDate).toLocaleDateString("tr-TR",{
                  month:"long",
                  year:"numeric"
              })}
          </h4>

          <button
              className="calendar-nav"
              onClick={goToNextMonth}
          >
              ›
          </button>

      </div>
    
                <div className="calendar-weekdays">
    
                  <span>Pzt</span>
    
                  <span>Sal</span>
    
                  <span>Çar</span>
    
                  <span>Per</span>
    
                  <span>Cum</span>
    
                  <span>Cmt</span>
    
                  <span>Paz</span>
    
                </div>
    
                <div className="calendar-grid">
                  
                  {calendarDays.map((day, index) => {
                    const isSelected =
                      day &&
                      selectedDate ===
                        `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                        const dateKey =
                          day &&
                          `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    
                        const hasTasks = day && tasksByDate[dateKey];
                        const isToday =
                        day &&
                        new Date().toISOString().split("T")[0] === dateKey;
                        return (
                    <div
                    
                      key={index}
                      onClick={() => {
                        if (!day) return;
    
                        setSelectedDate(
                          `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
                        );
                      }}
                                        
                      className={`calendar-day ${day ? "" : "empty"}
                      ${isSelected ? "selected-day" : ""}
                      ${isToday ? "today-day" : ""}
                      `}
                      
                    >
                      <>
                        <span>{day}</span>
    
                        {hasTasks && (
                          <div className="calendar-dot"></div>
                        )}
                      </>
                      
                    </div>
                    );
                  })}
    
                </div>
    
              </div>

  );

}

export default Calendar;