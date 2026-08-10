export function useDashboardStats(tasks, selectedDate, texts) {
  const selectedTasks = tasks.filter(
    task => task.due_date === selectedDate
  );

  const completedSelectedTasks = selectedTasks.filter(
    task => task.completed
  );

  const completedTasks = completedSelectedTasks.length;

  const activeTasks =
    selectedTasks.length - completedTasks;

  const percent =
    selectedTasks.length === 0
      ? 0
      : Math.round(
          (completedTasks / selectedTasks.length) * 100
        );

  const chartData = [
  {
    name: texts.chart.completed,
    value: completedTasks,
  },
  {
    name: texts.chart.active,
    value: activeTasks,
  },
];

  const COLORS = ["#0f5c63", "#4f9da6"];

  const weekDays = texts.weekDays;

const weeklyData = weekDays.map((day, index) => {
  const count = tasks.filter(task => {
    if (!task.completed_at) return false;

    const completedDay = new Date(task.completed_at).getDay();

    const convertedDay =
      completedDay === 0 ? 6 : completedDay - 1;

    return convertedDay === index;
  }).length;

  return {
    day,
    count,
  };
});

  const calculateStreak = () => {
    const completedDates = tasks
      .filter(task => task.completed_at)
      .map(task =>
        new Date(task.completed_at)
          .toISOString()
          .split("T")[0]
      );

    const uniqueDays = [...new Set(completedDates)]
      .sort()
      .reverse();

    let streak = 0;

    const today = new Date();

    for (let i = 0; i < uniqueDays.length; i++) {
      const checkDate = new Date(today);

      checkDate.setDate(today.getDate() - i);

      const formatted = checkDate
        .toISOString()
        .split("T")[0];

      if (uniqueDays.includes(formatted)) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  };

  const calculateBestStreak = () => {
    const completedDates = tasks
      .filter(task => task.completed_at)
      .map(task =>
        new Date(task.completed_at)
          .toISOString()
          .split("T")[0]
      );

    const uniqueDays = [...new Set(completedDates)].sort();

    if (uniqueDays.length === 0) return 0;

    let best = 1;
    let current = 1;

    for (let i = 1; i < uniqueDays.length; i++) {
      const previous = new Date(uniqueDays[i - 1]);
      const currentDate = new Date(uniqueDays[i]);

      const diff =
        (currentDate - previous) /
        (1000 * 60 * 60 * 24);

      if (diff === 1) {
        current++;
      } else {
        current = 1;
      }

      if (current > best) {
        best = current;
      }
    }

    return best;
  };

  const streak = calculateStreak();
  const bestStreak = calculateBestStreak();

  return {
    selectedTasks,
    completedTasks,
    activeTasks,
    percent,
    chartData,
    COLORS,
    streak,
    bestStreak,
    weeklyData,
  };
}