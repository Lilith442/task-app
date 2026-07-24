import { Flame, Trophy } from "lucide-react";

function StreakCard({
  streak,
  bestStreak,
}) {
  return (
    <div className="streak-card">

      <div className="streak-fire">
        <Flame size={54} strokeWidth={2.3}/>
      </div>

      <div className="streak-content">

        <span className="streak-label">
          Daily Streak
        </span>

        <h2 className="streak-number">
          {streak} Gün
        </h2>

        <p className="streak-message">
          {streak > 0
            ? "Bugün görev tamamlandı ✅"
            : "İlk görevin seni bekliyor 🚀"}
        </p>

        <div className="streak-divider"></div>

        <p className="best-streak">
          <Trophy size={15}/>
           {" "} En İyi Seri: {bestStreak} Gün
        </p>

      </div>

    </div>
  );
}

export default StreakCard;