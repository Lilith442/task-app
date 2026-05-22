/*App.jsx*/

import { useState, useEffect } from "react";
import { supabase } from "./supabase";

import {
  DndContext,
  closestCenter
} from "@dnd-kit/core";

import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove
} from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";

import { motion, AnimatePresence } from "framer-motion";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip
} from "recharts";

// 🔥 DRAG WRAPPER
function SortableItem(props) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: props.task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  };

  return (
    <div ref={setNodeRef} style={style}>
      <Item
        {...props}
        dragHandleProps={{ ...attributes, ...listeners }}
      />
    </div>
  );
}

// 🔥 ITEM
function Item({
  task,
  toggleTask,
  deleteTask,
  editingId,
  editText,
  setEditText,
  setEditingId,
  saveEdit,
  dragHandleProps,
  setDeleteId
}) {
  return (
    <motion.div className="task-card"
    layout
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.8 }}
    transition={{ duration: 0.2 }}
    >
      <div className="task-left">
        <span
          className="drag-handle"
          {...dragHandleProps}
          style={{ cursor: "grab", marginRight: 8 }}
        >
          ☰
        </span>

        <input
          type="checkbox"
          checked={!!task.completed}
          onChange={() => toggleTask(task.id)}
        />

        {editingId === task.id ? (
          <input
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
          />
        ) : (
          <div className="task-content">

            <span className={task.completed ? "done task-title" : "task-title"}>
              {task.text}
            </span>

            <span className="task-date">
              Today
            </span>

          </div>
        )}

        <span className={`tag ${task.category}`}>
          {task.category}
        </span>
      </div>

      <div className="task-actions">
        {editingId === task.id ? (
          <button onClick={() => saveEdit(task.id)}>Kaydet</button>
        ) : (
          <button
            onClick={() => {
              setEditingId(task.id);
              setEditText(task.text);
            }}
          >
            Düzenle
          </button>
        )}

        <button onClick={() => setDeleteId(task.id)}>
          Sil
      </button>
      </div>
    </motion.div>
  );
}

function App() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState("");
  const [category, setCategory] = useState("genel");
  const [priority, setPriority] = useState("medium");
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
          user_id: user.id,
          position: tasks.length,
          status: "todo"
        }
      ])
      .select();

    setTasks([...tasks, data[0]]);
    setInput("");
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
    .update({ status: newStatus })
    .eq("id", draggedTask.id);

  setTasks(prev =>
    prev.map(task =>
      task.id === draggedTask.id
        ? { ...task, status: newStatus }
        : task
    )
  );

  showToast(`Taşındı → ${newStatus} 🚀`);

  setDraggedTask(null);
};

  const toggleTask = async (id) => {
    const task = tasks.find(t => t.id === id);
    const newValue = !task.completed;

    await supabase
      .from("tasks")
      .update({ completed: newValue })
      .eq("id", id);

    let updated = tasks.map(t =>
      t.id === id ? { ...t, completed: newValue } : t
    );

    updated.sort((a, b) => a.completed - b.completed);
    setTasks(updated);
  };

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

    {toast.message && (
      <div className={`toast ${toast.type}`}>
        {toast.message}
      </div>
    )}

    {deleteId && (
      <div className="modal-overlay">

        <div className="modal">

          <h3>Görevi sil?</h3>

          <p>Bu işlem geri alınamaz.</p>

          <div className="modal-actions">

            <button
              className="cancel-btn"
              onClick={() => setDeleteId(null)}
            >
              Vazgeç
            </button>

            <button
              className="delete-btn"
              onClick={async () => {
                await deleteTask(deleteId);
                setDeleteId(null);
              }}
            >
              Sil
            </button>

          </div>
        </div>
      </div>
    )}


      <main className="main-content">
        <div className="topbar">

        <div className="topbar-left">
          <div className="logo-circle">⚡</div>

          <div>
            <h3>TaskFlow</h3>
            <p>Stay productive</p>
          </div>
        </div>

        <div className="topbar-right">

          <div className="user-box">
            <div className="online-dot"></div>
            <span>{user.email}</span>
          </div>

          <button
            className="dark-toggle"
            onClick={() => setDarkMode(!darkMode)}
          >
            🌙
          </button>

          <button
            className="logout-btn"
            onClick={logout}
          >
            Logout
          </button>

        </div>
      </div>
        <motion.div
          className="container"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >

          <h1>Task App</h1>

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

          <div className="input-group">

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
          <div className="stats-grid">

            <div className="stat-card">
              <h3>{tasks.length}</h3>
              <p>Total Tasks</p>
            </div>

            <div className="stat-card">
              <h3>{tasks.filter(t => t.completed).length}</h3>
              <p>Completed</p>
            </div>

            <div className="stat-card">
              <h3>{tasks.filter(t => !t.completed).length}</h3>
              <p>Active</p>
            </div>

          </div>

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
          <div className="filters">

            <button onClick={() => setFilter("all")}>
              Tümü
            </button>

            <button onClick={() => setFilter("active")}>
              Aktif
            </button>

            <button onClick={() => setFilter("completed")}>
              Tamamlanan
            </button>

          </div>

          <div className="view-switch">

            <button onClick={() => setView("list")}>
              📋 Liste
            </button>

            <button onClick={() => setView("board")}>
              📌 Board
            </button>

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

            <div className="board">

              <div
                className={`column ${activeColumn === "todo" ? "column-active" : ""}`}

                onDragEnter={() => setActiveColumn("todo")}
                onDragLeave={() => setActiveColumn(null)}

                onDragOver={(e) => e.preventDefault()}

                onDrop={() => {
                  handleStatusDrop("todo");
                  setActiveColumn(null);
                }}
              >

                <h3>
                  📝 Todo
                  <span className="count">
                    ({filteredTasks.filter(task => task.status === "todo").length})
                  </span>
                </h3>

                {filteredTasks.filter(task => task.status === "todo").length === 0 ? (

                  <div className="empty-column">
                    Task yok 🚀
                  </div>

                ) : (

                  filteredTasks
                    .filter(task => task.status === "todo")
                    .map(task => (

                      <motion.div
                        key={task.id}
                        className="task-card board-task"
                        draggable
                        onDragStart={() => setDraggedTask(task)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >

                        <div className="board-task-top">
                          <span>{task.text}</span>
                        </div>

                        <div className="board-task-bottom">

                          <span className={`tag ${task.category}`}>
                            {task.category}
                          </span>

                          <span className={`priority ${task.priority || "medium"}`}>
                            {task.priority || "medium"}
                          </span>

                        </div>

                      </motion.div>

                    ))

                )}

              </div>

              <div
                className={`column ${activeColumn === "doing" ? "column-active" : ""}`}

                onDragEnter={() => setActiveColumn("doing")}
                onDragLeave={() => setActiveColumn(null)}

                onDragOver={(e) => e.preventDefault()}

                onDrop={() => {
                  handleStatusDrop("doing");
                  setActiveColumn(null);
                }}
              >

                <h3>⚡ Doing</h3>

                {filteredTasks.filter(task => task.status === "doing").length === 0 ? (

                  <div className="empty-column">
                    Task yok 🚀
                  </div>

                ) : (

                  filteredTasks
                    .filter(task => task.status === "doing")
                    .map(task => (

                      <motion.div
                        key={task.id}
                        className="task-card board-task"
                        draggable
                        onDragStart={() => setDraggedTask(task)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >

                        <div className="board-task-top">
                          <span>{task.text}</span>
                        </div>

                        <div className="board-task-bottom">

                          <span className={`tag ${task.category}`}>
                            {task.category}
                          </span>

                          <span className={`priority ${task.priority || "medium"}`}>
                            {task.priority || "medium"}
                          </span>

                        </div>

                      </motion.div>

                    ))

                )}

              </div>

              <div
                className={`column ${activeColumn === "done" ? "column-active" : ""}`}

                onDragEnter={() => setActiveColumn("done")}
                onDragLeave={() => setActiveColumn(null)}

                onDragOver={(e) => e.preventDefault()}

                onDrop={() => {
                  handleStatusDrop("done");
                  setActiveColumn(null);
                }}
              >

                <h3>✅ Done</h3>

                {filteredTasks.filter(task => task.status === "done").length === 0 ? (

                  <div className="empty-column">
                    Task yok 🚀
                  </div>

                ) : (

                  filteredTasks
                    .filter(task => task.status === "done")
                    .map(task => (

                      <motion.div
                        key={task.id}
                        className="task-card board-task"
                        draggable
                        onDragStart={() => setDraggedTask(task)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >

                        <div className="board-task-top">
                          <span>{task.text}</span>
                        </div>

                        <div className="board-task-bottom">

                          <span className={`tag ${task.category}`}>
                            {task.category}
                          </span>

                          <span className={`priority ${task.priority || "medium"}`}>
                            {task.priority || "medium"}
                          </span>

                        </div>

                      </motion.div>

                    ))

                )}

              </div>

            </div>

          ) : (

            <DndContext
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >

              <SortableContext
                items={filteredTasks.map(t => t.id)}
                strategy={verticalListSortingStrategy}
              >

                <AnimatePresence>

                  {filteredTasks.map(task => (

                    <SortableItem
                      key={task.id}
                      task={task}
                      toggleTask={toggleTask}
                      deleteTask={deleteTask}
                      editingId={editingId}
                      editText={editText}
                      setEditText={setEditText}
                      setEditingId={setEditingId}
                      saveEdit={saveEdit}
                      setDeleteId={setDeleteId}
                    />

                  ))}

                </AnimatePresence>

              </SortableContext>

            </DndContext>

          )}

        </motion.div>

      </main>

    </div>
);
}

export default App;