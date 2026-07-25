import "./TaskForm.css";

function TaskForm({

    input,
    setInput,

    category,
    setCategory,

    priority,
    setPriority,

    dueDate,
    setDueDate,

    repeatType,
    setRepeatType,

    addTask,

    loading,

}) {

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

                <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="date-input"
                />

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