import Calendar from "./Calendar";

function DashboardSection({
    selectedDate,
    setSelectedDate,

    tasks,

    percent,

    selectedTasks,

    selectedCompleted,

    dailyGoal,

    goalPercent,

    chartData,

    COLORS,

    weeklyData,

    goToPreviousMonth,
    goToNextMonth,
}) {
  return (
    <>
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