import { motion } from "framer-motion";
import "./Board.css";

function Board({
  filteredTasks,
  activeColumn,
  setActiveColumn,
  setDraggedTask,
  handleStatusDrop,
}) {
  return (
    <div className="board">

      {/* TODO */}

      <div
        className={`column ${activeColumn === "todo" ? "column-active" : ""}`}
        onDragEnter={() => setActiveColumn("todo")}
        onDragLeave={() => setActiveColumn(null)}
        onDragOver={(e) => e.preventDefault()}
        onDrop={() => {
          handleStatusDrop("todo");
          setActiveColumn(null);
        }}
      >
        <h3>
          📝 Todo
          <span className="count">
            ({filteredTasks.filter(task => task.status === "todo").length})
          </span>
        </h3>

        {filteredTasks.filter(task => task.status === "todo").length === 0 ? (
          <div className="empty-column">
            Task yok 🚀
          </div>
        ) : (
          filteredTasks
            .filter(task => task.status === "todo")
            .map(task => (
              <motion.div
                key={task.id}
                className="task-card board-task"
                draggable
                onDragStart={() => setDraggedTask(task)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="board-task-top">
                  <span>{task.text}</span>
                </div>

                <div className="board-task-bottom">
                  <span className={`tag ${task.category}`}>
                    {task.category}
                  </span>

                  <span className={`priority ${task.priority || "medium"}`}>
                    {task.priority || "medium"}
                  </span>
                </div>
              </motion.div>
            ))
        )}
      </div>

      {/* DOING */}

      <div
        className={`column ${activeColumn === "doing" ? "column-active" : ""}`}
        onDragEnter={() => setActiveColumn("doing")}
        onDragLeave={() => setActiveColumn(null)}
        onDragOver={(e) => e.preventDefault()}
        onDrop={() => {
          handleStatusDrop("doing");
          setActiveColumn(null);
        }}
      >
        <h3>
          ⚡ Doing
          <span className="count">
            ({filteredTasks.filter(task => task.status === "doing").length})
          </span>
        </h3>

        {filteredTasks.filter(task => task.status === "doing").length === 0 ? (
          <div className="empty-column">
            Task yok 🚀
          </div>
        ) : (
          filteredTasks
            .filter(task => task.status === "doing")
            .map(task => (
              <motion.div
                key={task.id}
                className="task-card board-task"
                draggable
                onDragStart={() => setDraggedTask(task)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="board-task-top">
                  <span>{task.text}</span>
                </div>

                <div className="board-task-bottom">
                  <span className={`tag ${task.category}`}>
                    {task.category}
                  </span>

                  <span className={`priority ${task.priority || "medium"}`}>
                    {task.priority || "medium"}
                  </span>
                </div>
              </motion.div>
            ))
        )}
      </div>

      {/* DONE */}

      <div
        className={`column ${activeColumn === "done" ? "column-active" : ""}`}
        onDragEnter={() => setActiveColumn("done")}
        onDragLeave={() => setActiveColumn(null)}
        onDragOver={(e) => e.preventDefault()}
        onDrop={() => {
          handleStatusDrop("done");
          setActiveColumn(null);
        }}
      >
        <h3>
          ✅ Done
          <span className="count">
            ({filteredTasks.filter(task => task.status === "done").length})
          </span>
        </h3>

        {filteredTasks.filter(task => task.status === "done").length === 0 ? (
          <div className="empty-column">
            Task yok 🚀
          </div>
        ) : (
          filteredTasks
            .filter(task => task.status === "done")
            .map(task => (
              <motion.div
                key={task.id}
                className="task-card board-task"
                draggable
                onDragStart={() => setDraggedTask(task)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="board-task-top">
                  <span>{task.text}</span>
                </div>

                <div className="board-task-bottom">
                  <span className={`tag ${task.category}`}>
                    {task.category}
                  </span>

                  <span className={`priority ${task.priority || "medium"}`}>
                    {task.priority || "medium"}
                  </span>
                </div>
              </motion.div>
            ))
        )}
      </div>

    </div>
  );
}

export default Board;