export async function checkRecurringTasks({

  tasks,
  user,
  supabase

}) {

  console.log("🔁 Recurring task kontrolü başladı");

  const recurringTasks = tasks.filter(
    task => task.repeat_type !== "none"
  );

  console.log(recurringTasks);

  for (const task of recurringTasks) {

    console.log(
        `Kontrol ediliyor: ${task.text}`
    );

}

}