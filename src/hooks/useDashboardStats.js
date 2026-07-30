export function useDashboardStats(tasks, selectedDate) {

    const selectedTasks = tasks.filter(
        task => task.due_date === selectedDate
    );

    const completedTasks = selectedTasks.filter(
        task => task.completed
    ).length;

    const activeTasks =
        selectedTasks.length - completedTasks;

    const percent =
        selectedTasks.length === 0
            ? 0
            : Math.round(
                (completedTasks /
                    selectedTasks.length) *
                    100
            );

    return {

        selectedTasks,

        completedTasks,

        activeTasks,

        percent,

    };

}