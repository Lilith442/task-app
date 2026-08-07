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

    texts,
    language,

})
{

  return (
    <>
    <Calendar
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        tasks={tasks}
        goToPreviousMonth={goToPreviousMonth}
        goToNextMonth={goToNextMonth}

        texts={texts}
        language={language}
    />
  </>
  );
}

export default DashboardSection;