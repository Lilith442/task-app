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

}) {

    const formattedSelectedDate = new Date(selectedDate).toLocaleDateString(
        "tr-TR",
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

                <h3>✨ Yeni Görev</h3>

                <p>
                    Yeni bir görev oluştur ve planlamaya başla.
                </p>

            </div>

            <div className="input-group">

                <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addTask()}
                    placeholder="Görev ekle"
                />

                <div className="form-row">

                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                    >
                        <option value="Genel">Genel</option>
                        <option value="İş">İş</option>
                        <option value="Kişisel">Kişisel</option>
                    </select>

                    <select
                        value={priority}
                        onChange={(e) => setPriority(e.target.value)}
                    >
                        <option value="low">Düşük</option>
                        <option value="medium">Orta</option>
                        <option value="high">Yüksek</option>
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
                                Görev bu tarihe eklenecek
                            </small>

                        </div>

                    </div>

                    <div className="date-stats">

                        <span>
                            📌 {selectedTasks.length} görev
                        </span>

                        <span>
                            ✅ {completedTasks} tamamlandı
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
                        <option value="none">Tek Sefer</option>
                        <option value="daily">Her Gün</option>
                        <option value="weekly">Haftalık</option>
                        <option value="every2days">2 Günde Bir</option>
                    </select>

                    <button onClick={addTask}>
                        {loading ? "..." : "✨ Ekle"}
                    </button>

                </div>

            </div>

        </div>

    );

}

export default TaskForm;