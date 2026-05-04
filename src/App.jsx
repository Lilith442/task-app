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
  const fetchTasks = async () => {
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .eq("user_id", user.id);

    if (error) {
      console.error("FETCH ERROR:", error);
      return;
    }

    setTasks(data || []);
  };

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

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  // 🔥 TASK FETCH
  useEffect(() => {
    if (user?.id) {
      fetchTasks();
    }
  }, [user]);

  // 🔥 SIGN UP
  const signUp = async () => {
    setMessage("");

    const { error } = await supabase.auth.signUp({
      email: loginInput,
      password: "123456",
      options: {
        emailRedirectTo: "https://task-app-tau-six.vercel.app/"
      }
    });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage("📩 Mailini kontrol et ve doğrula");
    }
  };

  // 🔥 LOGIN
  const login = async () => {
    setMessage("");

    const { error } = await supabase.auth.signInWithPassword({
      email: loginInput,
      password: "123456"
    });

    if (error) {
      if (error.message.includes("Email not confirmed")) {
        setMessage("⚠️ Önce emailini doğrulamalısın");
      } else {
        setMessage(error.message);
      }
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setTasks([]);
  };

  // 🔥 ADD TASK
  const addTask = async () => {
    if (!input.trim()) return;

    const { data, error } = await supabase
      .from("tasks")
      .insert([
        {
          text: input,
          user_id: user.id,
          category
        }
      ])
      .select();

    if (error) {
      alert(error.message);
      return;
    }

    setTasks([...tasks, data[0]]);
    setInput("");
  };

  const deleteTask = async (id) => {
    await supabase.from("tasks").delete().eq("id", id);
    setTasks(tasks.filter((t) => t.id !== id));
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

  // 🔥 LOGIN SCREEN
  if (!user) {
    return (
      <div className="login">
        <div className="login-box">
          <h2>👋 Welcome</h2>

          <input
            value={loginInput}
            onChange={(e) => setLoginInput(e.target.value)}
            placeholder="Enter email"
          />

          {message && <p style={{ color: "white" }}>{message}</p>}

          <button onClick={login}>Login</button>
          <button onClick={signUp}>Sign Up</button>
        </div>
      </div>
    );
  }

  // 🔥 APP
  return (
    <div className="container">
      <div className="top-bar">
        <h1>Task App</h1>
        <button onClick={logout}>
          Logout ({user.email})
        </button>
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