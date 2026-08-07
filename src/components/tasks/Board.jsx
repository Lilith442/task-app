/*Board.jsx */
import { motion } from "framer-motion";
import "./Board.css";
import "./TaskItem.css";

function Board({
  filteredTasks,
  activeColumn,
  setActiveColumn,
  setDraggedTask,
  handleStatusDrop,

  texts,
}) {

const columns = [
  {
    id: "todo",
    title: texts.board.todo,
  },
  {
    id: "doing",
    title: texts.board.doing,
  },
  {
    id: "done",
    title: texts.board.done,
  },
];

const getPriorityLabel = (priority = "medium") => {

    switch (priority.toLowerCase()) {

        case "high":
            return texts.board.priority.high;

        case "low":
            return texts.board.priority.low;

        default:
            return texts.board.priority.medium;

    }

};

  return (
    <div className="board">

      {columns.map((column) => {

        const tasks = filteredTasks.filter(
          (task) => task.status === column.id
        );
        const progress = 0;
        return (

          <div
            key={column.id}
            className={`column ${
              activeColumn === column.id ? "column-active" : ""
            }`}
            onDragEnter={() => setActiveColumn(column.id)}
            onDragLeave={() => setActiveColumn(null)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => {
              handleStatusDrop(column.id);
              setActiveColumn(null);
            }}
          >

            <h3>

              <span>{column.title}</span>

              <span className="count">
                {tasks.length}
              </span>

            </h3>

            {tasks.length === 0 ? (

              <div className="empty-column">
                {texts.board.empty}
              </div>

            ) : (

              tasks.map((task) => (

                <motion.div
                  key={task.id}
                  className="task-card board-task"
                  draggable
                  onDragStart={() => setDraggedTask(task)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >

                  <div className="board-task-top">

                    <h4>{task.text}</h4>

                  </div>
                
                  <div className="board-task-bottom">

                    <span className={`tag ${task.category}`}>
                      {task.category}
                    </span>

                    <span
                      className={`priority ${(task.priority || "medium").toLowerCase()}`}
                    >
                      {getPriorityLabel(task.priority)}
                    </span>

                  </div>

                </motion.div>

              ))
              
            )}

          </div>

        );
    
      })}

    </div>
  );
}

export default Board;