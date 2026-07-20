function DailyGoalCard({
  todayCompleted,
  dailyGoal,
  goalPercent,
}) {
  return (
    <div className="daily-goal-card">

      <div className="goal-header">
        <h3>🎯 Günlük Hedef</h3>

        <span>
          {todayCompleted} / {dailyGoal}
        </span>
      </div>

      <div className="goal-progress">
        <div
          className="goal-progress-fill"
          style={{
            width: `${goalPercent}%`,
          }}
        />
      </div>

      <p>
        {goalPercent === 100
          ? "🎉 Harika! Günlük hedefini tamamladın."
          : `Bugünkü hedef için ${
              dailyGoal - todayCompleted
            } görev kaldı.`}
      </p>

    </div>
  );
}

export default DailyGoalCard;