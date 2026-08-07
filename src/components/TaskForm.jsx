import "./TaskForm.css";

function TaskForm({

    input,
    setInput,

    category,
    setCategory,

    priority,
    setPriority,

    selectedDate,
    tasks,

    repeatType,
    setRepeatType,

    addTask,

    loading,
    texts,
    language,

}) {

    const formattedSelectedDate = new Date(selectedDate).toLocaleDateString(
    language === "tr"
        ? "tr-TR"
        : "en-US",
        {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
        }
    );

    const selectedTasks = tasks.filter(
    (task) => task.due_date === selectedDate
        );

        const completedTasks = selectedTasks.filter(
            (task) => task.completed
        ).length;

        const progress =
            selectedTasks.length === 0
                ? 0
                : Math.round(
                    (completedTasks / selectedTasks.length) * 100
                );

    return (

        <div className="task-form-card">

            <div className="task-form-header">

                <h3>✨ {texts.taskForm.title}</h3>

                <p>
                    {texts.taskForm.subtitle}
                </p>

            </div>

            <div className="input-group">

                <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addTask()}
                    placeholder={texts.taskForm.placeholder}
                />

                <div className="form-row">

                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                    >
                        <option value="Genel">
                            {texts.categories.general}
                        </option>

                        <option value="İş">
                            {texts.categories.work}
                        </option>

                        <option value="Kişisel">
                            {texts.categories.personal}
                        </option>
                    </select>

                    <select
                        value={priority}
                        onChange={(e) => setPriority(e.target.value)}
                    >
                        <option value="low">
                            {texts.priority.low}
                        </option>

                        <option value="medium">
                            {texts.priority.medium}
                        </option>

                        <option value="high">
                            {texts.priority.high}
                        </option>
                    </select>

                </div>

                <div className="selected-date-card">

                    <div className="date-header">

                        <span className="date-icon">
                            📅
                        </span>

                        <div>

                            <strong>
                                {formattedSelectedDate}
                            </strong>

                            <small>
                                {texts.taskForm.dateInfo}
                            </small>

                        </div>

                    </div>

                    <div className="date-stats">

                        <span>
                            📌 {selectedTasks.length} {texts.taskForm.tasks}
                        </span>

                        <span>
                            ✅ {completedTasks} {texts.taskForm.completed}
                        </span>

                    </div>

                    <div className="mini-progress">

                        <div
                            className="mini-progress-fill"
                            style={{
                                width: `${progress}%`,
                            }}
                        />

                    </div>

                </div>

                <div className="form-row">

                    <select
                        value={repeatType}
                        onChange={(e) => setRepeatType(e.target.value)}
                    >
                        <option value="none">
                            {texts.taskForm.once}
                        </option>

                        <option value="daily">
                            {texts.taskForm.daily}
                        </option>

                        <option value="weekly">
                            {texts.taskForm.weekly}
                        </option>

                        <option value="every2days">
                            {texts.taskForm.every2days}
                        </option>
                    </select>

                    <button onClick={addTask}>
                        {loading ? "..." : texts.taskForm.add}
                    </button>

                </div>

            </div>

        </div>

    );

}

export default TaskForm;