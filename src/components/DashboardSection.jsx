import Calendar from "./Calendar";
import StreakCard from "./StreakCard";

function DashboardSection({
    selectedDate,
    setSelectedDate,

    streak,
    bestStreak,

    tasks,

    goToPreviousMonth,
    goToNextMonth,
}) {
  return (
    <>
      <StreakCard
        streak={streak}
        bestStreak={bestStreak}
      />

      <Calendar
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        tasks={tasks}
        goToPreviousMonth={goToPreviousMonth}
        goToNextMonth={goToNextMonth}
      />
    </>
  );
}

export default DashboardSection;