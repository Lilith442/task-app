import React from "react";
import "./WeeklyActivity.css";
import { BarChart3 } from "lucide-react";

function WeeklyActivity({
  weeklyData,
  texts,
}) {
  return (
    <div className="weekly-card">

      <h3>
        <BarChart3 size={22} />
        {texts.weeklyActivity.title}
      </h3>

      {weeklyData.map((item) => (

        <div
          key={item.day}
          className="week-row"
        >

          <span className="week-day">
            {item.day}
          </span>

          <div className="week-bar">

            <div
              className="week-fill"
              style={{
                width: `${Math.min(item.count * 20, 100)}%`,
              }}
            />

          </div>

          <span className="week-count">
            {item.count}
          </span>

        </div>

      ))}

    </div>
  );
}

export default WeeklyActivity;