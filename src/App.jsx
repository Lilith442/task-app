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

function App() {
  const [user, setUser] = useState(() => {
    return JSON.parse(localStorage.getItem("user")) || null;
  });

  const [tasks, setTasks] = useState([]);
  const [loginInput, setLoginInput] = useState("");
  const [input, setInput] = useState("");
  const [category, setCategory] = useState("genel");
  const [filter, setFilter] = useState("all");
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  // 🔥 TASK FETCH
  useEffect(() => {
    if (user?.name) {
      fetchTasks();
    }
  }, [user]);

  const fetchTasks = async () => {
    try {
      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .eq("user_name", user.name);

      if (error) {
        console.error("FETCH ERROR:", error);
        return;
      }

      setTasks(data || []);
    } catch (err) {
      console.error("CRASH:", err);
    }
  };

  const login = () => {
    if (!loginInput.trim()) return;
    const userData = { name: loginInput };

    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    setTasks([]);
  };

  const addTask = async () => {
  if (!input.trim()) return;

  const { data, error } = await supabase
    .from("tasks")
    .insert([
      {
        text: input,
        user_name: user.name,
        category
      }
    ])
    .select();

  console.log("DATA:", data);
  console.log("ERROR:", error);

  if (error) {
    alert(error.message);
    return;
  }

  setTasks([...tasks, data[0]]);
  setInput("");
};

  const deleteTask = async (id) => {
    await supabase.from("tasks").delete().eq("id", id);
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const toggleTask = async (id) => {
    const task = tasks.find((t) => t.id === id);

    await supabase
      .from("tasks")
      .update({ completed: !task.completed })
      .eq("id", id);

    fetchTasks();
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = tasks.findIndex((t) => t.id === active.id);
    const newIndex = tasks.findIndex((t) => t.id === over.id);

    setTasks(arrayMove(tasks, oldIndex, newIndex));
  };

  const startEdit = (task) => {
    setEditingId(task.id);
    setEditText(task.text);
  };

  const saveEdit = async (id) => {
    await supabase
      .from("tasks")
      .update({ text: editText })
      .eq("id", id);

    fetchTasks();
    setEditingId(null);
    setEditText("");
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === "completed") return task.completed;
    if (filter === "active") return !task.completed;
    return true;
  });

  // 🔥 LOGIN
  if (!user) {
    return (
      <div className="login">
        <div className="login-box">
          <h2>👋 Welcome</h2>
          <p>Start managing your tasks</p>

          <input
            value={loginInput}
            onChange={(e) => setLoginInput(e.target.value)}
            placeholder="Enter username"
            onKeyDown={(e) => e.key === "Enter" && login()}
          />

          <button onClick={login}>Login</button>
        </div>
      </div>
    );
  }

  // 🔥 APP
  return (
    <div className="container">
      <div className="top-bar">
        <h1>Task App</h1>
        <button onClick={logout}>Logout ({user.name})</button>
      </div>

      <div className="input-group">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
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

        <button onClick={addTask}>Ekle</button>
      </div>

      <div className="filters">
        <button onClick={() => setFilter("all")}>Tümü</button>
        <button onClick={() => setFilter("active")}>Aktif</button>
        <button onClick={() => setFilter("completed")}>
          Tamamlanan
        </button>
      </div>

      {filteredTasks.length === 0 && <p>Görev yok</p>}

      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext
          items={filteredTasks.map((t) => t.id)}
          strategy={verticalListSortingStrategy}
        >
          {filteredTasks.map((task) => (
            <SortableItem
              key={task.id}
              task={task}
              toggleTask={toggleTask}
              deleteTask={deleteTask}
              editingId={editingId}
              editText={editText}
              setEditText={setEditText}
              startEdit={startEdit}
              saveEdit={saveEdit}
            />
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );
}

// 🔥 ITEM
function SortableItem({
  task,
  toggleTask,
  deleteTask,
  editingId,
  editText,
  setEditText,
  startEdit,
  saveEdit
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  };

  return (
    <div ref={setNodeRef} style={style} className="task-card">
      <div {...attributes} {...listeners}>
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => toggleTask(task.id)}
        />

        {editingId === task.id ? (
          <input
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
          />
        ) : (
          <span style={{ marginLeft: 10 }}>
            {task.text}
          </span>
        )}

        <span className="tag">{task.category}</span>
      </div>

      <div>
        {editingId === task.id ? (
          <button onClick={() => saveEdit(task.id)}>Kaydet</button>
        ) : (
          <button onClick={() => startEdit(task)}>Düzenle</button>
        )}

        <button onClick={() => deleteTask(task.id)}>Sil</button>
      </div>
    </div>
  );
}

export default App;