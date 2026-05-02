import { useState, useEffect } from "react";

function App() {
  const [user, setUser] = useState(() => {
    return JSON.parse(localStorage.getItem("user")) || null;
  });

  const storageKey = user ? `tasks_${user.name}` : "tasks";

  const [tasks, setTasks] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [loginInput, setLoginInput] = useState("");
  const [input, setInput] = useState("");
  const [category, setCategory] = useState("genel");
  const [filter, setFilter] = useState("all");
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(tasks));
  }, [tasks, storageKey]);

  const login = () => {
    if (!loginInput.trim()) return;
    const userData = { name: loginInput };
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  const addTask = () => {
    if (!input.trim()) return;

    const newTask = {
      id: Date.now(),
      text: input,
      completed: false,
      category,
    };

    setTasks([...tasks, newTask]);
    setInput("");
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const toggleTask = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id
          ? { ...task, completed: !task.completed }
          : task
      )
    );
  };

  const startEdit = (task) => {
  setEditingId(task.id);
  setEditText(task.text);
  };

  const saveEdit = (id) => {
  setTasks(
    tasks.map((task) =>
      task.id === id ? { ...task, text: editText } : task
    )
  );
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
        <p>Start managing your tasks</p>
        <h2>Login</h2>

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

  // 🔥 MAIN APP
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

      {filteredTasks.map((task) => (
  <div className="task-card" key={task.id}>
    <div>
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
        <span
          style={{
            marginLeft: "10px",
            textDecoration: task.completed ? "line-through" : "none",
          }}
        >
          {task.text}
        </span>
      )}

      <span className="tag">{task.category}</span>
    </div>

    <div style={{ display: "flex", gap: "5px" }}>
      {editingId === task.id ? (
        <button onClick={() => saveEdit(task.id)}>Kaydet</button>
      ) : (
        <button onClick={() => startEdit(task)}>Düzenle</button>
      )}

      <button onClick={() => deleteTask(task.id)}>Sil</button>
    </div>
  </div>
))}

      <button className="clear" onClick={() => setTasks([])}>
        Tümünü temizle
      </button>
    </div>
  );
}

export default App;