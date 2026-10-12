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
  X,
} from "lucide-react";
import "./TaskItem.css";

function TaskItem({
  task,
  toggleTask,

  // Edit
  editingId,
  editText,
  setEditText,
  editDescription,
  setEditDescription,
  editCategory,
  setEditCategory,
  editPriority,
  setEditPriority,
  editDueDate,
  setEditDueDate,
  editRepeatType,
  setEditRepeatType,
  setEditingId,
  saveEdit,
  cancelEdit,

  // Delete
  setDeleteId,

  // Subtasks
  addSubtask,
  subtasks,
  toggleSubtask,

  // Drag
  dragHandleProps,

  // Language
  texts,
}) {
  const [showSubtasks, setShowSubtasks] = useState(false);
  const [subtaskText, setSubtaskText] = useState("");

  const taskSubtasks = subtasks.filter(
    (subtask) => subtask.task_id === task.id
  );

  const completedSubtasks = taskSubtasks.filter(
    (subtask) => subtask.completed
  ).length;

  const progress =
    taskSubtasks.length === 0
      ? task.completed
        ? 100
        : 0
      : Math.round(
          (completedSubtasks / taskSubtasks.length) * 100
        );

  const isEditing = editingId === task.id;
  const [showScopeChoice, setShowScopeChoice] = useState(false);

  const startEditing = () => {
    setEditingId(task.id);
    setEditText(task.text || "");
    setEditDescription(task.description || "");
    setEditCategory(task.category || "Genel");
    setEditPriority(task.priority || "medium");
    setEditDueDate(task.due_date || "");
    setEditRepeatType(task.repeat_type || "none");
  };

  return (
    <motion.div
      className="task-card"
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.2 }}
    >
      <div className="task-header">
        <div className="task-header-left">
          <span className="drag-handle" {...dragHandleProps}>
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

          {isEditing ? (
            <div className="task-edit-fields">
              <input
                className="task-edit-title"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                placeholder="Görev başlığı"
              />

              <textarea
                className="task-edit-description"
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                placeholder="Açıklama"
                rows={3}
              />
            </div>
          ) : (
            <div className="task-title-wrapper">
              <h3
                className={
                  task.completed
                    ? "done task-title"
                    : "task-title"
                }
              >
                {task.text}
              </h3>

              {task.description && (
                <p className="task-description">
                  {task.description}
                </p>
              )}
            </div>
          )}
        </div>

        {!isEditing && (
          <span className={`priority ${task.priority}`}>
            {task.priority === "high" &&
              texts.taskItem.priority.high}

            {task.priority === "medium" &&
              texts.taskItem.priority.medium}

            {task.priority === "low" &&
              texts.taskItem.priority.low}
          </span>
        )}
      </div>

      {isEditing && (
        <div className="task-edit-panel">
          <div className="task-edit-row">
            <div className="task-edit-group">
              <label>Kategori</label>

              <select
                value={editCategory}
                onChange={(e) =>
                  setEditCategory(e.target.value)
                }
              >
                <option value="Genel">Genel</option>
                <option value="İş">İş</option>
                <option value="Kişisel">Kişisel</option>
              </select>
            </div>

            <div className="task-edit-group">
              <label>Öncelik</label>

              <select
                value={editPriority}
                onChange={(e) =>
                  setEditPriority(e.target.value)
                }
              >
                <option value="high">Yüksek</option>
                <option value="medium">Orta</option>
                <option value="low">Düşük</option>
              </select>
            </div>
          </div>

          <div className="task-edit-row">
            <div className="task-edit-group">
              <label>Tarih</label>

              <input
                type="date"
                value={editDueDate}
                onChange={(e) =>
                  setEditDueDate(e.target.value)
                }
              />
            </div>

            <div className="task-edit-group">
              <label>Tekrar</label>

              <select
                value={editRepeatType}
                onChange={(e) =>
                  setEditRepeatType(e.target.value)
                }
              >
                <option value="none">Tekrar yok</option>
                <option value="daily">Her gün</option>
                <option value="weekly">Her hafta</option>
                <option value="every2days">
                  2 günde bir
                </option>
              </select>
            </div>
          </div>
        </div>
      )}

      <div className="task-progress">
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="progress-info">
          <span>
            {progress}% {texts.taskItem.completed}
          </span>

          <span>
            {completedSubtasks} / {taskSubtasks.length}
          </span>
        </div>
      </div>

      <div className="task-body">
        <button
          className="toggle-subtasks-btn"
          onClick={() => setShowSubtasks(!showSubtasks)}
        >
          {showSubtasks ? (
            <ChevronDown size={18} />
          ) : (
            <ChevronRight size={18} />
          )}  

          {texts.taskItem.subtasks} ({taskSubtasks.length})
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
                    toggleSubtask(
                      subtask.id,
                      subtask.completed
                    )
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
            onChange={(e) =>
              setSubtaskText(e.target.value)
            }
            placeholder={texts.taskItem.addSubtask}
          />

          <button
            onClick={() => {
              if (!subtaskText.trim()) return;

              addSubtask(task.id, subtaskText);
              setSubtaskText("");
            }}
          >
            <Plus size={18} />
          </button>
        </div>
      </div>

      <div className="task-footer">
        <div className="task-meta">
          <span className={`tag ${task.category}`}>
            {task.category}
          </span>

          <span className="task-date">
            <CalendarDays size={14} />
            {texts.taskItem.today}
          </span>

          {task.repeat_type !== "none" && (
            <span className="task-repeat">
              <Repeat size={14} />{" "}
              {task.repeat_type === "daily"
                ? texts.taskItem.repeat.daily
                : task.repeat_type === "weekly"
                ? texts.taskItem.repeat.weekly
                : texts.taskItem.repeat.every2days}
            </span>
          )}
        </div>

        <div className="task-actions">
          {isEditing ? (
            <>
              <button
              onClick={() => {
                const isRecurring =
                  task.repeat_type &&
                  task.repeat_type !== "none";

                if (isRecurring) {
                  setShowScopeChoice(true);
                } else {
                  saveEdit(task.id, "single");
                }
              }}
                disabled={!editText.trim()}
              >
                💾 {texts.taskItem.save}
              </button>

              <button onClick={cancelEdit}>
                <X size={16} />
                İptal
              </button>
            </>
          ) : (
            <button onClick={startEditing}>
              <Pencil size={16} />
              {texts.taskItem.edit}
            </button>
          )}

          {!isEditing && (
            <button
              onClick={() => setDeleteId(task.id)}
            >
              <Trash2 size={16} />
              {texts.taskItem.delete}
            </button>
          )}
        </div>
      </div>
      {showScopeChoice && (
        <div className="edit-scope-backdrop">
          <div
            className="edit-scope-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-scope-title"
          >
            <h3 id="edit-scope-title">
              Görevleri nasıl güncelleyelim?
            </h3>

            <p>
              Bu görev tekrarlanan bir seriye ait.
              Hangi görevleri değiştirmek istiyorsun?
            </p>

            <div className="edit-scope-actions">
              <button
                onClick={async () => {
                  setShowScopeChoice(false);
                  await saveEdit(task.id, "single");
                }}
              >
                Sadece bu görev
              </button>

              <button
                onClick={async () => {
                  setShowScopeChoice(false);
                  await saveEdit(task.id, "series");
                }}

            
              >
                
                Serinin tamamı
              </button>
              

              <button
                onClick={() => setShowScopeChoice(false)}
              >
                Vazgeç
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}

export default TaskItem;