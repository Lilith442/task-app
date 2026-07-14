import { DndContext, closestCenter } from "@dnd-kit/core";

import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import { AnimatePresence } from "framer-motion";

import SortableItem from "./SortableItem";

import "./TaskList.css";

import React from "react";
import PropTypes from "prop-types";
import { useState } from "react";
import { useEffect } from "react";
import { useCallback } from "react";
import { useMemo } from "react";
import { useRef } from "react";
import { useLayoutEffect } from "react";
import { useReducer } from "react";
import { useContext } from "react";
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
  toggleSubtask

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
            />

          ))}

        </AnimatePresence>

      </SortableContext>

    </DndContext>
    

  );

}

export default TaskList;