function StreakCard({
  streak,
  bestStreak,
}) {
  return (
    <div className="streak-card">

      <div className="streak-fire">
        🔥
      </div>

      <div>

        <h3>{streak} Günlük Seri</h3>

        <p>
          {streak > 0
            ? "Bugün görev tamamlandı ✅"
            : "Bugün henüz görev tamamlanmadı"}
        </p>

        <p className="best-streak">
          🏆 En İyi Seri: {bestStreak} Gün
        </p>

      </div>

    </div>
  );
}

export default StreakCard;