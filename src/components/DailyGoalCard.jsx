import { Target } from "lucide-react";

function DailyGoalCard({
  todayCompleted,
  dailyGoal,
  goalPercent,
  texts,
}) {
  return (
    <div className="daily-goal-card">

      <div className="goal-header">

        <h3>
          <Target size={22} />
          {texts.dailyGoal.title}
        </h3>

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
          ? texts.dailyGoal.completed
          : `${texts.dailyGoal.remainingPrefix} ${
              dailyGoal - todayCompleted
            } ${texts.dailyGoal.remainingSuffix}`}
      </p>

    </div>
  );
}

export default DailyGoalCard;