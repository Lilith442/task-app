import "./ViewSwitch.css";

function ViewSwitch({
    view,
    setView
}) {
  return (
    <div className="view-switch">

        <button onClick={() => setView("list")}>
            📋 Liste
        </button>

        <button onClick={() => setView("board")}>
            📌 Board
        </button>

    </div>
    );

}
export default ViewSwitch;