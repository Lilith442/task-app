/*TaskList.jsx */
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
  editingId,
  editText,
  setEditText,
  setEditingId,
  saveEdit,
  setDeleteId,
  addSubtask,
  subtasks,
  toggleSubtask,
  texts,

}) {

  return (
    
    <DndContext
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >

      <SortableContext
        items={filteredTasks.map(t => t.id)}
        strategy={verticalListSortingStrategy}
      >

        <AnimatePresence>

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