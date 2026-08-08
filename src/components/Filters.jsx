import "./Filters.css";

function Filters({
  filter,
  setFilter,
  texts,
}) {
  return (
    <div className="filters">

      <button
        onClick={() => setFilter("all")}
      >
        {texts.filters.all}
      </button>

      <button
        onClick={() => setFilter("active")}
      >
        {texts.filters.active}
      </button>

      <button
        onClick={() => setFilter("completed")}
      >
        {texts.filters.completed}
      </button>

    </div>
  );
}

export default Filters;