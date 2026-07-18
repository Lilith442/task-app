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

        <div className="input-group mobile-sticky">

            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addTask()}
              placeholder="Görev ekle"
            />

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="genel">Genel</option>
              <option value="iş">İş</option>
              <option value="kişisel">Kişisel</option>
            </select>

            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option value="low">Düşük öncelik</option>
              <option value="medium">Orta</option>
              <option value="high">Acil</option>
            </select>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="date-input"
            />
            <select
              value={repeatType}
              onChange={(e) => setRepeatType(e.target.value)}
            >

              <option value="none">
                Tek Sefer
              </option>

              <option value="daily">
                Her Gün
              </option>

              <option value="weekly">
                Haftalık
              </option>

              <option value="every2days">
                2 Günde Bir
              </option>

            </select>
            <button onClick={addTask}>
              {loading ? "..." : "Ekle"}
            </button>

          </div>

    );

}

export default TaskForm;