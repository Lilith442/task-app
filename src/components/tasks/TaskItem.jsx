import { useState } from "react";
import { motion } from "framer-motion";

function TaskItem({

  task,
  toggleTask,
  deleteTask,
  editingId,
  editText,
  setEditText,
  setEditingId,
  saveEdit,
  dragHandleProps,
  setDeleteId,
  addSubtask,
  subtasks,
  toggleSubtask
}) {

  const [showSubtasks, setShowSubtasks] = useState(true);
  const [subtaskText, setSubtaskText] = useState("");
  const taskSubtasks = subtasks.filter(

      subtask => subtask.task_id === task.id

  );

  const completedSubtasks =
    taskSubtasks.filter(
        subtask => subtask.completed
    ).length;

  const progress =
      taskSubtasks.length === 0
          ? 0
          : Math.round(
                completedSubtasks /
                taskSubtasks.length *
                100
            );

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

            <div className="subtask-progress">

              <div className="progress-bar">

                <div
                  className="progress-fill"
                  style={{
                    width: `${progress}%`
                  }}
                />

              </div>

              <span>{progress}% tamamlandı</span>

            </div>

            <button
              className="toggle-subtasks-btn"
              onClick={() => setShowSubtasks(!showSubtasks)}
            >

              {showSubtasks ? "▼" : "▶"} Alt Görevler ({taskSubtasks.length})

            </button>

            <div className="subtask-input">

              <input
                value={subtaskText}
                onChange={(e) => setSubtaskText(e.target.value)}
                placeholder="Alt görev ekle..."
              />

              <button
                onClick={() => {

                  if (!subtaskText.trim()) return;

                  addSubtask(task.id, subtaskText);

                  setSubtaskText("");

                }}
              >
                +
              </button>

            </div>

            
            {showSubtasks && (

              taskSubtasks.map(subtask => (

                <div
                  key={subtask.id}
                  className="subtask-item"
                >

                  <input
                    type="checkbox"
                    checked={subtask.completed}
                    onChange={() =>
                      toggleSubtask(subtask.id, subtask.completed)
                    }
                  />

                  <span>{subtask.text}</span>

                </div>

              ))

            )}

            <span className="task-date">
              Bugün
            </span>
            {task.repeat_type !== "none" && (
              <span className="task-repeat">
                🔁 {
                  task.repeat_type === "daily"
                    ? "Her Gün"
                    : task.repeat_type === "weekly"
                    ? "Haftalık"
                    : "2 Günde Bir"
                }
              </span>
            )}
          </div>
        )}

        <span className={`tag ${task.category}`}>
          {task.category}
        </span>
        <span className={`priority ${task.priority || "medium"}`}>
          {task.priority || "medium"}
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

export default TaskItem;