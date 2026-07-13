/*App.jsx*/

import { useState, useEffect } from "react";
import { supabase } from "./supabase";
import { motion, AnimatePresence } from "framer-motion";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip
} from "recharts";
import Calendar from "./components/Calendar";
import WeeklyActivity from "./components/WeeklyActivity";
import Stats from "./components/Stats";
import Filters from "./components/Filters";
import ViewSwitch from "./components/ViewSwitch";
import Header from "./components/Header";
import DeleteModal from "./components/DeleteModal";
import Toast from "./components/Toast";
import TaskList from "./components/tasks/TaskList";
import TaskItem from "./components/tasks/TaskItem";
import SortableItem from "./components/tasks/SortableItem";
import Board from "./components/tasks/Board";

// 🔥 ITEM

function App() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState("");
  const [category, setCategory] = useState("genel");
  const [priority, setPriority] = useState("medium");
  const [dueDate, setDueDate] = useState("");
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

// SADECE BU FONKSİYONU DEĞİŞTİR

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
    setMessage("📩 Mailini doğrula");
    showToast("Kayıt başarılı 📩" , "success");
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
    showToast("Giriş başarılı 🎉", "success");
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setTasks([]);
  };
  

const fetchTasks = async () => {
  setLoading(true);

  const { data } = await supabase
    .from("tasks")
    .select("*")
    .eq("user_id", user.id)
    .order("position", { ascending: true });

  setTasks(data || []);
  setLoading(false);
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
      }
    )

    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };

}, [user]);

  // ➕ ADD
  const addTask = async () => {
    if (!input.trim()) {
    showToast("Görev boş olamaz ⚠️", "warning");
    return;
    }

    setLoading(true);

    const { data } = await supabase
      .from("tasks")
      .insert([
        {
          text: input,
          category,
          priority,
          repeat_type: repeatType,
          user_id: user.id,
          position: tasks.length,
          status: "todo",
          due_date: dueDate || null,
        }
      ])
      .select();

    setTasks([...tasks, data[0]]);
    setInput("");
    setDueDate("");
    setRepeatType("none");
    setLoading(false);

    showToast("Görev eklendi ✅", "success");
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

  showToast(`Taşındı → ${newStatus} 🚀`);

  setDraggedTask(null);
};

const changeDay = (amount) => {

  const date = new Date(selectedDate);

  date.setDate(date.getDate() + amount);

  setSelectedDate(date.toISOString().split("T")[0]);

};

const goToToday = () => {

  setSelectedDate(
    new Date().toISOString().split("T")[0]
  );

};

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

  const calculateStreak = () => {
  const completedDates = tasks
    .filter(task => task.completed_at)
    .map(task => {
      const date = new Date(task.completed_at);

      return date.toISOString().split("T")[0];
    });

  const uniqueDays = [...new Set(completedDates)].sort().reverse();

  let streak = 0;

  const today = new Date();

  for (let i = 0; i < uniqueDays.length; i++) {

    const checkDate = new Date(today);

    checkDate.setDate(today.getDate() - i);

    const formatted = checkDate.toISOString().split("T")[0];

    if (uniqueDays.includes(formatted)) {
      streak++;
    } else {
      break;
    }

  }

  return streak;
};

  const streak = calculateStreak();

  const calculateBestStreak = () => {

  const completedDates = tasks
    .filter(task => task.completed_at)
    .map(task => {
      const date = new Date(task.completed_at);

      return date.toISOString().split("T")[0];
    });

  const uniqueDays = [...new Set(completedDates)].sort();

  if (uniqueDays.length === 0) return 0;

  let best = 1;
  let current = 1;

  for (let i = 1; i < uniqueDays.length; i++) {

    const previous = new Date(uniqueDays[i - 1]);
    const currentDate = new Date(uniqueDays[i]);

    const diff =
      (currentDate - previous) / (1000 * 60 * 60 * 24);

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

const goToPreviousMonth = () => {

  const date = new Date(selectedDate);

  date.setMonth(date.getMonth() - 1);

  setSelectedDate(date.toISOString().split("T")[0]);

};

const goToNextMonth = () => {

  const date = new Date(selectedDate);

  date.setMonth(date.getMonth() + 1);

  setSelectedDate(date.toISOString().split("T")[0]);

};

const bestStreak = calculateBestStreak();

  const deleteTask = async (id) => {
    if (!confirm("Silmek istediğine emin misin?")) return;

    await supabase.from("tasks").delete().eq("id", id);
    setTasks(tasks.filter(t => t.id !== id));

    showToast("Görev silindi 🗑", "warning");
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

    showToast("Güncellendi ✏️");
  };

const filteredTasks = tasks
  .filter(task => {
      if (!task.due_date) return false;

      return task.due_date === selectedDate;
    })

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
    task.text.toLowerCase().includes(search.toLowerCase())
  );

  const percent =
    tasks.length === 0
      ? 0
      : Math.round(
          (tasks.filter(t => t.completed).length / tasks.length) * 100
        );

    const activeTasks = tasks.filter(t => !t.completed).length;

    const completedTasks = tasks.filter(t => t.completed).length;

    const dailyGoal = 5;

    const todayCompleted = tasks.filter(task => {
      if (!task.completed_at) return false;

      const today = new Date().toISOString().split("T")[0];
      const completedDate = new Date(task.completed_at)
        .toISOString()
        .split("T")[0];

      return today === completedDate;
    }).length;

    const goalPercent = Math.min(
      100,
      Math.round((todayCompleted / dailyGoal) * 100)
    );
        
  const chartData = [
  {
    name: "Completed",
    value: tasks.filter(t => t.completed).length
  },
  {
    name: "Active",
    value: tasks.filter(t => !t.completed).length
  }
];

const COLORS = ["#0f5c63", "#4f9da6"];
const weekDays = [
  "Pzt",
  "Sal",
  "Çar",
  "Per",
  "Cum",
  "Cmt",
  "Paz"
];

const weeklyData = weekDays.map((day, index) => {
  const count = tasks.filter(task => {
    if (!task.completed_at) return false;

    const completedDay = new Date(task.completed_at).getDay();

    const convertedDay = completedDay === 0 ? 6 : completedDay - 1;

    return convertedDay === index;
  }).length;

  return {
    day,
    count
  };
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

      <button className="top-left" onClick={() => setDarkMode(!darkMode)}>
        {darkMode ? "☀️ Light" : "🌙 Dark"}
      </button>

      <div className="login-container">

        <div className="login-header">
          <div className="avatar">🚀</div>
          <h2>Welcome back</h2>
          <p>Devam etmek için giriş yap</p>
        </div>

        <div className="login-form">
          <input
            placeholder="Email adresin"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {message && <p className="login-message">{message}</p>}

          <button onClick={login} disabled={loading} className="primary">
            {loading ? "Giriş yapılıyor..." : "Login"}
          </button>

          <button onClick={signUp} className="secondary">
            Sign Up
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
    />

    <main className="main-content">
    <Header
        user={user}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        logout={logout}
    />
        <motion.div
          className="container"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >

          <h1>Task App</h1>

          <div className="date-navigation">
          <button onClick={() => changeDay(-1)}>
            ◀
          </button>
          <h3>
            {new Date(selectedDate).toLocaleDateString("tr-TR", {
              day: "numeric",
              month: "long",
              year: "numeric"
            })}
          </h3>

          <button
            className="today-btn"
            onClick={goToToday}
          >
            Bugün
          </button>

          <button onClick={() => changeDay(1)}>
            ▶
          </button>

        </div>

          <div className="streak-card">
            <div className="streak-fire">🔥</div>

            <div>
              <h3>{streak} Günlük Seri</h3>

              <p>
                {streak > 0
                  ? "Bugün görev tamamlandı ✅"
                  : "Bugün henüz görev tamamlanmadı"}
              </p>
              <p className="best-streak">
                🏆 En İyi Seri: {bestStreak} Gün {" "}
              </p>
            </div>
          </div>

          <div className="selected-date-info">

            📅 Görüntülenen gün    

            <strong>
              {new Date(selectedDate).toLocaleDateString("tr-TR", {
                day: "numeric",
                month: "long",
                year: "numeric"
              })}
            </strong>

          </div>

          <p style={{ opacity: 0.6 }}>
            {tasks.length} görev • {tasks.filter(t => !t.completed).length} aktif
          </p>

          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: percent + "%" }}
            />
          </div>

          <p className="progress-text">
            %{percent} tamamlandı
          </p>

          <div className="input-group mobile-sticky">

            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addTask()}
              placeholder="Görev ekle"
            />

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="genel">Genel</option>
              <option value="iş">İş</option>
              <option value="kişisel">Kişisel</option>
            </select>

            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option value="low">Düşük öncelik</option>
              <option value="medium">Orta</option>
              <option value="high">Acil</option>
            </select>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="date-input"
            />
            <select
              value={repeatType}
              onChange={(e) => setRepeatType(e.target.value)}
            >

              <option value="none">
                Tek Sefer
              </option>

              <option value="daily">
                Her Gün
              </option>

              <option value="weekly">
                Haftalık
              </option>

              <option value="every2days">
                2 Günde Bir
              </option>

            </select>
            <button onClick={addTask}>
              {loading ? "..." : "Ekle"}
            </button>

          </div>

          <div className="search-box">

            <input
              type="text"
              placeholder="Görev Ara"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

          </div>
          <div className="daily-goal-card">

          <div className="goal-header">

            <h3>🎯 Günlük Hedef</h3>

            <span>
              {todayCompleted} / {dailyGoal}
            </span>

          </div>

          <div className="goal-progress">

            <div
              className="goal-progress-fill"
              style={{ width: `${goalPercent}%` }}
            />

          </div>

          <p>

            {goalPercent === 100
              ? "🎉 Harika! Günlük hedefini tamamladın."
              : `Bugünkü hedef için ${dailyGoal - todayCompleted} görev kaldı.`}

          </p>

        </div>
        <Stats

            totalTasks={tasks.length}
            completedTasks={completedTasks}
            activeTasks={activeTasks}
            bestStreak={bestStreak}

        />

          <div className="chart-card">

            <h3>Task Progress</h3>

            <ResponsiveContainer width="100%" height={220}>
              <PieChart>

                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell
                      key={index}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>

                <Tooltip />

              </PieChart>
            </ResponsiveContainer>

          </div>

          <Calendar
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              tasks={tasks}
              goToPreviousMonth={goToPreviousMonth}
              goToNextMonth={goToNextMonth}
          />  

          <WeeklyActivity
            weeklyData={weeklyData}
          />
          
          <Filters

            filter={filter}
            setFilter={setFilter}

          />

          <ViewSwitch

              view={view}
              setView={setView}

          />

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

            />
          )}

        </motion.div>

      </main>

    </div>
);
}

export default App;