import "./Header.css";
function Header({
    user,
    darkMode,
    setDarkMode,
    logout
}) {
  return (
        <div className="topbar">

        <div className="topbar-left">
          <div className="logo-circle">⚡</div>

          <div>
            <h3>Task-App</h3>
            <p>Verimli Gün Planlama</p>
          </div>
        </div>

        <div className="topbar-right">

          <div className="user-box">
            <div className="online-dot"></div>
            <span>{user.email}</span>
          </div>

          <button
                className="dark-toggle"
                onClick={() => setDarkMode(prev => !prev)}
            >
                {darkMode ? "☀️" : "🌙"}
            </button>

          <button
            className="logout-btn"
            onClick={logout}
          >
            Çıkış
          </button>

        </div>
      </div>
    );

}
export default Header;