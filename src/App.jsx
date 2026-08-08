/*App.jsx*/

import { useState, useEffect } from "react";
import { supabase } from "./supabase";
import { motion, AnimatePresence } from "framer-motion";
import Header from "./components/Header";
import DeleteModal from "./components/DeleteModal";
import Toast from "./components/Toast";
import TaskList from "./components/tasks/TaskList";
import Board from "./components/tasks/Board";
import { checkRecurringTasks } from "./utils/recurringTasks";
import "./components/Login.css";
import "./styles/Theme.css";
import "./styles/Layout.css";
import "./components/Search.css";
import DashboardSection from "./components/DashboardSection";
import TaskForm from "./components/TaskForm";
import ToolbarSection from "./components/ToolbarSection";
import { useCalendarNavigation } from "./hooks/useCalendarNavigation";
import ProgressOverview from "./components/ProgressOverview";
import DailyGoalCard from "./components/DailyGoalCard";
import Stats from "./components/Stats";
import ChartCard from "./components/ChartCard";
import WeeklyActivity from "./components/WeeklyActivity";
import StreakCard from "./components/StreakCard";
import { useDashboardStats } from "./hooks/useDashboardStats";
import { useTaskFilters } from "./hooks/useTaskFilters";
import WelcomePanel from "./components/WelcomePanel";
import { tr } from "./locales/tr";
import { en } from "./locales/en";

// 🔥 ITEM

function App() {
  const [tasks, setTasks] = useState([]);
  const [subtasks, setSubtasks] = useState([]);
  const [input, setInput] = useState("");
  const [category, setCategory] = useState("Genel");
  const [priority, setPriority] = useState("medium");
  const [repeatType, setRepeatType] = useState("none");
  const [selectedDate, setSelectedDate] = useState(() => {
    return new Date().toISOString().split("T")[0];
  });
  const [filter, setFilter] = useState(() => {
  return localStorage.getItem("filterMode") || "all";
  });
  const [search, setSearch] = useState(() => {
  return localStorage.getItem("searchText") || "";
  });
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
  return localStorage.getItem("darkMode") === "true";
  });
  const [view, setView] = useState(() => {
  return localStorage.getItem("viewMode") || "list";
  });
  const [toast, setToast] = useState({
  message: "",
  type: ""
  });
  const [draggedTask, setDraggedTask] = useState(null);
  const [activeColumn, setActiveColumn] = useState(null);
  const [language, setLanguage] = useState(() => {
  return localStorage.getItem("language") || "tr";
  });
  const texts = language === "tr" ? tr : en;
  const [deleteId, setDeleteId] = useState(null);

  // 🌙 DARK MODE
  useEffect(() => {
    document.body.classList.toggle("dark", darkMode);
  }, [darkMode]);

  useEffect(() => {
  localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem("viewMode", view);
  }, [view]);

  useEffect(() => {
    localStorage.setItem("filterMode", filter);
  }, [filter]);

  useEffect(() => {
    localStorage.setItem("searchText", search);
  }, [search]);

  useEffect(() => {
  localStorage.setItem("language", language);
}, [language]);

  // 🔐 AUTH
  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      setUser(data.session?.user || null);
    };

    getSession();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user || null);
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);


const showToast = (message, type = "success") => {
  setToast({ message, type });

  setTimeout(() => {
    setToast({
      message: "",
      type: ""
    });
  }, 2000);
};

  const signUp = async () => {
    setMessage("");
    const { error } = await supabase.auth.signUp({
      email,
      password: "123456"
    });
    if (error) setMessage(error.message);
    else {
    setMessage(texts.login.verifyMail);
    showToast(texts.login.signupSuccess, "success");
}
  };

  const login = async () => {
    setMessage("");
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: "123456"
    });

    if (error) setMessage(error.message);
    setLoading(false);
    if (!error) {
    showToast(texts.login.loginSuccess, "success");
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setTasks([]);
  };

  const fetchTasks = async () => {
  setLoading(true);

  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .eq("user_id", user.id)
    .order("position", { ascending: true });

  if (error) {
    console.error(error);
    setLoading(false);
    return;
  }

  setTasks(data || []);
  setLoading(false);
};

const fetchSubtasks = async () => {
  const { data, error } = await supabase
    .from("subtasks")
    .select("*");

  if (error) {
    console.error(error);
    return;
  }

  setSubtasks(data || []);
};
  

  // 📦 FETCH + REALTIME
useEffect(() => {
  if (!user) return;

  fetchTasks();

  const channel = supabase
    .channel("tasks-realtime")

    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "tasks",
        filter: `user_id=eq.${user.id}`
      },

      () => {
        fetchTasks();
        fetchSubtasks(
          
        );
      }
    )

    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };

}, [user]);

useEffect(() => {

  if (!user || tasks.length === 0) return;

  checkRecurringTasks({
    tasks,
    user,
    supabase,
  });

}, [tasks, user]);

  // ➕ ADD TASK
 const addTask = async () => {

  if (!input.trim()) {
    showToast(texts.toast.taskEmpty, "warning");
    return;
  }

  setLoading(true);

  const tasksToInsert = [];

  const startDate = new Date(selectedDate);

  const recurringGroupId =
  repeatType === "none"
    ? null
    : crypto.randomUUID();

  const createTask = (date) => ({
    text: input,
    category,
    priority,
    repeat_type: repeatType,
    user_id: user.id,
    status: "todo",
    completed: false,
    due_date: date.toISOString().split("T")[0],
    position: tasks.length + tasksToInsert.length,
    last_generated_date: date.toISOString().split("T")[0],
    recurring_group_id: recurringGroupId,
  });
if (repeatType === "none") {

    tasksToInsert.push(createTask(startDate));

}

if (repeatType === "daily") {

  for (let i = 0; i < 30; i++) {

    const date = new Date(startDate);
    date.setDate(date.getDate() + i);

    tasksToInsert.push(createTask(date));
  }

}

if (repeatType === "weekly") {

  for (let i = 0; i < 12; i++) {

    const date = new Date(startDate);
    date.setDate(date.getDate() + i * 7);

    tasksToInsert.push(createTask(date));
  }

}

if (repeatType === "every2days") {

  for (let i = 0; i < 30; i++) {

    const date = new Date(startDate);
    date.setDate(date.getDate() + i * 2);

    tasksToInsert.push(createTask(date));
  }

}
const { data, error } = await supabase
  .from("tasks")
  .insert(tasksToInsert)
  .select();

if (error) {
  console.error(error);
  setLoading(false);
  return;
}

setTasks(prev => [...prev, ...data]);
  setInput("");
  setRepeatType("none");
  setLoading(false);

  showToast(texts.toast.taskAdded, "success");
};

const addSubtask = async (taskId, text) => {

  console.log("🚀 addSubtask çalıştı", taskId, text);

  const { data, error } = await supabase
    .from("subtasks")
    .insert([
      {
        task_id: taskId,
        text,
        completed: false
      }
    ])
    .select();

  console.log("DATA:", data);
  console.log("ERROR:", error);

  if (error) {
  console.error(error);
  return;
  }

  await fetchSubtasks();

  };

  const toggleSubtask = async (id, completed) => {

  const { error } = await supabase
    .from("subtasks")
    .update({
      completed: !completed
    })
    .eq("id", id);

  if (error) {
    console.error(error);
    return;
  }

  await fetchSubtasks();

};

  // 🔄 DRAG
  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = tasks.findIndex(t => t.id === active.id);
    const newIndex = tasks.findIndex(t => t.id === over.id);

    const updated = arrayMove(tasks, oldIndex, newIndex);
    setTasks(updated);

    updated.forEach((task, index) => {
      supabase
        .from("tasks")
        .update({ position: index })
        .eq("id", task.id);
    });
  };

  const handleStatusDrop = async (newStatus) => {

  if (!draggedTask) return;

  await supabase
    .from("tasks")
    .update({
      status: newStatus,
      completed: newStatus === "done",
      completed_at:
        newStatus === "done"
          ? new Date().toISOString()
          : null
    })
    .eq("id", draggedTask.id);

  setTasks(prev =>
    prev.map(task =>
      task.id === draggedTask.id
        ? {
        ...task,
        status: newStatus,
        completed: newStatus === "done",
        completed_at:
          newStatus === "done"
            ? new Date().toISOString()
            : null
      }
        : task
    )
  );

  showToast(`${texts.toast.taskMoved} → ${newStatus} 🚀`);

  setDraggedTask(null);
};

const {
  changeDay,
  goToToday,
  goToPreviousMonth,
  goToNextMonth,
} = useCalendarNavigation(
  selectedDate,
  setSelectedDate
);

const {
  selectedTasks,
  completedTasks,
  activeTasks,
  percent,
  chartData,
  COLORS,
  streak,
  bestStreak,
  weeklyData,
} = useDashboardStats(tasks, selectedDate);

const dailyGoal = selectedTasks.length;

const selectedCompleted = completedTasks;

const goalPercent =
  dailyGoal === 0
    ? 0
    : Math.round((selectedCompleted / dailyGoal) * 100);

const formatDueDate = (date) => {
  if (!date) return "No date";

  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  const taskDate = new Date(date);

  const format = (d) => d.toISOString().split("T")[0];

  if (format(taskDate) === format(today)) return "Today";

  if (format(taskDate) === format(tomorrow)) return "Tomorrow";

  if (taskDate < today && format(taskDate) !== format(today)) {
    return "⚠️ Overdue";
  }

  return taskDate.toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "short"
  });
};

  const toggleTask = async (id) => {
    const task = tasks.find(t => t.id === id);
    const newValue = !task.completed;

    await supabase
      .from("tasks")
      .update({
        completed: newValue,
        completed_at: newValue ? new Date().toISOString() : null,
        status: newValue ? "done" : "todo"
      })
      .eq("id", id);

    let updated = tasks.map(t =>
      t.id === id ? {
  ...t,
    completed: newValue,
    status: newValue ? "done" : "todo"
  } : t
    );

    updated.sort((a, b) => a.completed - b.completed);
    setTasks(updated);
  };

const deleteTask = async (id, deleteMode = "single") => {

  const task = tasks.find((t) => t.id === id);

  if (!task) return;

  if (deleteMode === "single") {

    await supabase
      .from("tasks")
      .delete()
      .eq("id", id);

    setTasks(prev => prev.filter(t => t.id !== id));

    showToast(texts.toast.taskDeleted, "warning");

    return;
  }

  if (deleteMode === "series") {

  await supabase
    .from("tasks")
    .delete()
    .eq("recurring_group_id", task.recurring_group_id);

  setTasks(prev =>
    prev.filter(
      t =>
        t.recurring_group_id !==
        task.recurring_group_id
    )
  );

  showToast(texts.toast.seriesDeleted, "warning");

  return;
}

if (deleteMode === "future") {

  const futureTasks = tasks.filter(
    (t) =>
      t.recurring_group_id === task.recurring_group_id &&
      t.due_date >= task.due_date
  );

  const ids = futureTasks.map((t) => t.id);

  await supabase
    .from("tasks")
    .delete()
    .in("id", ids);

  setTasks((prev) =>
    prev.filter((t) => !ids.includes(t.id))
  );

 showToast(texts.toast.futureDeleted, "warning");

  return;
}

};
  const saveEdit = async (id) => {
    await supabase
      .from("tasks")
      .update({ text: editText })
      .eq("id", id);

    setTasks(prev =>
      prev.map(t =>
        t.id === id ? { ...t, text: editText } : t
      )
    );

    setEditingId(null);
    setEditText("");

   showToast(texts.toast.taskUpdated);
  };

const filteredTasks = useTaskFilters({
  tasks,
  selectedDate,
  filter,
  search,
});
  

const last30Days = Array.from({ length: 30 }, (_, i) => {

  const date = new Date();

  date.setDate(date.getDate() - (29 - i));

  const formatted = date.toISOString().split("T")[0];

  const completed = tasks.some(task => {

    if (!task.completed_at) return false;

    return (
      new Date(task.completed_at)
        .toISOString()
        .split("T")[0] === formatted
    );

  });

  return {
    date: formatted,
    completed
  };

});

  // 🔐 LOGIN UI
  if (!user) {
  return (
    <>
      {toast.message && (
  <div className={`toast ${toast.type}`}>
    {toast.message}
  </div>
)}


      <div className="login-top-controls">

      <button
        className="dark-toggle"
        onClick={() => setDarkMode(!darkMode)}
      >
        {darkMode
          ? texts.theme.light
          : texts.theme.dark}
      </button>

      <div className="language-switch">

        <button
          className={language === "tr" ? "active" : ""}
          onClick={() => setLanguage("tr")}
        >
          TR
        </button>

        <button
          className={language === "en" ? "active" : ""}
          onClick={() => setLanguage("en")}
        >
          EN
        </button>

      </div>

    </div>

      <div className="login-container">

        <div className="login-header">
          <div className="avatar">🚀</div>
          <h2>{texts.login.title}</h2>
          <p>{texts.login.subtitle}</p>
        </div>

        <div className="login-form">
          <input
            placeholder={texts.login.email}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {message && <p className="login-message">{message}</p>}

          <button onClick={login} disabled={loading} className="primary">
            {loading
              ? texts.login.loginLoading
              : texts.login.login}
          </button>

          <button onClick={signUp} className="secondary">
            {texts.login.signup}
          </button>
        </div>

      </div>
    </>
  );
}

  // APP UI
return (
  <div className="app-layout">

    <Toast toast={toast} />

    <DeleteModal
    deleteId={deleteId}
    setDeleteId={setDeleteId}
    deleteTask={deleteTask}
    texts={texts}
    />

    <main className="main-content">
    <Header
        user={user}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        logout={logout}
        language={language}
        
        setLanguage={setLanguage}
        texts={texts}
    />
        <motion.div
          className={`container ${view === "board" ? "board-container" : ""}`}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >

          <h1>Task App</h1>

          <StreakCard
            streak={streak}
            bestStreak={bestStreak}
            texts={texts}
          />

          <WelcomePanel
              const greeting = {texts.welcome.title}
              todayText={texts.welcome.subtitle}
              todayTasks={selectedTasks.length}
              overdueTasks={0}
              goalPercent={goalPercent}
              texts={texts}
          />

          <div className="dashboard-layout">

            <div className="dashboard-left">

              <DashboardSection
                  selectedDate={selectedDate}
                  setSelectedDate={setSelectedDate}

                  tasks={tasks}

                  goToPreviousMonth={goToPreviousMonth}
                  goToNextMonth={goToNextMonth}

                  texts={texts}
                  language={language}
              />
            </div>

            <div className="dashboard-right">

                <TaskForm
                  input={input}
                  setInput={setInput}

                  category={category}
                  setCategory={setCategory}

                  priority={priority}
                  setPriority={setPriority}

                  selectedDate={selectedDate}

                  tasks={tasks}

                  repeatType={repeatType}
                  setRepeatType={setRepeatType}
                  addTask={addTask}
                  loading={loading}

                  texts={texts}
                  language={language}
              />

            </div>

        </div>
          <div className="tasks-section">

            <div className="tasks-header">

              <div className="tasks-title">

                <h2>📝 Görevlerim</h2>

                <p>
                  Görevlerinizi bulun, filtreleyin ve yönetin.
                </p>

              </div>

            </div>

            <ToolbarSection
              search={search}
              setSearch={setSearch}
              filter={filter}
              setFilter={setFilter}
              view={view}
              setView={setView}
            />

          </div>

          {filteredTasks.length === 0 && (
            <motion.div
            className="empty-state"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >

            <div className="empty-icon">
              ✨
            </div>

            <h3>No tasks yet</h3>

            <p>
              Add your first task and start building momentum.
            </p>

          </motion.div>
          )}

          {view === "board" ? (

            <Board

            filteredTasks={filteredTasks}

            activeColumn={activeColumn}
            setActiveColumn={setActiveColumn}

            setDraggedTask={setDraggedTask}

            handleStatusDrop={handleStatusDrop}

            texts={texts}

          />

          ) : (

            <TaskList

              filteredTasks={filteredTasks}
              handleDragEnd={handleDragEnd}

              toggleTask={toggleTask}
              deleteTask={deleteTask}

              editingId={editingId}
              editText={editText}

              setEditText={setEditText}
              setEditingId={setEditingId}

              saveEdit={saveEdit}
              setDeleteId={setDeleteId}

              addSubtask={addSubtask}
              subtasks={subtasks}
              toggleSubtask={toggleSubtask}

              texts={texts}
            />
          )}
          <ProgressOverview
            tasks={selectedTasks}
            percent={percent}
          />

          <DailyGoalCard
            todayCompleted={selectedCompleted}
            dailyGoal={dailyGoal}
            goalPercent={goalPercent}
          />

          <Stats
            totalTasks={selectedTasks.length}
            completedTasks={completedTasks}
            activeTasks={activeTasks}
            bestStreak={bestStreak}
          />

          <div className="analytics-grid">
            <ChartCard
              chartData={chartData}
              COLORS={COLORS}
            />

            <WeeklyActivity
              weeklyData={weeklyData}
            />
          </div>

          <Stats
            totalTasks={selectedTasks.length}
            completedTasks={completedTasks}
            activeTasks={activeTasks}
            bestStreak={bestStreak}
          />


        </motion.div>

      </main>

    </div>
);
}

export default App;