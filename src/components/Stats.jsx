import React from "react";
import "./Stats.css";

function Stats({
  totalTasks,
  completedTasks,
  activeTasks,
  bestStreak,
  texts,
}) {
  return (
    <div className="stats-grid">

      <div className="stat-card">
        <h3>{totalTasks}</h3>
        <p>{texts.stats.totalTasks}</p>
      </div>

      <div className="stat-card">
        <h3>{completedTasks}</h3>
        <p>{texts.stats.completed}</p>
      </div>

      <div className="stat-card">
        <h3>{activeTasks}</h3>
        <p>{texts.stats.active}</p>
      </div>

      <div className="stat-card">
        <h3>{bestStreak}</h3>
        <p>{texts.stats.bestStreak} 🔥</p>
      </div>

    </div>
  );
}

export default Stats;