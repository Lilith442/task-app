import { motion } from "framer-motion";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

import Calendar from "./Calendar";
import WeeklyActivity from "./WeeklyActivity";
import Stats from "./Stats";

function DashboardSection({
    selectedDate,
    setSelectedDate,

    changeDay,
    goToToday,

    streak,
    bestStreak,

    tasks,

    percent,

    todayCompleted,
    dailyGoal,
    goalPercent,

    completedTasks,
    activeTasks,

    chartData,
    COLORS,

    goToPreviousMonth,
    goToNextMonth,

    weeklyData,
}) {
  return (
  <>
    <div className="date-navigation">

      <button onClick={() => changeDay(-1)}>
        ◀
      </button>

      <h3>
        {new Date(selectedDate).toLocaleDateString("tr-TR", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })}
      </h3>

      <button
        className="today-btn"
        onClick={goToToday}
      >
        Bugün
      </button>

      <button onClick={() => changeDay(1)}>
        ▶
      </button>

    </div>

    <div className="streak-card">
        <div className="streak-fire">🔥</div>

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

    <div className="selected-date-info">

        📅 Görüntülenen gün    

        <strong>
            {new Date(selectedDate).toLocaleDateString("tr-TR", {
            day: "numeric",
            month: "long",
            year: "numeric"
            })}
        </strong>

    </div>

    <p style={{ opacity: 0.6 }}>
        {tasks.length} görev • {tasks.filter(t => !t.completed).length} aktif
    </p>

    <div className="progress-bar">
        <div
            className="progress-fill"
            style={{ width: percent + "%" }}
        />
    </div>

    <p className="progress-text">
         %{percent} tamamlandı
    </p>

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
                style={{ width: `${goalPercent}%` }}
            />
    
        </div>
    
            <p>
                {goalPercent === 100
                  ? "🎉 Harika! Günlük hedefini tamamladın."
                  : `Bugünkü hedef için ${dailyGoal - todayCompleted} görev kaldı.`}
    
            </p>
    
    </div>

    <Stats
    
        totalTasks={tasks.length}
        completedTasks={completedTasks}
        activeTasks={activeTasks}
        bestStreak={bestStreak}
    
    />

    <div className="chart-card">
    
        <h3>Task Progress</h3>
    
        <ResponsiveContainer width="100%" height={220}>
            <PieChart>
    
                <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                >
                      {chartData.map((entry, index) => (
                        <Cell
                          key={index}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                </Pie>
    
                <Tooltip />
    
            </PieChart>
        </ResponsiveContainer>
    
    </div>

    <Calendar
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        tasks={tasks}
        goToPreviousMonth={goToPreviousMonth}
        goToNextMonth={goToNextMonth}
     />

    <WeeklyActivity
        weeklyData={weeklyData}
    />
  </>
);
}

export default DashboardSection;