function Toast({ toast }) {

  if (!toast.message) return null;

  return (

    <div className={`toast ${toast.type}`}>
      {toast.message}
    </div>

  );

}

export default Toast;