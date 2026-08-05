export async function checkRecurringTasks({
  tasks,
  user,
  supabase,
}) {

  if (!user) return;

  const today = new Date();

  const recurringTasks = tasks.filter(
    task =>
      task.repeat_type !== "none" &&
      task.last_generated_date
  );

  console.log(recurringTasks);
}