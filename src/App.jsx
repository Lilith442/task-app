import { useState, useEffect } from "react";

function App() {
  const [tasks, setTasks] = useState(() => {
    try {
      const saved = localStorage.getItem("tasks");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [input, setInput] = useState("");
  const [category, setCategory] = useState("genel");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (input.trim() === "") return;

    const newTask = {
      id: Date.now(),
      text: input,
      completed: false,
      category: category,
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

  // 🔥 FILTER LOGIC
  const filteredTasks = tasks.filter((task) => {
    if (filter === "completed") return task.completed;
    if (filter === "active") return !task.completed;
    return true;
  });

  return (
    <div className="container">
      <h1 style={{ textAlign: "center" }}>Task App</h1>

      {/* INPUT + CATEGORY */}
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

      {/* 🔥 FILTER BUTTONS */}
      <div style={{ marginTop: "15px" }}>
        <button onClick={() => setFilter("all")}>Tümü</button>
        <button onClick={() => setFilter("active")}>Aktif</button>
        <button onClick={() => setFilter("completed")}>
          Tamamlanan
        </button>
      </div>

      {/* BOŞ DURUM */}
      {filteredTasks.length === 0 && <p>Görev yok</p>}

      {/* TASK LİSTESİ */}
      {filteredTasks.map((task) => (
        <div className="task-card" key={task.id}>
          <div>
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => toggleTask(task.id)}
            />

            <span
              style={{
                marginLeft: "10px",
                textDecoration: task.completed
                  ? "line-through"
                  : "none",
              }}
            >
              {task.text}
            </span>

            <span
              style={{
                fontSize: "12px",
                color: "black",
                background: "#6FA4AF",
                padding: "3px 8px",
                borderRadius: "6px",
                marginLeft: "10px",
              }}
            >
              {task.category || "genel"}
            </span>
          </div>

          <button onClick={() => deleteTask(task.id)}>Sil</button>
        </div>
      ))}

      {/* CLEAR ALL */}
      <button
        style={{ marginTop: "20px", width: "100%" }}
        onClick={() => setTasks([])}
      >
        Tümünü temizle
      </button>
    </div>
  );
}

export default App;