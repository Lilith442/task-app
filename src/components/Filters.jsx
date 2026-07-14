import "./Filters.css";

function Filters({
    filter,
    setFilter
}) {
  return (
    <div className="filters">

        <button onClick={() => setFilter("all")}>
              Tümü
        </button>

        <button onClick={() => setFilter("active")}>
              Aktif
        </button>

        <button onClick={() => setFilter("completed")}>
              Tamamlanan
        </button>

    </div>
    );

}
export default Filters;