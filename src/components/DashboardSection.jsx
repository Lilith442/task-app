import Calendar from "./Calendar";

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