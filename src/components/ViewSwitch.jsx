import "./ViewSwitch.css";

function ViewSwitch({
  view,
  setView,
  texts,
}) {
  return (
    <div className="view-switch">

      <button onClick={() => setView("list")}>
        {texts.viewSwitch.list}
      </button>

      <button onClick={() => setView("board")}>
        {texts.viewSwitch.board}
      </button>

    </div>
  );
}

export default ViewSwitch;