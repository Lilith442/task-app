import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { AnimatePresence } from "framer-motion";

import SortableItem from "./SortableItem";

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
  setDeleteId

}) {    <DndContext
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
                    />

                  ))}

                </AnimatePresence>

              </SortableContext>

            </DndContext>
}

export default TaskList;