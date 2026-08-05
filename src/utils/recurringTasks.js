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
  const today = new Date().toISOString().split("T")[0];

  for (const task of recurringTasks) {
    if (!task.due_date) {
        continue;
    }

    console.log(`Kontrol ediliyor: ${task.text}`);

    const dueDate = new Date(task.due_date);
    const currentDate = new Date(today);

    const diffDays = Math.floor(
        (currentDate - dueDate) /
        (1000 * 60 * 60 * 24)
    );

    console.log(diffDays);

    let shouldCreate = false;

if (task.repeat_type === "daily" && diffDays > 0) {

    shouldCreate = diffDays >= 1;

}

if (task.repeat_type === "every2days") {

    shouldCreate =
        diffDays >= 2 &&
        diffDays % 2 === 0;

}

if (task.repeat_type === "weekly") {

    shouldCreate =
        diffDays >= 7 &&
        diffDays % 7 === 0;

}

console.log("Oluşturulsun mu?", shouldCreate);
if (!shouldCreate) continue;

const alreadyExists = tasks.some(
    t =>
        t.text === task.text &&
        t.due_date === today
);

console.log("Bugün zaten var mı?", alreadyExists);
if (alreadyExists) {
    continue;
}

const { error } = await supabase
    .from("tasks")
    .insert([
        {
            text: task.text,
            category: task.category,
            priority: task.priority,
            repeat_type: task.repeat_type,
            user_id: user.id,
            due_date: today,
            status: "todo",
            completed: false,
            position: tasks.length,
        },
    ]);

if (error) {
    console.error(error);
} else {
    console.log("✅ Tekrarlayan görev oluşturuldu:", task.text);
}

}

}
