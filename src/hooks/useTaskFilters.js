export function useTaskFilters({
  tasks,
  selectedDate,
  filter,
  search,
}) {
  return tasks
    .filter(task => {
      if (!task.due_date) return false;

      return task.due_date === selectedDate;
    })
    .filter(task => {
      if (filter === "completed") return task.completed;

      if (filter === "active") return !task.completed;

      return true;
    })
    .filter(task =>
      task.text
        .toLowerCase()
        .includes(search.toLowerCase())
    );
}