function ProgressOverview({ tasks, percent }) {
  const activeTasks = tasks.filter((task) => !task.completed).length;

  return (
    <div className="progress-overview">

      <p className="progress-summary">
        {tasks.length} görev • {activeTasks} aktif
      </p>

      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{
            width: `${percent}%`,
          }}
        />
      </div>

      <p className="progress-text">
        %{percent} tamamlandı
      </p>

    </div>
  );
}

export default ProgressOverview;
