import { useState, useEffect, useCallback } from "react";
import { supabase } from "./supabase";

import {
  DndContext
} from "@dnd-kit/core";

import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove
} from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";

function App() {
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);

  const [loginInput, setLoginInput] = useState("");
  const [input, setInput] = useState("");
  const [category, setCategory] = useState("genel");
  const [filter, setFilter] = useState("all");

  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [message, setMessage] = useState("");

  // 🔥 AUTH SESSION
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

  // 🔥 FETCH (FIXED)
  const fetchTasks = useCallback(async () => {
    if (!user?.id) return;

    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .eq("user_id", user.id)
      .order("id", { ascending: true });

    if (!error) setTasks(data || []);
  }, [user]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // 🔥 AUTH
  const login = async () => {
    setMessage("");

    const { error } = await supabase.auth.signInWithPassword({
      email: loginInput,
      password: "123456"
    });

    if (error) setMessage(error.message);
  };

  const signUp = async () => {
    const { error } = await supabase.auth.signUp({
      email: loginInput,
      password: "123456"
    });

    if (error) setMessage(error.message);
    else setMessage("📩 Mailini doğrula");
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setTasks([]);
  };

  // 🔥 ADD
  const addTask = async () => {
    if (!input.trim()) return;

    const { data, error } = await supabase
      .from("tasks")
      .insert([
        {
          text: input,
          user_id: user.id,
          category,
          completed: false
        }
      ])
      .select();

    if (!error) {
      setTasks((prev) => [...prev, data[0]]);
      setInput("");
    }
  };

  // 🔥 DELETE
  const deleteTask = async (id) => {
    await supabase.from("tasks").delete().eq("id", id);
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  // 🔥 ✅ FIXED TOGGLE (EN KRİTİK)
  const toggleTask = async (id) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;

    const newValue = !task.completed;

    const { error } = await supabase
      .from("tasks")
      .update({ completed: newValue })
      .eq("id", id);

    if (!error) {
      setTasks((prev) =>
        prev.map((t) =>
          t.id === id ? { ...t, completed: newValue } : t
        )
      );
    }
  };

  // 🔥 EDIT
  const saveEdit = async (id) => {
    await supabase
      .from("tasks")
      .update({ text: editText })
      .eq("id", id);

    setTasks((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, text: editText } : t
      )
    );

    setEditingId(null);
    setEditText("");
  };

  // 🔥 DRAG
  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = tasks.findIndex((t) => t.id === active.id);
    const newIndex = tasks.findIndex((t) => t.id === over.id);

    setTasks(arrayMove(tasks, oldIndex, newIndex));
  };

  // 🔥 FILTER
  const filteredTasks = tasks.filter((task) => {
    if (filter === "completed") return task.completed;
    if (filter === "active") return !task.completed;
    return true;
  });

  // 🔥 LOGIN UI
  if (!user) {
    return (
      <div className="login">
        <input
          value={loginInput}
          onChange={(e) => setLoginInput(e.target.value)}
        />
        <p>{message}</p>
        <button onClick={login}>Login</button>
        <button onClick={signUp}>Sign Up</button>
      </div>
    );
  }

  // 🔥 APP UI
  return (
    <div className="container">
      <h1>Task App</h1>

      <button onClick={logout}>
        Logout ({user.email})
      </button>

      <div className="input-group">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
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

      <DndContext onDragEnd={handleDragEnd}>
        <SortableContext
          items={filteredTasks.map((t) => t.id)}
          strategy={verticalListSortingStrategy}
        >
          {filteredTasks.map((task) => (
            <Item
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
          checked={!!task.completed}
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
          <button onClick={() => setEditingId(task.id)}>
            Düzenle
          </button>
        )}

        <button onClick={() => deleteTask(task.id)}>Sil</button>
      </div>
    </div>
  );
}

export default App;