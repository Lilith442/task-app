function ProgressOverview({ tasks, percent, texts }) {
  const activeTasks = tasks.filter((task) => !task.completed).length;

  return (
    <div className="progress-overview">

      <p className="progress-summary">
        {tasks.length} {texts.progressOverview.tasks} • {activeTasks} {texts.progressOverview.active}
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
        %{percent} {texts.progressOverview.completed}
      </p>

    </div>
  );
}

export default ProgressOverview;
