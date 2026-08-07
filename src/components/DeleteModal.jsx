import { useState } from "react";
import "./DeleteModal.css";

function DeleteModal({

  deleteId,
  setDeleteId,
  deleteTask,
  texts,

}) 

{
const [deleteMode, setDeleteMode] = useState("single");
  if (!deleteId) return null;

  return (

    <div className="modal-overlay">

      <div className="modal">

        <h3>{texts.deleteModal.title}</h3>

        <p>{texts.deleteModal.subtitle}</p>

        <div className="delete-options">

          <label>
            <input
              type="radio"
              value="single"
              checked={deleteMode === "single"}
              onChange={(e) => setDeleteMode(e.target.value)}
            />
            {texts.deleteModal.single}
          </label>

          <label>
            <input
              type="radio"
              value="future"
              checked={deleteMode === "future"}
              onChange={(e) => setDeleteMode(e.target.value)}
            />
            {texts.deleteModal.future}
          </label>

          <label>
            <input
              type="radio"
              value="series"
              checked={deleteMode === "series"}
              onChange={(e) => setDeleteMode(e.target.value)}
            />
            {texts.deleteModal.series}
          </label>

        </div>

        <div className="modal-actions">

          <button
            className="cancel-btn"
            onClick={() => setDeleteId(null)}
          >
            {texts.deleteModal.cancel}
          </button>

          <button
            className="delete-btn"
            onClick={async () => {
              await deleteTask(deleteId, deleteMode);
              setDeleteId(null);
            }}
          >
            {texts.deleteModal.delete}
          </button>

        </div>

      </div>

    </div>

  );

}

export default DeleteModal;