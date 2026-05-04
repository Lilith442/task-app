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
  dragHandleProps
}) {
  return (
    <div className="task-card">
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
          <span className={task.completed ? "done" : ""}>
            {task.text}
          </span>
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

        <button onClick={() => deleteTask(task.id)}>Sil</button>
      </div>
    </div>
  );
}

function App() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState("");
  const [category, setCategory] = useState("genel");
  const [filter, setFilter] = useState("all");
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // 🌙 DARK MODE
  useEffect(() => {
    document.body.classList.toggle("dark", darkMode);
  }, [darkMode]);

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

  const signUp = async () => {
    setMessage("");
    const { error } = await supabase.auth.signUp({
      email,
      password: "123456"
    });
    if (error) setMessage(error.message);
    else setMessage("📩 Mailini doğrula");
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
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setTasks([]);
  };

  // 📦 FETCH
  useEffect(() => {
    if (user) fetchTasks();
  }, [user]);

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

  // ➕ ADD
  const addTask = async () => {
    if (!input.trim()) return;

    setLoading(true);

    const { data } = await supabase
      .from("tasks")
      .insert([
        {
          text: input,
          category,
          user_id: user.id,
          position: tasks.length
        }
      ])
      .select();

    setTasks([...tasks, data[0]]);
    setInput("");
    setLoading(false);
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
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === "completed") return task.completed;
    if (filter === "active") return !task.completed;
    return true;
  });

  const percent =
    tasks.length === 0
      ? 0
      : Math.round(
          (tasks.filter(t => t.completed).length / tasks.length) * 100
        );

  // 🔐 LOGIN UI
  if (!user) {
    return (
      <>
        <button className="top-left" onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? "☀️ Light" : "🌙 Dark"}
        </button>

        <div className="login-container">
          <h2>Welcome back</h2>

          <input
            placeholder="Email adresin"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <p>{message}</p>

          <button onClick={login} disabled={loading}>
            {loading ? "..." : "Login"}
          </button>

          <button onClick={signUp}>Sign Up</button>
        </div>
      </>
    );
  }

  // 🔥 APP UI
  return (
    <>
      <button className="top-left" onClick={() => setDarkMode(!darkMode)}>
        {darkMode ? "☀️ Light" : "🌙 Dark"}
      </button>

      <button className="top-right" onClick={logout}>
        Logout ({user.email})
      </button>

      <div className="container">
        <h1>Task App</h1>

        <p style={{ opacity: 0.6 }}>
          {tasks.length} görev • {tasks.filter(t => !t.completed).length} aktif
        </p>

        <div className="progress-bar">
          <div className="progress-fill" style={{ width: percent + "%" }} />
        </div>

        <p className="progress-text">%{percent} tamamlandı</p>

        <div className="input-group">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTask()}
            placeholder="Görev ekle"
          />

          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="genel">Genel</option>
            <option value="iş">İş</option>
            <option value="kişisel">Kişisel</option>
          </select>

          <button onClick={addTask}>{loading ? "..." : "Ekle"}</button>
        </div>

        <div className="filters">
          <button onClick={() => setFilter("all")}>Tümü</button>
          <button onClick={() => setFilter("active")}>Aktif</button>
          <button onClick={() => setFilter("completed")}>Tamamlanan</button>
        </div>

        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext
            items={filteredTasks.map(t => t.id)}
            strategy={verticalListSortingStrategy}
          >
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
              />
            ))}
          </SortableContext>
        </DndContext>
      </div>
    </>
  );
}

export default App;