import React from "react";
import "./Stats.css";

function Stats({

    totalTasks,
    completedTasks,
    activeTasks,
    bestStreak

}) {
  return (

          <div className="stats-grid">

            <div className="stat-card">
              <h3>{totalTasks}</h3>
              <p>Total Tasks</p>
            </div>

            <div className="stat-card">
              <h3>{completedTasks}</h3>
              <p>Completed</p>
            </div>

            <div className="stat-card">
              <h3>{activeTasks}</h3>
              <p>Active</p>
            </div>

            <div className="stat-card">
              <h3>{bestStreak}</h3>
              <p>Best Streak 🔥</p>
            </div>

          </div>

    );

}
export default Stats;