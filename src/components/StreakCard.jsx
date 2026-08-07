import { Flame, Trophy } from "lucide-react";

function StreakCard({
  streak,
  bestStreak,
  texts,
}) {
  return (
    <div className="streak-card">

      <div className="streak-fire">
        <Flame size={54} strokeWidth={2.3}/>
      </div>

      <div className="streak-content">

        <span className="streak-label">
          {texts.streak.title}
        </span>

        <h2 className="streak-number">
        {streak} {texts.streak.day}
        </h2>

        <p className="streak-message">
          {streak > 0
            ? texts.streak.completed
            : texts.streak.waiting}
        </p>

        <div className="streak-divider"></div>

        <p className="best-streak">
            <Trophy size={15}/>
            {" "}
            {texts.streak.best}: {bestStreak} {texts.streak.day}
        </p>

      </div>

    </div>
  );
}

export default StreakCard;