
export function useTaskFilters({
  tasks,
  selectedDate,
  filter,
  search,
}) {

console.log(
  "GÖREV FİLTRE DETAYI:",
  JSON.stringify({
    selectedDate,
    taskCount: tasks.length,
    matchingDateCount: tasks.filter(
      (task) => task.due_date === selectedDate
    ).length,
    filter,
    search,
    matchingAfterStatus: tasks
      .filter((task) => task.due_date === selectedDate)
      .filter((task) => {
        if (filter === "completed") return task.completed;
        if (filter === "active") return !task.completed;
        return true;
      }).length,
  })
);


  return tasks
    .filter((task) => {
      if (!task.due_date) return false;

      return task.due_date === selectedDate;
    })
    .filter((task) => {
      if (filter === "completed") return task.completed;

      if (filter === "active") return !task.completed;

      return true;
    })
    .filter((task) =>
      task.text
        .toLowerCase()
        .includes(search.toLowerCase())
    );
}
