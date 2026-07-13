function DeleteModal({

  deleteId,
  setDeleteId,
  deleteTask

}) {

  if (!deleteId) return null;

  return (

    <div className="modal-overlay">

      <div className="modal">

        <h3>Görevi sil?</h3>

        <p>Bu işlem geri alınamaz.</p>

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
              await deleteTask(deleteId);
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