import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { AnimatePresence } from "framer-motion";
import SortableItem from "./SortableItem";
import "./TaskList.css";
import "./TaskItem.css";

function TaskList({
  filteredTasks,
  handleDragEnd,
  toggleTask,
  deleteTask,

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

  // Language
  texts,
}) {
  return (
    <DndContext
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={filteredTasks.map((t) => t.id)}
        strategy={verticalListSortingStrategy}
      >
        <AnimatePresence>
          {filteredTasks.map((task) => (
            <SortableItem
              key={task.id}
              task={task}
              toggleTask={toggleTask}
              deleteTask={deleteTask}

              editingId={editingId}
              editText={editText}
              setEditText={setEditText}
              editDescription={editDescription}
              setEditDescription={setEditDescription}
              editCategory={editCategory}
              setEditCategory={setEditCategory}
              editPriority={editPriority}
              setEditPriority={setEditPriority}
              editDueDate={editDueDate}
              setEditDueDate={setEditDueDate}
              editRepeatType={editRepeatType}
              setEditRepeatType={setEditRepeatType}
              setEditingId={setEditingId}
              saveEdit={saveEdit}
              cancelEdit={cancelEdit}

              setDeleteId={setDeleteId}

              addSubtask={addSubtask}
              subtasks={subtasks}
              toggleSubtask={toggleSubtask}

              texts={texts}
            />
          ))}
        </AnimatePresence>
      </SortableContext>
    </DndContext>
  );
}

export default TaskList;