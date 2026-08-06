import { useState } from "react";
import "./DeleteModal.css";

function DeleteModal({

  deleteId,
  setDeleteId,
  deleteTask

}) 

{
const [deleteMode, setDeleteMode] = useState("single");
  if (!deleteId) return null;

  return (

    <div className="modal-overlay">

      <div className="modal">

        <h3>Görevi sil?</h3>

        <p>Nasıl silmek istiyorsun?</p>

        <div className="delete-options">

          <label>
            <input
              type="radio"
              value="single"
              checked={deleteMode === "single"}
              onChange={(e) => setDeleteMode(e.target.value)}
            />
            Sadece bu görev
          </label>

          <label>
            <input
              type="radio"
              value="future"
              checked={deleteMode === "future"}
              onChange={(e) => setDeleteMode(e.target.value)}
            />
            Bu ve sonraki görevler
          </label>

          <label>
            <input
              type="radio"
              value="series"
              checked={deleteMode === "series"}
              onChange={(e) => setDeleteMode(e.target.value)}
            />
            Tüm seri
          </label>

        </div>

        <div className="modal-actions">

          <button
            className="cancel-btn"
            onClick={() => setDeleteId(null)}
          >
            Vazgeç
          </button>

          <button
            className="delete-btn"
            onClick={async () => {
              await deleteTask(deleteId, deleteMode);
              setDeleteId(null);
            }}
          >
            Sil
          </button>

        </div>

      </div>

    </div>

  );

}

export default DeleteModal;