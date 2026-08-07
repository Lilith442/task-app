import "./WelcomePanel.css";

function WelcomePanel({
  greeting,
  todayText,
  todayTasks,
  overdueTasks,
  goalPercent,
  texts,
}) {
  return (
    <div className="welcome-panel">

      <div className="welcome-top">

        <div>
          <h2>{greeting} 👋</h2>
          <p>{todayText}</p>
        </div>

        <div className="welcome-badge">
          🎯 %{goalPercent}
        </div>

      </div>

      <div className="welcome-stats">

        <div className="welcome-item">
          <span>📌</span>

          <div>
            <strong>{todayTasks}</strong>
            <small>{texts.welcome.todayTasks}</small>
          </div>
        </div>

        <div className="welcome-item">
          <span>⚠️</span>

          <div>
            <strong>{overdueTasks}</strong>
            <small>{texts.welcome.overdueTasks}</small>
          </div>
        </div>

      </div>

    </div>
  );
}

export default WelcomePanel;