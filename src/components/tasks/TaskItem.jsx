import { useState } from "react";
import { motion } from "framer-motion";
import {
  GripVertical,
  Pencil,
  Trash2,
  CalendarDays,
  Repeat,
  ChevronDown,
  ChevronRight,
  Plus,
} from "lucide-react";
import "./TaskItem.css";

function TaskItem({
  task,
  toggleTask,
  editingId,
  editText,
  setEditText,
  setEditingId,
  saveEdit,
  dragHandleProps,
  setDeleteId,
  addSubtask,
  subtasks,
  toggleSubtask,
}) {
  const [showSubtasks, setShowSubtasks] = useState(true);
  const [subtaskText, setSubtaskText] = useState("");

  const taskSubtasks = subtasks.filter(
    (subtask) => subtask.task_id === task.id
  );

  const completedSubtasks = taskSubtasks.filter(
    (subtask) => subtask.completed
  ).length;

  const progress =
    taskSubtasks.length === 0
      ? 0
      : Math.round((completedSubtasks / taskSubtasks.length) * 100);

  return (
    <motion.div
      className="task-card"
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.2 }}
    >

      {/* ================= HEADER ================= */}

      <div className="task-header">

        <div className="task-header-left">

          <span
            className="drag-handle"
            {...dragHandleProps}
          >
            <GripVertical size={20} />
          </span>

          <label className="task-checkbox">

            <input
                type="checkbox"
                checked={!!task.completed}
                onChange={() => toggleTask(task.id)}
            />

            <span className="checkmark"></span>

          </label>

          {editingId === task.id ? (
            <input
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
            />
          ) : (
            <h3 className={task.completed ? "done task-title" : "task-title"}>
              {task.text}
            </h3>
          )}

        </div>

        <span className={`priority ${task.priority}`}>

            {task.priority === "high" && "🔴 High"}

            {task.priority === "medium" && "🟡 Medium"}

            {task.priority === "low" && "🔵 Low"}

        </span>

      </div>

      {/* ================= PROGRESS ================= */}

      <div className="task-progress">

        <div className="progress-bar">

          <div
            className="progress-fill"
            style={{ width: `${progress}%` }}
          />

        </div>

        <div className="progress-info">

            <span>
                {progress}% tamamlandı
            </span>

            <span>

                {completedSubtasks} / {taskSubtasks.length}

            </span>

        </div>
      </div>

      {/* ================= BODY ================= */}

      <div className="task-body">

       <button
          className="toggle-subtasks-btn"
          onClick={() => setShowSubtasks(!showSubtasks)}
        >
          {showSubtasks ? (
              <ChevronDown size={18}/>
          ) : (
              <ChevronRight size={18}/>
          )}

          Alt Görevler ({taskSubtasks.length})
      </button>

        {showSubtasks && (

          <div className="subtask-list">

            {taskSubtasks.map((subtask) => (

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

            ))}

          </div>

        )}

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
            <Plus size={18}/>
          </button>

        </div>

      </div>

      {/* ================= FOOTER ================= */}

      <div className="task-footer">

        <div className="task-meta">

          <span className={`tag ${task.category}`}>
            {task.category}
          </span>

          <span className="task-date">

            <CalendarDays size={14}/>

            Bugün

          </span>

          {task.repeat_type !== "none" && (

            <span className="task-repeat">

              <Repeat size={14}/>{" "}

              {task.repeat_type === "daily"
                ? "Her Gün"
                : task.repeat_type === "weekly"
                ? "Haftalık"
                : "2 Günde Bir"}

            </span>

          )}

        </div>

        <div className="task-actions">

          {editingId === task.id ? (

            <button onClick={() => saveEdit(task.id)}>
              Kaydet
            </button>

          ) : (

            <button
              onClick={() => {

                setEditingId(task.id);
                setEditText(task.text);

              }}
            >
              <>
                {" "}<Pencil size={16}/>{" "}
                Düzenle
            </>
            </button>

          )}

          <button
            onClick={() => setDeleteId(task.id)}
          >
            <>
                <Trash2 size={16}/>{" "}
                Sil
            </>
          </button>

        </div>

      </div>

    </motion.div>
  );
}

export default TaskItem;